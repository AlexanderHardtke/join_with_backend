let contactDetails = {};
let IMGPfadon = ['deleteBlue','editBlue']
let IMGPfadof = ['delete',  'edit']


/**
 * Classes are removed and added and a function call takes place.
 * 
 * @param {*} initials 
 * @param {*} name 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} buttonColor 
 * @param {*} index 
 */
function editNewContact(initials, name, email, phone, buttonColor, index) {
    document.getElementById("MenuEditDeleteOptionsID").classList.add("none");
    document.getElementById("MenuEditDeleteOptionsID").classList.remove("MenuEditDeleteOptionsSmall");
    document.getElementById("MenuEditDeleteOptionsID").classList.remove("SlideinWindowDW1");
    document.getElementById("MenuEditDeleteOptionsID").classList.add("SlideinWindowDW2");
    document.getElementById("MenuEditDeleteButtonID").classList.add("none");
    document.getElementById("EditContactIDWIn").classList.remove("none");
    document.getElementById("EditContactIDWIn").classList.add("EditContactWindow");
    editNewContactCheckValues(initials, name, email, phone, buttonColor, index, true);
}


/**
 * The values for name, email and phone are read out. If this is not the case, the respective function is called. 
 * Further function calls also take place.
 * 
 * @param {*} name 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} index 
 */
function editNewContactSave(name, email, phone, index) {
  let nameelement = document.getElementById("editNameInput").value
  let emailelement = document.getElementById("editEmailInput").value
  let phoneelement = document.getElementById("editPhoneInput").value
  editNewContactValidateCheck(nameelement, emailelement, phoneelement)
  validationInputAndBlur("editNameInput", name, validateName);
  validationInputAndBlur("editEmailInput", email, validateEmail);
  validationInputAndBlur("editPhoneInput", phone, validatePhone);
  editNewContactCheckInput(index) 
}


/**
 * Here we check if name, email and phone are filled in.
 * 
 * @param {*} nameelement 
 * @param {*} emailelement 
 * @param {*} phoneelement 
 */
function editNewContactValidateCheck(nameelement, emailelement, phoneelement){
    if(nameelement === '')
        {validateName("editNameInput")
    }
    if(emailelement === ''){
        validateEmail("editEmailInput")
    }
    if(phoneelement === ''){
        validatePhone("editPhoneInput")
    }
}


/**
 * This is where the form validation takes place and the information is prevented from being sent.
 * In addition, the current values are retrieved from the input fields and the telephone number format is implemented.
 * The telephone number format is checked and a function call is made if the format has been adhered to. 
 * 
 * @param {*} index 
 */
function editNewContactCheckInput(index) {
    let WindowSize = window.innerWidth;
    if (WindowSize < 900) {
        document.getElementById('ChangeClosebutton').innerHTML = `<img class="ImgCloseStyle" src="../assets/icons/closeWhite.png">`;
    }
    const nameValue = document.getElementById("editNameInput").value;
    const emailValue = document.getElementById("editEmailInput").value;
    const phoneValue = document.getElementById("editPhoneInput").value;
    const phoneRegex = /^\+\d{2} \d{4} \d{3} \d{2} \d{1}$/;
    if (!phoneRegex.test(phoneValue)) {
        return; 
    } else {
        editNewContactChange(nameValue, emailValue, phoneValue,index);
    }
}


/**
 * Depending on which boolean is passed, the values name, email, phone, buttonColor and initials are filled or empty.
 * 
 * @param {*} initialsValue 
 * @param {*} nameValue 
 * @param {*} emailValue 
 * @param {*} phoneValue 
 * @param {*} buttonColorValue 
 * @param {*} index 
 * @param {*} showValues 
 */
function editNewContactCheckValues(initialsValue, nameValue, emailValue, phoneValue, buttonColorValue, index, showValues = true) {
    const name = showValues && nameValue ? nameValue : '';  
    const email = showValues && emailValue ? emailValue : '';
    const phone = showValues && phoneValue ? phoneValue : '';
    const buttonColor = showValues && buttonColorValue ? buttonColorValue : '';
    const initials = showValues && initialsValue ? initialsValue : '';
    editNewContactHtml(initials, name, email, phone, buttonColor, index);
}


/**
 * Here initials, name, email, phone, buttonColor and index are added to an object.
 * 
 * @param {*} initials 
 * @param {*} name 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} buttonColor 
 * @param {*} index 
 */
function setContactDetails(initials, name, email, phone, buttonColor, index) {
    contactDetails = { initials, name, email, phone, buttonColor, index };
}


/**
 * In the Add new contact window, text and buttons are changed using functions and class.
 * 
 */
