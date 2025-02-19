const BaseUrl = "https://join-357c8-default-rtdb.europe-west1.firebasedatabase.app/";
let charContactArray = [];
let emailsArray = [];
let contactNameArray = [];
let PhonenumberArray = [];
let colorPalette = [];
let isButtonClicked = false;
let editDeleteChoiceID = ['MenuEditDeleteOptionsID', 'MenuEditDeleteOptionsID', 'editDeleteChoiceButton']
let editDeleteChoiceAdd = ['SlideinWindowDW1', 'MenuEditDeleteOptionsSmall', 'none']
let editDeleteChoiceRemove = ['SlideinWindowDW2', 'none', 'MenuEditDeleteButton']
let editDeleteWindowID = ['ContactfieldInfodiv', 'ContactfieldInfodiv', 'MenuEditDeleteOptionsID']
let editDeleteWindowRemove = ['Slideinright', 'Slideinleft', 'SlideinWindowDW1']
let showContactWindowIDAdd = ['EveryContact', 'AddContactNewButton', 'ArrowBackClick', 'editDeleteChoiceButton']
let showContactWindowAddClass= ['none', 'none', 'StyleBackarrowClick', 'MenuEditDeleteButton']
let showContactWindowIDRemove = ['AddContactNewButton', 'MenuEditDeleteButtonID', 'editDeleteChoiceButton']
let showContactWindowRemoveClass = ['MenuEditDeleteButton', 'none', 'none']
let goBackToContactsremoveID = ['EveryContact', 'AddContactNewButton', 'ArrowBackClick', 'editDeleteChoiceButton']
let goBackToContactsremove = ['none', 'none', 'StyleBackarrowClick', 'MenuEditDeleteButton']
let goBackToContactsAddID = ['AddContactNewButton', 'editDeleteChoiceButton', 'MenuEditDeleteButtonID']
let goBackToContactsAdd = ['MenuEditDeleteButton', 'none', 'none']
contactLoad();


/**
 * Fetches the data from the database and converts it into a json.
 * Fills several arrays with the corresponding information using a for loop.
 * 
 * @param {*} name
 */
function contactLoad() {
    cleanArray();
    let contactAllArray = JSON.parse(localStorage.getItem('contactAllArray')) || [];
    for (let key in contactAllArray) {  
        contactNameArray.push(contactAllArray[key].name);
        emailsArray.push(contactAllArray[key].email);
        PhonenumberArray.push(contactAllArray[key].phone);
        charContactArray.push({ key: key, name: contactAllArray[key].name, email: contactAllArray[key].email, phone: contactAllArray[key].phone });
        colorPalette.push(contactAllArray[key].color);
    }
    contactLoadChar(contactNameArray);
}


function cleanArray(){
    contactNameArray = [];
    emailsArray = [];
    PhonenumberArray = [];
    charContactArray = [];
    colorPalette = [];
}


/**
 * 
 * charContactArray is filled, and then the array is sorted alphabetically by initials and then by name.
 * 
 * @param {*} contactNameArray 
 */
function contactLoadChar(contactNameArray){
    contactNameArray.forEach((name, index) => {
        let email = emailsArray[index];
        if(name){
            let [firstName, lastName] = name.split(" ");
            let initials = `${firstName[0]}${lastName[0]}`;
            charContactArray[index].initial = firstName[0].toUpperCase();
            charContactArray[index].initials = initials;
        }});
    charContactArray.sort((a, b) => {
        if (a.initial === b.initial) {return a.name.localeCompare(b.name);}
        return a.initial.localeCompare(b.initial);});
    contactLoadContainer();
}


/**
 * A div container is created here and extensive functions are called up.
 * 
 */
function contactLoadContainer(){
    let container = document.createElement('div');
    let currentInitial = '';
    charContactArray.forEach((obj) => {
        contactLoadInitialLineSpan(obj, currentInitial, container)
    });
    contactLoadTargetId(container);
}


/**
 * Each element of charContactArray is selected and checked to see if the initials match.
 * If not, a new initial is displayed. A horizontal line is also created.
 * 
 * @param {*} obj 
 * @param {*} currentInitial 
 * @param {*} container 
 */
function contactLoadInitialLineSpan(obj, currentInitial, container){
    if (obj.initial !== currentInitial) {
        currentInitial = obj.initial;
        let initialExists = Array.from(container.children).some(child => 
            child.classList.contains('initial-span') && child.textContent === currentInitial);
        if (!initialExists) {
            let span = document.createElement('span');
            span.textContent = currentInitial;
            span.classList.add('initial-span');
            container.appendChild(span);
            let lineDiv = document.createElement('div');
            lineDiv.classList.add('gray-line');
            container.appendChild(lineDiv);}}
    contactLoadCreateButton(container, obj);
}


/**
 * 
 * The buttons are created and assigned an ID based on the Firebase key.
 * 
 * @param {*} container 
 * @param {*} obj 
 */
