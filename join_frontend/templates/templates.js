function renderHeader(id) {
  document.getElementById(id).innerHTML = /*html*/`
    <section onclick="hideBurgerMenu()" class="headerOverlay" id="headerOverlay"></section>
        <section class="sideBar">
        <img class="sideBarLogo" src="../assets/icons/logoWhite.png">
        <div id="SidebarMenuFourButtons" class="sideBarMenu">
            <a id="sideBarsummary" href="../htmls/summary.html"><img id="picsummary" class="sideBarPic" src="../assets/icons/summary.png">Summary</a>
            <a id="sideBaraddTask" href="../htmls/addTask.html"><img id="picaddTask" class="sideBarPic" src="../assets/icons/addTask.png">Add Task</a>
            <a id="sideBarboard" href="../htmls/board.html"><img id="picboard" class="sideBarPic" src="../assets/icons/board.png">Board</a>
            <a id="sideBarcontacts" href="../htmls/contacts.html"><img id="piccontacts" class="sideBarPic" src="../assets/icons/contacts.png">Contacts</a>
        </div>
        <div class="sideBarLegal">
            <a id="sideBarprivacyPolicy" class="sideBarLegalLink" href="../htmls/privacyPolicy.html">Privacy Policy</a>
            <a id="sideBarlegalNotice" class="sideBarLegalLink" href="../htmls/legalNotice.html">Legal Notice</a>
        </div>
    </section>

    <div class="header">
        <div class="headerDiv"></div>
        <div class="headerBtns">
            <div class="HeaderJoinLogoSmall"><img class="HeaderJoinLogoSmallStyle" src="../assets/icons/logo.png"></div>
            <div class="headerText">Kanban Project Management Tool</div>
            <div id="HelpSideOpen" class="headerBtns">
                <a class="HelpButtonRemove" href="../htmls/help.html"><img class="headerHelpBtn" src="../assets/icons/help.png"></a>
                <a id="headerProfile" onclick="toggleBurgerMenu()"><div>??</div></a>
            </div>
        </div>
        <div id="burgerMenu" class="dNone">
            <a href="../htmls/help.html" class="HelpSymbolBurgerMenu">Help</a>
            <a href="../htmls/legalNotice.html">Legal Notice</a>
            <a href="../htmls/privacyPolicy.html">Privacy Policy</a>
            <a href="../index.html" onclick="resetUser()">Log out</a>
        </div>
        <div class="seperator"></div>

    </div>
    `
}

/**
 * This function loads the HTML-Code for the Load Task Site and the Load Task Function in the board.html
 * 
 */
function loadAddTaskComplete() {
  document.getElementById('mainContent').innerHTML = /*html*/`
  <section class="wrapper">
  
    <h1>Add Task</h1>
    <img src="../assets/icons/close.png" class="xButton dNone" id="xButton"  onclick="closeAddTaskWithX()">
  
    <form id="myForm" class="dFlex" onsubmit="return false" novalidate>
    <div class="taskForm">
  
      <p>Title<span>*</span></p>
  
      <input id="titleInput" placeholder="Enter a title" type="text" required>
      <span class="inputError" id="inputerror1">This field is required</span>
  
  
      <p>Description</p>
      <textarea class="description" id="descriptionInput" placeholder="Enter a Description"></textarea>
  
  
      <p>Assigned to</p>
      <div class="dropdownWrapper">
      </div>
      <button type="button" class="dropdownButtonArea" id="userButton" onclick="toggleUserDropdown()">Select Contacts
        to assign<img class="arrow" src="../assets/icons/arrowDrop.png"></button>
  
      <div class="dropdownWrapper">
        <div class="dropdown dNone" id="dropdown">
          <input id="searchUser" class="searchUser" type="search">
          <img class="upArrow" src="../assets/icons/arrowDrop.png" onclick="toggleUserDropdown()">
          <div class="dropdownUsers dNone" id="dropdownUsers"></div>
          
        </div>
        
      </div>
  
      <div id="assignedUsers" class="assignedUsers"></div>
      <div id="extraUsers" class="extraUser dNone"></div>

  
    </div>
  
  
    <div class="taskSeperator"></div>
  
  
    <div class="taskForm">
  
      <p>Due Date<span>*</span></p>
      <div class="dueDate">
        <input id="dueDateInput" class="dateInput" type="date" min="" required>
        <img class="calendar" src="../assets/icons/calendar.png">
      </div>
      <span class="inputError" id="inputerror2">This field is required</span>
  
  
      <p>Prio</p>
  
      <div class="prio">
  
        <div id="prio0" class="prioButton" onclick="activatePrioButton(0)">Urgent
          <img id="prioHigh" src="../assets/icons/prioUrgent.png">
        </div>
  
        <div id="prio1" class="prioButton" onclick="activatePrioButton(1)">Medium
          <img id="prioMed" src="../assets/icons/prioMedium.png">
        </div>
  
        <div id="prio2" class="prioButton" onclick="activatePrioButton(2)">Low
          <img id="prioLow" src="../assets/icons/prioLow.png">
        </div>
  
      </div>
  
  
      <p>Category<span>*</span></p>
      <button type="button" class="dropdownButtonArea" id="category" onclick="toggleCategory()">Select task
        category<img class="arrow" src="../assets/icons/arrowDrop.png"></button>
      <div class="dropdownWrapper">
        <div class="dropdowncat dNone" id="dropdownCategory">
          <div class="dropdownButton" id="techTask" onclick="selectCategory('Technical Task')">Technical Task</div>
          <div class="dropdownButton" id="userStory" onclick="selectCategory('User Story')">User Story</div>
        </div>
      </div>
      <span class="inputError" id="inputerror3">This field is required</span>
  
  
      <p class="subtaskHeadline">Subtasks</p>
  
      <input id="subtasksInput" placeholder="Add new subtask" onfocus="showSubtaskIcons()">
  
      <div class="subtaskIcons">
        <img class="subtaskIcon" id="subtaskInactive" src="../assets/icons/addNoBorder.png" onclick="showSubtask()">
  
        <div class="dNone dFlexAlign" id="subtaskActive">
          <img class="subtaskIcon" src="../assets/icons/close.png" onclick="clearSubtaskInput()">
          <div class="smallSeparator"></div>
          <img class="subtaskIcon" src="../assets/icons/check.png" onclick="checkSubtask()">
        </div>
  
      </div>
  
      <span class="inputError" id="inputerrorSubtask1">Subtask needs Description</span>
      <div class="subtasksBox" id="subtasksBox"></div>
  
      <div class="emptyBox"></div>
  
    </div>
  
    </form>
    <div class="addTaskBottomBar">
    <p class="required"><span>*</span>This field is required</p>
    <div class="taskButtons">
        <button class="clearButton" onclick="clearAddTask()">Clear</button>
        <button class="createTaskButton" onclick="createTask()">Create Task</button>
      </div>
    </div>
  </section>
      `
}


