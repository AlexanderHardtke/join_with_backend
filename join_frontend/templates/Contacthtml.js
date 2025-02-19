function  contactInfoHtml(initials, name, email, phone, buttonColor, index){
    document.getElementById('Contenttext').innerHTML= /*html*/`
      <div id="ContactfieldInfodiv" class="ContactfieldInfo">
            <div class="ContactCircleName">
                <header class="ContactSection">
                    <div class="CircleInitial" style="background-color: ${buttonColor}">
                        ${initials}
                    </div>
                </header>
                <section class="NameEditDelete">
                    <div class="ContactName">${name}</div>
                    <div id="ContactEditDeleteID"  class="ContactEditDelete">
                        <button onclick="editNewContact('${initials}', '${name}', '${email}', '${phone}', '${buttonColor}', '${index}'), editContactShowWindow()" class="ContactEditButton"> 
                            <div id="ContactEditChange1" class="ContactEditChangeClass1">
                                 <img class="ContactDeleteEdit" src="../assets/icons/edit.png">
                                  <span id="ContactDeleteTextHover" class="ContactDeleteEditText">Edit</span>
                            </div>
                           
                        </button>
                        <button class="ContactDeleteButton" onclick="deleteContactList(${index})">   
                            <div id="ContactDeleteChange2" class="ContactEditChangeClass1">
                                <img class="ContactDeleteEdit" src="../assets/icons/delete.png">
                                <span id="ContactDeleteEditHover" class="ContactDeleteEditText">Delete</span>
                            </div>
                            
                        </button>
                    </div>
                </section>
            </div>  
            <div class="ContactInformationBorder">
                <span class="ContactInformationText">Contact Information</span>
            </div>
            <div class="ContactEmailPhone">
                <div class="ContactInfoContainer">
                    <span class="ContactEmailText1">Email</span>
                    <span class="ContactEmailText2">${email}</span>
                </div>
           
                <div class="ContactInfoContainer">
                    <span class="ContactEmailText1">Phone</span>
                    <span class="ContactPhoneText2">${phone}</span>
                </div>
            </div>
        </div>
         <div onclick="protect(event)" id="MenuEditDeleteOptionsID" class="none">
            <button onclick="editNewContact('${initials}', '${name}', '${email}', '${phone}', '${buttonColor}', '${index}'), editContactShowWindow()" class="ContactEditButton"> 
                <div id="ContactEditChange3" class="ContactEditChangeClass1">
                    <img class="ContactDeleteEdit" src="../assets/icons/edit.png">
                    <span class="ContactDeleteEditText">Edit</span>
                </div>
                
            </button>
             <button class="ContactDeleteButton" onclick="deleteContactList(${index})">   
                <div id="ContactDeleteChange4" class="ContactEditChangeClass1">
                    <img class="ContactDeleteEdit" src="../assets/icons/delete.png">
                    <span class="ContactDeleteEditText">Delete</span>
                </div>
                
            </button>
        </div>
    `;
}


