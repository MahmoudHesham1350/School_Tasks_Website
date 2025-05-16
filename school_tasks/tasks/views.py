from django.shortcuts import render, redirect
from .models import Task, Assigned
from .forms import TaskForm
from django.contrib.auth.decorators import login_required
from users.authorization import admin_only


# Create your views here.
@login_required(login_url='login')
def tasks(request):
    if request.method == 'GET':
        if request.user.role == 'teacher':
            tasks = Assigned.objects.filter(teacher=request.user).prefetch_related('task').all()
            tasks = [task.task for task in tasks]
        elif request.user.role == 'admin':
            tasks = Task.objects.filter(creator=request.user).all()
        return render(request, 'tasks/listTasks.html', {'tasks': tasks})
    
@login_required(login_url='login')
@admin_only
def create_task(request):
    if request.method == 'GET':
        form = TaskForm()
        return render(request, 'tasks/createTask.html', {'form': form})

    elif request.method == 'POST':
        form = TaskForm(data=request.POST)
        print(request.POST)
        print(form.is_valid())
        print(form.errors)
        if form.is_valid():
            task = form.save(commit=False)
            task.creator = request.user
            task.save()
            return redirect('tasks')
        else:
            return render(request, 'tasks/createTask.html', {'form': form})
    
@login_required(login_url='login')
def update_task(request, task_id):
    if request.method == 'GET':
        task = Task.objects.get(id=task_id)
        form = TaskForm(instance=task)
        return render(request, 'tasks/createTask.html', {'form': form})
            
    elif request.method == 'POST':
        task = Task.objects.get(id=task_id)
        form = TaskForm(data=request.POST, instance=task)
        if form.is_valid():
            form.save()
            return redirect('tasks')
        return render(request, 'tasks/createTask.html', {'form': form})
    
@login_required(login_url='login')
def task_detail(request, task_id):
    if request.method == 'GET':
        task = Task.objects.get(id=task_id)
        return render(request, 'tasks/taskDetail.html', {'task': task})
    
@login_required(login_url='login')
@admin_only
def delete_task(request, task_id):
    if request.method == 'POST':
        task = Task.objects.get(id=task_id)
        if task.creator != request.user:
            return redirect('404')
        task.delete()
        return redirect('tasks')

        