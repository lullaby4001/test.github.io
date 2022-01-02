var currentColor = { name: "blue", color: "#144674", off_color: "#48739b" };
var color_data = [{
    name: 'blue',
    color_code: '#144674',
    off_color_code: '#48739b'
}, {
    name: 'red',
    color_code: '#b27777',
    off_color_code: '#9e4646'
}, {
    name: 'purple',
    color_code: '#681752',
    off_color_code: '#913779'
}, {
    name: 'green',
    color_code: '#223e36',
    off_color_code: '#3a6b5d'
}, {
    name: 'orange',
    color_code: '#e8b004',
    off_color_code: '#b18913'
}, {
    name: 'deep-orange',
    color_code: '#f9d17b',
    off_color_code: '#daad4d'
}, {
    name: 'baby-blue',
    color_code: '#66a9c9',
    off_color_code: '#3f89ac'
}, {
    name: 'cerise',
    color_code: '#e3adb9',
    off_color_code: '#c48c98'
}, {
    name: 'lime',
    color_code: '#869d9d',
    off_color_code: '#637c7c'
}, {
    name: 'teal',
    color_code: '#7a7374',
    off_color_code: '#5e5a5a'
}, {
    name: 'pink',
    color_code: '#8076a3',
    off_color_code: '#64598d'
}, {
    name: 'black',
    color_code: '#685e48',
    off_color_code: '#9e8e6c'
}];
var postIts = []; //記事陣列，用來放置月曆中的記事物件資料

function getDayOfWeekName(day) {
    if (day == 0) return "Sunday";
    if (day == 1) return "Monday";
    if (day == 2) return "Tuesday";
    if (day == 3) return "Wednesday";
    if (day == 4) return "Thursday";
    if (day == 5) return "Friday";
    if (day == 6) return "Satday";
}

function getMonthName(month) {
    if (month == 0) return "January";
    if (month == 1) return "Feburary";
    if (month == 2) return "March";
    if (month == 3) return "April";
    if (month == 4) return "May";
    if (month == 5) return "June";
    if (month == 6) return "July";
    if (month == 7) return "August";
    if (month == 8) return "September";
    if (month == 9) return "October";
    if (month == 10) return "November";
    if (month == 11) return "December";
}

function getOrdinary(date) {
    if (date == 1 || date == 21 || date == 31) return date + "<sup>st</sup>";
    if (date == 2 || date == 22) return date + "<sup>nd</sup>";
    if (date == 3 || date == 23) return date + "<sup>rd</sup>";
    return date + "<sup>th</sup>";
}
var thisMonth, thisYear; //宣告為全域變數，使得這2個變數可以被所有的函式直接使用。
function updateCalendar() {
    var today = new Date();
    document.getElementById("cur-year").innerHTML = today.getFullYear();
    document.getElementById("cur-month").innerHTML = getMonthName(today.getMonth());
    document.getElementById("cur-date").innerHTML = getOrdinary(today.getDate());
    document.getElementById("cur-day").innerHTML = getDayOfWeekName(today.getDay());

    thisMonth = today.getMonth();
    // console.log(thisMonth);
    thisYear = today.getFullYear();
    fillInMonth(thisYear, thisMonth);
    // fillInMonth(2018, 3);
}

//記事圖示與ToolTip處理
function appendSpriteToCellAndTooltip(uid, elem) {
    for (let i = 0; i < postIts.length; i++) {
        if (uid == postIts[i].id) {
            elem.innerHTML += `<img src='images/note${postIts[i].note_num}.png' alt='A post-it note'>`;
            elem.classList.add("tooltip");
            elem.innerHTML += `<span>${postIts[i].note}</span>`;
        }
    }
}

function getUID(month, year, day) {
    if (month == 0) { //上個月減1，進到去年份
        month = 12;
        year--;
    }
    if (month == 13) { //下個月加1，進到下年份
        month = 1;
        year++;
    }
    // console.log(month.toString() + year.toString() + day.toString())
    return year.toString() + month.toString() + day.toString();
}

