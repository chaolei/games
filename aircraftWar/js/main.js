var score = 0, challenger, enemyNum=0, enemyMaxNum=50, enemyBoss, enemyBullets = [], beatAudio, bgAudio;
var main = {
    init: function(){
        beatAudio = document.querySelector(".beat");
        bgAudio = document.querySelector(".bgAudio")
        this.addListner();
    },
    start: function(){
        bgAudio.currentTime = 0;
        bgAudio.play();
        enemyNum = 0;
        score = 0;
        var node = document.querySelector(".winner");
        if(node) {
            node.querySelectorAll("p")[1].innerText = "Score: " + score;
        }
        enemyBullets = [];
        challengerBullets = [];        
        var bg = document.querySelector(".lang-bg");
        bg.style.top = "-300%";
        bg.setAttribute("class", "lang-bg go");
        challenger = new Challenger();
        var enemy1 = new Enemy();
        var enemy2 = new Enemy();
    },
    loadEnemy: function(){
        var enemy = new Enemy();
    },
    loadChallenger: function(){
        if(challenger.canMove) return ;
        challenger = null;    
        challenger = new Challenger();
        enemyBullets = [];
        challengerBullets = [];
    },
    showBigBoom: function(x,y){
        var boom = document.createElement("div");
        boom.setAttribute("class", "bigboom");
        boom.style.left = x+50 + "px";
        boom.style.top = y+40 + "px";
        document.querySelector(".land").appendChild(boom);
        setTimeout(function(){
            boom.remove();
            main.showWin();
        },600);
    },
    showBoom: function(x,y){
        var boom = document.createElement("div");
        boom.setAttribute("class", "boom");
        boom.style.left = x-15 + "px";
        boom.style.top = y-20 + "px";
        document.querySelector(".land").appendChild(boom);
        setTimeout(function(){
            boom.remove();
        },400);
    },
    showWin: function(){
        bgAudio.pause();
        var _this = this;
        var node = document.querySelector(".winner");
        challenger.destory();
        challenger = null;
        enemyBoss = null;

        if(node) {
            node.setAttribute("class", "winner");
            node.querySelectorAll("p")[1].innerText = "Score: " + score;
            return ;
        }
        
        var fragment = document.createDocumentFragment();
        var winpanel = document.createElement("div");
        winpanel.setAttribute("class", "winner");

        var winp = document.createElement("p");
        var txt = document.createTextNode("Winner");
        winp.appendChild(txt);

        var winp2 = document.createElement("p");
        var txt2 = document.createTextNode("Score: "+score);
        winp2.appendChild(txt2);

        var btn = document.createElement("span");
        var txt = document.createTextNode("Restart");
        btn.appendChild(txt);

        winpanel.appendChild(winp);
        winpanel.appendChild(winp2);
        winpanel.appendChild(btn);
        fragment.appendChild(winpanel);

        document.querySelector(".land").appendChild(fragment);

        btn.addEventListener("click", function(){
            winpanel.setAttribute("class", "winner hide");
            _this.start();
        });
    },
    addListner: function(){
        var _this = this;
        var startbtn = document.querySelector(".start-game");
        startbtn.addEventListener("click", function(){
            startbtn.setAttribute("class", "start-game hide");
            _this.start();
        });
    }
}
main.init();