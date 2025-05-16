from django.contrib import admin
from .models import Task, Assigned

# Register your models here.

admin.site.register(Task)
admin.site.register(Assigned)
