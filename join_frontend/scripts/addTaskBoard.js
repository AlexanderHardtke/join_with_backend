const dateInput = document.getElementById('dueDateInput');
let tasks = [
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
let task = tasks[0];

/**
 * Loads the initial tasks for the addTask.html unless you are on mobile then open addTask.html
 */
function loadFunctions() {
    if (window.innerWidth <= 1040) {
        window.location.href = 'addTask.html';
    }
    else {
        loadAddTaskInBoard();
    }
}


/**
 * This function loads the addTask Page in the board.html
 */
function loadAddTaskInBoard() {
    loadAddTaskComplete();
    activatePrioButton(1);
    getUsers();
    searchUsers();
    openAddTask();
    configureDueDateInput()
}


document.addEventListener('focusout', (event) => {
    if (event.target && event.target.id === 'subtasksInput') {
        showSubtaskIcons();
    }
});


if (dateInput) {
    dateInput.addEventListener('input', function () {
        if (dateInput.value) {
            dateInput.classList.add('has-value');
        } else {
            dateInput.classList.remove('has-value');
        }
    });
}


document.addEventListener('dblclick', function (dblclickEvent) {
    let subTaskInput0 = document.getElementById("subTaskBox0");
    let subTaskInput1 = document.getElementById("subTaskBox1");
    if (subTaskInput0 && subTaskInput0.contains(dblclickEvent.target)) {
        editSubtask(0);
    }
    else if (subTaskInput1 && subTaskInput1.contains(dblclickEvent.target)) {
        editSubtask(1);
    }
});


document.addEventListener('click', function (clickEvent) {
    let dropdown = document.getElementById("dropdown");
    let button = document.getElementById('userButton');
    if (dropdown && button && !dropdown.contains(clickEvent.target) && !button.contains(clickEvent.target) && !dropdown.classList.contains('dNone')) {
        toggleUserDropdown();
    }
});


/**
 * Opens the AddTask Window in the board.html
 */
function openAddTask() {
    let addTaskOverlay = document.getElementById('addTaskoverlay');
    addTaskOverlay.classList.add('slideinright');
    addTaskOverlay.classList.remove('slideinleft');
    addTaskOverlay.classList.remove('dNone');
    document.getElementById('xButton').classList.remove('dNone');
}


/**
 * Closes the AddTask Window in the board.html if you click on the Overlay
 */
function closeAddTask() {
    if (event.target.id === 'addTaskoverlay') {
        closeAddTaskWithX();
    }
}


/**
 * Closes the AddTask Window in the board.html
 */
function closeAddTaskWithX() {
    let addTaskOverlay = document.getElementById('addTaskoverlay');
    addTaskOverlay.classList.remove('slideinright');
    addTaskOverlay.classList.add('slideinleft');
    setTimeout(() => {
        addTaskOverlay.classList.add('dNone');
        document.getElementById('xButton').classList.add('dNone');
        document.getElementById('mainContent').innerHTML = ``;
        task.subtasks = [];
    }, 400);
}


/**
 * Resets all priority Buttons and activates the clicked priority Button and it's Function
 * 
 * @param {number} i This is the number of the priority Button
 */
function activatePrioButton(i) {
    resetPrioButtons()
    switch (i) {
        case 0:
            setPrioHigh(task);
            break;
        case 1:
            setPrioMedium(task);
            break;
        case 2:
            setPrioLow(task);
            break;
    }
}


/**
 * Breaks up the array and load the individual user
 * 
 */
function getUsers() {
    document.getElementById('dropdownUsers').innerHTML = ``;
    document.getElementById('assignedUsers').innerHTML = ``;
    for (let i = 0; i < contactAllArray.length; i++) {
        let user = contactAllArray[i];
        loadUser(user, i)
    }
}


/**
 * Gets the initials of the individual user and starts the render Function for the dropdown Menu
 * 
 * @param {Object} user The individual User in the Array
 * @param {number} i The index of the Object in the Array
 */
function loadUser(user, i) {
    let nameParts = user.name.split(' ');
    let initials = nameParts.slice(0, 2).map(part => part.charAt(0).toUpperCase()).join('');
    renderAssignedTo(user, initials, i);
    renderAssignedUser(user, initials, i);
}


/**
 * Selects the Category in the dropdown Menu and resets it if the same one is clicked and sets it into the array task
 * 
 * @param {string} cat This string contains the category
 */
function selectCategory(cat) {
    let userstory = document.getElementById('userStory');
    let techTask = document.getElementById('techTask');
    if (cat === "User Story" && !userstory.classList.contains('dropdownButtonSelected')) {
        selectUserStory(userstory, techTask)
    }
    else if (cat === "Technical Task" && !techTask.classList.contains('dropdownButtonSelected')) {
        selectTechTask(userstory, techTask)
    }
    else {
        clearCategory();
    }
    task['category'] = cat;
    toggleCategory()
}


/**
 * Sets the focus on the subtask input field
 */
function showSubtask() {
    document.getElementById('subtasksInput').focus();
}


/**
 * Pushes the subtask input field into the task Array and puts it into a subtaskbox
 * 
 * @param {string} input The value of the subtask input
 */
function createSubtask(input) {
    let subtasks = task['subtasks'];
    for (let i = 0; i < subtasks.length; i++) {
        if (subtasks[i] === "") {
            subtasks[i] = input;
            putSubtask(input, i);
            clearSubtaskInput();
            return;
        }
    }
    subtasks.push(input);
    putSubtask(input, subtasks.length - 1);
    clearSubtaskInput();
}


/**
 * clears the value of the subtask input field
 */
function clearSubtaskInput() {
    document.getElementById('subtasksInput').value = "";
}


/**
 * clears all Input Fields and buttons and puts them into their default state
 */
function clearAddTask() {
    loadContact();
    getUsers();
    searchUsers();
    clearCircle();
    clearInputValues();
    activatePrioButton(1);
    clearCategory();
    clearAllSubtasks();
}


/**
 * Creates a new Task and adds it to the local storage
 * 
 * @returns stops the function if not all inputs needed are filled
 */
function createTask() {
    setArrayUsers();
    if (!checkInputs()) {
        return;
    }
    save();
    successfullSlide();
    closeAddTaskWithX();
    clearAddTask();
    loadAll();
}


/**
 * checks if all 3 inputs are filled
 * 
 * @returns true if all inputs are validated
 */
function checkInputs() {
    let checked = true;
    check1 = checkInputTitle(checked);
    check2 = checkInputDate(checked);
    check3 = checkInputCategory(checked);
    if (check1 === false || check2 === false || check3 === false) {
        checked = false;
    }
    return checked;
}


/**
 * fills the Object [task] with the assigned users and starts the setArrayInputs function
 */
function setArrayUsers() {
    let users = document.getElementsByClassName('dropdownButton');
    for (let i = 0; i < users.length; i++) {
        if (users[i].classList.contains('dropdownButtonSelectedUser')) {
            task['assignedName'].push(document.getElementById(`searchUserName${i}`).innerText);
            task['assignedInitals'].push(document.getElementById(`userCircle${i}`).innerText);
            task['color'].push(document.getElementById(`userCircle${i}`).style.backgroundColor);
        }
    }
    setArrayInputs();
}


/**
 * fills the Object [task] with the inputs from the addTask form
 */
function setArrayInputs() {
    task['date'] = changeDateFormat();
    task['description'] = document.getElementById('descriptionInput').value;
    let id = taskAllArray.length;
    task['id'] = id;
    task['title'] = document.getElementById('titleInput').value;
}


/**
 * Changes Date format from Input to German format
 * 
 * @returns formatted Date in German
 */
function changeDateFormat() {
    let date = document.getElementById('dueDateInput').value;
    let formattedDate = date.replace(/-/g, '/');
    let [year, month, day] = formattedDate.split('/');
    let formattedDateStr = `${day}/${month}/${year}`;
    return formattedDateStr;
}


/**
 * checks if the searchUser input is filled and pushes the info to the function searchuser()
 */
function searchUsers() {
    let timeout;
    document.getElementById('searchUser').addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            filterUsers(this.value);
        }, 300);
    })
};


