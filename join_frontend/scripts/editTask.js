/**
 * @type {Array<Object>}
 * Array containing the structure for edited tasks.
 */
let editedTaskArrays = [
  {
    'category': '',
    'date': '',
    'description': '',
    'id': '',
    'prio': '../assets/icons/prioMedium.png',
    'prioName': 'Medium',
    'section': 'toDo',
    'subtasks': [],
    'subtasksCheck': [],
    'title': '',
    'assignedInitals': [],
    'assignedName': [],
    'color': [],
  },
];


/**
 * @type {Object}
 * Reference to the first edited task object.
 */
let editedTaskArray = editedTaskArrays[0];

/**
 * Opens the task edit view for the specified task.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
function editTask(taskIndex) {
  let task = taskAllArray[taskIndex];
  setTimeout(() => {
    editTaskTemplate(task, task.date, taskIndex);
  }, 100);
  setTimeout(() => {
    setPriorityButton(task);
    getUsers();
    searchUsers();
    configureDueDateInput();
    setAssignedUsers(task);
    loadSubtasksFromArray(taskIndex);
    checkEmptySubtasks();
  }, 150);
}


/**
 * loads the taskAllArray into the editedTaskArray 
 * 
 * @param {number} taskIndex the index of the task in taskAllArray
 * @returns the edited Task Array
 */
function loadSubtasksFromArray(taskIndex) {
  editedTaskArray = taskAllArray[taskIndex];
  return editedTaskArray;
}


/**
 * Hides subtask fields if they are empty or starts
 */
function checkEmptySubtasks() {
  if (editedTaskArray.subtasks.length === 0) {
    return
  }
  else {
    renderSubtaskEdit();
  }
}


/**
 * Toggles the visibility of the user dropdown in the edit task view.
 */
function toggleUserDropdownEdit() {
  let dropdown = document.getElementById("dropdown");
  let dropdownUsers = document.getElementById("dropdownUsers");
  dropdown.classList.toggle("dNone");
  dropdownUsers.classList.toggle("dNone");
  document.getElementById("searchUser").focus();
}


/**
 * Sets the priority button in the edit task view based on the task's priority.
 *
 * @param {Object} task - The task object containing priority data.
 */
function setPriorityButton(task) {
  resetPrioButtons();
  if (task.prioName === "Low") {
    setPrioLowEdit();
  }
  if (task.prioName === "Urgent") {
    setPrioHighEdit();
  }
  if (task.prioName === "Medium") {
    setPrioMediumEdit();
  }
}


/**
 * Sets the task priority to "High" in the edit task view.
 */
function setPrioHighEdit() {
  resetPrioButtons();
  document.getElementById('prio0').classList.add('high', 'active');
  document.getElementById('prioHigh').src = "../assets/icons/prioUrgentWhite.png";
}


/**
 * Sets the task priority to "Medium" in the edit task view.
 */
function setPrioMediumEdit() {
  resetPrioButtons();
  document.getElementById('prio1').classList.add('medium', 'active');
  document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
}


/**
 * Sets the task priority to "Low" in the edit task view.
 */
function setPrioLowEdit() {
  resetPrioButtons();
  document.getElementById('prio2').classList.add('low', 'active');
  document.getElementById('prioLow').src = "../assets/icons/prioLowWhite.png";
}


/**
 * Sets the assigned users for the task in the edit task view.
 *
 * @param {Object} task - The task object containing assigned user data.
 */
function setAssignedUsers(task) {
  let users = task.assignedName;
  let allUsers = contactAllArray;
  for (let i = 0; i < allUsers.length; i++) {
    let allUser = allUsers[i].name;
    if (users.includes(allUser)) {
      toggleAssignedUser(i);
    }
  }
}


/**
 * Toggles the edit mode for a specific subtask.
 *
 * @param {number} i - The index of the subtask being edited.
 */
function subtaskEdit(i) {
  document.getElementById(`subtaskBoxEdit${i}`).classList.remove('dNone');
  document.getElementById(`subtaskBox${i}`).classList.add('dNone');
}


/**
 * renders the subtasks in the editCard
 */
function renderSubtaskEdit() {
  let subtasks = editedTaskArray.subtasks;
  document.getElementById('subtasksBox').innerHTML = ``;
  for (let i = 0; i < subtasks.length; i++) {
    let subtask = subtasks[i];
    generateSubtasksEdit(subtask, i)
  }
}


/**
 * renders a new subtask in the editCard
 * 
 * @param {string} subtask The new subtask the user has entered
 */
function renderNewSubtaskEdit(subtask) {
  let i = document.getElementsByClassName('editSubtaskInput').length;
  generateSubtasksEdit(subtask, i);
  document.getElementById('subtasksInput').value = "";
}


/**
 * Saves the edited task details to local storage.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
function saveEditedTasktoLocalStorage(taskIndex) {
  if (!checkInputsEdit()) {
    return;
  }
  else {
    setEditedArray(taskIndex);
    saveToCurrentTask(taskIndex);
    openTaskWithoutAnimation();
    renderAllTasks();
    showTaskDetail(taskIndex, false);
  }
}

/**
 * checks if all 2 inputs are filled
 * 
 * @returns true if all inputs are validated
 */
