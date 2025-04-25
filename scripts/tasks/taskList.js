const AUTHOR_NAME = new URLSearchParams(window.location.search).get('author');

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    const database = new Database();
    displayTasks(database.tasks);
});

function viewTaskDetails(taskID){
    window.location.href = `/pages/tasks/taskDetails.html?taskId=${taskID}`;
}

function createTaskCard(task) {
    const item = document.createElement("div");
    item.className = "task_card";
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
                <div class="created_by">By: ${task.assigned_by}</div>
            </div>
        </div>`;

    return item;
}

function displayTasks(tasks) {
    const list = document.getElementById("tasks-list");
    list.innerHTML = ''; 
    
    // Filter tasks if author filter is applied
    let filteredTasks = tasks;
    if (AUTHOR_NAME !== null) {
        filteredTasks = tasks.filter(task => task.assigned_by === AUTHOR_NAME);
    }
    
    // Check if there are any tasks to display
    if (!tasks || tasks.length === 0 || filteredTasks.length === 0) {
        const noTasksMessage = document.createElement("div");
        noTasksMessage.className = "no-tasks-message";
        noTasksMessage.innerHTML = "<p>No tasks available. Check back later!</p>";
        list.style.display = "block";
        list.appendChild(noTasksMessage);
        return;
    }
    
    // Display available tasks
    filteredTasks.forEach(task => {
        const item = createTaskCard(task);
        list.appendChild(item);
    });
}
