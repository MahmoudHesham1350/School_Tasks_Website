const AUTHOR_NAME = new URLSearchParams(window.location.search).get('author');

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '/pages/auth/login.html';
        return;
    }
    const database = new Database();
    
    // Add event listener for priority filter
    const priorityFilter = document.getElementById('priority-filter');
    priorityFilter.addEventListener('change', () => displayTasks(database.tasks));
    
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

function filterTasksByAuthor(tasks, authorName) {
    return authorName ? tasks.filter(task => task.assigned_by === authorName) : tasks;
}

function filterTasksByPriority(tasks, priority) {
    return priority ? tasks.filter(task => task.priority === priority) : tasks;
}

function createNoTasksMessage() {
    const noTasksMessage = document.getElementById("message-container");
    noTasksMessage.innerHTML = `<div id="no-tasks-message" class="no-tasks-message"><p>No tasks available. Check back later!</p></div>`;
}

function renderTasksList(list, tasks) {
    list.innerHTML = '';
    document.getElementById("message-container").innerHTML = "";

    if (!tasks || tasks.length === 0) {
        createNoTasksMessage();
        return;
    }

    tasks.forEach(task => {
        list.appendChild(createTaskCard(task));
    });
}

function displayTasks(tasks) {
    const list = document.getElementById("tasks-list");
    const priorityFilter = document.getElementById('priority-filter').value;
    
    let filteredTasks = filterTasksByAuthor(tasks, AUTHOR_NAME);
    filteredTasks = filterTasksByPriority(filteredTasks, priorityFilter);
    
    renderTasksList(list, filteredTasks);
}
