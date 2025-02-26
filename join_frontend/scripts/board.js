const taskURL = 'http://127.0.0.1:8000/api/tasks/';
const contactURL = 'http://127.0.0.1:8000/api/contacts/'

let taskAllArray = [];
let contactAllArray = [];
let currentDraggedElement;


/**
 * Loads all necessary data (contacts and tasks) from the API 
 * and renders the tasks on the page.
 */
async function loadAll() {
  await loadContact();
  await loadTasks();
  checkContacts();
  renderAllTasks();
}


/**
 * Loads the contact array from the API if it exists.
 * Otherwise, the contact array remains empty.
 */
async function loadContact() {
  try {
    const response = await fetch(contactURL, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + currentLoggedUser.token,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    contactAllArray = await response.json();
  } catch (error) {
    console.error(error.message);
  }
}


/**
 * Loads the task array from the API if it exists.
 * Otherwise, the task array remains empty.
 */
async function loadTasks() {
  try {
    const response = await fetch(taskURL, {
      method: 'GET',
      headers: {
        'Authorization': 'Token ' + currentLoggedUser.token,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    taskAllArray = await response.json();
  } catch (error) {
    console.error(error.message);
  }
}


/**
 * Saves the task array to the API
 */
async function saveMovedTasks() {
  let taskId = getIndexOfTask(currentDraggedElement)
  if (taskId) {
    try {
      let response = await fetch(taskURL + taskId + "/", {
        method: 'PUT',
        headers: {
          'Authorization': 'Token ' + currentLoggedUser.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskAllArray[currentDraggedElement])
      });
      await response.json();
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  }
}


/**
 * get the index of the task in the array
 * 
 * @param {*} i the index
 * @returns the taskid
 */
function getIndexOfTask(i) {
  let task = taskAllArray[i]
  if (task) {
    return task.id
  }
}


/**
 * Renders tasks in all task sections (toDo, inProgress, awaitFeedback, done).
 */
function renderAllTasks() {
  renderSection('toDo', 'toDo');
  renderSection('inProgress', 'inProgress');
  renderSection('awaitFeedback', 'awaitFeedback');
  renderSection('done', 'done');
}


/**
 * Renders tasks within a specific section by clearing the container and 
 * generating the appropriate task HTML.
 *
 * @param {string} section - The name of the section to render tasks for.
 * @param {string} containerId - The HTML element ID of the section's container.
 */
function renderSection(section, containerId) {
  let container = document.getElementById(containerId);
  container.innerHTML = '';
  let formattedSectionName = formatSectionName(section);
  let tasksFound = false;

  for (let i = 0; i < taskAllArray.length; i++) {
    let task = taskAllArray[i];
    if (task && task.section === section) {
      container.innerHTML += generateTasksHTML(task, i);
      tasksFound = true;
    }
  }

  if (!tasksFound) {
    container.innerHTML = `<div class="noTasks">No Tasks in ${formattedSectionName}</div>`;
  }
}


/**
 * Formats the section name by capitalizing the first letter and adding spaces before any capitalized letters.
 *
 * @param {string} section - The section name to format.
 * @returns {string} - The formatted section name.
 */
function formatSectionName(section) {
  let formattedName = section.charAt(0).toUpperCase() + section.slice(1);
  formattedName = formattedName.replace(/([A-Z])/g, ' $1').trim();
  return formattedName;
}


/**
 * Truncates a task description to a specified word limit.
 *
 * @param {string} description - The task description.
 * @param {number} wordLimit - The maximum number of words to display.
 * @returns {string} - The truncated description followed by an ellipsis if truncated.
 */
function truncateDescription(description, wordLimit) {
  let words = (typeof description === 'string' ? description.split(' ') : []);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(' ') + '...'
    : description;
}


/**
 * Capitalizes the first letter of a given text.
 *
 * @param {string} text - The text to capitalize.
 * @returns {string} - The text with the first letter capitalized.
 */
function capitalizeFirstLetter(text) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}


/**
 * Starts dragging a task by setting the currentDraggedElement index and adding a "dragging" class to the task.
 *
 * @param {number} taskIndex - The index of the task being dragged.
 */
function startDragging(taskIndex) {
  currentDraggedElement = taskIndex;
  let taskElement = document.querySelector(`[data-task="${taskAllArray[taskIndex].title}"]`);
  taskElement.classList.add('dragging');
}


/**
 * Allows dropping of an element during a drag-and-drop operation.
 *
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}


/**
 * Moves a dragged task to a specified section and updates the UI.
 * 
 * This function handles the movement of a currently dragged task to the target section.
 * It removes the 'dragging' class from the task element and removes the 'dragHover' class
 * from the target section once the task is dropped. The tasks are re-rendered and saved to the API
 * 
 * @param {string} section - The ID of the section where the task should be moved.
 */
function moveTo(section) {
  event.preventDefault()
  if (typeof currentDraggedElement !== 'number' || currentDraggedElement < 0 || currentDraggedElement >= taskAllArray.length) {
    return;
  }

  let task = taskAllArray[currentDraggedElement];
  task.section = section;

  let taskElement = document.querySelector(`[data-task="${taskAllArray[currentDraggedElement].title}"]`);
  taskElement.classList.remove('dragging');

  let sectionElement = document.getElementById(section);
  sectionElement.classList.remove('dragHover');

  renderAllTasks();
  saveMovedTasks();
}


/**
 * Adds a 'dragHover' class to the specified section.
 * 
 * This function is triggered when a draggable task enters a section during drag-and-drop.
 * It adds the 'dragHover' class to the section to provide visual feedback.
 * 
 * @param {string} sectionId - The ID of the section where the task is dragged over.
 */
function highlightBox(sectionId) {
  document.getElementById(sectionId).classList.add('dragHover');
}


/**
 * Removes the 'dragHover' class from the specified section.
 * 
 * This function is triggered when a draggable task leaves a section during drag-and-drop.
 * It removes the 'dragHover' class from the section, removing the visual feedback.
 * 
 * @param {string} sectionId - The ID of the section where the task is no longer dragged over.
 */
function removeHighlightBox(sectionId) {
  document.getElementById(sectionId).classList.remove('dragHover');
}


/**
 * Handles the drag leave event on a drop zone by removing the highlight 
 * from the section if the dragged element has left the current target.
 *
 * @param {DragEvent} event - The drag leave event object.
 * @param {string} sectionId - The ID of the section from which to remove the highlight.
 * 
 * The function checks if the drag event's related target (the element that 
 * the pointer moved to) is still inside the current drop zone. If it is not, 
 * the highlight is removed, and event propagation is stopped.
 */
function handleDropLeave(event, sectionId) {
  if (!event.relatedTarget || !event.currentTarget.contains(event.relatedTarget)) {
    removeHighlightBox(sectionId);
    event.stopPropagation();
  }
}


/**
 * Formats a category string by removing spaces.
 *
 * @param {string} category - The category to format.
 * @returns {string} - The formatted category class name.
 */
function formatCategoryClass(category) {
  return category ? category.replace(/\s+/g, '') : '';
}


/**
 * Returns the initials to display and the count of remaining initials not shown.
 *
 * @param {Array<string>} assignedInitals - The list of initials assigned to a task.
 * @param {number} maxInitialsToShow - The maximum number of initials to display.
 * @returns {{initialsToShow: Array<string>, remainingInitialsCount: number}} - An object containing the initials to show and the remaining count.
 */
function getInitialsToShow(assignedInitals, maxInitialsToShow) {
  let initialsToShow = assignedInitals.slice(0, maxInitialsToShow);
  let remainingInitialsCount = assignedInitals.length - maxInitialsToShow;
  return { initialsToShow, remainingInitialsCount };
}


/**
 * Renders initials for assigned users along with a priority indicator.
 *
 * @param {Array<string>} assignedInitals - The initials of assigned users.
 * @param {Array<string>} colors - The colors associated with each initial.
 * @param {string} prio - The task priority level.
 * @returns {string} - The HTML to display the initials and priority.
 */
function renderInitials(assignedInitals, colors, prio) {
  let maxInitialsToShow = 3;
  let { initialsToShow, remainingInitialsCount } = getInitialsToShow(assignedInitals, maxInitialsToShow);
  let initialElements = initialsToShow.map((initial, index) => `
    <div class="assignedUser" style="background-color: ${colors[index]};">
      <span class="userInitials">${initial}</span>
    </div>
  `).join('');
  let remainingElement = remainingInitialsCount > 0
    ? `<div class="assignedUser remainingUsers"><span class="userInitials">+${remainingInitialsCount}</span></div>`
    : '';
  return generateInitialsAndPriorityHTML(initialElements, remainingElement, prio);
}


/**
 * Calculates the progress of subtasks for a given task.
 *
 * @param {number} taskIndex - The index of the task.
 * @returns {{subtaskBarWidth: number, completedSubtasks: number, amountSubtasks: number}} - An object containing subtask progress information.
 */
function calculateSubtaskProgress(taskIndex) {
  let task = taskAllArray[taskIndex];
  if (!task || !task.subtasks || task.subtasks.length === 0) {
    return { subtaskBarWidth: 0, completedSubtasks: 0, amountSubtasks: 0 };
  }
  let validSubtasks = task.subtasks.filter(subtask => subtask && subtask.trim() !== '');
  let completedSubtasks = task.subtasksCheck ? task.subtasksCheck.filter(Boolean).length : 0;
  let amountSubtasks = validSubtasks.length;
  let subtaskBarWidth = amountSubtasks > 0 ? (completedSubtasks / amountSubtasks) * 100 : 0;
  return {
    subtaskBarWidth,
    completedSubtasks,
    amountSubtasks
  };
}


/**
 * Updates the subtask progress bar and count of completed subtasks.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {number} subtaskBarWidth - The width of the progress bar as a percentage.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} amountSubtasks - The total number of subtasks.
 */
function updateSubtaskProgressBar(taskIndex, subtaskBarWidth, completedSubtasks, amountSubtasks) {
  let subtaskBar = document.getElementById(`subtaskBar${taskIndex}`);
  let subtaskCount = document.getElementById(`subtaskCount${taskIndex}`);
  if (subtaskBar) {
    subtaskBar.style.width = `${subtaskBarWidth}%`;
  }
  if (subtaskCount) {
    subtaskCount.innerText = `${completedSubtasks}/${amountSubtasks} Subtasks`;
  }
}


/**
 * Checks if the contactAllArray contains the User from the task
 * 
 * @param {string} key The key-string for the Array
 * @param {string} value The value of the Array
 * @returns 
 */
function containsValue(key, value) {
  return contactAllArray.some(contact => contact[key] === value);
}


/**
 * Checks the contactAllArray with the TaskAllarray and deletes the users in the tasks that are deleted
 */
function checkContacts() {
  for (let i = 0; i < taskAllArray.length; i++) {
    let task = taskAllArray[i];
    let assignedNames = task.assignedName;
    console.log(assignedNames, task);
    
    for (let j = 0; j < assignedNames.length; j++) {
      let name = assignedNames[j];
      let check = containsValue("name", name);
      if (!check) {
        task.assignedInitals.splice(j, 1);
        task.assignedName.splice(j, 1);
        task.color.splice(j, 1);
        saveMovedTasks
          ()
      }
    }
  }
}