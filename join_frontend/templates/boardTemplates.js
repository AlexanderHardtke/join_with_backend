/**
 * Generates the HTML for a task card.
 *
 * @param {Object} element - The task object containing task data.
 * @param {number} i - The index of the task in the task array.
 * @returns {string} - The HTML string for the task card.
 */
function generateTasksHTML(element, i) {
  let { category, title, description, subtasks = [], prio, assignedInitals = [], color = [] } = element;
  let categoryClass = formatCategoryClass(category);
  let capitalizedTitle = capitalizeFirstLetter(title);
  let capitalizedDescription = capitalizeFirstLetter(description);
  let truncatedDescription = truncateDescription(capitalizedDescription, 7);

  let progressHTML = subtasks.length > 0 ? generateSubtaskProgressHTML(subtasks, i) : '';
  let initials = renderInitials(assignedInitals, color, prio);

  return /*html*/`
    <div class="task" draggable="true" data-task="${title}" ondragstart="startDragging(${i})" ondrop="moveTo('${element.section}')" onclick="showTaskDetail(${i})">
       <div class="category ${categoryClass}">${category}</div>
       <div class="title">${capitalizedTitle}</div>
       <div class="description">${truncatedDescription}</div>
       ${progressHTML}
       ${initials}
     </div>
  `;
}


/**
 * Generates the HTML for the initials and priority of the task.
 *
 * @param {string} initialElements - HTML for the initials of assigned users.
 * @param {string} remainingElement - HTML for the remaining initials, if any.
 * @param {string} prio - The priority of the task (with an image path or default).
 * @returns {string} - The HTML string for initials and priority display.
 */
function generateInitialsAndPriorityHTML(initialElements, remainingElement, prio) {
  let validPrio;
  if(prio.startsWith('../')) {
  validPrio = prio
  } else {
  validPrio = '..' + prio || '../assets/icons/defaultPriority.png';
  }
  return /*html*/`
    <div class="assignedToAndPrio">
      <div>${initialElements}${remainingElement}</div>
      <img src="${validPrio}" alt="PriorityImage" class="priority-icon">
    </div>
  `;
}


/**
 * Generates the HTML for the progress bar and count of subtasks completed.
 *
 * @param {Array<string>} subtasks - Array of subtask descriptions.
 * @param {number} taskIndex - The index of the task in the task array.
 * @returns {string} - The HTML string for the subtask progress bar and count.
 */
function generateSubtaskProgressHTML(subtasks, taskIndex) {
  let nonEmptySubtasks = subtasks.filter(subtask => subtask && typeof subtask === 'string' && subtask.trim() !== '');
  if (nonEmptySubtasks.length === 0) return '';
  let subtaskProgress = calculateSubtaskProgress(taskIndex);
  if (!subtaskProgress || typeof subtaskProgress.subtaskBarWidth !== 'number') {
    console.error('Invalid subtaskProgress:', subtaskProgress);
    return '';
  }
  return /*html*/`
    <div class="subtasks">
      <div class="subtaskBarContainer">
        <div class="subtaskBar" id="subtaskBar${taskIndex}" style="width: ${subtaskProgress.subtaskBarWidth}%;"></div>
      </div>
      <span class="subtaskCount" id="subtaskCount${taskIndex}">${subtaskProgress.completedSubtasks}/${subtaskProgress.amountSubtasks} Subtasks</span>
    </div>`;
}


/**
 * Renders the subtasks of a task for display.
 *
 * @param {number} taskIndex - The index of the task in the task array.
 * @returns {string} - The HTML string for rendering the subtasks.
 */
function renderSubtasks(taskIndex) {
  let { subtasksStatus } = calculateSubtaskProgress(taskIndex) || { subtasksStatus: [] };
  if (!Array.isArray(subtasksStatus)) {
    console.error('subtasksStatus is not an array:', subtasksStatus);
    return '';
  }
  return subtasksStatus.map(({ subtask, isCompleted }) => /*html*/`
    <div class="subtaskItem">
      <input type="checkbox" ${isCompleted ? 'checked' : ''} disabled>
      <span>${subtask}</span>
    </div>
  `).join('');
}


/**
 * Generates the detailed view HTML for a task.
 *
 * @param {Object} task - The task object containing task data.
 * @param {number} taskIndex - The index of the task in the task array.
 * @returns {string} - The HTML string for the detailed task view.
 */