/**
 * Renders the dropdown button for 1 user
 * 
 * @param {Object} user The individual User in the Array
 * @param {string} initials The initials of the User
 * @param {number} i The index of the Object in the Array, used to set the ID of the Button
 */
function renderAssignedTo(user, initials, i) {
  document.getElementById('dropdownUsers').innerHTML += /*html*/`
        <div class="dropdownButton" id="user${i}" onclick="toggleAssignedUser(${i})">
            <div class="dropdownUser">
                <div class="userCircle" style="background-color:${user.color};">${initials}</div>
                <div class="searchUserName" id="searchUserName${i}">${user.name}</div>
            </div>
            <img id="assignedCheck${i}" class="dropdownCheckMark" src="../assets/icons/checkButtonblank.png" type="checkbox">
          </div>
    `
}


/**
* Renders the circle user icon
* 
* @param {*} user The individual User in the Array
* @param {*} initials The initials of the User
* @param {*} i The index of the Object in the Array, used to set the ID of the Button
*/
function renderAssignedUser(user, initials, i) {
  document.getElementById('assignedUsers').innerHTML += /*html*/`
        <div class="userCircle dNone" id="userCircle${i}" style="background-color:${user.color};">${initials}</div>
    `
}


/**
* renders a subtask box below the subtask input
* 
* @param {string} input The value of the subtask input
* @param {number} i The number of the subtask box
*/
function putSubtask(input, i) {
  document.getElementById('subtasksBox').innerHTML += /*html*/`
    <div id="subtaskBox${i}" class="subtaskBox">
        <ul>
            <li id="subtask${i}">${input}</li>
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="editSubtask(${i})" src="../assets/icons/edit.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" onclick="deleteSubtask(${i})" src="../assets/icons/delete.png">
            </div>
        </ul>
    </div>
    `
}


/**
* renders a subtask box below the subtask with an input field
* 
* @param {string} input The value of the subtask input
* @param {number} i The number of the subtask box
*/
function putSubtaskInput(input, i) {
  document.getElementById('subtasksBox').innerHTML += /*html*/`
    <div id="subtaskBox${i}" class="subtaskBox">
        <div class="dFlexAlign backgroundWhite">
            <input id="subtask${i}" value="${input}" class="editSubtaskInput">
            <div class="subtaskIconsLower">
                <img class="subtaskIcon" onclick="deleteSubtask(${i})" src="../assets/icons/delete.png">
                <div class="smallSeparator"></div>
                <img class="subtaskIcon" src="../assets/icons/check.png" onclick="changeSubtask(${i})">
            </div>
        </div>
    </div>
    `
}