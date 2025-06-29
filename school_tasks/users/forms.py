from django import forms 
from .models import User


class UserLoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'id': 'username'}), max_length=150, required=True)
    password = forms.CharField(widget=forms.PasswordInput(attrs={'id': 'password'}), required=True)

class UserRegistrationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password',
                                widget=forms.PasswordInput(attrs={'id': 'password1'}),
                                required=True
                                )
    password2 = forms.CharField(label='Confirm Password', 
                              widget=forms.PasswordInput(attrs={'id': 'password2'}), 
                              required=True
                              )
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'role']
        widgets = {
            'username': forms.TextInput(attrs={'id': 'username'}),
            'email': forms.EmailInput(attrs={'id': 'email'}),
            'role': forms.Select(attrs={'id': 'role'})
        }

    def is_valid(self):
        valid = super().is_valid()
        if not valid:
            return False
        if self.cleaned_data['password1'] != self.cleaned_data['password2']:
            self.add_error('password2', 'Passwords do not match')
            return False
        return True

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

