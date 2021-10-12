const tasksList = document.querySelector("#tasksList");
const completedTaskList = document.querySelector("#completedTasksList");
const addTaskForm = document.querySelector("#addTask");
const addTaskInput = document.querySelector("#addTaskInput");
const messageBoxAddTask = document.querySelector(".messageBoxAddTask");
const messageBoxDeleteTask = document.querySelector(".messageBoxDeleteTask");
const messageBoxUpdateTask = document.querySelector(".messageBoxUpdateTask");

let addTimeout;
let deleteTimeout;
let updateTimeout;

const deleteTask = async (e) => {
  const taskIndex = e.target.parentNode.getAttribute("data-index");

  try {
    const response = await fetch(`/tasks/${taskIndex}`, {
      method: "DELETE",
    });
    const data = await response.text();
    clearTimeout(deleteTimeout);
    messageBoxDeleteTask.innerText = data;
    loadAllTasks();
    deleteTimeout = setTimeout(() => {
      messageBoxDeleteTask.innerText = "";
    }, 1500);
  } catch (err) {
    console.log(err);
  }
};

const updateTask = async (e) => {
  const taskIndex = e.target.parentNode.getAttribute("data-index");
  let updatedData;
  if (e.target.className === "completedBtn") {
    updatedData = { completed: true };
  } else if (e.target.className === "uncompletedBtn") {
    updatedData = { completed: false };
  }

  try {
    const response = await fetch(`/tasks/${taskIndex}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    const data = await response.text();
    clearTimeout(updateTimeout);
    messageBoxUpdateTask.innerText = data;
    loadAllTasks();
    updateTimeout = setTimeout(() => {
      messageBoxUpdateTask.innerText = "";
    }, 1500);
  } catch (err) {
    console.log(err);
  }
};

const loadAllTasks = async () => {
  tasksList.innerText = "";
  completedTaskList.innerText = "";
  try {
    const data = await fetch("/tasks");
    const tasks = await data.json();

    tasks.forEach((task, index) => {
      if (task.completed === false) {
        const li = document.createElement("li");
        li.setAttribute("data-index", index);
        li.innerText = `${task.name}`;

        const completedBtn = document.createElement("button");
        completedBtn.classList.add("completedBtn");
        completedBtn.innerText = "Done!";
        li.appendChild(completedBtn);

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.innerText = "Delete";
        li.appendChild(deleteBtn);

        tasksList.appendChild(li);
      } else {
        const li = document.createElement("li");
        li.setAttribute("data-index", index);
        li.innerText = `${task.name}`;

        const uncompletedBtn = document.createElement("button");
        uncompletedBtn.classList.add("uncompletedBtn");
        uncompletedBtn.innerText = "Not yet...";
        li.appendChild(uncompletedBtn);
        completedTaskList.appendChild(li);
      }
    });

    const completedBtns = document.querySelectorAll(".completedBtn");
    const deleteBtns = document.querySelectorAll(".deleteBtn");
    const uncompletedBtns = document.querySelectorAll(".uncompletedBtn");

    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", deleteTask);
    });

    completedBtns.forEach((btn) => {
      btn.addEventListener("click", updateTask);
    });

    uncompletedBtns.forEach((btn) => {
      btn.addEventListener("click", updateTask);
    });
  } catch (err) {
    console.log(err);
  }
};

window.addEventListener("load", loadAllTasks);

addTaskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const taskName = addTaskInput.value.trim();
  const task = {
    name: taskName,
    completed: false,
  };
  try {
    const response = await fetch("/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    const data = await response.text();
    clearTimeout(addTimeout);
    messageBoxAddTask.innerText = data;
    addTaskInput.value = "";
    loadAllTasks();
    addTimeout = setTimeout(() => {
      messageBoxAddTask.innerText = "";
    }, 1500);
  } catch (err) {
    console.log(err);
  }
});
