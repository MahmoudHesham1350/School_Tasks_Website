document.addEventListener("DOMContentLoaded", function () {
  // Fetch the data from the JSON file
  fetch("../../data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // For demo purposes, we'll use the first student (ID: 2)
      const studentId = 2; // Alex Johnson
      displayStudentData(data, studentId);
      displayStudentTasks(data, studentId);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      document.querySelector(".dashboard").innerHTML =
        "<p>Failed to load dashboard data. Please try again later.</p>";
    });
});

function displayStudentData(data, studentId) {
  // Find the student in the users array
  const student = data.users.find(
    (user) => user.id === studentId && user.role === "student"
  );

  if (student) {
    // Update the profile information
    document.querySelector(".profile-name").textContent = student.name;
    document.querySelector(
      ".profile-bio"
    ).textContent = `Grade ${student.grade} Student`;
  }
}

function displayStudentTasks(data, studentId) {
  // Filter tasks assigned to this student
  const studentTasks = data.tasks.filter(
    (task) => task.assigned_to === studentId
  );

  // Clear current activity list
  const activityList = document.querySelector(".activity-list");
  activityList.innerHTML = "";

  // If no tasks, display a message
  if (studentTasks.length === 0) {
    activityList.innerHTML =
      '<div class="activity-item">No tasks assigned yet</div>';
    return;
  }

  // Sort tasks by due date and priority
  studentTasks.sort((a, b) => {
    // First sort by status (pending first)
    if (a.status !== b.status) {
      return a.status === "pending" ? -1 : 1;
    }
    // Then by due date
    return new Date(a.due_date) - new Date(b.due_date);
  });

  // Add tasks to the activity list
  studentTasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "activity-item";

    // Format the task display based on status
    let statusClass = "";
    switch (task.status) {
      case "pending":
        statusClass = "task-pending";
        break;
      case "in progress":
        statusClass = "task-progress";
        break;
      case "completed":
        statusClass = "task-completed";
        break;
      default:
        statusClass = "task-not-started";
    }

    taskElement.classList.add(statusClass);

    // Format due date
    const dueDate = new Date(task.due_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    taskElement.innerHTML = `
            <h4>${task.title}</h4>
            <p class="task-subject">${task.subject}</p>
            <p class="task-due">Due: ${dueDate}</p>
            <p class="task-status">Status: ${task.status}</p>
        `;

    activityList.appendChild(taskElement);
  });
}