function fillInMonth(thisYear, thisMonth) {
    document.getElementById("cal-year").innerHTML = thisYear;
    document.getElementById("cal-month").innerHTML = getMonthName(thisMonth);
    //將月曆表格從0填到41
    let days = document.getElementsByTagName("td"); //將td標籤放入days物件集合中
    var today = new Date();
    console.log(days)
    var firstDateOfThisMonth = new Date(thisYear, thisMonth, 1); //建立今年今月1日的 Date日期物件
    var firstDateDayOfThisMonth = firstDateOfThisMonth.getDay(); //取得今年今月1日是禮拜幾
    // console.log(firstDateDayOfThisMonth);
    var monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //儲存每月的天數，其中2月為28或29
    if ((thisYear % 4 == 0 && thisYear % 100 != 0) || (thisYear % 400 == 0)) monthDays[1] = 29; //若是閏年，2月設為29日

    for (let i = 0; i < days.length; i++) { //清除表格的class設置
        if (days[i].classList.contains("color")) days[i].classList.remove("color");
        if (days[i].classList.contains("prev-month-last-day")) days[i].classList.remove("prev-month-last-day"); //框線的處理
    }

    //當月
    for (var i = 1; i <= monthDays[thisMonth]; i++) { //填今月日期在TD格子上，從今年今月1日是禮拜幾開始填1~今月天數
        days[firstDateDayOfThisMonth + i - 1].innerHTML = i;
        let uid = getUID(thisMonth, thisYear, i);
        days[firstDateDayOfThisMonth + i - 1].setAttribute("data-uid", uid);
        appendSpriteToCellAndTooltip(uid, days[firstDateDayOfThisMonth + i - 1]);

    }

    //填上個月日期
    if (firstDateDayOfThisMonth > 0) days[firstDateDayOfThisMonth - 1].classList.add("prev-month-last-day"); //框線的處理，上個月的最後1天

    var lastMonth = thisMonth - 1;
    if (lastMonth == -1) lastMonth = 11; //跨到上年度
    for (var i = firstDateDayOfThisMonth - 1, d = monthDays[lastMonth]; i >= 0; i--, d--) {
        // console.log(i + "    ,,,   " + d);
        days[i].innerHTML = d;
        let uid = getUID(thisMonth - 1, thisYear, d);
        days[i].setAttribute("data-uid", uid);
        appendSpriteToCellAndTooltip(uid, days[i]);
        days[i].classList.add("color");
    }

    //填下個月日期
    for (var i = firstDateDayOfThisMonth + monthDays[thisMonth], d = 1; i <= 41; i++, d++) {
        // console.log(i + "    ,,,   " + d);
        days[i].innerHTML = d;
        let uid = getUID(thisMonth + 1, thisYear, d);
        days[i].setAttribute("data-uid", uid);
        appendSpriteToCellAndTooltip(uid, days[i]);
        days[i].classList.add("color");
    }

    // console.log(document.getElementsByTagName('tbody')[0].innerHTML);

    //處理今日元素表格的顯著背景設定
    if (document.getElementById("current-day")) {
        document.getElementById("current-day").removeAttribute("id");
    }
    var thisDate = today.getDate();
    if (thisYear == today.getFullYear() && thisMonth == today.getMonth()) { //僅在當年當月進行今天日期的顯著標示(灰色)
        days[firstDateDayOfThisMonth + thisDate - 1].setAttribute("id", "current-day");
    }
    change_color();
}


document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
            previousMonth();
            break;
        case 39:
            nextMonth();
            break;
    }
};

function previousMonth() {
    // console.log("Prev...");
    thisMonth--;
    if (thisMonth == -1) {
        thisMonth = 11;
        thisYear--;
    }
    fillInMonth(thisYear, thisMonth);
}

function nextMonth() {
    // console.log("Next...");
    thisMonth++;
    if (thisMonth == 12) {
        thisMonth = 0;
        thisYear++;
    }
    fillInMonth(thisYear, thisMonth);
}


function addCheckMark(color_name) {
    currentColor.name = color_name; //將勾選的色彩名稱color_name指定給全域變數currentColorName，以便在changeColor方法裏使用，來設定整個主題的色彩。

    //清除/移除類別有"checkmark"的元素，也就是清除掉勾選的顯示
    var checkmarks = document.getElementsByClassName("checkmark");
    for (let i = 0; i < checkmarks.length; i++) {
        checkmarks[i].parentNode.removeChild(checkmarks[i]);
    }

    var colorPreviews = document.getElementsByClassName("color-preview");
    for (let i = 0; i < colorPreviews.length; i++) {
        if (colorPreviews[i].id == color_name) {
            console.log(colorPreviews[i].id + "," + color_name)
            colorPreviews[i].innerHTML = "<i class='fas fa-check checkmark'></i>";
        }
    }
}

function open_fav_color() {
    var modal = document.getElementById("modal");
    modal.open = true;
    var template = document.getElementById("fav-color");
    template.removeAttribute("hidden");
}

function change_color() {
    //第1步：先找出勾選色彩所設定的色碼
    color_data.forEach(function(arr_data) { //陣列的走訪，每走訪一個陣列元素，帶出的元素以arr_data變數呈現(arr_data我們自取的名稱)
        if (currentColor.name == arr_data.name) { //找到color_data陣列中符合的色彩，
            currentColor.color = arr_data.color_code;
            currentColor.off_color = arr_data.off_color_code;
        }
    });
    var elements;
    //先清除掉所有的style設置(td)
    elements = document.getElementsByTagName("td");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style = null;
    }
    //改變目前的色彩設置
    elements = document.getElementsByClassName("color");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = currentColor.color;
    }
    elements = document.getElementsByClassName("border-color");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.borderColor = currentColor.color;
    }
    elements = document.getElementsByClassName("off-color");
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.color = currentColor.off_color;
    }
    //關閉對話方塊
    var modal = document.getElementById("modal");
    modal.open = false;
    var template = document.getElementById("fav-color");
    template.setAttribute("hidden", "hidden");
}