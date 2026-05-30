// To-Do List App

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const emptyMessage = document.getElementById('emptyMessage');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// Array to store tasks
let tasks = [];

// Load tasks from local storage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
    renderTasks();
});

// Event Listener: Add task on button click
addBtn.addEventListener('click', addTask);

// Event Listener: Add task on Enter key press
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Function to add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    // Validation: Check if input is not empty
    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    // Check for duplicate tasks
    if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        alert('This task already exists!');
        return;
    }

    // Create task object
    const task = {
        id: Date.now(), // Unique ID using timestamp
        text: taskText,
        completed: false
    };

    // Add task to array
    tasks.push(task);

    // Clear input field
    taskInput.value = '';
    taskInput.focus();

    // Save to local storage
    saveTasksToLocalStorage();

    // Render tasks
    renderTasks();
}

// Function to delete a task
function deleteTask(id) {
    // Filter out the task with matching ID
    tasks = tasks.filter(task => task.id !== id);

    // Save to local storage
    saveTasksToLocalStorage();

    // Render tasks
    renderTasks();
}

// Function to toggle task completion status
function toggleComplete(id) {
    // Find task and toggle its completed status
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = !task.completed;
    }

    // Save to local storage
    saveTasksToLocalStorage();

    // Render tasks
    renderTasks();
}

// Function to render tasks on the DOM
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';

    // Check if tasks array is empty
    if (tasks.length === 0) {
        emptyMessage.style.display = 'block';
    } else {
        emptyMessage.style.display = 'none';
    }

    // Loop through tasks array and create DOM elements
    tasks.forEach(task => {
        // Create list item
        const li = document.createElement('li');
        li.className = 'task-item';

        // Add completed class if task is completed
        if (task.completed) {
            li.classList.add('completed');
        }

        // Create checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(task.id));

        // Create task text span
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = task.text;

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        // Append elements to list item
        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(deleteBtn);

        // Append list item to task list
        taskList.appendChild(li);
    });

    // Update statistics
    updateStats();
}

// Function to update task statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    totalCount.textContent = total;
    completedCount.textContent = completed;
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}
