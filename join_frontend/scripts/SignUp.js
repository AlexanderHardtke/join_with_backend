const BaseUrl = "https://join-357c8-default-rtdb.europe-west1.firebasedatabase.app/";
let SignUpWindowArrayIDs = ['LoginWindow', 'SignUpWindow', 'SignUpButtondisabled', 'SignUpButtonWindow']
let SignUpWindowArrayAdd = ['none', 'SignUpMain', 'ButtonAddDisabled', 'none']
let SignUpWindowArrayRemove = ['LoginPageMain', 'none', 'ButtonRemoveDisabled', 'LoginPageSignUp']
import { getDatabase, ref, get, child, set } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import {logInAnimation} from './LogIn.js';
import { firebaseConfigHidden } from './firebase.js';
window.submitToFirebase = submitToFirebase;
window.backToLogin = backToLogin;
window.signUpWindow = signUpWindow;
window.togglePasswordVisibility = togglePasswordVisibility;
window.userInformationPopUp = userInformationPopUp;
const firebaseConfig = firebaseConfigHidden;
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { app, database, ref, get, child, set };


/**
 * Opens the SignUp window and the login window is hidden.
 */
function signUpWindow(){
    singUpWindowHtml();
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.add(`${SignUpWindowArrayAdd[i]}`);
    }    
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.remove(`${SignUpWindowArrayRemove[i]}`);
    }
    document.getElementById('SignUpButtondisabled').disabled = true;
    signUpLoad()
}


/**
 * Closes the SingUp window and opens the login window.
 */
function backToLogin(){
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.remove(`${SignUpWindowArrayAdd[i]}`);
    }    
    for(let i = 0;i < SignUpWindowArrayIDs.length;i++){
        document.getElementById(`${SignUpWindowArrayIDs[i]}`).classList.add(`${SignUpWindowArrayRemove[i]}`);
    }
}


/**
 * Checks each input field to see if it has been clicked and if so, a function is executed.
 */
function signUpLoad(){
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");
    const passwordInput = document.getElementById("passwordInput");
    const confirmPasswordInput = document.getElementById("confirmPasswordInput");
    const checkbox = document.getElementById("checkboxInput");
    nameInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    emailInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    signUpInputChange(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox)
}


/**
 * Checks each input field to see if it has been clicked and if so, a function is executed.
 * 
 * @param {*} nameInput 
 * @param {*} emailInput 
 * @param {*} passwordInput 
 * @param {*} confirmPasswordInput 
 * @param {*} checkbox 
 */
function signUpInputChange(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox){
    passwordInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    confirmPasswordInput.addEventListener('input', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
    checkbox.addEventListener('change', () => {
        validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox);
    });
}


/**
 * Here, the values are read from the input fields and saved in variables. The system then checks whether the user already exists.
 * Depending on whether the user already exists, the corresponding function is executed.
 * 
 * @param {*} event 
 */
export function submitToFirebase(event) {
    event.preventDefault();
    const emailInput = document.getElementById("emailInput").value;
    const nameInput = document.getElementById("nameInput").value;
    const passwordInput = document.getElementById("passwordInput").value;
    const newUser = { name: nameInput, email: emailInput, password: passwordInput };
    const usersRef = ref(database, 'users');
    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            checkEmailExist(snapshot, newUser, emailInput, usersRef);
        } else {
            submitTryUser(newUser, database);}
    }).catch(() => {
        userInformationPopUp('Error when retrieving user data!');});
}


/**
 * If the user does not yet exist, the user is registered here and you return to the login.
 * 
 * @param {*} newUser 
 * @param {*} database 
 */
function submitTryUser(newUser, database) {
    set(ref(database, 'users/0'), newUser)
    .then(() => {
        userInformationPopUp('User successfully registered!');
        backToLogin();
    })
    .catch(() => {
        userInformationPopUp('User could not be registered!');
    });
}


/**
 * Here it is checked whether the specified email already exists and, 
 * depending on this, a pop-up is generated that displays the corresponding action.
 * 
 * @param {*} snapshot 
 * @param {*} newUser 
 * @param {*} emailInput 
 * @param {*} usersRef 
 * @returns 
 */
function checkEmailExist(snapshot, newUser, emailInput, usersRef) {
    const usersData = snapshot.val();
    const signUpButton = document.getElementById("SignUpButtondisabled");
    const emailExists = Object.values(usersData).some(user => user.email === emailInput);
    if (emailExists) {
        userInformationPopUp('This email is already in use!');
        signUpButton.disabled = true; return;}
    const existingKeys = Object.keys(usersData).map(key => parseInt(key, 10));
    const nextIndex = existingKeys.length > 0 ? Math.max(...existingKeys) + 1 : 0;
    const newUserRef = child(usersRef, nextIndex.toString());
    set(newUserRef, newUser).then(() => {
        userInformationPopUp('User successfully registered!');
        backToLogin();})
    .catch(() => {userInformationPopUp('User could not be registered!'); signUpButton.disabled = true;});
}


/**
 * This creates a pop-up window that is able to display the current status of whether the registration is working or not.
 * 
 * @param {*} text 
 */
