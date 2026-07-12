from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management import call_command
import atexit

from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management import call_command
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
import atexit
from api.models import Assignment
import os

def send_terminal_reminders():
    # Identify tasks under 12 hours that haven't triggered a reminder
    threshold = timezone.now() + timedelta(hours=12)
    impending_tasks = Assignment.objects.filter(
        deadline__lte=threshold, 
        deadline__gt=timezone.now(),
        status__in=['urgent', 'pending', 'upcoming'],
        reminder_sent=False
    )
    
    owner = os.getenv("IMAP_USER", "default@example.com")
    
    for task in impending_tasks:
        try:
            send_mail(
                subject=f"[REMINDER] {task.title}",
                message=f"This is an automated system reminder that your assignment '{task.title}' is due at {task.deadline.strftime('%I:%M %p')}.",
                from_email='server@storimail.local',
                recipient_list=[owner],
            )
            print(f"Dispatched email reminder for: {task.title}")
            task.reminder_sent = True
            task.save()
        except Exception as e:
            print(f"Failed to dispatch reminder: {str(e)}")

def start():
    scheduler = BackgroundScheduler()
    # Execute the email fetch every 15 minutes seamlessly alongside the server
    scheduler.add_job(lambda: call_command('fetch_emails'), 'interval', minutes=15, id='fetch_emails_background', replace_existing=True)
    # Check for outgoing reminders every 10 minutes
    scheduler.add_job(send_terminal_reminders, 'interval', minutes=10, id='send_reminders_background', replace_existing=True)
    scheduler.start()

    atexit.register(lambda: scheduler.shutdown())
    scheduler.add_job(lambda: call_command('fetch_emails'), 'interval', minutes=15, id='fetch_emails_background', replace_existing=True)
    scheduler.start()

    atexit.register(lambda: scheduler.shutdown())
