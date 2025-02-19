/**
 * Function to generate a random color in hex format.
 * 
 * @returns 
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/**
 * The parameter passed is split into two parts. The first letter of the first name and the first letter of the last name are returned as capital letters.
 * 
 * @param {*} name 
 * @returns 
 */
function getInitials(name) {
    let nameParts = name.split(' ');
    let firstNameInitial = nameParts[0] ? nameParts[0][0].toUpperCase() : '';
    let lastNameInitial = nameParts[1] ? nameParts[1][0].toUpperCase() : '';
    return firstNameInitial + lastNameInitial;
}


/**
 * Classes are added and removed to create a popup that disappears after 2 seconds.
 * 
 * @param {*} text 
 */
function showPopUpInfo(text) {
    let WindowSize = window.innerWidth
    if(WindowSize < 900){
        const popupElement = document.getElementById('ContactInfoPopUp');
        popupElement.classList.remove('none');
        popupElement.classList.add('ContactInforWindow');
        contactInformationPopUpHTML(text);
        setTimeout(() => { popupElement.classList.add('Contactshow-popup'); }, 10);
        setTimeout(() => {
            popupElement.classList.add('none');
            popupElement.classList.remove('ContactInforWindow');
            popupElement.classList.remove('Contactshow-popup');
        }, 2000);}
}


/**
 * When formatting the telephone number, all digits and the plus sign are removed. In addition, the format of a cell phone number is implemented.
 * 
 * @param {*} value 
 * @returns 
 */
function formatPhoneNumber(value) {
    value = value.replace(/[^\d+]/g, "");
    if (value.startsWith("+") && value.length > 3) {
        value = value.replace(
            /^\+(\d{2})(\d{0,4})(\d{0,3})(\d{0,2})(\d{0,1}).*/,
            "+$1 $2 $3 $4 $5"
        );
    } else if (!value.startsWith("+")) {
        value = "+";
    }
    if (value.length > 17) {
        value = value.slice(0, 17);
    }
    return value.trim();
}


/**
 * The element is made visible to start the slide in animation.
 * 
 */
function editContactShowWindow() {
    const editWindow = document.getElementById('EditContactIDWIn');
    editWindow.classList.remove('none', 'Slideinleft');
    editWindow.classList.add('EditContactWindow', 'Slideinright');
}


/**
* A different path is used depending on which ID is transferred. This is used to exchange icons.
* 
* @param {*} id 
*/
function onmouseClose(id){
    if(id == 'XCloseID'){
        document.getElementById(id).innerHTML=`<img id="XCloseother" class="ImgCloseStyle2" src="../assets/icons/closeBlue.png">`;
    }
}


/**
* A different path is used depending on which ID is transferred. This is used to exchange icons.
* 
* @param {*} id 
*/
function outmouseClose(id){
    if(id == 'XCloseID'){
        document.getElementById(id).innerHTML=`<img id="XClose" class="ImgCloseStyle2" src="../assets/icons/close.png">`;
    }
}  


/**
*An element that is equipped with this function is not considered by an eventListener. 
* 
* @param {*} event 
*/
function protect(event){
    event.stopPropagation();
}
