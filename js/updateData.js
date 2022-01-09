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