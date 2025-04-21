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

    if (!user) {
      alert('Invalid username or password.');
      return;
    }

    sessionStorage.setItem('currentUser', JSON.stringify(user));

    let dashFile;
    switch (user.userType) {
      case 'admin':   dashFile = 'AdminDashboard.html';   break;
      case 'teacher': dashFile = 'TeacherDashboard.html'; break;
      default:        dashFile = 'StudentDashboard.html';
    }

    window.location.href = `../../pages/dashboard/${dashFile}`;
  });
});
