from django.db import models
from users.models import User

# Create your models here.


class Task(models.Model):
    creator = models.ForeignKey(User , on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=64)
    subject = models.CharField(max_length=64)
    priority = models.CharField(choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')], max_length=64)
    description = models.TextField()
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    files = models.FileField(upload_to='tasks_files/', blank=True, null=True)

class Assigned(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    teacher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_tasks')
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    