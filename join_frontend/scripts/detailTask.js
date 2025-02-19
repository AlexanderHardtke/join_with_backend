/**
 * Displays the details of a specific task, including subtasks.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {boolean} - The parameter that decides if the animation is played or not
 */
function showTaskDetail(taskIndex, boolean) {
  let task = taskAllArray[taskIndex];
  let taskDetailsHTML = generateTaskDetails(task, taskIndex);
  let taskContent = document.getElementById("taskDetailCard");
  if (taskContent) {
    taskContent.innerHTML = taskDetailsHTML;
  }
  let subtasksElement = document.getElementById("subtasksDetail");
  if (subtasksElement && Array.isArray(task.subtasks) && task.subtasks.length > 0) {
    subtasksElement.innerHTML = renderSubtasks(taskIndex, task);
    calculateSubtaskProgress(taskIndex);
  }
  toggleTask(boolean);
}


/**
 * Converts a date from German format (DD/MM/YYYY) to standard format (YYYY-MM-DD).
 *
 * @param {string} dateGerman - The date in German format.
 * @returns {string} - The date in standard format.
 */
function changeDateFormatEdit(dateGerman) {
  let [year, month, day] = dateGerman.split("/");
  let formattedDateStr = `${day}-${month}-${year}`;
  return formattedDateStr;
}


/**
 * Converts a date from standard format (YYYY-MM-DD) to German format (DD/MM/YYYY).
 *
 * @param {string} dateEnglish - The date in standard format.
 * @returns {string} - The date in German format.
 */
function changeDateFormat(dateEnglish) {
  let formattedDate = dateEnglish.replace(/-/g, '/');
  let [year, month, day] = formattedDate.split('/');
  let formattedDateStr = `${day}/${month}/${year}`;
  return formattedDateStr;
}


/**
 * Toggles the visibility of the task detail view.
 */
function toggleTask(boolean) {
  let taskDetailContainer = document.getElementById("containerTasksDetail");
  if (boolean === false) {
    taskDetailContainer.classList.remove('slideinright');
    taskDetailContainer.classList.remove('slideinleft');
  } else {
    taskDetailContainer.classList.add('slideinright');
    taskDetailContainer.classList.remove('slideinleft');
  }
  taskDetailContainer.classList.toggle("d-none");
}

/**
 * Opens the task detail without animation (used after editing).
 */
function openTaskWithoutAnimation() {
  toggleTask(false);
}

/**
 * Closes the current Task
 */
function closeTask() {
  let taskDetailContainer = document.getElementById("containerTasksDetail");

  taskDetailContainer.classList.remove('slideinright');
  taskDetailContainer.classList.add('slideinleft');

  setTimeout(() => {
    taskDetailContainer.classList.add("d-none");
    document.getElementById("taskDetailCard").innerHTML = ``;
  }, 400);
}


/**
 * Closes the current Task with the Overlay
 */
function closeTaskWithOverlay () {
  if (event.target.id === "containerTasksDetail"){
    closeTask();
  }
}


/**
 * Deletes a task from the taskAllArray and updates the task display.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 */
function deleteTask(taskIndex) {
  taskAllArray.splice(taskIndex, 1);
  saveTasksToLocalStorage();
  toggleTask();
  renderAllTasks();
  document.getElementById('searchInput').value = "";
}


/**
 * Toggles the completion status of a subtask and updates its display.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {number} subtaskIndex - The index of the subtask within the task.
 */
function toggleSubtaskImage(taskIndex, subtaskIndex) {
  let task = taskAllArray[taskIndex];
  if (!task || !Array.isArray(task.subtasksCheck)) return console.error('Invalid task data', taskIndex);

  task.subtasksCheck[subtaskIndex] = !task.subtasksCheck[subtaskIndex];
  let image = document.getElementById(`subtask-image-${taskIndex}-${subtaskIndex}`);
  if (image) {
    image.src = task.subtasksCheck[subtaskIndex]
      ? "../assets/icons/checkButtonChecked.png"
      : "../assets/icons/checkButtonblank.png";
  }
  saveTasksToLocalStorage();
  let { subtaskBarWidth, completedSubtasks, amountSubtasks } = calculateSubtaskProgress(taskIndex);
  updateSubtaskProgressBar(taskIndex, subtaskBarWidth, completedSubtasks, amountSubtasks);
}


/**
 * Renders the subtasks of a task.
 *
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} - The HTML string for rendering subtasks.
 */
function renderSubtasks(taskIndex, task) {
  let subtasks = task.subtasks || [];
  let subtasksCheck = task.subtasksCheck || [];
  let validSubtasks = subtasks.filter(subtask => subtask && subtask.trim() !== "");
  if (!validSubtasks.length) return "<p>No subtasks available.</p>";

  return validSubtasks.map((subtask, validIndex) => {
    let isChecked = subtasksCheck[validIndex] || false;
    let imageSrc = isChecked
      ? "../assets/icons/checkButtonChecked.png"
      : "../assets/icons/checkButtonblank.png";
    return `
      <div class="subtask">
        <img src="${imageSrc}" id="subtask-image-${taskIndex}-${validIndex}" class="custom-checkbox" onclick="toggleSubtaskImage(${taskIndex}, ${validIndex})" alt="Subtask Status">
        <span>${subtask}</span>
      </div>`;
  }).join("");
}


/**
 * Toggles the visibility of the dropdown menu.
 * 
 * This function selects the element with the ID 'sectionDropdown' and
 * toggles its visibility by adding or removing the 'd-none' class.
 * 
 * If the 'd-none' class is present, the function removes it to show the
 * dropdown menu. If the class is absent, the function adds it to hide the
 * dropdown menu.
 */
function toggleSectionDropdown() {
  const sectionDropdown = document.getElementById('sectionDropdown');
  if (sectionDropdown.classList.contains('d-none')) {
      sectionDropdown.classList.remove('d-none');
  } else {
      sectionDropdown.classList.add('d-none');
  }
}


/**
 * Moves the task to the selected section based on the task index.
 * 
 * @param {string} section - The section to which the task will be moved (e.g., 'toDo', 'inProgress', 'done').
 * @param {number} taskIndex - The index of the task in the taskAllArray.
 * 
 * This function updates the 'section' property of the task in the taskAllArray
 * and saves the updated tasks to local storage. It also triggers a re-rendering
 * of the task list and hides the dropdown after the task is moved.
 */
function moveTaskToSection(section, taskIndex) {
  if (typeof taskIndex === 'number' && taskIndex >= 0 && taskIndex < taskAllArray.length) {
      taskAllArray[taskIndex].section = section;
      saveTasksToLocalStorage(); 
      renderAllTasks(); 
      toggleSectionDropdown(); 
  } else {
      console.error('Task index is not valid:', taskIndex); 
  }
}


/**
 * Returns the task index.
 * 
 * @param {number} taskIndex - The index of the task.
 * @returns {number} The task index.
 * 
 * This function logs the current task index for debugging and simply returns the index.
 */
function getCurrentTaskIndex(taskIndex) {
  return taskIndex; 
}