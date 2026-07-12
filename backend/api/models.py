from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Base user extension. Good practice in Django to start with a custom User model
    pass

class Assignment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('upcoming', 'Upcoming'),
        ('urgent', 'Urgent'),
        ('completed', 'Completed'),
    )
    title = models.CharField(max_length=255)
    deadline = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    reminder_sent = models.BooleanField(default=False)
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assignments', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.status})"

class EmailLog(models.Model):
    message_id = models.CharField(max_length=255, unique=True, default="unknown")
    subject = models.CharField(max_length=255)
    sender_email = models.EmailField()
    received_at = models.DateTimeField()
    parsed_status = models.BooleanField(default=False)
    raw_content = models.TextField(blank=True, help_text="Stored metadata and body of the original email")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Email from {self.sender_email}: {self.subject}"