function editNewContactHtml(initials, name, email, phone, buttonColor, index) {
    document.getElementById('EditContactIDWIn').innerHTML = /*html*/`
    <div class="EditWindowNew" onclick="protect(event)">
        <section class="EditWindowLeftArea">
            <div class="EditLeftTopStyle">
                <img class="EditJoinLogo" src="../assets/icons/logoWhite.png">
                <div class="EditWindowAddText1Con">
                    <span id="EditWindowAddText1Change" class="EditWindowAddText1">Edit contact</span>
                </div>
                <span id="EditWindowAddText2Change" class="EditWindowAddText2"></span>
                <div class="EditWindowAddxlineOutStyle"><div class="EditWindowAddxline"></div></div>
                <button id="ChangeClosebutton"  onclick="clickContactBack()" class="EditCloseHeaderSmall">
                    <img class="ImgCloseStyle" src="../assets/icons/close.png">
                </button>
            </div>
        </section>
        <section class="EditWindowRightArea">
            <section class="CircleInputstyle">
                <div class="EditCircleStyle" id="EditCircleStyleColor" style="background: ${buttonColor}">
                    <div class="EditCircleInitials" id="EditCircleInitialsID">${initials}</div>
                </div>
                <form id="editContactForm">
                    <div class="EditwindowInputDeleteSave">
                        <div class="EditwindowInputfield">
                            <div class="EditWindowInput">
                                <input id="editNameInput" placeholder="First and Last Name" pattern="^[a-zA-Z]+(?: [a-zA-Z]+)+$" title="Please enter your first and last name, separated by a space." required class="InputfieldEditStyle" value="${name}" type="text">
                                <div>
                                    <img class="InputfieldIcon" src="../assets/icons/person.png">
                                </div>
                            </div>
                            <div class="EditWindowInput">
                                <input id="editEmailInput" required class="InputfieldEditStyle" value="${email}" type="email" placeholder="Email">
                                <div>
                                    <img class="InputfieldIcon" src="../assets/icons/mail.png">
                                </div>
                            </div>
                            <div class="EditWindowInput">
                                <input id="editPhoneInput" pattern="^\\+\\d{2}\\s\\d{4}\\s\\d{3}\\s\\d{2}\\s\\d{1}$" title="Please enter a valid phone number in the format +XX 1111 111 11" required class="InputfieldEditStyle" value="${phone}" type="tel" placeholder="Phone">
                                <div> 
                                    <img class="InputfieldIcon" src="../assets/icons/call.png">
                                </div>
                            </div>
                        </div>
                        <div class="EditWindowDeleteSave" id="EditWindowDeleteSaveID1">
                            <button id="EditWindowDeleteButtonID" onclick="deleteContactList(${index}); editContactCloseWindow();" type="button" class="EditWindowDeleteButton">Delete</button>
                            <button typ="submit" id="EditNewContactButtonID" onclick="editNewContactCheckInput(${index}), clickContactBack()" class="EditWindowSaveButton">Save <img class="EditSaveCheck" src="../assets/icons/checkWhite.png"></button>
                        </div>
                        <div id="EditWindowDeleteSaveID2"></div>
                    </div>
                </form>
            </section>   
        </section>
    </div>
    `;
    editNewContactSave(name, email, phone, index);
}
 

function editNewContactChangeHTML(){
    document.getElementById('EditWindowDeleteSaveID2').innerHTML=/*html*/`
    <button type="button" onclick="editContactCloseWindow()" id="CloseButtonID" type="button" class="EditWindowDeleteButton2">Cancel 
        <div class="XButtonCloseStyle" id="XCloseID">
            <img  class="ImgCloseStyle2" src="../assets/icons/close.png">
        </div>
    </button>
    <button type="button" id="CreateContactButtonID" onclick="createNewContact()" class="EditWindowSaveButton">Create contact <img class="EditSaveCheck" src="../assets/icons/checkWhite.png"></button>
    `;
}


function contactInfoHeadlineHtml(){
    document.getElementById('ContactsInfoSection').innerHTML=/*html*/`
    <section id="RightsectionheadlineID" class="Rightsectionheadline">
        <span class="Contactheadline">Contacts</span>
        <div class="Contactyline"></div>
        <span class="Contactsmallheadline">Better with a team</span>
        <div class="ContactNewyline"></div>
    </section>
    <div id="Contenttext"></div>
    <div onclick="protect(event)" class="ArrowstylePosition">
        <button id="ArrowBackClick" onclick="goBackToContacts()" class="none">
            <img class="StyleBackarrow" src="../assets/icons/arrowLeft.png">
        </button>
    </div>
    `;
}


function contactInformationPopUpHTML(text){
    document.getElementById('ContactInfoPopUp').innerHTML=/*html*/`
    <div class="ContactInformation">
        <div >${text}</div>
    </div>
    `; 
}
