from django.shortcuts import render

# Create your views here.


def adminDashboard(request):
    if request.method == 'GET':
        return render(request, 'dashboards/adminDashboard.html')
        
def teacherDashboard(request):
    if request.method == 'GET':
        return render(request, 'dashboards/teacherDashboard.html')
        