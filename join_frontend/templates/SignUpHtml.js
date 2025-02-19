function singUpWindowHtml(){
    document.getElementById('SignUpWindow').innerHTML=` 
    <header class="SingUpheader">
        <div class="SignUpTextLine">
          <span class="SignUpTextStyle">Sign up</span>
          <div class="LoginXLineStyle"></div>
        </div>
    </header>
    <form id="signUpForm">
        <section class="SignUpInputfields">
            <div id="SignInputIconfirst" class="SignInputIcon">
                <input id="nameInput" class="SignUpInput" type="text" placeholder="First and Last Name" pattern="^[a-zA-Z]+(?: [a-zA-Z]+)+$" title="Please enter your first and last name, separated by a space!" required>
                <img class="LoginInputfieldIcon" src="./assets/icons/person.png">
            </div>
            <div id="SignInputIconsecond" class="SignInputIcon">
                <input id="emailInput" class="SignUpInput" title="Enter your email the @ symbol is mandatory!" required type="text" placeholder="Email">
                <img class="LoginInputfieldIcon" src="./assets/icons/mail.png">
            </div>
            <div id="SignInputIconthird" class="SignInputIcon">
                <input id="passwordInput" title="Password with 8 characters, one capital letter, one number and one special character!" required class="SignUpInput" type="password" placeholder="Password">
                <img id="toggleIcon1" onclick="togglePasswordVisibility('toggleIcon1', 'passwordInput')" class="LoginInputfieldIconLock" src="./assets/icons/lock.png">
            </div>
            <div id="SignInputIconfourth" class="SignInputIcon">
                <input id="confirmPasswordInput" title="Repeat your password!" required  class="SignUpInput" type="password" placeholder="Confirm Password">
                <img id="toggleIcon2" onclick="togglePasswordVisibility('toggleIcon2', 'confirmPasswordInput')"  class="LoginInputfieldIconLock" src="./assets/icons/lock.png">
            </div>
            <label class="custom-checkbox">
                <input id="checkboxInput" class="LoginCheckbox" type="checkbox">
                <span class="checkmark"></span>
                <div class="SignUpPrivacyPolicy">
                    <span class="SignUpAcceptText">I accept the</span>
                    <a class="SignUpPrivacyLegalText" href="./htmls/privacyPolicy.html">Privacy policy</a>
                </div>
            </label>
        </section>
    </form>
    <button onclick="submitToFirebase(event)" id="SignUpButtondisabled" class="SignUpButton">Sign up</button>
    <button onclick="backToLogin()" class="SignUpLeftArrow">
        <img class="SignUpLeftarrowAStyle" src="./assets/icons/arrowLeft.png">
    </button>
    `;
}


function userInformationPopUpHTML(text){
    document.getElementById('UserInfoPopUp').innerHTML=`
    <div class="UserInformation">
        <div id="UserInformationText">${text}</div>
    </div>
    `; 
}