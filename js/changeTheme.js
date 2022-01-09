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

function open_fav_color() {
    var modal = document.getElementById("modal");
    modal.open = true;
    var template = document.getElementById("fav-color");
    template.removeAttribute("hidden");
}

function change_color() {
    //將currentColor.name更新到資料庫
    ajax({color:currentColor.name});
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