/**
 * filters the dropdown users by the input
 * 
 * @param {string} input the input the user writes in searchUser ID
 */
function filterUsers(input) {
    input = input.toLowerCase();
    let users = document.getElementsByClassName('dropdownButton');
    for (let i = 0; i < users.length; i++) {
        let userNameElement = users[i].getElementsByClassName('searchUserName')[0];
        if (userNameElement) {
            let userName = userNameElement.innerHTML.toLowerCase();
            updateUserDisplay(users[i], userName, input);
        }
    }
}


/**
 * shows the user that matches the input
 * 
 * @param {*} userBox The Dropdown-Div for the the User and the initals
 * @param {*} userName The Username
 * @param {*} input The input from the user
 */
function updateUserDisplay(userBox, userName, input) {
    if (input.length >= 3) {
        userBox.style.display = userName.includes(input) ? 'flex' : 'none';
    } else {
        userBox.style.display = 'flex';
    }
}


/**
 * pushes the current taskAllArray into the local storage Array
 */
function save() {
    taskAllArray.push(task);
    let tasksAsText = JSON.stringify(taskAllArray);
    localStorage.setItem('taskAllArray', tasksAsText);
}


/**
 * This function shows the User with a slider that the task has been successfully added
 */
function successfullSlide() {
    document.getElementById('taskSuccessAdd').classList.remove('dNone');
    setTimeout(function () {
        document.querySelector('.taskSuccessAdd').classList.add('taskSuccessAdded');
    }, 10);
    setTimeout(() => {
        document.getElementById('taskSuccessAdd').classList.add('dNone')
        document.querySelector('.taskSuccessAdd').classList.remove('taskSuccessAdded')
    }, 800);
}