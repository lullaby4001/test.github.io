updateCalendar();
//current 目前點擊的日期
var currentPostItID = 0; //目前的記事ID
var newCurrentPostIt = false; //目前的記事是否為新？也就是：目前點選的日期尚未有任何的記事資料
var currentPostItIndex = 0; //目前的記事在postIts陣列中的位置索引

function openMakeNote() {
    var modal = document.getElementById("modal");
    modal.open = true;
    var template = document.getElementById("make-note");
    template.removeAttribute("hidden");
    document.getElementById("edit-post-it").focus(); //游標跳至文字輸入方塊中, 解決autofocus無作用的問題

    if (!newCurrentPostIt) {
        document.getElementById("edit-post-it").value = postIts[currentPostItIndex].note;
    }
}

function closeMakeNote() {
    //關閉對話方塊
    var modal = document.getElementById("modal");
    modal.open = false;
    var template = document.getElementById("make-note");
    template.setAttribute("hidden", "hidden");
}

function dayClicked(elm) {
    console.log(elm.dataset.uid)
    currentPostItID = elm.dataset.uid; //目前的記事ID為所點擊的日期表格上的uid
    currentDayHasNote(currentPostItID); //判斷目前點擊的日期是否有記事資料
    if (newCurrentPostIt == false) document.getElementById("edit-post-it").value = postIts[currentPostItIndex].note;
    openMakeNote();
}


function currentDayHasNote(uid) { //測試特定UID是否已經有記事
    for (var i = 0; i < postIts.length; i++) {
        if (postIts[i].id == uid) {
            newCurrentPostIt = false;
            currentPostItIndex = i;
            return;
        }
    }
    newCurrentPostIt = true;
}

function getRandom(min, max) { //傳回介於min與max間的亂數值
    return Math.floor(Math.random() * (max - min)) + min;
}