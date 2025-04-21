document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  form.addEventListener('submit', event => {
    event.preventDefault();

    const username = form.username.value.trim();
    const email    = form.email.value.trim();
    const password = form.password.value;
    const confirm  = form['confirm-password'].value;
    const userType = form.user_type.value;         

    if (password !== confirm) {
      alert('Passwords do not match.');
      return;
    }
    if (!username || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username || u.email === email)) {
      alert('Username or email already taken.');
      return;
    }

    users.push({ username, email, password, userType });
    localStorage.setItem('users', JSON.stringify(users));

    let dashFile;
    switch (userType) {
      case 'admin':   dashFile = 'AdminDashboard.html';   break;
      case 'teacher': dashFile = 'TeacherDashboard.html'; break;
      default:        dashFile = 'StudentDashboard.html';
    }
    alert('Sign‑up successful! Redirecting you now…');
    window.location.href = `../dashboard/${dashFile}`;
  });
});