function userInformationPopUp(text) {
    const popupElement = document.getElementById('UserInfoPopUp');
    popupElement.classList.remove('none');
    popupElement.classList.add('UserInforWindow');
    userInformationPopUpHTML(text);
    setTimeout(() => {
        popupElement.classList.add('show-popup');
    }, 10);
    setTimeout(() => {
        popupElement.classList.add('none');
        popupElement.classList.remove('UserInforWindow');
        popupElement.classList.remove('show-popup');
    }, 3000);
}


/**
 * First you get access to the corresponding password field and the icon. 
 * The system then checks whether the password is in password or text mode and the icon changes to an eye.
 * If the password is displayed as text, the display changes to a password and the icon becomes a lock.
 * 
 * @param {*} id 
 * @param {*} PasswortID 
 */
function togglePasswordVisibility(id, PasswortID) {
    const passwordInput = document.getElementById(PasswortID);
    const toggleIcon = document.getElementById(id);
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.src = "./assets/icons/visibilityOff.png"; 
    } else {
        passwordInput.type = 'password';
        toggleIcon.src = './assets/icons/lock.png';
    }
}


/**
 * When index.html is called up, the following functions are executed directly at the beginning.
 * 
 */
window.onload = function() {
    logInAnimation()
    loadRememberedData();
    addInputListeners();
};


/**
 * This function checks the value of the input field if it is empty, 
 * then the border of the container is black if the content is not correct, 
 * then the border turns red and if it is correct, then the border turns blue.
 * 
 * @param {*} input 
 * @param {*} container 
 * @param {*} pattern 
 * @returns 
 */
function validateValue(input, container, pattern) {
    if (input.value.trim() === '') {
        container.style.border = '1px solid black';
        return false;
    } else if (!pattern.test(input.value)) {
        container.style.border = '1px solid red';
        return false;
    } else {
        container.style.border = '1px solid #29ABE2';
        return true;
    }
}


/**
 * This function checks the value of the input field if it is empty, 
 * then the border of the container is black if the content is not correct, 
 * then the border turns red and if it is correct, then the border turns blue.
 * 
 * @param {*} confirmPasswordInput 
 * @param {*} confirmPasswordContainer 
 * @param {*} passwordInput 
 * @returns 
 */
function validateConfirmPassword(confirmPasswordInput, confirmPasswordContainer, passwordInput) {
    if (confirmPasswordInput.value.trim() === '') {
        confirmPasswordContainer.style.border = '1px solid black';
        return false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
        confirmPasswordContainer.style.border = '1px solid red';
        return false;
    } else {
        confirmPasswordContainer.style.border = '1px solid #29ABE2';
        return true;
    }
}


/**
 * The value of an input field of the type checkbox is transferred here. 
 * It is checked whether a tick has been set or not and either true or false is returned.
 * 
 * @param {*} checkbox 
 * @returns 
 */
function validateCheckbox(checkbox) {
    return checkbox.checked;
}


/**
 * The div containers in which the input fields and the icons are located are assigned to variables.
 * The conditions for the name, email and password are assigned to the respective variables.
 * The variables are transferred to various functions.
 * 
 * @param {*} nameInput 
 * @param {*} emailInput 
 * @param {*} passwordInput 
 * @param {*} confirmPasswordInput 
 * @param {*} checkbox 
 */
function validateForm(nameInput, emailInput, passwordInput, confirmPasswordInput, checkbox) {
    const signUpButton = document.getElementById("SignUpButtondisabled");
    const nameContainer = document.getElementById('SignInputIconfirst');
    const emailContainer = document.getElementById('SignInputIconsecond');
    const passwordContainer = document.getElementById('SignInputIconthird');
    const confirmPasswordContainer = document.getElementById('SignInputIconfourth');
    const namePattern = /^[A-Z][a-z]*\s[A-Z][a-z]*$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const passwordPattern = /^.{8,}$/;
    const isNameValid = validateValue(nameInput, nameContainer, namePattern);
    const isEmailValid = validateValue(emailInput, emailContainer, emailPattern);
    const isPasswordValid = validateValue(passwordInput, passwordContainer, passwordPattern);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPasswordInput, confirmPasswordContainer, passwordInput);
    validateEveryone(isNameValid, isEmailValid, isPasswordValid, isConfirmPasswordValid, checkbox, signUpButton)
}


/**
 * If each value is correct, the button is made clickable in the if condition and it is given the background colour blue.
 * If not every value is correct, then it is not clickable and has the background colour grey.
 * 
 * @param {*} isNameValid 
 * @param {*} isEmailValid 
 * @param {*} isPasswordValid 
 * @param {*} isConfirmPasswordValid 
 * @param {*} checkbox 
 * @param {*} signUpButton 
 */
function validateEveryone(isNameValid, isEmailValid, isPasswordValid, isConfirmPasswordValid, checkbox, signUpButton){
    const isCheckboxChecked = validateCheckbox(checkbox);
    if (isNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isCheckboxChecked) {
        signUpButton.disabled = false; 
        signUpButton.classList.remove('ButtonAddDisabled');
        signUpButton.classList.add('ButtonRemoveDisabled');
    } else {
        signUpButton.disabled = true; 
        signUpButton.classList.add('ButtonAddDisabled');
        signUpButton.classList.remove('ButtonRemoveDisabled');
    }
}


