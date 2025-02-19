/**
 * Sets the priority in the Array[task] to high and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioHigh(task) {
    resetPrioButtons()
    document.getElementById('prio0').classList.add('high', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioUrgentWhite.png";
    task['prio'] = '../assets/icons/prioUrgent.png';
    task['prioName'] = 'Urgent';
}


/**
 * Sets the priority in the Array[task] to medium and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioMedium(task) {
    resetPrioButtons()
    document.getElementById('prio1').classList.add('medium', 'active');
    document.getElementById('prioMed').src = "../assets/icons/prioMediumWhite.png";
    task['prio'] = '../assets/icons/prioMedium.png';
    task['prioName'] = 'Medium';
}


/**
 * This function sets the priority in the Array[task] to low and colors the button
 * 
 * @param {Array} task The array that is used to temporarily save all inputs
 */
function setPrioLow(task) {
    resetPrioButtons()
    document.getElementById('prio2').classList.add('low', 'active');
    document.getElementById('prioLow').src = "../assets/icons/prioLowWhite.png";
    task['prio'] = '../assets/icons/prioLow.png';
    task['prioName'] = 'Low';
}


/**
 * Resets all priority buttons to normal with no colors
 */
function resetPrioButtons() {
    document.getElementById('prio0').classList.remove('high', 'active');
    document.getElementById('prio1').classList.remove('medium', 'active');
    document.getElementById('prio2').classList.remove('low', 'active');
    document.getElementById('prioHigh').src = "../assets/icons/prioUrgent.png";
    document.getElementById('prioMed').src = "../assets/icons/prioMedium.png";
    document.getElementById('prioLow').src = "../assets/icons/prioLow.png";
}


/**
 * Checks the Button of a User in the dropdown Menu
 * 
 * @param {*} i The index of the Button
 */
function toggleAssignedUser(i) {
    let buttonChecked = "../assets/icons/checkButtonMobile.png";
    let buttonUnchecked = "../assets/icons/checkButtonblank.png";
    let check = document.getElementById(`assignedCheck${i}`);
    let checkedImg = check.src
    if (check) {
        let currentCheck = check.src.split('/').pop();
        document.getElementById(`user${i}`).classList.toggle('dropdownButtonSelectedUser');
        check.src = currentCheck === 'checkButtonMobile.png' ? buttonUnchecked : buttonChecked;
        toggleAssignedUserCircle(i, checkedImg);
    }
}


/**
 * This function is fancy
 * 
 * @param {number} i Index of the Button of the assigned User Dropdown
 */
function toggleAssignedUserCircle(i, checkedImg) {
    let visibleUserCircles = countVisibleUserCircles();
    if (visibleUserCircles <= 4) {
        if (!checkedImg.includes("checkButtonMobile.png")) {
            document.getElementById(`userCircle${i}`).classList.remove('dNone')
        }
        else {
            document.getElementById('extraUsers').classList.add('dNone');
            document.getElementById(`userCircle${i}`).classList.add('dNone')
        }
    }
    else if (visibleUserCircles > 4) {
        document.getElementById('extraUsers').classList.remove('dNone');
        document.getElementById('extraUsers').innerHTML = `+${visibleUserCircles - 4}`;
    }
}


/**
 * This function counts the amount of checked Assigned Users in the dropdown menu
 * 
 * @returns the amount of visible Usercircles with the Initials
 */
function countVisibleUserCircles() {
    let count = 0;
    for (let i = 0; i < contactAllArray.length; i++) {
        let check = document.getElementById(`assignedCheck${i}`);
        if (check) {
            let checkedImg = check.src;
            if (checkedImg.includes("checkButtonMobile.png")) {
                count++;
            }
        }
    }
    return count;
}


/**
 * Sets the category userstory as category
 * 
 * @param {id} userstory The button User Story
 * @param {id} techTask The button Technical Task
 */
function selectUserStory(userstory, techTask) {
    userstory.classList.toggle('dropdownButtonSelected');
    techTask.classList.remove('dropdownButtonSelected');
    document.getElementById('category').innerHTML = "User Story";
}


/**
 * Sets the category userstory as Technical Task
 * 
 * @param {id} userstory The button User Story
 * @param {id} techTask The button Technical Task
 */
function selectTechTask(userstory, techTask) {
    techTask.classList.toggle('dropdownButtonSelected');
    userstory.classList.remove('dropdownButtonSelected');
    document.getElementById('category').innerHTML = "Technical Task";
}


/**
 * Clears the category Input
 * 
 * @param {id} userstory The button User Story
 * @param {id} techTask The button Technical Task
 */
function clearCategory() {
    document.getElementById('userStory').classList.remove('dropdownButtonSelected');
    document.getElementById('techTask').classList.remove('dropdownButtonSelected');
    document.getElementById('category').innerHTML = /*html*/`
    Select task category<img class="arrow" src="../assets/icons/arrowDrop.png">
    `;
}


/**
 * Checks if there are already 2 subtasks and shows an error message if the user tries to create a third
 */