function generateTaskDetails(task, taskIndex) {
  let categoryClass = formatCategoryClass(task.category);
  let initialsAndName = generateInitalsAndNameDetailHTML(task);
  let capitalizedDescription = task.description ? capitalizeFirstLetter(task.description) : "No Description";
  let hasValidSubtasks = Array.isArray(task.subtasks) && task.subtasks.some(subtask => subtask && subtask.trim() !== "");
  let subtasksCheck = Array.isArray(task.subtasksCheck) && task.subtasksCheck.length === task.subtasks.length
    ? task.subtasksCheck
    : task.subtasks.map(() => false);

  return /*html*/ `
    <div class="detailtask">
      <div class="categoryAndClose">
        <div class="category ${categoryClass}">${task.category || "No Category"}</div>
        <div onclick="toggleSectionDropdown()" id="moveToMobile" class="moveToMobile">
          <p>Move To</p>
          <img src="../assets/icons/scrollArrowDown.png" class="imgMoveToMobile" alt="">
          <div id="sectionDropdown" class="section-dropdown d-none">
            <button onclick="moveTaskToSection('toDo', ${taskIndex})">To Do</button>
            <button onclick="moveTaskToSection('inProgress', ${taskIndex})">In Progress</button>
            <button onclick="moveTaskToSection('awaitFeedback', ${taskIndex})">Awaiting Feedback</button>
            <button onclick="moveTaskToSection('done', ${taskIndex})">Done</button>
          </div>
        </div>
        <img onclick="closeTask()" src="../assets/icons/close.png" alt="Close">
      </div> 
      <div class="detailtaskinfos">
        <div class="titleDetail">${task.title}</div>
        <div class="descriptionDetail">${capitalizedDescription}</div>
        <div>Due date: ${task.date || 'No Date'}</div>
        <div>
          Priority: ${task.prioName ? task.prioName : 'No Priority'} 
          <img src="${task.prio ? (task.prio.startsWith('../') ? task.prio : '..' + task.prio) : '../assets/icons/defaultPriority.png'}" alt="PriorityImage">
        </div>
        <div class="assignedTo">Assigned To:</div>
        <div class="initalsAndName">${initialsAndName}</div>
        ${hasValidSubtasks ? `
        <div>Subtasks:</div>
        <div class="subtasksDetail" id="subtasksDetail">
          ${task.subtasks.map((subtask, index) => `
            <div class="subtaskItem">
              <input type="checkbox" ${subtasksCheck[index] ? 'checked' : ''} disabled>
              <span>${subtask || 'No Subtask'}</span>
            </div>
          `).join('')}
        </div>
        ` : ''}
      </div>
      <div class="iconContainer">
        <div onclick="deleteTask(${taskIndex})" class="detailTaskIcon">
          <img src="../assets/icons/delete.png" alt="Delete">
          <p>Delete</p>
        </div>
        <div class="verticalLine"></div>
        <div onclick="editTask(${taskIndex})" class="detailTaskIcon">
          <img src="../assets/icons/edit.png" alt="Edit">
          <p>Edit</p>
        </div>
      </div>
    </div>
  `;
}


/**
 * Generates the HTML for the initials and name display in the detailed task view.
 *
 * @param {Object} task - The task object containing task data.
 * @returns {string} - The HTML string for initials and name in the detailed view.
 */
function generateInitalsAndNameDetailHTML(task) {
  if (!task.assignedInitals || task.assignedInitals.length === 0) return "";
  if (!task.assignedName || task.assignedName.length === 0) return "";
  if (!task.color || task.color.length === 0) return "";

  let detailHtml = "";

  task.assignedInitals.forEach((initial, index) => {
    let color = task.color[index];
    let name = task.assignedName[index];

    detailHtml += /*html*/ `
      <div class="intalsAndName">
        <div class="assignedInitals" style="background-color: ${color};">
          ${initial}
        </div>
        <div>
          ${name}
        </div>
      </div>
    `;
  });
  return detailHtml;
}


/**
 * Generates the HTML for the task editing view, allowing the user to edit task details such as title, description, and subtasks.
 *
 * @param {Object} task - The task object containing task data.
 * @param {string} date - The due date of the task.
 * @param {number} taskIndex - The index of the task in the task array.
 */
