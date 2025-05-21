from django.shortcuts import render
from tasks.models import Task, Assigned
from django.contrib.auth.decorators import login_required
from django.utils import timezone

# Create your views here.

@login_required(login_url='login')
def adminDashboard(request):
    if request.method == 'GET':
        tasks = Task.objects.filter(creator=request.user).all()
        return render(request, 'dashboards/adminDashboard.html', {'tasks': tasks})

@login_required(login_url='login')
def teacherDashboard(request):
    if request.method == 'GET':
        # Get assigned tasks with their completion status
        assigned_tasks = Assigned.objects.filter(
            teacher=request.user
        ).select_related('task').all()
        return render(request, 'dashboards/teacherDashboard.html', {
            'assigned_tasks': assigned_tasks,
            'now': timezone.now()
        })