function contactLoadCreateButton(container, obj){
    let button = document.createElement('button');
    button.classList.add('person-button');
    button.id = `contact-button-${obj.key}`;
    button.classList.add('Backgroundgray');
    contactLoadCreateCircleColor(container, obj, button);
}


/**
 * 
 * The circle element for the initials is created here and equipped with the appropriate color contained in the colorPalette array.
 * A div container is created from name and e-mail
 * 
 * @param {*} container 
 * @param {*} obj 
 * @param {*} button 
 */
function contactLoadCreateCircleColor(container, obj, button) {
    let circleDiv = document.createElement('div');
    circleDiv.textContent = obj.initials;
    circleDiv.classList.add('initial-circle');
    let colorIndex = obj.key; 
    let color = colorPalette[colorIndex % colorPalette.length]; 
    circleDiv.style.backgroundColor = color;
    button.appendChild(circleDiv);
    let nameEmailDiv = document.createElement('div');
    nameEmailDiv.classList.add('name-email');
    contactLoadNameEmailDiv(container, nameEmailDiv, button, obj);
}


/**
 * 
 * A div container is created from name and e-mail
 * 
 * @param {*} container 
 * @param {*} nameEmailDiv 
 * @param {*} button 
 * @param {*} obj 
 */
function contactLoadNameEmailDiv(container, nameEmailDiv, button, obj){
    let nameDiv = document.createElement('div');
    nameDiv.textContent = obj.name;
    nameDiv.classList.add('person-name');
    nameEmailDiv.appendChild(nameDiv);
    let emailDiv = document.createElement('div');
    emailDiv.textContent = obj.email;
    emailDiv.classList.add('person-email');
    nameEmailDiv.appendChild(emailDiv);
    button.appendChild(nameEmailDiv);
    contactLoadClickButton(container, button);
}


/**
 * 
 * Event listener for buttons to change the background color. In addition, classes are removed and added based on the behavior of the listener.
 * 
 * @param {*} container 
 * @param {*} button 
 */
function contactLoadClickButton(container, button){
    button.addEventListener('click', function() {
        document.querySelectorAll('.person-button').forEach(btn => {
            btn.classList.remove('button-active');
            btn.classList.add('Backgroundgray');
        });
        button.classList.add('button-active');
        button.classList.remove('Backgroundgray');
        let clickedButtonId = event.currentTarget.id;
        let buttonColor = event.currentTarget.querySelector('.initial-circle').style.backgroundColor;
        contactloadOtherWidth(buttonColor, clickedButtonId)
    });
    container.appendChild(button);
}


/**
 * The If condition checks whether the Px width is below 900 and, depending on this, the following functions are executed.
 * 
 * @param {} buttonColor 
 * @param {*} clickedButtonId 
 */
function contactloadOtherWidth(buttonColor, clickedButtonId){
    let currentWindowWidth = window.innerWidth;
    if(currentWindowWidth < 900){
        showContactWindow()
        contactInfo(clickedButtonId, buttonColor);
    }else{
        contactInfo(clickedButtonId, buttonColor);
        let ChangeZIndex =document.getElementById('ContactsInfoSection')
        ChangeZIndex.style.zIndex = '5'
        document.getElementById('ContactfieldInfodiv').classList.add('Slideinright')
        document.getElementById('ContactfieldInfodiv').classList.remove('Slideinleft')
    }
}


/**
 * With a for loop, several classes are removed and then some are added. 
 * Then a setTimeout function is executed which removes and adds classes with a delay.
 */
function editDeleteWindowBack(){
    for(let i = 0; i < editDeleteWindowID.length;i++){
        document.getElementById(`${editDeleteWindowID[i]}`).classList.remove(`${editDeleteWindowRemove[i]}`)
    }
    document.getElementById('MenuEditDeleteOptionsID').classList.add('SlideinWindowDW2');
    document.getElementById('ContactfieldInfodiv').classList.add('SlideinTopNew');
    setTimeout(() => {
        document.getElementById('MenuEditDeleteOptionsID').classList.add('none')
        document.getElementById('MenuEditDeleteOptionsID').classList.remove('MenuEditDeleteOptionsSmall')
        document.getElementById('editDeleteChoiceButton').classList.remove('none')
        document.getElementById('editDeleteChoiceButton').classList.add('MenuEditDeleteButton')
    }, 200);
}


/**
 * Classes are added and removed here and the style of two IDs is also changed. 
 * An onclick element is added to an Id.
 */
