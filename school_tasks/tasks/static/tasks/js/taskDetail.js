function deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        fetch(window.location.href, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrfToken
            }
        }).then(response => {
            if (response.ok) {
                window.location.href = tasksListUrl;
            }
        });
    }
}
