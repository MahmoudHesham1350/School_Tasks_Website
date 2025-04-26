document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', event => {
    event.preventDefault();

    const username = form.username.value.trim();
    const password = form.password.value;

    const database = new Database();
    const user = database.getUserByUsername(username);

    if(!user || !user.checkPassword(password)) {
      alert("Invalid username or password.");
      return;
    }
    delete user.password; 
    
    sessionStorage.setItem('currentUser', JSON.stringify(user));

    let dashFile;
    switch (user.role) {
      case 'admin':   dashFile = 'adminDashboard.html';   break;
      case 'teacher': dashFile = 'teacherDashboard.html'; break;
      default : throw new Error('Unknown role: ' + user.role);
    }

    window.location.href = `/pages/dashboard/${dashFile}`;
  });
});
