document.addEventListener("DOMContentLoaded", listTasks);

function getUserByID(id, users) {
  return users.find(user => user.id === id);
}

function viewTaskDetails(taskID){
  window.location.href = `${URL}pages/tasks/Task_Details.html?taskId=${taskID}`;
}

function createTaskCard(task, users){
  const item = document.createElement("div");
  item.className = "task_card";
  const created_by = getUserByID(task.assigned_by, users)?.name || 'Unknown';
  item.addEventListener('click', () => viewTaskDetails(task.id));

  item.innerHTML = `
      <div class="title">
          <h3>${task.title}</h3>
      </div>
      <div class="card_details">
          <div class="description">
              <p>${task.description}</p>
          </div>
          <div class="card_footer">
              <div class="due_date">Due: ${task.due_date}</div>
              <div class="created_by">By: ${created_by}</div>
          </div>
      </div>`;

    return item;
}

async function listTasks() {
  try {
    const json = JSON.parse(await fetchData("data.json"));
    const tasks = json.tasks;
    const users = json.users;
    const list = document.getElementById("tasks-list");
    
    tasks.forEach(task => {
      const item = createTaskCard(task, users)
      list.appendChild(item);
    });

  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
