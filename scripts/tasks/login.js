document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', event => {
    event.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value;

    const usersJSON = localStorage.getItem('users');
    if (!usersJSON) {
      alert('No users found. Please sign up first.');
      return;
    }
    const users = JSON.parse(usersJSON);

    const user = users.find(u =>
      u.username.toLowerCase() === username.toLowerCase() &&
      u.password === password
    );

    if (user) {

      sessionStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = '../dashboard/student_dashboard.html';
    } else {
      alert('Invalid username or password.');
    }
  });
});
