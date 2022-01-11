function play() {

    openRule.style.display = "none";
    document.getElementById("rules").style.display = "none";
    startGame.style.display = "none";
    document.getElementById("gameover").classList.add("display-none")
    document.getElementById("score").classList.add("display-none")
    document.getElementById("bestScore").classList.add("display-none")

    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");

    // 基礎變數設定
    var gap = 100; // 水管之間的通道長度
    var constant;
    var attack;
    var Hp = 100; // 總血量

    // 小鳥的初始座標
    var bX = 20;
    var bY = 150;

    //  重力
    var gravity = 1.0;

    var alive = true;

    const score= {
        best : parseInt(localStorage.getItem("best")) || 0,
        value : 0
    }
    
    // 載入圖片
    var bird = new Image();
    var birdsprite = new Image();
    var boom = new Image();
    var bg = new Image();
    var fg = new Image();
    var pipeNorth = new Image();
    var pipeSouth = new Image();
    var life = new Image();

    bird.src = "images/bird.png";
    birdsprite.src = "images/birdsprite.png";
    boom.src = "images/boom.png";
    bg.src = "images/bg.png";
    fg.src = "images/fg.png";
    pipeNorth.src = "images/pipeNorth.png";
    pipeSouth.src = "images/pipeSouth.png";
    life.src = "images/life.png";


    // 載入音效
    var fly = new Audio();
    var scor = new Audio();
    var hit = new Audio();
    var bgm = new Audio();

    fly.src = "sounds/fly.mp3";
    scor.src = "sounds/score.mp3";
    hit.src = "sounds/hit.wav";
    bgm.src = "sounds/bgm.mp3";

    bgm.loop = true;// 設定循環撥放

    // 拍動翅膀圖片切割設定
    let bcols = 1;
    let brows = 4;
    let bspriteWidth = 36 / bcols; // 圖片寬度除格數
    let bspriteHeight = 104 / brows; // 圖片高度除格數

    // 墜毀圖片切割設定
    let dcols = 6;
    let drows = 1;
    let dspriteWidth = 762 / dcols; // 圖片寬度除格數
    let dspriteHeight = 127 / drows; // 圖片高度除格數
      

    // 圖片切割的起始點
    let srcX =0;
    let srcY =0;

    // 控制速度用的
    let btotalFrames = 4;
    let dtotalFrames = 6;
    let currentFrame = 0;
    let frameDrawn =0;

    // 水管初始座標
    var pipe = [];

    pipe[0] = {
        x: cvs.width,
        y: 0
    };

    // 生命值初始座標
    var lifes = [];

    lifes[0] = {
        x: cvs.width + 110,
        y: 0
    };

    // 按下按鍵
    document.addEventListener("keydown", moveUp);
    
    function moveUp(e){
        var x = e.keyCode
        if(x == 38){
            bY -= 35;
            fly.play();
        }
    }

    // 繪製畫布
    function draw() {

        ctx.drawImage(bg, 0, 0);
        bgm.play();

        // 繪製水管
        for (var i = 0; i < pipe.length; i++) {

            constant = pipeNorth.height + gap;
            ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
            ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

            pipe[i].x = pipe[i].x - 1;

            if (pipe[i].x == 480) {
                pipe.push({
                    x: cvs.width,
                    y: Math.floor(Math.random() * (0 - (-190) + 1)) + (-190)
                });
            }

            // 水管碰撞偵測
            if (bX + bird.width >= pipe[i].x 
                && bX <= pipe[i].x + pipeNorth.width 
                && (bY <= pipe[i].y + pipeNorth.height 
                    || bY + bird.height >= pipe[i].y + constant) 
                    || bY + bird.height >= cvs.height - fg.height 
                    || bY <= 0) {
                alive = false;
            }

            if (pipe[i].x == 5) {
                score.value++;
                scor.play();
            }
        }

        // 繪製生命值
        for (var i = 0; i < lifes.length; i++) {

            attack = 10; // 沒吃到生命值扣的血量

            ctx.drawImage(life, lifes[i].x, lifes[i].y);

            lifes[i].x = lifes[i].x - 1;

            if (lifes[i].x == 590) {
                lifes.push({
                    x: cvs.width + 110,
                    y: Math.floor(Math.random() * (350 - 40 + 1)) + 40
                });
            }

            // 生命值碰撞偵測
            // 生命值消失
            if (bX + bird.width > lifes[i].x && //
                bX < lifes[i].x + life.width &&
                bY < lifes[i].y + life.height &&
                bY + bird.height > lifes[i].y) {
                lifes.splice(i, 1)
            }

            // 沒碰撞到生命值，生命值離開畫面造成總血量減少
            if (lifes[i].x == 5) {
                Hp -= attack;
            }

            if (Hp == 0) {
                alive = false;
            }
        }

        if (alive == true){
            ctx.drawImage(fg, 0, cvs.height - fg.height);

            // 小鳥拍動翅膀
            currentFrame = currentFrame % btotalFrames;
            srcY = currentFrame * bspriteHeight;

            ctx.drawImage(birdsprite, srcX, srcY, 
                bspriteWidth, bspriteHeight, bX, bY, bspriteWidth, bspriteHeight);

            frameDrawn++;
            if(frameDrawn >= 10){
                currentFrame++;
                frameDrawn = 0;
            }

            bY += gravity;

            showScore();

            ctx.fillStyle = "#000";
            ctx.font = "20px Anton";
            ctx.fillText("HP : " + Hp + "%", 200, cvs.height - 20);

            requestAnimationFrame(draw);
        }

        // 遊戲結束
        else if (alive == false) {
            ctx.drawImage(fg, 0, cvs.height - fg.height);
            bgm.pause();
            frameDrawn = 0;

            // 小鳥墜毀
            currentFrame = currentFrame % dtotalFrames;
            srcY = currentFrame * dspriteHeight;

            ctx.drawImage(boom, srcX, srcY, 
                dspriteWidth, dspriteHeight, bX, bY, dspriteWidth, dspriteHeight);

            frameDrawn++;
            if(frameDrawn >= 10){
                currentFrame++;
                frameDrawn = 0;
            }

            startGame.style.display = "none";
            startGame.innerHTML = "<p>RETRY</p>";
            setTimeout(wait, 10);

            document.getElementById("score").innerHTML = "Score: " + score.value;
            document.getElementById("bestScore").innerHTML = "Best Score: " + score.best;

            document.getElementById("gameover").classList.remove("display-none")
            document.getElementById("score").classList.remove("display-none")
            document.getElementById("bestScore").classList.remove("display-none")
            
            hit.play();
            // frameDrawn = 0;
        }
    }
    
    function showScore() {
        ctx.fillStyle = "#000";
        ctx.font = "20px Anton";
        ctx.fillText("Score : " + score.value, 10, cvs.height - 20);

        score.best = Math.max(score.value, score.best);
        localStorage.setItem("best", score.best);
    }

    draw();
}

function rule() {
    startGame.style.display = "none";
    openRule.style.display = "none";
    setTimeout(wait, 10);

    document.getElementById("rules").style.display = "block";
}

function wait() {
    startGame.style.display = "block";
}

var startGame = document.getElementById("startButton");
var openRule = document.getElementById("ruleButton");

startGame.addEventListener("click", play);
openRule.addEventListener("click", rule);