function checkInputsEdit() {
  let checked = true;
  let checked1 = checkInputTitle();
  if (!checked1) {
    checked = false;
  }
  let checked2 = checkInputDate();
  if (!checked2) {
    checked = false;
  }
  return checked;
}


/**
 * Saves the current task to the taskAllArray and local storage.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
async function saveToCurrentTask(taskIndex) {
  taskId = getIndexOfTask(taskIndex)
  try {
    let response = await fetch(taskURL + taskId + "/", {
      method: 'PUT',
      headers: {
        'Authorization': 'Token ' + currentLoggedUser.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskAllArray[taskIndex])
    });
    await response.json();
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
  }
}


/**
 * Sets up the edited task array with the updated task details.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
function setEditedArray(taskIndex) {
  initializeEditedTaskArray();
  updateAssignedUsers();
  updateTaskDetails(taskIndex);
  updateSubtasks(taskIndex);
  updateTaskPriority();
}


/**
 * Initializes the edited task array by clearing assigned user data.
 */
function initializeEditedTaskArray() {
  editedTaskArray['assignedName'] = [];
  editedTaskArray['assignedInitals'] = [];
  editedTaskArray['color'] = [];
  document.getElementById('taskDetailCard').classList.remove('initalsAndName');
}


/**
 * Updates the assigned users for the task based on the edit view selections.
 */
function updateAssignedUsers() {
  let users = document.getElementsByClassName('dropdownButton');
  for (let i = 0; i < users.length; i++) {
    let check = document.getElementById(`assignedCheck${i}`);
    let currentCheck = check.src.split('/').pop();
    if (users[i].classList.contains('dropdownButtonSelectedUser') && currentCheck !== "checkButtonBlank.png") {
      editedTaskArray['assignedName'].push(document.getElementById(`searchUserName${i}`).innerText);
      editedTaskArray['assignedInitals'].push(document.getElementById(`userCircle${i}`).innerText);
      editedTaskArray['color'].push(document.getElementById(`userCircle${i}`).style.backgroundColor);
    }
  }
}


/**
 * Updates the task details in the edited task array.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
function updateTaskDetails(taskIndex) {
  editedTaskArray['section'] = taskAllArray[taskIndex].section;
  editedTaskArray['category'] = taskAllArray[taskIndex].category;
  editedTaskArray['date'] = taskAllArray[taskIndex].date;
  editedTaskArray['description'] = document.getElementById('descriptionInput').value;
  editedTaskArray['title'] = document.getElementById('titleInput').value;
}


/**
 * Updates the subtasks in the edited task array.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
function updateSubtasks(taskIndex) {
  let task = taskAllArray[taskIndex];
  if (document.getElementById('subtask0')) {
    editedTaskArray['subtasks'][0] = (document.getElementById('subtask0').innerText);
    let checked = task.subtasksCheck[0];
    editedTaskArray['subtasksCheck'][0] = checked;
    if (document.getElementById('subtask1')) {
      editedTaskArray['subtasks'][1] = (document.getElementById('subtask1').innerText);
      let checked = task.subtasksCheck[1];
      editedTaskArray['subtasksCheck'][1] = checked;
    }
  }
}


/**
 * Updates the task priority in the edited task array.
 */
function updateTaskPriority() {
  let prioButtons = document.getElementsByClassName('prioButtonEdit');
  for (let j = 0; j < prioButtons.length; j++) {
    let prioButton = prioButtons[j];
    if (prioButton.classList.contains('active')) {
      editedTaskArray['prioName'] = prioButton.innerText;
      editedTaskArray['prio'] = `../assets/icons/prio${prioButton.innerText}.png`;
    }
  }
}


/**
 * Deletes a subtask from the task and updates the display.
 *
 *
 * @param {number} subtaskIndex - The index of the subtask to delete.
 */
function deleteSubtaskEdit(subtaskIndex) {
  console.log(subtaskIndex);
  
  editedTaskArray['subtasks'].splice(subtaskIndex, 1, "");
  editedTaskArray['subtasksCheck'].splice(subtaskIndex, 1, false);
  document.getElementById(`subtaskBox${subtaskIndex}`).remove();
  document.getElementById(`subtaskBoxEdit${subtaskIndex}`).remove();
}


/**
 * Creates a new subtask for the task in the edit view.
 *
 */
function createSubtaskEdit() {
  let input = document.getElementById('subtasksInput').value;
  if (input === "") {
    return
  }
  else {
    let i = editedTaskArray.subtasks.length;
    editedTaskArray.subtasks[i] = input
  }
  renderNewSubtaskEdit(input);
}


/**
 * Changes the content of a subtask in the task and updates the task data.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {number} i - The index of the subtask being changed.
 */
function subtaskChange(i) {
  let input = document.getElementById(`subtaskEdit${i}`).value.trim();
  if (input === "") {
    deleteSubtaskEdit(i);
    return;
  }
  editedTaskArray.subtasks.splice(i, 1, input);
  checkEmptySubtasks();
}