function checkSubtask() {
    let input = document.getElementById('subtasksInput').value;
    document.getElementById('inputerrorSubtask1').style.display = 'none';
    document.getElementById('subtasksInput').classList.remove('redInputBorder');
    if (input.length === 0) {
        document.getElementById('inputerrorSubtask1').style.display = 'block';
        document.getElementById('subtasksInput').classList.add('redInputBorder');
    }
    else {
        createSubtask(input)
    }
}


/**
 * validates input and shows an error message if not true
 * 
 * @returns true if input is validated / false if not 
 */
function checkInputTitle() {
    let x = document.getElementById('titleInput').value;
    if (x === "") {
        document.getElementById('inputerror1').style.display = 'block';
        document.getElementById('titleInput').classList.add('redInputBorder');
        checked = false;
        return false;
    }
    else {
        document.getElementById('inputerror1').style.display = 'none';
        return true;
    }
}


/**
 * validates input and shows an error message if not true
 * 
 * @returns true if input is validated / false if not 
 */
function checkInputDate() {
    let date = document.getElementById('dueDateInput').value
    let today = new Date().toISOString().split('T')[0];
    if (date < today || date === "") {
        document.getElementById('inputerror2').style.display = 'block';
        document.getElementById('dueDateInput').classList.add('redInputBorder');
        checked = false;
        return false;
    }
    else {
        document.getElementById('inputerror2').style.display = 'none';
        return true;
    }
}


/**
 * validates input and shows an error message if not true
 * 
 * @returns true if input is validated / false if not 
 */
function checkInputCategory() {
    if (!document.getElementById('category')) {
        return true
    }
    if (document.getElementById('category').innerText === 'Select task category') {
        document.getElementById('inputerror3').style.display = 'block';
        checked = false;
        return false;
    }
    else {
        document.getElementById('inputerror3').style.display = 'none';
        return true;
    }
}


/**
 * Deletes a subtask box and removes the value from the array
 * 
 * @param {number} i The number of the subtask box
 */
function deleteSubtask(i) {
    task['subtasks'].splice(i, 1);
    document.getElementById(`subtaskBox${i}`).remove();
}


/**
 * THis function clears all Subtasks
 */
function clearAllSubtasks() {
    let subtasks = document.getElementsByClassName(`subtaskBox`).length;
    for (let i = 0; i < subtasks; i++) {
        deleteSubtask(i);
    }
}


/**
 * Deletes a subtask box
 * 
 * @param {number} i The number of the subtask box
 */
function clearSubtask(i) {
    if (document.getElementById(`subtaskBox${i}`)) {
        task['subtasks'][i] = "";
        document.getElementById(`subtaskBox${i}`).remove();
    }
}


/**
 * removes the subtaskbox and replaces it with a box with the same structure but with with an input field
 * 
 * @param {number} i The number of the subtask box
 */
function editSubtask(i) {
    let info = task['subtasks'][i];
    document.getElementById(`subtaskBox${i}`).remove();
    putSubtaskInput(info, i);
    let input = document.getElementById(`subtask${i}`);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
}


/**
 * changes the new imput on the subtask box with input to the normal subtask box
 * 
 * @param {number} i The number of the subtask box
 */
function changeSubtask(i) {
    let input = document.getElementById(`subtask${i}`).value.trim();
    if (input === "") {
        deleteSubtask(i);
        return;
    }
    putSubtask(input, i);
    task['subtasks'].splice(i, 1, input);
    document.getElementById(`subtaskBox${i}`).remove();
}


/**
 * Activates the Buttons beside the subtask input field
 */
function showSubtaskIcons() {
    setTimeout(function () {
        if (document.getElementById('subtaskActive')) {
            document.getElementById('subtaskActive').classList.toggle('dNone');
            document.getElementById('subtaskInactive').classList.toggle('dNone');
        }
    }, 150);
}


/**
 * Toggles the category dropdown menu
 */
function toggleCategory() {
    let dropdown = document.getElementById("dropdownCategory");
    dropdown.classList.toggle("dNone");
}


/**
 * This function restricts the User to set a date in the past
 */
function configureDueDateInput() {
    const dateInput = document.getElementById('dueDateInput');
    if (dateInput) {
        let today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute("min", today);

        dateInput.addEventListener('input', function () {
            if (dateInput.value) {
                dateInput.classList.add('has-value');
            } else {
                dateInput.classList.remove('has-value');
            }
        });
    }
}


/**
 * Toggles the users dropdown menu
 */
function toggleUserDropdown() {
    let dropdown = document.getElementById("dropdown");
    let dropdownUsers = document.getElementById("dropdownUsers");
    dropdown.classList.toggle("dNone");
    dropdownUsers.classList.toggle("dNone");
    document.getElementById('searchUser').focus();
}


/**
 * This function clears the input Values of the AddTask.html
 */
function clearInputValues() {
    document.getElementById('titleInput').value = "";
    document.getElementById('descriptionInput').value = "";
    document.getElementById('dueDateInput').value = "";
    document.getElementById('subtasksInput').value = "";
}


/**
 * This function clears the extraUser Circle if it was displayed
 */
function clearCircle() {
    if (document.getElementById('extraUsers')) {
        document.getElementById('extraUsers').innerHTML = ``;
        document.getElementById('extraUsers').classList.add('dNone');
    }
}