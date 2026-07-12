import os
import imaplib
import email
from email.header import decode_header
import json
from django.core.management.base import BaseCommand
from django.utils.timezone import make_aware, get_current_timezone
from datetime import datetime, timedelta
import dateutil.parser
from api.models import EmailLog, Assignment
from openai import OpenAI

def get_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdispo = str(part.get('Content-Disposition'))

            if ctype == 'text/plain' and 'attachment' not in cdispo:
                charset = part.get_content_charset()
                payload = part.get_payload(decode=True)
                if payload:
                    return payload.decode(charset or 'utf-8', errors='ignore')
    else:
        charset = msg.get_content_charset()
        payload = msg.get_payload(decode=True)
        if payload:
            return payload.decode(charset or 'utf-8', errors='ignore')
    return ""

def extract_assignments_via_llm(subject, body, current_date):
    """ Passes the email subject and body to the LLM for JSON structural extraction. """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    prompt = f"""
    Current Date: {current_date}
    
    You are an intelligent email extraction assistant tracking student or employee assignments.
    Read the following email subject and body. Extract any tasks or assignments mentioned.
    Resolve natural language relative dates (like 'tomorrow', 'next Monday', 'in 2 days') into exact ISO-8601 string deadlines mathematically based on the 'Current Date' provided.
    If no specific time is provided with a date, default the time to "23:59:59".
    
    Email Subject: {subject}
    Email Body:
    {body}
    
    Return ONLY a JSON array of objects. Each object should have strictly these keys:
    - "title": (string) The title or description of the assignment.
    - "deadline": (string) ISO-8601 formatted datetime (e.g. YYYY-MM-DDTHH:MM:SSZ). If impossible to determine a date, return null.
    
    Return nothing else but the JSON array. Do not include markdown formatting blocks. If there are no actionable assignments, return [].
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        content = response.choices[0].message.content.strip()
        
        # Strip potential markdown formatting if the LLM ignores instructions
        if content.startswith("```json"):
            content = content[7:-3]
        elif content.startswith("```"):
            content = content[3:-3]
            
        return json.loads(content)
    except Exception as e:
        print(f"LLM Extraction failed: {e}")
        return []

class Command(BaseCommand):
    help = 'Fetches emails and extracts assignments using an LLM.'

    def handle(self, *args, **options):
        server = os.getenv("IMAP_SERVER")
        user = os.getenv("IMAP_USER")
        password = os.getenv("IMAP_PASSWORD")
        api_key = os.getenv("OPENAI_API_KEY")
        
        if not server or not user or not password or not api_key:
            self.stdout.write(self.style.ERROR("Missing credentials in .env! Ensure IMAP and OPENAI_API_KEY are populated."))
            return

        try:
            self.stdout.write("Connecting to IMAP Server...")
            mail = imaplib.IMAP4_SSL(server)
            mail.login(user, password)
            mail.select("inbox")
            
            status, messages = mail.search(None, 'UNSEEN')
            
            if status != 'OK' or not messages[0]:
                self.stdout.write(self.style.WARNING("No new unread emails found."))
                return
            
            email_ids = messages[0].split()
            self.stdout.write(f"Processing {len(email_ids)} emails via LLM Pipeline...")
            
            for e_id in email_ids:
                res, msg_data = mail.fetch(e_id, '(RFC822)')
                for response_part in msg_data:
                    if isinstance(response_part, tuple):
                        msg = email.message_from_bytes(response_part[1])
                        
                        # Parse Subject
                        subj, encoding = decode_header(msg["Subject"])[0]
                        if isinstance(subj, bytes):
                            subj = subj.decode(encoding if encoding else 'utf-8', errors='ignore')
                        if subj is None:
                            subj = "(No Subject)"
                        
                        sender = msg.get("From")
                        body = get_body(msg)
                        
                        # Baseline received date
                        aware_date = make_aware(datetime.now(), get_current_timezone())
                        
                        # 1. Pipeline execution
                        assignments_json = extract_assignments_via_llm(subj, body, aware_date.isoformat())
                        
                        is_relevant = len(assignments_json) > 0
                        
                        # 2. Persist Email Log
                        EmailLog.objects.create(
                            message_id=message_id,
                            subject=subj[:255],
                            sender_email=sender,
                            received_at=aware_date,
                            parsed_status=is_relevant,
                            raw_content=body
                        )
                        
                        # 3. Spawn DB Assignments based on LLM output
                        for item in assignments_json:
                            title = item.get("title", "Untitled Extraction")
                            deadline_str = item.get("deadline")
                            
                            deadline_date = None
                            status = "pending"
                            
                            if deadline_str:
                                try:
                                    # Very resilient parsing of whatever the LLM throws (ISO or partial)
                                    deadline_date = dateutil.parser.parse(deadline_str)
                                    if not deadline_date.tzinfo:
                                        deadline_date = make_aware(deadline_date, get_current_timezone())
                                        
                                    # User Requested Status Logic: "urgent if coming up very soon"
                                    now = make_aware(datetime.now(), get_current_timezone())
                                    
                                    if deadline_date < now:
                                        status = "urgent" # Past due is extremely urgent
                                    elif deadline_date <= now + timedelta(hours=24):
                                        status = "urgent" # Under 24 hours
                                    else:
                                        status = "upcoming"
                                except ValueError:
                                    pass

                            Assignment.objects.create(
                                title=title,
                                deadline=deadline_date,
                                status=status
                            )
                            
                        self.stdout.write(self.style.SUCCESS(f"Processed: '{subj}' -> Generated {len(assignments_json)} assignments!"))
                        
            mail.close()
            mail.logout()
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error encountered: {str(e)}"))
