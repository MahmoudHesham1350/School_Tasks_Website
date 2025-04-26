document.addEventListener("DOMContentLoaded", () => {
  loadData();
  document.getElementById("taskForm").addEventListener("submit", handleSubmit);
});

function loadData() {
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = router.getPage("/login");
    return;
  }
}

function handleSubmit(event) {
  event.preventDefault();
  const database = new Database();
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

  // Get form values
  const title = document.getElementById("title").value;
  const subject = document.getElementById("subject").value;
  const priority = document.getElementById("priority").value;
  const status = document.getElementById("status").value;
  const description = document.getElementById("description").value;
  const due_date = document.getElementById("due_date").value;
  const attachmentInput = document.getElementById("attachment");

  // Create new task
  const task = new Task(
    Date.now().toString(), // Generate unique ID
    title,
    description,
    currentUser.username, // Use current user's username
    due_date,
    priority,
    status,
    subject
  );

  // Handle file attachments
  if (attachmentInput.files.length > 0) {
    Array.from(attachmentInput.files).forEach((file) => {
      const fileInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
      };
      task.addAttachment(fileInfo);
    });
  }

  // Add task to database
  try {
    database.addTask(task);
    alert("Task created successfully!");
    window.location.href = router.getPage("/tasks"); // Redirect to task list page
  } catch (error) {
    alert("Error creating task: " + error.message);
  }

  return false;
}

function clearLocalStorage() {
  const form = document.getElementById("taskForm");
  form.reset();

  // Clear file input separately since reset doesn't always work for files
  const fileInput = document.getElementById("attachment");
  fileInput.value = "";
}
