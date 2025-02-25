let currentLoggedUser = {};

/**
 * The following functions are executed when the page is loaded.
 * 
 * @param {*} id 
 */
function init(id) {
    getUserFromLocalStorage()
    renderHeader(id);
    checkCurrentPage();
    checkUser()
}


/**
 * Gets the user from the loal storage and parse it into an array
 * 
 */
function getUserFromLocalStorage() {
    let currentUser = localStorage.getItem('CurrentUser');
    currentLoggedUser = JSON.parse(currentUser)
}


/**
 * This checks where the user is currently located and classes are added depending on this.
 * 
 */
function checkCurrentPage() {
    let i = window.location.href;
    currentPageHTML = i.substring(i.lastIndexOf('/')).replace('/', "");
    currentPage = currentPageHTML.split('.')[0];
    if (currentPage == 'privacyPolicy' || currentPage == 'legalNotice') {
        document.getElementById('sideBar' + currentPage).classList.add('sideBarLegalActiveSite');
    }
    else if (currentPage == 'summary' || currentPage == 'addTask' || currentPage == 'board' || currentPage == 'contacts') {
        document.getElementById('pic' + currentPage).src = "../assets/icons/" + currentPage + "White.png";
        document.getElementById('sideBar' + currentPage).classList.add('sideBarMenuActiveSite');
    }
}


/**
 * This function takes you back to the previous window.
 */
function goBack() {
    window.history.back();
}


/**
 * In this function, the current user is loaded from the local storage and it is checked whether the user is null or not.
 * In addition, the initials are loaded at the desired position in the header.
 */
async function checkUser() {
    if (currentLoggedUser == 'null') {
        initials = removeNoneUserOptions();
    } else {
        initials = checkIfUserGuest(currentLoggedUser);
    }
    document.getElementById('headerProfile').innerHTML = /*html*/`
    <div>${initials}</div>
    `;
}


/**
 * This function passes the current CurrentName and splits the first letter of the first name and last name.
 * The system then checks whether initials has the length 1; if this is the case, then the guest has logged in.
 * Finally, the initials are returned.
 * 
 * @param {*} Currentname 
 * @param {*} name 
 * @returns 
 */
function checkIfUserGuest(currentLoggedUser) {
    let initials = currentLoggedUser.first_name[0] + currentLoggedUser.last_name[0]
    if (initials.length === 1) {
        document.getElementById('headerProfile').classList.add('guestLogin');
    }
    return initials;
}


/**
 * Classes are added here.
 */
function removeNoneUserOptions() {
    document.getElementById('burgerMenu').classList.add('dNone');
    document.getElementById('HelpSideOpen').classList.add('dNone');
    document.getElementById('SidebarMenuFourButtons').classList.add('dNone');
}


/**
 * Here it is checked whether the element has the class dNone and, depending on this, a different function is executed.
 */
function toggleBurgerMenu() {
    if (document.getElementById('burgerMenu').classList.contains("dNone")) {
        showBurgerMenu();
    }
    else {
        hideBurgerMenu();
    }
}


/**
 * The element is visualised here.
 */
function showBurgerMenu() {
    document.getElementById('burgerMenu').classList.remove('dNone');
    document.getElementById('headerOverlay').classList.add('showHeaderOverlay');
}


/**
 * The element is made invisible here.
 */
function hideBurgerMenu() {
    document.getElementById('burgerMenu').classList.add('dNone');
    document.getElementById('headerOverlay').classList.remove('showHeaderOverlay');
}


/**
 * If the function is clicked, the Current User is set to zero in the local storage.
 * This means that the saved name is reset as if no user is logged in.
 */
function resetUser() {
    let UserAsText = JSON.stringify(null);
    localStorage.setItem('CurrentUser', UserAsText);
}