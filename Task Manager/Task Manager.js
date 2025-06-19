const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const noDeadlineButton = document.getElementById("no-deadline");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");


noDeadlineButton.addEventListener("click", () => {
    if (noDeadlineButton.classList.contains("active")) {
        noDeadlineButton.classList.remove("active");
        deadlineInput.disabled = false;
        deadlineInput.value = "";
    } else {
        noDeadlineButton.classList.add("active");
        deadlineInput.disabled = true;
        deadlineInput.value = "";
    }
});

addTaskButton.addEventListener("click", () => {
    const task = taskInput.value;
    const priority = priorityInput.value;
    let deadline = deadlineInput.value;
    
    
    if (task.trim() === "" || (!deadlineInput.disabled && deadline === "")) {
        alert("Please enter a task and select an upcoming date or choose 'No Deadline'.");
        return;
    }
    
    
    if (!deadlineInput.disabled) {
        const selectedDate = new Date(deadline);
        const currentDate = new Date();
        if (selectedDate <= currentDate) {
            alert("Please select an upcoming date for the deadline.");
            return;
        }
    } else {
        deadline = "None";
    }

    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.innerHTML = `
    <p>${task}</p>
    <p>Priority: ${priority}</p>
    <p>Deadline: ${deadline}</p>
    <button class="mark-done"></button>
  `;

    taskList.appendChild(taskItem);

    taskInput.value = "";
    priorityInput.value = "top";
    if (!deadlineInput.disabled) {
        deadlineInput.value = "";
    }
});
    
taskList.addEventListener("click", (event) => {
    if (event.target.classList.contains("mark-done") && !event.target.classList.contains("done")) {
        const taskItem = event.target.parentElement;
        taskItem.style.backgroundColor = "#f2f2f2";
        event.target.classList.add("done");
        event.target.disabled = true;
    }
});