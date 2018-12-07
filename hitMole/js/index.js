var WinWidth = window.innerWidth, WinHeight = window.innerHeight, MapWidth = document.querySelector(".game-map").offsetWidth;
var Game = {
    mouseList: [],

    holes:[
        {
            x:145, y:247
        },
        {
            x:331, y:249
        },
        {
            x:530, y:259
        },
        {
            x:116, y:344
        },
        {
            x:334, y:344
        },
        {
            x:532, y:340
        },
        {
            x:110, y:440 
        },
        {
            x:335, y:444
        },
        {
            x:554, y:442
        }
    ],
    _init: function(){
        this.addListener();
    },
    showHummer: function(pos){
        var hummar = document.querySelector(".hummar");
        if(WinWidth == MapWidth){
            hummar.style.left = (pos.x / WinWidth * 100) +"%";
        }else{
            var tw = (WinWidth - MapWidth) / 2;
            var lx = pos.x - tw;
            hummar.style.left = (lx / MapWidth * 100) +"%";       
        }
        hummar.style.top = (pos.y / WinHeight * 100) +"%";
    },
    showHummerAni: function(pos){
        if(Game.clickFlag) return;
        Game.clickFlag = true;
        var hummar = document.querySelector(".hummar");
        this.showHummer(pos);
        hummar.setAttribute("class", "hummar hit");
        setTimeout(function(){
            hummar.setAttribute("class", "hummar");
            Game.clickFlag = false;
        }, 200);
    },
    checkHitStart: function(pos){
        var start = document.querySelector(".startbtn");
        var wrap = document.querySelector(".wrap");
        var map = document.querySelector(".game-map");

        var sleft = start.offsetLeft-(start.offsetWidth/2);
        var wleft = wrap.offsetLeft-(wrap.offsetWidth/2);
        var mleft = map.offsetLeft-(map.offsetWidth/2);
        var stop = start.offsetTop-(start.offsetHeight/2);
        var wtop = wrap.offsetTop;

        var left = sleft + wleft + mleft;
        var top = wtop + stop;
        if((pos.x > left && pos.x < left+start.offsetWidth) && (pos.y > top && pos.y < top+start.offsetHeight)){
            document.querySelector(".wrap").setAttribute("class", "wrap hide");
            this.start();
        }
    },
    checkHit: function(pos) {
        console.log(pos);
    },
    addListener: function(){
        var _this = this;
        var start = document.querySelector(".startbtn");
        var map = document.querySelector(".game-map");
        map.addEventListener("click", function(e){
            var pos = {x: e.clientX, y: e.clientY};
            _this.showHummerAni(pos);
            if(_this.startFlag){
                _this.checkHit(pos);
            }else{
                _this.checkHitStart(pos);
            }
        });
        map.addEventListener("mousemove", function(e){
            _this.showHummer({x: e.clientX, y: e.clientY});
        });
        window.onresize = function(){
            WinWidth = window.innerWidth;
            MapWidth = document.querySelector(".game-map").offsetWidth;
            this.console.log(WinWidth);
        };
        start.addEventListener("click", function(e){
            document.querySelector(".wrap").setAttribute("class", "wrap hide");
            _this.start();
        });
    },
    start: function(){
        this.startFlag = true;
        this.showMouse();
    },
    showMouse: function(){
        var mouse = new Mouse();
        mouse.show();        
    }
}
var Mouse = function(pos){
    var node = document.createElement("div");
    var num = Game.mouseList.length;
    var pos = Game.holes[Math.floor(Math.random()*9)];

    node.setAttribute("class", "mouse");
    node.style.left = (pos.x/750*100)+"%";
    node.style.top = (((pos.y/550 * (MapWidth/750*550)) / WinHeight)*100)+"%";
    document.querySelector(".game-map").appendChild(node);
    this.node = node;
    this.num = num;
    Game.mouseList.push(this.node);
    console.log(Game.mouseList.length);
}
Mouse.prototype = {
    show: function(){
        var _this = this;
        _this.node.setAttribute("class","mouse show");
        setTimeout(function(){
            _this.hide();
        }, 1000);
    },
    hide: function(){
        //this.node.setAttribute("class","mouse");
        //this.node.remove();
        Game.mouseList.splice(this.num, 1);
        console.log(Game.mouseList.length);
    }
}

Game._init();