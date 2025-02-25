const taskURL = 'http://127.0.0.1:8000/api/tasks/';
let SectionTypArray = []
let SectionPrioArray = []
let SectionPrioDateArray = []
let highCount = 0;
let highIndices = [];
let inProgressCount = 0;
let awaitFeedbackCount = 0;
let doneCount = 0;
let toDoCount = 0;
let SectionTypLength = 0;
let taskAllArray = [];
initial()


function initial() {
    setTimeout(() => {
        summaryLoad()
        setTimeBasedGreeting();
        checkWidthAndExecute();
    }, 50);
}


/**
 * Data is extracted from the array stored in the local storage and stored in a variable. 
 * The variable is then run through with the help of a for loop and the section, date and name
 * is pushed into the respective array.
 * 
 */
async function summaryLoad() {
    try {
        const response = await fetch(taskURL, {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + currentLoggedUser.token,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        taskAllArray = await response.json();
    } catch (error) {
        console.error(error.message);
    } for (let item of taskAllArray) {
        SectionTypArray.push(item.section);
        SectionPrioDateArray.push(item.date);
        SectionPrioArray.push(item.prioName);
    }
    summarySectionCheck();
}


/**
 * clears the arrays and gets the user from local storage
 * 
 * @returns the user Object
 */
function clearArrays() {
    SectionTypArray = [];
    SectionPrioArray = [];
    SectionPrioDateArray = [];
}


/**
 * The current date is checked here and the appropriate text is displayed depending on the time of day.
 * 
 */
function setTimeBasedGreeting() {
    const element = document.getElementById('Timewelcome');
    const now = new Date();
    const hour = now.getHours();
    let greeting;
    if (hour >= 5 && hour < 12) {
        greeting = "Good morning,";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Good afternoon,";
    } else {
        greeting = "Good evening,";
    }
    element.textContent = greeting;
}


/**
 * Here the SectionTypArray is run through and the elements are checked to see which Section 
 * is present. The number of times an element occurs is stored in a variable. 
 * 
 */
function summarySectionCheck() {
    SectionTypArray.forEach(type => {
        switch (type) {
            case "inProgress":
                inProgressCount++;
                break;
            case "awaitFeedback":
                awaitFeedbackCount++;
                break;
        }
    });
    summarySectionCheckNext()
}


/**
 * Here the SectionTypArray is run through and the elements are checked to see which Section 
 * is present. The number of times an element occurs is stored in a variable. 
 * 
 */
function summarySectionCheckNext() {
    SectionTypArray.forEach(type => {
        switch (type) {
            case "done":
                doneCount++;
                break;
            case "toDo":
                toDoCount++;
                break;
        }
    });
    SectionTypLength = SectionTypArray.length
    summarySectionChangeText(SectionTypLength)
}


/**
 * In this function, a text is added to several IDs. The SectionPrioArray array is also checked 
 * how often the variable value contains “High”. On the other hand, a variable is used to count the number of times this is the case.
 * The index of the variable is pushed into an array.
 * 
 * @param {*} SectionTypLength 
 */
function summarySectionChangeText(SectionTypLength) {
    document.getElementById('SummaryTaskProgressCount').innerHTML = `${inProgressCount}`;
    document.getElementById('SummaryBoardCount').innerHTML = `${SectionTypLength}`;
    document.getElementById('SummaryAwaitFeedbackCount').innerHTML = `${awaitFeedbackCount}`;
    document.getElementById('SummaryToDoCount').innerHTML = `${toDoCount}`;
    document.getElementById('SummaryDoneCount').innerHTML = `${doneCount}`;
    SectionPrioArray.forEach((value, index) => {
        if (value === "Urgent") {
            highCount++;
            highIndices.push(index);
        }
        summarySectionCheckCounter(highCount)
    });
    summarySectionFilterDate(highCount)
}


/**
 * class is removed and one is added.
 * 
 * @param {*} highCount 
 */
function summarySectionCheckCounter(highCount) {
    if (highCount == 0) {
        document.getElementById('currentDate').classList.add('none')
        document.getElementById('currentDate').classList.remove('SummarySecondDate')
    }
    else {
        document.getElementById('currentDate').classList.remove('none')
        document.getElementById('currentDate').classList.add('SummarySecondDate')
    }
}


/**
 * In this function, the date values are converted and all zero values are filtered out. 
 * In addition, the dates are pushed into an array and sorted in ascending order according to the earliest date.
 * 
 * @param {*} highCount 
 */
function summarySectionFilterDate(highCount) {
    let filteredDates = highIndices
        .map(index => new Date(SectionPrioDateArray[index]))
        .filter(date => !isNaN(date.getTime()));
    filteredDates.sort((a, b) => a - b);
    if (filteredDates.length > 0) {
        summarySectionEarlyDate(filteredDates, highCount);
    }
    loginGoodMorning();
}


/**
 * The earliest date is read out here and all date values that do not match are sorted out.
 * The date is then formatted in the desired format and transferred to the corresponding id as text.
 * 
 * @param {*} filteredDates 
 * @param {*} highCount 
 */
function summarySectionEarlyDate(filteredDates, highCount) {
    const earliestDate = filteredDates[0];
    document.getElementById('SummaryCount').innerHTML = `${highCount}`
    const dateToDisplay = new Date(earliestDate);
    if (!isNaN(dateToDisplay)) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateToDisplay.toLocaleDateString('de-DE', options);
        document.getElementById('currentDate').textContent = formattedDate;
    } else {
        console.error('Ungültiges Datum:', earliestDate);
    }
}


/**
 * First of all, it is checked whether the parameter passed has the appropriate format; if this is not the case, null is returned.
 * The date is then split using “.” or “/”. It is then sorted according to the correct order of day, month, year and returned.
 * @param {*} dateString 
 * @returns 
 */
function convertDateFormat(dateString) {
    if (!dateString || !dateString.includes(".") && !dateString.includes("/")) {
        return null;
    }
    const parts = dateString.includes(".") ? dateString.split(".") : dateString.split("/");
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
}


/**
 * If you hover over the corresponding button, the respective id is passed as a parameter and the icon is replaced at this point.
 * 
 * @param {*} id 
 */
function toDoChangeOn(id) {
    if (id == 'ChangeIcon1') {
        const imgElement = document.querySelector(`#${id} img`);
        imgElement.src = "../assets/icons/Frame 59.png";
    }
    if (id == 'ChangeIcon2') {
        const imgElement = document.querySelector(`#${id} img`);
        imgElement.src = "../assets/icons/checkCircle.png";
    }
}


/**
 * If you hover over the corresponding button, the respective id is passed as a parameter and the icon is replaced at this point.
 * 
 * @param {*} id 
 */
function toDoChangeOut(id) {
    if (id == 'ChangeIcon1') {
        const imgElement = document.querySelector(`#${id} img`);
        imgElement.src = "../assets/icons/editCircleDark.png";
    }
    if (id == 'ChangeIcon2') {
        const imgElement = document.querySelector(`#${id} img`);
        imgElement.src = "../assets/icons/checkCircleDark.png";
    }
}


/**
 * The current name of the user is read from the local storage and assigned to the id as text.
 * 
 */
function loginGoodMorning() {
    if (currentLoggedUser) {
        GoodMorningName = currentLoggedUser.first_name + ' ' + currentLoggedUser.last_name;
    }
    document.getElementById('UserLogGoodMorning').innerHTML = `${GoodMorningName}`;
}


/**
 * If the px width is smaller than 1400px, the greeting is executed first and after 2 sec 
 * you will be redirected to the Summary Content.
 * 
 */
function checkWidthAndExecute() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth < 1400) {
        setTimeout(() => {
            document.getElementById('SummaryRightSectionNone').style.display = 'none'
            document.getElementById('SummaryheaderheadlineNone').style.display = 'flex'
            document.getElementById('SummaryLeftToDoNone').style.display = 'flex'
        }, 2000);
    }
    else {
        document.getElementById('SummaryRightSectionNone').style.display = 'flex'
    }

}


window.addEventListener('resize', checkWidthAndExecute);