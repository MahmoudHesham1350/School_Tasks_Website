from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from . import forms
from tasks.models import Task

# Create your views here.
def home(request):
    recent_tasks = []
    if request.user.is_authenticated:
        if request.user.role == 'admin':
            recent_tasks = Task.objects.filter(creator=request.user).order_by('-created_at')[:5]
        else:  # teacher
            recent_tasks = Task.objects.filter(assignments__teacher=request.user).order_by('-created_at')[:5]
    return render(request, 'home.html', {'recent_tasks': recent_tasks })


def page404(request):
    return render(request, '404.html')


def login(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('home')
        form = forms.UserLoginForm()
        return render(request, 'users/login.html', {'form': form})
    
    if request.method == 'POST':
        form = forms.UserLoginForm(data=request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('home')
            else:
                form.add_error(None, 'Invalid email or password')
        return render(request, 'users/login.html', {'form': form})


def signup(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return redirect('home')
        form = forms.UserRegistrationForm()
        return render(request, 'users/signup.html', {'form': form})
    
    if request.method == 'POST':
        form = forms.UserRegistrationForm(data=request.POST)
        if form.is_valid():
            user = form.save()
            auth_login(request, user)
            return redirect('home')
        return render(request, 'users/signup.html', {'form': form})
    
    
def logout(request):
    if(request.user.is_authenticated):
        auth_logout(request)
        return redirect('home')
    else:
        return redirect('404')

