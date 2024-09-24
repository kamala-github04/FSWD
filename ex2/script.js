// Function to load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => {
        addTaskToDOM(task);
    });
}

// Function to add a task to the DOM
function addTaskToDOM(taskText) {
    const taskList = document.getElementById('task-list');

    // Create a new list item
    const li = document.createElement('li');
    li.innerText = taskText;

    // Create the delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = '🗑️';

    // Add delete functionality
    deleteBtn.addEventListener('click', function () {
        taskList.removeChild(li);
        deleteTaskFromStorage(taskText);
    });

    // Append the delete button to the list item
    li.appendChild(deleteBtn);

    // Add the new task to the list
    taskList.appendChild(li);
}

// Function to save tasks to localStorage
function saveTaskToStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to delete task from localStorage
function deleteTaskFromStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event listener to add a new task
document.getElementById('add-task').addEventListener('click', function () {
    const taskText = document.getElementById('new-task').value;

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Add task to the DOM
    addTaskToDOM(taskText);

    // Save task to localStorage
    saveTaskToStorage(taskText);

    // Clear the input field
    document.getElementById('new-task').value = '';
});

// Load tasks when the page is loaded
document.addEventListener('DOMContentLoaded', loadTasks);
