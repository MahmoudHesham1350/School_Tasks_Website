document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('taskForm');
    
    form.addEventListener('submit', function(e) {
        const dueDate = document.querySelector('input[name="due_date"]').value;
        if (new Date(dueDate) < new Date()) {
            e.preventDefault();
            alert('Due date cannot be in the past');
        }
    });
});