function showContactWindow(){
    for(let i = 0; i < showContactWindowIDAdd.length;i++){
        document.getElementById(`${showContactWindowIDAdd[i]}`).classList.add(`${showContactWindowAddClass[i]}`)
    }
    for(let i = 0; i < showContactWindowIDRemove.length;i++){
        document.getElementById(`${showContactWindowIDRemove[i]}`).classList.remove(`${showContactWindowRemoveClass[i]}`)
    }
    let ChangeRightSection = document.getElementById('RightsectionheadlineID')
    ChangeRightSection.style.display = 'flex'
    let ChangeZIndex =document.getElementById('ContactsInfoSection')
    ChangeZIndex.style.zIndex = '5'
    isButtonClicked = true;
    let ContactSectionField = document.getElementById('ContactsInfoSection');
    ContactSectionField.onclick = editDeleteWindowBack;
}


/**
 * Classes are added and removed here and the px width is also checked in order to potentially execute an if statement.
 */
function goBackToContacts(){
    for(let i = 0; i < goBackToContactsAddID.length;i++){
        document.getElementById(`${goBackToContactsAddID[i]}`).classList.add(`${goBackToContactsAdd[i]}`)
    }
    for(let i = 0; i < goBackToContactsremoveID.length;i++){
        document.getElementById(`${goBackToContactsremoveID[i]}`).classList.remove(`${goBackToContactsremove[i]}`)
    }
    let windowsize = window.innerWidth;
    if(windowsize < 901){
        let ChangeZIndex =document.getElementById('ContactsInfoSection')
        ChangeZIndex.style.zIndex = '-1'
    }
    isButtonClicked = false;
}


/**
 * Classes are added and removed here.
 */
function editDeleteWindow(){
    for(let i = 0; i < editDeleteChoiceID.length;i++){
        document.getElementById(`${editDeleteChoiceID[i]}`).classList.add(`${editDeleteChoiceAdd[i]}`)
    }
    for(let i = 0; i < editDeleteChoiceID.length;i++){
        document.getElementById(`${editDeleteChoiceID[i]}`).classList.remove(`${editDeleteChoiceRemove[i]}`)
    }    
}


/**
 * A class is added and one is removed. In addition, a setTimeout function is executed which executes classes with a delay.
 * A function is then executed.
 */
function clickContactBack(){
    const editWindow = document.getElementById('EditContactIDWIn');
    editWindow.classList.remove('Slideinright');
    editWindow.classList.add('Slideinleft');
    setTimeout(() => {
        editWindow.classList.add("none");
        editWindow.classList.remove("EditContactWindow");
    }, 400); 
    clickContactBackClass()
}


/**
 * Here it is checked whether the variable contains the appropriate text and classes are executed depending on this.
 */
function clickContactBackClass(){
    const element = document.getElementById('EditWindowAddText1Change');
    if (element.textContent.trim() === 'Add contact') {
        document.getElementById('editDeleteChoiceButton').classList.add('none');
        document.getElementById('editDeleteChoiceButton').classList.remove('MenuEditDeleteButton');
        document.getElementById("MenuEditDeleteButtonID").classList.add("none");
    } else {
        document.getElementById('editDeleteChoiceButton').classList.remove('none');
        document.getElementById('editDeleteChoiceButton').classList.add('MenuEditDeleteButton');
        document.getElementById("MenuEditDeleteButtonID").classList.remove("none");
    }
}


/** 
 * This checks whether a button has been pressed and, depending on the Px width of the screen, a z-index is passed to a variable that is responsible for the style.
 */
window.addEventListener('resize', function() {
    const windowWidth = window.innerWidth;
    let ChangeZIndex =document.getElementById('ContactsInfoSection')
    if (isButtonClicked) {
        if (windowWidth < 900) {ChangeZIndex.style.zIndex = '5'} 
        else {ChangeZIndex.style.zIndex = '10'}}
    else{
        if (windowWidth < 900) {ChangeZIndex.style.zIndex = '-1'} 
        else {ChangeZIndex.style.zIndex = '10'}}
});


/**
 * 
 * The key is extracted from the ID. The corresponding object in the array is also filtered out. 
 * In addition, the system checks whether the px width is smaller than 900; if this is the case, one class is added and one removed.
 * 
 * @param {*} clickedButtonId 
 * @param {*} buttonColor 
 */
function contactInfo(clickedButtonId, buttonColor){
    let key = clickedButtonId.split('-').pop(); 
    let contact = charContactArray.find(obj => obj.key === key);
    if (contact) {
        let { initials, name, email, phone } = contact;
        contactInfoHtml(initials, name, email, phone, buttonColor, key);
        let windowSize = window.innerWidth
        if(windowSize > 900){
            document.getElementById('MenuEditDeleteOptionsID').classList.add('none')
            document.getElementById('MenuEditDeleteOptionsID').classList.remove('MenuEditDeleteOptionsSmall')
        }
    }
}


/**
 * The destination ID where they should be located is specified here.
 * 
 * @param {*} container 
 */
function contactLoadTargetId(container){
    document.getElementById('EveryContact').innerHTML= ``;
    let targetElement = document.getElementById('EveryContact'); 
    if (targetElement) {
        targetElement.appendChild(container);
    }
}






