document.addEventListener('DOMContentLoaded', () => {
  const database = new Database();
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

    if (database.getUserByUsername(username)) {
      alert('Username or email already taken.');
      return;
    }
    database.addUser(new User(username, email, password, userType));

    sessionStorage.setItem('currentUser', JSON.stringify(new User(username, email, password, userType)));

    let dashFile;
    switch (userType) {
      case 'admin':   dashFile = 'adminDashboard.html';   break;
      case 'teacher': dashFile = 'teacherDashboard.html'; break;
      default:        dashFile = 'studentDashboard.html';
    }
    window.location.href = `/pages/dashboard/${dashFile}`;
  });
});
