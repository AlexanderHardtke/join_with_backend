import { app, database, ref, get, child, set } from './SignUp.js';
const BaseUrl = "https://join-357c8-default-rtdb.europe-west1.firebasedatabase.app/";
let matchingUser;
window.loginUser = loginUser;
window.addInputListeners = addInputListeners;
window.guestLogIn = guestLogIn;
window.loadRememberedData = loadRememberedData;
window.logInAnimation = logInAnimation;
fetchContactTask();


/**
 * The current password and email are read out here and if the data is not found, the border of the email container changes to red.
 * 
 * @returns 
 */
function logInvalidateEmail() {
    const emailInputElement = document.getElementById("emailInputLogin");
    const emailContainer = document.getElementById("LoginInputIconID1");
    const emailInput = emailInputElement.value;
    const usersRef = ref(database, 'users');
    logInvalidateEmailNull(emailInput, emailContainer);
    get(usersRef).then((snapshot) => {
        logInvalidateEmailExist(snapshot, emailInput, emailContainer);
    }).catch(() => {
        emailContainer.style.border = '1px solid red';
    });
}


/**
 * If the email field is empty, the border of the container will turn black.
 * 
 * @param {*} emailInput 
 * @param {*} emailContainer 
 * @returns 
 */
function logInvalidateEmailNull(emailInput, emailContainer) {
    if (emailInput.trim() === '') {
        emailContainer.style.border = '1px solid black';
        matchingUser = null;
        return;
    }
}


/**
 * If the email field is empty when logging in, the border of the container is black and if entered incorrectly it is red.
 * 
 * @param {*} snapshot 
 * @param {*} emailInput 
 * @param {*} emailContainer 
 */
function logInvalidateEmailExist(snapshot, emailInput, emailContainer) {
    if (snapshot.exists()) {
        try {
            const usersData = snapshot.val();
            matchingUser = Object.values(usersData).find(user => user.email === emailInput);
            if (matchingUser) {
                emailContainer.style.border = '1px solid black';
            } else {
                emailContainer.style.border = '1px solid red';
            }
        } catch{emailContainer.style.border = '1px solid red';}
    } else {
        emailContainer.style.border = '1px solid red';
    }
}


/**
 * Adds two add event listeners to the two input fields. The first is responsible for when the field is clicked to enter text and
 * the second, when you leave the field, the original state is restored.
 * 
 */
function addInputListeners() {
    const emailInputElement = document.getElementById("emailInputLogin");
    emailInputElement.addEventListener('input', logInvalidateEmail);
    emailInputElement.addEventListener('change', logInvalidateEmail);
    emailInputElement.addEventListener('blur', resetEmailBorderOnBlur);
    const passwordInputElement = document.getElementById("passwordInput1");
    passwordInputElement.addEventListener('input', logInvalidatePassword);
    passwordInputElement.addEventListener('change', logInvalidatePassword);
    passwordInputElement.addEventListener('blur', resetPasswordBorderOnBlur);
}


/**
 * If the password field is empty when logging in, the border of the container is black, 
 * if it is entered incorrectly it is red and if it is correct it is blue.
 * 
 * @returns 
 */
function logInvalidatePassword() {
    const passwordInputElement = document.getElementById("passwordInput1");
    const passwordContainer = passwordInputElement.closest(".LoginInputIcon");
    const passwordInput = passwordInputElement.value;
    if (passwordInput.trim() === '') {
        passwordContainer.style.border = '1px solid black';
        return;
    }
    if (matchingUser && matchingUser.password === passwordInput) {
        passwordContainer.style.border = '1px solid #29ABE2';
    } else {
        passwordContainer.style.border = '1px solid red'; 
    }
}


/**
 * When you leave the field, the border is set to black.
 * 
 */
function resetEmailBorderOnBlur() {
    const emailContainer = document.getElementById("LoginInputIconID1");
    emailContainer.style.border = '1px solid black';
}


/**
 * When you leave the field, the border is set to black.
 * 
 */
function resetPasswordBorderOnBlur() {
    const passwordInputElement = document.getElementById("passwordInput1");
    const passwordContainer = passwordInputElement.closest(".LoginInputIcon");
    passwordContainer.style.border = '1px solid black';
}


/**
 * Data is retrieved from the input fields and transferred to the functions.
 * 
 */
function loginUser() {
    const emailInputElement = document.getElementById("emailInputLogin");
    const passwordInputElement = document.getElementById("passwordInput1");
    const rememberMeChecked = document.getElementById("rememberMe").checked;
    const emailInput = emailInputElement.value;
    const passwordInput = passwordInputElement.value;
    loginUserChecked(rememberMeChecked, emailInput, passwordInput)
    const usersRef = ref(database, 'users');
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            loginUserCorrect(emailInput, passwordInput, snapshot)
        } else {
            userInformationPopUp('Keine Benutzer gefunden.')
        }})
}


/**
 * Here, data such as email, encrypted password and the click on the Rememberfield are saved in local storage.
 * If Rememberfield is not ticked, the data will not be saved
 * 
 * @param {*} rememberMeChecked 
 */
