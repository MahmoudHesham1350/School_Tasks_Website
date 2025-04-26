document.addEventListener("DOMContentLoaded", function () {
  const currentTeacher = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentTeacher || currentTeacher.role !== "teacher") {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  const database = new Database();
  if (!database.tasks) {
    document.querySelector(".task_list").innerHTML = "<p>No tasks available.</p>";
    return;
  }

  // Display teacher name
  const profileName = document.querySelector(".profile-name");
  if (profileName) profileName.textContent = currentTeacher.username;

});

