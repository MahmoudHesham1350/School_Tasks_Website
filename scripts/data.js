class User {
    username;
    role; 
    email;
    password; // Private field for password

    constructor(username, email, password, role) {
        this.username = username;
        this.role = role;
        this.email = email;
        this.password = password;
    }   

    checkPassword(password) {
        return this.password === password;
    }

    setPassword(newPassword) {
        this.password = newPassword;
    }

}

class Task {
    constructor(id, title, description, assigned_by, due_date, priority, status, subject) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.assigned_by = assigned_by;
        this.due_date = due_date;           
        this.priority = priority;
        this.status = status;
        this.subject = subject;
        this.createdAt = new Date().toLocaleString(); // Set createdAt to current date and time
        this.Attachment = []; // Initialize Attachment as an empty array
    }
    addAttachment(attachment) {
        this.Attachment.push(attachment);
    }
}

class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    }

    save() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    addUser(user) {
        this.users.push(user);
        this.save();
    }

    getTaskByID(id) {
        return this.tasks.find(task => task.id === id);
    }

    addTask(task) {
        this.tasks.push(task);
        this.save();
    }

    deleteTask(taskID) {
        this.tasks = this.tasks.filter(task => task.id !== taskID);
        this.save();
    }
    
    updateTask(updatedTask) {
        const index = this.tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.save();
            return true;
        }
        return false;
    }

    getUserByUsername(username) {
        const user_data = this.users.find(user => user.username === username);
        if (user_data) {
            return new User(user_data.username, user_data.email, user_data.password, user_data.role);
        }
        return null;
    }
    getUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }
}