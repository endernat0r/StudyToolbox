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

function renderTask(task) {
  const li = document.createElement('li');
  li.classList.add('task-item');
  li.innerHTML = `
    <span class="task-name">${task.name}</span>
    <span class="task-priority">Priority: ${task.priority}</span>
    <span class="task-deadline">Deadline: ${task.dueDate || 'None'}</span>
    <input type="radio" name="complete-${task.id}">
  `;
  return li;
}

function displayTasks() {
  const list = document.getElementById('task-list');
  list.innerHTML = '';
  getTasks().forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <span class="task-title">${task.name}</span>
      <span class="task-priority">Priority: ${task.priority}</span>
      <span class="task-deadline">Deadline: ${task.dueDate}</span>
    `;
    list.appendChild(li);
  });
}

const deleteAllBtn = document.getElementById('delete-all-btn');
deleteAllBtn.addEventListener('click', () => {
  const list = document.querySelector(
    `#tab-contents .task-list[data-tab="${activeTab}"]`
  );
  if (list) list.innerHTML = '';
});

const sortBtn = document.getElementById('sort-filter-btn');
let sortState = 'deadline';  // toggle between 'deadline' and 'priority'

sortBtn?.addEventListener('click', () => {
  // flip state
  sortState = sortState === 'deadline' ? 'priority' : 'deadline';
  sortBtn.innerText = sortState === 'deadline'
    ? 'Sort: Deadline'
    : 'Sort: Priority';
  sortTasks();
});

function sortTasks() {
  const list = document.querySelector(
    `#tab-contents .task-list[data-tab="${activeTab}"]`
  );
  const items = Array.from(list.children);
  items.sort((a, b) => {
    const pElsA = a.querySelectorAll('p');
    const pElsB = b.querySelectorAll('p');
    const prA = pElsA[1].innerText.split(': ')[1].toLowerCase();
    const prB = pElsB[1].innerText.split(': ')[1].toLowerCase();
    const dlA = pElsA[2].innerText.split(': ')[1];
    const dlB = pElsB[2].innerText.split(': ')[1];

    if (sortState === 'priority') {
      const order = { top: 1, middle: 2, low: 3 };
      return order[prA] - order[prB];
    } else {
      const timeA = dlA === 'None' ? Infinity : new Date(dlA).getTime();
      const timeB = dlB === 'None' ? Infinity : new Date(dlB).getTime();
      return timeA - timeB;
    }
  });

  // re-append in sorted order
  list.innerHTML = '';
  items.forEach(item => list.appendChild(item));
}