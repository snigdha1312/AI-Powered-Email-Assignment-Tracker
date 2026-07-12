import os
import django
import sys
from datetime import datetime, timezone

# Django Setup to run script outside manage.py
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.management.commands.fetch_emails import extract_assignments_via_llm

def run_tests():
    fake_date = datetime.now(timezone.utc).isoformat()
    
    print("\n--- TEST 1: Long Email (Multiple Paragraphs, Embedded Deadlines) ---")
    long_subject = "FWD: Extremely important Q3 Marketing Logistics and Final Reports"
    long_body = """
    Hey team,
    Thanks for all your hard work. I know we've been pushing really hard on the new logistics.
    I wanted to remind everyone that despite everything happening, we still need to submit the Vendor Accounting report.
    Please ensure you submit the vendor report by next Thursday at 5 PM EST. 
    Also, don't forget the Q3 slides for the presentation. The deadline for the slides is tomorrow morning at 9:00 AM bright and early.
    
    Let me know if there are any issues with this timeline!
    Best,
    Michael
    """
    res1 = extract_assignments_via_llm(long_subject, long_body, fake_date)
    print("Result 1:", res1)
    
    print("\n--- TEST 2: Different Formats (Weird spacing, informal) ---")
    weird_subject = "assignment stuff??"
    weird_body = "hey  can u plz submit ur homework 4 physics by \n\n 11/15/2026 ?? thx!!"
    res2 = extract_assignments_via_llm(weird_subject, weird_body, fake_date)
    print("Result 2:", res2)

    print("\n--- TEST 3: Missing Dates (No time info at all) ---")
    edge_subject = "Please read the attached PDF"
    edge_body = "Attached is the mandatory employee handbook. Please read it and submit the acknowledgement form. Thank you."
    res3 = extract_assignments_via_llm(edge_subject, edge_body, fake_date)
    print("Result 3:", res3)

if __name__ == "__main__":
    run_tests()
