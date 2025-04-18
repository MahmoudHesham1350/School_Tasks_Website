document.addEventListener("DOMContentLoaded", listTasks);

function getUserByID(id, users) {
  return users.find(user => user.id === id);
}

async function listTasks() {
  try {
    const json = JSON.parse(await fetchData("data.json"));
    const tasks = json.tasks;
    const users = json.users;
    const list = document.getElementById("tasks-list");
    
    tasks.forEach(task => {
      const item = document.createElement("div");
      item.className = "task_card";

      let created_by = getUserByID(task.assigned_by, users);
      created_by = created_by ? created_by.name : 'Unknown';

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
      list.appendChild(item);
    });

  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}