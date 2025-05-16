from functools import wraps
from django.shortcuts import redirect


def admin_only(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.user.role == 'teacher':
            return redirect('404')
        return view_func(request, *args, **kwargs)
    return wrapper