function editTaskTemplate(task, date, taskIndex) {
  document.getElementById("taskDetailCard").innerHTML = /*html*/ `
    <div class="detailtaskEdit">
      <div class="closeTaskContainer">
        <img class="closeTask" onclick="closeTask()" src="../assets/icons/close.png" alt="Close">
      </div>
      <div class="titleEdit">Title</div>
      <input id="titleInput" class="titleInput" placeholder="Enter a Title" value="${task.title}" type="text" required>
      <span class="inputError" id="inputerror1">This field is required</span>
      <p class="descriptionEdit">Description</p>
      <textarea class="descriptionInput" id="descriptionInput" placeholder="Enter a Description">${task.description}</textarea>
      <p>Due Date</p>
      <div class="dueDate">
        <input id="dueDateInput" class="dateInput" type="date" min="" value="${date || today}" required>
        <img class="calendar" src="../assets/icons/calendar.png">
      </div>
      <span class="inputError" id="inputerror2">This field is required</span>
      <p class="priorityEdit"><b>Priority</b></p>
      <div class="prio">
        <div id="prio0" class="prioButtonEdit" onclick="setPrioHighEdit()">Urgent
          <img id="prioHigh" src="../assets/icons/prioUrgent.png">
        </div>
        <div id="prio1" class="prioButtonEdit" onclick="setPrioMediumEdit()">Medium
          <img id="prioMed" src="../assets/icons/prioMedium.png">
        </div>
        <div id="prio2" class="prioButtonEdit" onclick="setPrioLowEdit()">Low
          <img id="prioLow" src="../assets/icons/prioLow.png">
        </div>
      </div>
      <p>Assigned to</p>
      <div class="dropdownWrapper"></div>
      <button type="button" class="dropdownButtonArea" id="userButton" onclick="toggleUserDropdownEdit()">Select Contacts
        to assign<img class="arrow" src="../assets/icons/arrowDrop.png"></button>
      <div class="dropdownWrapper">
        <div class="dropdown dNone" id="dropdown">
          <input id="searchUser" class="searchUser" type="search">
          <img class="upArrow" src="../assets/icons/arrowDrop.png" onclick="toggleUserDropdownEdit()">
          <div class="dropdownUsers dNone" id="dropdownUsers"></div>
        </div>
      </div>
      <div id="assignedUsers" class="assignedUsers"></div>
      <div id="extraUsers" class="extraUser dNone"></div>
      <div class="subtasksDetail" id="subtasksDetail"></div>
      <div class="subtasksContainer">
        <p class="subtaskHeadline">Subtasks</p>
        <input id="subtasksInput" placeholder="Add new subtask" onfocus="showSubtaskIcons()">
        <div class="subtaskIcons">
          <img class="subtaskIcon" id="subtaskInactive" src="../assets/icons/addNoBorder.png" onclick="showSubtask()">
          <div class="dNone dFlexAlign" id="subtaskActive">
            <img class="subtaskIcon" src="../assets/icons/close.png" onclick="clearSubtaskInput()">
            <div class="smallSeparator"></div>
            <img class="subtaskIcon" src="../assets/icons/check.png" onclick="createSubtaskEdit()">
          </div>
        </div>
        <span class="inputError" id="inputerrorSubtask1">Subtask needs Description</span>
        <div class="subtasksBox" id="subtasksBox">
        </div>
      </div>
      <div class="okButtonContainer">
        <button onclick="saveEditedTasktoLocalStorage(${taskIndex})" class="okButton">Ok<img src="../assets/icons/checkWhite.png"></button>
      </div>
    </div>
  `;
}


/**
 * Generates HTML for subtasks and adds it to the subtasks box in the DOM.
 * This function creates both the regular display of a subtask and an edit form for each subtask.
 *
 * @param {string} subtask - The text of the subtask to be displayed and edited.
 * @param {number} i - The index of the subtask, used to uniquely identify elements.
 */
function generateSubtasksEdit(subtask, i) {
  document.getElementById('subtasksBox').innerHTML += /*html*/`
  <div id="subtaskBox${i}" class="subtaskBox">
            <ul class="subtaksUlEdit">
              <li id="subtask${i}" class="subtaskLiEdit">${subtask}</li>
            </ul>
            <div id="subtaskIconsLower${i}" class="subtaskIconsLower">
              <img class="subtaskIcon" onclick="subtaskEdit(${i})" src="../assets/icons/edit.png">
              <div class="smallSeparator"></div>
              <img class="subtaskIcon" onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.png">
            </div>
          </div>
          <div id="subtaskBoxEdit${i}" class="subtaskBox dNone">
            <div class="dFlexAlign backgroundWhite">
              <input id="subtaskEdit${i}" value="${subtask}" class="editSubtaskInput">
              <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtaskEdit(${i})" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="subtaskChange(${i})">
              </div>
            </div>
          </div>
          `;
}