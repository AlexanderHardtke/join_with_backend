const LoginURL = "http://127.0.0.1:8000/api/login/";
const checkURL = "http://127.0.0.1:8000/api/usercheck/";
let matchingUser;
window.loginUser = loginUser;
window.guestLogIn = guestLogIn;
window.toggleRememberMe = toggleRememberMe;
window.logInAnimation = logInAnimation;
window.checkRememberMe = checkRememberMe();


/**
 * The current password and email are read out here and if the data is not found, the border of the email container changes to red.
 * 
 * @returns 
 */
function logInvalidateEmail() {
    const emailInputElement = document.getElementById("emailInputLogin");
    const emailContainer = document.getElementById("LoginInputIconID1");
    const emailInput = emailInputElement.value;
    emailContainer.style.border = '1px solid red';
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
    passwordContainer.style.border = '1px solid red';
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
async function loginUser() {
    const emailInputElement = document.getElementById("emailInputLogin");
    const passwordInputElement = document.getElementById("passwordInput1");
    const emailInput = emailInputElement.value;
    const passwordInput = passwordInputElement.value;
    let user = { username: emailInput, password: passwordInput }
    const userWithToken = await getUserToken(user)
    if (userWithToken.token) {
        userInformationPopUp("Login successful")
        setLocalStorage(userWithToken)
        setTimeout(() => {
            window.location.href = `../htmls/summary.html`;
        }, 1500);
    } else {
        let error = Object.values(userWithToken)
        checkErrors(error); 
    }
}


async function checkErrors(error) {
    await loginUserCorrect()
    setTimeout(() => {
        resetEmailBorderOnBlur();
        resetPasswordBorderOnBlur();
    }, 2500);
}


/**
 * gets the user array token from the login API
 * 
 * @param {*} user the user array
 * @returns the user array
 */
async function getUserToken(user) {
    try {
        let response = await fetch(LoginURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let result = await response.json();
        return result
    } catch (error) {
        console.error('Fehler beim Speichern:', error);
        userInformationPopUp(error)
    }
    LoginURL
}


async function checkEmail() {
    try {
        const response = await fetch(checkURL);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const user = response.json();
        return user
    } catch (error) {
        console.error(error.message);
    }
}


/**
 * sets the Current User in the local storage and stringifys it
 * 
 * @param {*} user the user array
 */
function setLocalStorage(user) {
    localStorage.setItem('CurrentUser', JSON.stringify(user));
}


/**
 * This function checks whether the email and password in the login match a user in the database.
 * If this is the case, the current user with the name is saved in an array in the local storage.
 * 
 * @param {*} emailInput  
 * @param {*} passwordInput 
 */
async function loginUserCorrect() {
    const users = [];
    const emailInput = document.getElementById("emailInputLogin").value;
    const usersData = await checkEmail()
    usersData.forEach(user => {
        users.push(user.email);
    });
    if (users.includes(emailInput)) {
        logInvalidatePassword()
        userInformationPopUp('Passwort ist falsch!')
    } else {
        logInvalidateEmail()
        userInformationPopUp('E-Mail existiert nicht!')
    }
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
 * If the button with the guest access was pressed in the login, the local storage 
 * the CurrentUser array is deleted and then recreated with the CurrentUser Guest.
 * The current CurrentUser is also transferred to the summary.html file. 
 * 
 */
function guestLogIn() {
    let matchingUser = {
        "token": "1d41be367c99a990503850feacb811f25a130ac9",
        "username": "Guest",
        "first_name": "Guest",
        "last_name": ""
    }
    localStorage.removeItem('CurrentUser');
    localStorage.setItem('CurrentUser', JSON.stringify(matchingUser));
    window.location.href = `./htmls/summary.html?name=${encodeURIComponent(matchingUser)}`;
}


/**
 * Here, the body and the JoinLogo are assigned to a variable. The first animation causes the logo to move to the top left.
 * The second animation fades in the remaining content with a delay and ensures that scrolling is possible again.
 * 
 */
export function logInAnimation() {
    const logo = document.querySelector('.JoinLogoStyle');
    const body = document.body;
    setTimeout(() => {
        logo.classList.add('logo-move');
        setTimeout(() => {
            body.classList.add('show-content');
            body.style.overflow = 'auto';
        }, 1000);
    }, 50);
}


/**
 * If the arrays already exist in the local storage, they will be deleted. 
 * The arrays are recreated empty and the data from the Firebase is stored in variables in Json format.
 * 
 */
async function fetchContactTask() {
    let LoggedUser = localStorage.getItem('LoggedUser');
    if (LoggedUser !== null) {
        const user = JSON.parse(LoggedUser);
        let pw = decryptPassword(user.password)
        document.getElementById("emailInputLogin").value = user.username;
        document.getElementById("passwordInput1").value = pw;
        document.getElementById("rememberMe").checked = true;
    }
}


/**
 * checks if the remember me button was checked in the local storage
 * 
 */
function checkRememberMe() {
    const rememberMeChecked = localStorage.getItem('rememberMeChecked');
    if (rememberMeChecked === 'true') {
        fetchContactTask();
    }
}


/**
 * toggles the remember me button and saves the status on the local storage
 * 
 */
function toggleRememberMe() {
    const rememberMeChecked = localStorage.getItem('rememberMeChecked')
    if (rememberMeChecked === 'true') localStorage.setItem("rememberMeChecked", 'false');
    else localStorage.setItem("rememberMeChecked", 'true');
}