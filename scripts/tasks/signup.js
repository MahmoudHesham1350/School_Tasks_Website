document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', event => {
    event.preventDefault();

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form['confirm-password'].value;
    const userType = form.user_type.value;

    if (password !== confirm) {
      alert('Passwords do not match.');
      return;
    }
    if (!username || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }

    const usersJSON = localStorage.getItem('users') || '[]';
    const users = JSON.parse(usersJSON);

    const duplicate = users.find(u =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email.toLowerCase() === email.toLowerCase()
    );
    if (duplicate) {
      alert('A user with that username or email already exists.');
      return;
    }

    users.push({ username, email, password, userType });

    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign‑up successful! Redirecting to your dashboard...');
    window.location.href = '../dashboard/student_dashboard.html';
  });
});