function editNewContactHtmlChange() {
    editContactShowWindow();
    editNewContactCheckValues(contactDetails.initials, contactDetails.name, contactDetails.email, contactDetails.phone, contactDetails.buttonColor, contactDetails.index, false);
    document.getElementById('EditWindowAddText1Change').innerHTML='Add contact';
    document.getElementById('EditWindowAddText2Change').innerHTML='Tasks are better with a team!';
    document.getElementById('EditCircleInitialsID').innerHTML='<img src="../assets/icons/person (1).png">'
     document.getElementById('EditCircleStyleColor').style.background='#D9D9D9'
    document.getElementById('EditWindowDeleteSaveID1').classList.remove('EditWindowDeleteSave')
    document.getElementById('EditWindowDeleteSaveID1').classList.add('none')
    document.getElementById('EditWindowDeleteSaveID2').classList.add('EditWindowDeleteSave')
    editNewContactChangeHTML()
}


/**
 * 
 * First of all I get the formatted json and then the values from the input fields are assigned to the variables name, email and phone.
 * The length of the contact strip is then determined and the appropriate key identified.
 * The new object is created and the values are assigned. They are then sent to the database.
 * The main function is rendered to get the current changes and the window is closed.
 */
function createNewContact(event) {
    if (event) event.preventDefault();
    let contactAllArray = JSON.parse(localStorage.getItem('contactAllArray')) || [];
    const name = document.getElementById('editNameInput').value.trim();
    const email = document.getElementById('editEmailInput').value.trim();
    const phone = document.getElementById('editPhoneInput').value.trim();
    if (name && email && phone) {
        let newContact = {"name": name,"email": email,"phone": phone,"color": getRandomColor()};
        contactAllArray.push(newContact);
        localStorage.setItem('contactAllArray', JSON.stringify(contactAllArray));
        editContactCloseWindow();
        showPopUpInfo('Contact was successfully added!')
        contactLoad()}
    else{document.getElementById('CreateContactButtonID').disabled = true;}
}
        

/**
 * The data is transferred from the database in an object. The length of the array containing the objects is then determined.
 * The object with the corresponding index is deleted from the array and it is rendered. 
 * If the px width is less than 900 px, another function is executed.
 * 
 * @param {*} index 
 * @param {*} name 
 */
function deleteContactList(index) {
    let contactAllArray = JSON.parse(localStorage.getItem('contactAllArray')) || [];
    if (index >= 0 && index < contactAllArray.length) {
        contactAllArray.splice(index, 1);
        localStorage.setItem('contactAllArray', JSON.stringify(contactAllArray));
        document.getElementById('ContactfieldInfodiv').classList.remove('Slideinright');
        document.getElementById('ContactfieldInfodiv').classList.add('Slideinleft');
        let windowSize = window.innerWidth
        if(windowSize < 900){goBackToContacts()}
        else{ document.getElementById('Contenttext').innerHTML='';}
        contactLoad(); }
}


/**
 * Slide out animation is started and the system waits until the animation is complete before hiding the element.
 * If the Px width is less than 900 and a certain text element is in the Id, the corresponding classes are executed.
 * 
 */
function editContactCloseWindow() {
    const editWindow = document.getElementById('EditContactIDWIn');
    editWindow.classList.remove('Slideinright');
    editWindow.classList.add('Slideinleft');
    setTimeout(() => {
        editWindow.classList.add("none");
        editWindow.classList.remove("EditContactWindow");
    }, 400); 
}


/**
 * Here the contactAllArray is loaded from the local storage into a variable and it is checked whether duplicates are present in the array.
 * If it is not a duplicate, the next function is executed.
 * 
 * @param {*} name 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} index 
 */
function editNewContactChange(name, email, phone ,index) {
    let contactAllArray = JSON.parse(localStorage.getItem('contactAllArray')) || [];
    let duplicate = contactAllArray.some(contact => 
        contact.name === name && contact.email === email && contact.phone === phone
    );
    if (index >= 0 && index < contactAllArray.length && !duplicate) {
        editChangeContact(name, email, phone,index, contactAllArray)
    }
}


/**
 * Clicking on the button of type submit prevents the form element from being sent.
 * The contact with the corresponding index is then deleted and a random background colour is assigned to a variable.
 * A new contact is created and inserted in the place of the deleted contact.
 * Then a class is removed and added and the initials are obtained by means of a function that is passed to a variable.
 * Two more functions are performed
 * 
 * @param {*} name 
 * @param {*} email 
 * @param {*} phone 
 * @param {*} index 
 * @param {*} contactAllArray 
 */
