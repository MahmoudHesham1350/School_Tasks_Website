document.addEventListener("DOMContentLoaded", function () {
  // Get current student from session storage
  const currentStudent = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentStudent) {
    window.location.href = "../auth/login.html";
    return;
  }

  // Get data from localStorage
  const usersJSON = localStorage.getItem("users");
  const tasksJSON = localStorage.getItem("tasks");

  if (!usersJSON || !tasksJSON) {
    document.querySelector(".dashboard").innerHTML =
      "<p>No data available. Please contact administrator.</p>";
    return;
  }

  const data = {
    users: JSON.parse(usersJSON),
    tasks: JSON.parse(tasksJSON),
  };

  displayStudentData(data, currentStudent);
  displayStudentTasks(data, currentStudent.id);
});

function displayStudentData(data, student) {
  document.querySelector(".profile-name").textContent = student.username;
  document.querySelector(".profile-bio").textContent = `Grade ${student.grade}`;
}

function displayStudentTasks(data, studentId) {
  const studentTasks = data.tasks.filter(
    (task) => task.assigned_to === studentId
  );
  const taskList = document.querySelector(".task_list");
  taskList.innerHTML = "";

  if (studentTasks.length === 0) {
    taskList.innerHTML = "<p>No tasks assigned to you yet.</p>";
    return;
  }

  studentTasks.forEach((task) => {
    const teacher = data.users.find((user) => user.id === task.assigned_by);
    const taskCard = document.createElement("div");
    taskCard.className = "task_card";
    taskCard.classList.add(`status-${task.status.replace(" ", "-")}`);

    taskCard.innerHTML = `
      <div class="title">
        <h3>${task.title}</h3>
        <span class="priority-badge ${task.priority}">${task.priority}</span>
      </div>
      <div class="card_details">
        <div class="description">
          <p>${task.description}</p>
        </div>
        <div class="task-meta">
          <p><strong>Subject:</strong> ${task.subject}</p>
          <p><strong>Status:</strong> ${task.status}</p>
        </div>
        <div class="card_footer">
          <div class="due_date">Due: ${task.due_date}</div>
          <div class="created_by">By: ${
            teacher ? teacher.name : "Unknown"
          }</div>
        </div>
      </div>
    `;

    taskList.appendChild(taskCard);
  });
}
