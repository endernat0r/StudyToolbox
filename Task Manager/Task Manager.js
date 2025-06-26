const taskInput = document.getElementById("task");
const priorityInput = document.getElementById("priority");
const deadlineInput = document.getElementById("deadline");
const noDeadlineButton = document.getElementById("no-deadline");
const addTaskButton = document.getElementById("add-task");

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

let activeTab = "default";

const createTabBtn = document.getElementById("create-tab");
const newTabNameInput = document.getElementById("new-tab-name");
const tabHeadersContainer = document.getElementById("tab-headers");
const tabContentsContainer = document.getElementById("tab-contents");

function switchTab(tabName) {
    activeTab = tabName;
    document.querySelectorAll(".tab-header").forEach(button => {
        button.classList.toggle("active", button.getAttribute("data-tab") === tabName);
    });
    document.querySelectorAll("#tab-contents .task-list").forEach(list => {
        list.style.display = (list.getAttribute("data-tab") === tabName) ? "block" : "none";
    });
}

tabHeadersContainer.querySelectorAll(".tab-header").forEach(button => {
    button.addEventListener("click", () => {
        if (!button.contains(event.target) || event.target.classList.contains("delete-tab")) return;
        switchTab(button.getAttribute("data-tab"));
    });
});

createTabBtn.addEventListener("click", function() {
    const newTabName = newTabNameInput.value.trim();
    if (!newTabName) {
        alert("Please enter a tab name.");
        return;
    }
    if (document.querySelector(`.tab-header[data-tab="${newTabName}"]`)) {
        alert("A tab with this name already exists.");
        return;
    }
    const newTabHeader = document.createElement("button");
    newTabHeader.classList.add("tab-header");
    newTabHeader.setAttribute("data-tab", newTabName);
    newTabHeader.innerHTML = `${newTabName} <span class="delete-tab" title="Delete Tab">&times;</span>`;
    
    newTabHeader.addEventListener("click", function(e) {
        if (e.target.classList.contains("delete-tab")) return;
        switchTab(newTabName);
    });
    
    const deleteBtn = newTabHeader.querySelector(".delete-tab");
    deleteBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        newTabHeader.remove();
        const tabContent = document.querySelector(`#tab-contents .task-list[data-tab="${newTabName}"]`);
        if (tabContent) tabContent.remove();
        if (activeTab === newTabName) {
            switchTab("default");
        }
    });
    
    tabHeadersContainer.insertBefore(newTabHeader, newTabNameInput);
    
    const newTabContent = document.createElement("div");
    newTabContent.className = "task-list";
    newTabContent.setAttribute("data-tab", newTabName);
    newTabContent.style.display = "none";
    tabContentsContainer.appendChild(newTabContent);
    
    newTabNameInput.value = "";
    switchTab(newTabName);
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
    
    const activeTaskList = document.querySelector(`#tab-contents .task-list[data-tab="${activeTab}"]`);
    const taskItem = document.createElement("div");
    taskItem.classList.add("task");
    taskItem.innerHTML = `
      <p>${task}</p>
      <p>Priority: ${priority}</p>
      <p>Deadline: ${deadline}</p>
      <button class="delete-task">Delete</button>
    `;
    
    taskItem.querySelector(".delete-task").addEventListener("click", () => {
        activeTaskList.removeChild(taskItem);
    });
    
    activeTaskList.appendChild(taskItem);
    taskInput.value = "";
    priorityInput.value = "top";
    if (!deadlineInput.disabled) {
        deadlineInput.value = "";
    }
});