function editChangeContact(name, email, phone, index, contactAllArray){
    document.getElementById('editContactForm').addEventListener('submit', function(event) {
        event.preventDefault();
        contactAllArray.splice(index, 1);
        let NewColorBackground = getRandomColor()
        let newContact = {"email": email,"name": name,"phone": phone,"color": NewColorBackground};
        contactAllArray.splice(index, 0, newContact);
        localStorage.setItem('contactAllArray', JSON.stringify(contactAllArray));
        document.getElementById('EditContactIDWIn').classList.remove('Slideinright');
        document.getElementById('EditContactIDWIn').classList.add('Slideinleft');
        let initial = getInitials(name)
        contactInfoHtml(initial, name, email, phone, NewColorBackground, index)
        contactLoad() 
    });   
}


/**
 * First a function is executed that capitalizes every first letter. Then the value in the input field is updated.
 * It is ensured that at least one first name and one surname are present. 
 * 
 * @param {	} inputFieldId 
 * @param {*} originalValue 
 * @returns 
 */
function validateName(inputFieldId, originalValue) {
    const nameInput = document.getElementById(inputFieldId);
    const parentDiv = nameInput.closest(".EditWindowInput");
    function capitalizeWords(str) {
        return str.replace(/\b\w/g, function(letter) {
            return letter.toUpperCase();
        });
    }
    nameInput.value = capitalizeWords(nameInput.value);
    const nameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)+$/;
    validateBorderChange(nameInput, parentDiv, nameRegex)
}


/**
 * The email is transferred and the conditions whether it is correct or not are transmitted.
 * 
 * @param {*} inputFieldId 
 * @param {*} originalValue 
 */
function validateEmail(inputFieldId, originalValue) {
    const emailInput = document.getElementById(inputFieldId);
    const parentDiv = emailInput.closest(".EditWindowInput");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    validateBorderChange(emailInput, parentDiv, emailRegex)
}


/**
 * An event listener is added for the focus to add the + sign. The phone number is formatted before it is validated.
 * 
 * @param {*} inputFieldId 
 * @param {*} originalValue 
 * @returns 
 */
  function validatePhone(inputFieldId, originalValue) {
    const phoneInput = document.getElementById(inputFieldId);
    const parentDiv = phoneInput.closest(".EditWindowInput");
    phoneInput.addEventListener('focus', function() {
        if (!phoneInput.value.startsWith('+')) {phoneInput.value = '+';}
    });
    if (phoneInput.value.startsWith('+')) {
        phoneInput.value = formatPhoneNumber(phoneInput.value);
    }
    const phoneRegex = /^\+\d{2} \d{4} \d{3} \d{2} \d{1}$/;
    validateBorderChange(phoneInput, parentDiv, phoneRegex)
}


/**
 * The status of the input field is viewed here, whether it is empty, an invalid entry has been made or whether it has been entered correctly.
 * 
 * @param {*} NameInput 
 * @param {*} parentDiv 
 * @param {*} NameRegex 
 * @returns 
 */
function validateBorderChange(NameInput, parentDiv, NameRegex){
    if (NameInput.value.trim() === '') {
        parentDiv.style.border = "1px solid #29ABE2";
        return false;
    } else if (!NameRegex.test(NameInput.value)) {
        parentDiv.style.border = "1px solid red";
        return false;
    } else {
        parentDiv.style.border = "1px solid #29ABE2";
        return true;
    }
}


/**
 * A function is called here depending on which value is passed. If the clicked field is empty, the old value is restored.
 * 
 * @param {*} inputFieldId 
 * @param {*} originalValue 
 * @param {*} validationFunction 
 */
function validationInputAndBlur(inputFieldId,originalValue,validationFunction) {
  const inputField = document.getElementById(inputFieldId);
  applyFocusAndValidation(inputField, originalValue)
  inputField.addEventListener("input", function () {
    validationFunction(inputFieldId, originalValue);
  });
  inputField.addEventListener("blur", function () {
    if (this.value === "") {
      this.value = originalValue;
    }
    validationFunction(inputFieldId, originalValue);
  });
}


/**
 * If the field also has a focus, the border and the outline are removed. If the current value corresponds to the original value, the field is empty.
 * 
 * @param {*} inputField 
 */
function applyFocusAndValidation(inputField, originalValue){
    inputField.addEventListener("focus", function () {
        this.style.border = "none";
        this.style.outline = "none";
        if (this.value === originalValue) {
            this.value = "";
            validateName("editNameInput")
            validateEmail("editEmailInput")
            validatePhone("editPhoneInput")
        }});
}