function loginUserChecked(rememberMeChecked, emailInput, passwordInput){
    if (rememberMeChecked) {
        localStorage.setItem('rememberedEmail', emailInput);
        localStorage.setItem('rememberedPassword', encryptPassword(passwordInput));
        localStorage.setItem('rememberMeChecked', 'true'); 
    } else {
        localStorage.removeItem('rememberedEmail'); 
        localStorage.removeItem('rememberedPassword');
        localStorage.setItem('rememberMeChecked', 'false');
    }
}


/**
 * This function checks whether the email and password in the login match a user in the database.
 * If this is the case, the current user with the name is saved in an array in the local storage.
 * 
 * @param {*} emailInput 
 * @param {*} passwordInput 
 */
function loginUserCorrect(emailInput, passwordInput, snapshot){
    const usersData = snapshot.val();
    const matchingUser = Object.values(usersData).find(user => 
        user.email === emailInput);
    if (matchingUser) {
        if (matchingUser.password === passwordInput) {
            localStorage.removeItem('CurrentUser');
            let decodedName = decodeURIComponent(matchingUser.name);
            localStorage.setItem('CurrentUser', JSON.stringify(decodedName));
            window.location.href = `../Join/htmls/summary.html`;
        } else {
            userInformationPopUp('Passwort ist falsch!')}
    } else {
        userInformationPopUp('E-Mail existiert nicht!')}
}


/**
 * The password is encrypted using Base64 and returned. 
 * 
 * @param {*} password 
 * @returns 
 */
function encryptPassword(password) {
    return btoa(password);
}


/**
 * Converts the Base64-encoded password back to plain text and returns it.
 * 
 * @param {*} encryptedPassword 
 * @returns 
 */
function decryptPassword(encryptedPassword) {
    const decodedPassword = atob(encryptedPassword); 
    return decodedPassword;
}


/**
 * First of all, the stored values are retrieved from the localStorage and stored in variables. 
 * Then the values are loaded into the input fields except for the checkbox, where it is first checked whether it is true.
 * 
 */
function loadRememberedData() {
    const rememberedEmail = localStorage.getItem('rememberedEmail'); 
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    const rememberMeChecked = localStorage.getItem('rememberMeChecked'); 
    if (rememberedEmail) {
        document.getElementById('emailInputLogin').value = rememberedEmail;
    }
    if (rememberedPassword) {
        document.getElementById('passwordInput1').value = decryptPassword(rememberedPassword);
    }
    if (rememberMeChecked === 'true') {
        document.getElementById('rememberMe').checked = true;
    }
}


/**
 * If the button with the guest access was pressed in the login, the local storage 
 * the CurrentUser array is deleted and then recreated with the CurrentUser Guest.
 * The current CurrentUser is also transferred to the summary.html file. 
 * 
 */
function guestLogIn(){
    let matchingUser = 'Guest'
    localStorage.removeItem('CurrentUser');
    localStorage.setItem('CurrentUser', JSON.stringify(matchingUser));
    window.location.href = `./htmls/summary.html?name=${encodeURIComponent(matchingUser)}`;
}


/**
 * Here, the body and the JoinLogo are assigned to a variable. The first animation causes the logo to move to the top left.
 * The second animation fades in the remaining content with a delay and ensures that scrolling is possible again.
 * 
 */
export function logInAnimation(){
    const logo = document.querySelector('.JoinLogoStyle');
    const body = document.body;
    setTimeout(() => {
        logo.classList.add('logo-move');
        setTimeout(() => {
            body.classList.add('show-content');
            body.style.overflow = 'auto'; 
        }, 1000);
    }, 400);
}


/**
 * If the arrays already exist in the local storage, they will be deleted. 
 * The arrays are recreated empty and the data from the Firebase is stored in variables in Json format.
 * 
 */
async function fetchContactTask(){
    localStorage.removeItem('taskAllArray');
    localStorage.removeItem('contactAllArray');
    let taskAllArray = [];
    let contactAllArray = [];
    const pathTasks = 'tasksAll';
    const pathContacts = 'contactall';
    let Summaryall = await fetch(BaseUrl + pathTasks + '.json');
    let Summaryallshow = await Summaryall.json();
    let Contactall = await fetch(BaseUrl + pathContacts + '.json');
    let Contactallshow = await Contactall.json();
    contactLoadStorage(Contactallshow, Summaryallshow, contactAllArray, taskAllArray)
}


/**
 * The data from the variables is added to the array and stored in the local storage.
 * 
 * @param {*} Contactallshow 
 * @param {*} Summaryallshow 
 * @param {*} contactAllArray 
 * @param {*} taskAllArray 
 */
function contactLoadStorage(Contactallshow, Summaryallshow, contactAllArray, taskAllArray){
    for (let key in Summaryallshow) {
        taskAllArray.push(Summaryallshow[key]);
    }
    for (let key in Contactallshow) {
        contactAllArray.push(Contactallshow[key]);
    }
    localStorage.setItem('taskAllArray', JSON.stringify(taskAllArray));
    localStorage.setItem('contactAllArray', JSON.stringify(contactAllArray));
}