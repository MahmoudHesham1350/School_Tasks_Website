from django.forms import ModelForm
import django.forms as forms
from users.models import User
from .models import Task, Assigned

class TaskForm(forms.ModelForm):
    assigned_to = forms.ModelMultipleChoiceField(
        queryset=User.objects.filter(role="teacher"), 
        required=True
    )
    due_date = forms.DateTimeField(
        widget=forms.DateTimeInput(attrs={'type': 'datetime-local'}), 
        required=True
    )
    
    class Meta:
        model = Task
        fields = ['title', 'subject', 'priority', 'description', 'due_date', 'files', 'assigned_to']

    def save(self, commit=True):
        task = super().save(commit=False)
        if commit:
            task.save()
            assigned_teachers = self.cleaned_data.get('assigned_to')
            assignments = [
                Assigned(task=task, teacher=teacher) 
                for teacher in assigned_teachers
            ]
            Assigned.objects.bulk_create(assignments)
        return task


