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
    
    tasks.forEach(task => {
        if (AUTHOR_NAME !== null && task.assigned_by !== AUTHOR_NAME) return;
        const item = createTaskCard(task);
        list.appendChild(item);
    });
}
