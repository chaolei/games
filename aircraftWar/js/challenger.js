var challengerBullets = [];
var ChallengerBullet = function(x, num){
    this.x = x;
    this.num = num;
    this.y = window.innerHeight - 40;
    this.bullet = null;
    this.frameId = null;

    this.move = function(){
        var top = this.bullet.offsetTop;
        top -= 10;
        this.y = top;
        this.bullet.style.top = top + "px";
        if(top <= 0){
            this.destory();
        }else{
            this.frameId = window.requestAnimationFrame(this.move.bind(this));
        }
    }

    this.createBullet = function(){
        var bullet = document.createElement("div");
        bullet.setAttribute("class", "c-bullet");
        bullet.style.left = this.x + "px";
        bullet.style.top = this.y + "px";
        this.bullet = bullet;
        document.querySelector(".land").appendChild(bullet);
        this.frameId = window.requestAnimationFrame(this.move.bind(this));
    }

    this.destory = function(){
        this.bullet.remove();
        challengerBullets[this.num] = undefined;
        window.cancelAnimationFrame(this.frameId);
    }

    this.createBullet();
}

/**/
var challenger = function(){
    this.aircraft = null;
    this.canMove = false;//展示废弃
    this.area = 700;
    this.x = 335;
    this.y = window.innerHeight - 40;
    

    this.createAircraft = function(){
        var aircraft = document.createElement("div");
        aircraft.setAttribute("class", "challeger");
        aircraft.style.left = this.x + "px";
        this.aircraft = aircraft;
        document.querySelector(".land").appendChild(aircraft);
    }

    this.goLeft = function(_this){
        var left = _this.aircraft.offsetLeft - 30;
        left = left < 0 ? 0: left;
        _this.x = left;
        _this.aircraft.style.left = _this.x + "px";
    }

    this.goRight = function(_this){
        var left = _this.aircraft.offsetLeft + 30;
        left = left > _this.area - 32 ? _this.area - 32 : left;
        _this.x = left;
        _this.aircraft.style.left = _this.x + "px";
    }
    this.shot = function(_this){
        var left = _this.x + 10;
        var num = challengerBullets.length;
        var bullet = new ChallengerBullet(left, num);
        challengerBullets.push(bullet);
    }

    this.keyOp = {
        key65: this.goLeft,
        key68: this.goRight,
        key32: this.shot
    };

    this.addListener = function(){
        var _this = this;
        document.addEventListener("keydown", function(e){
            var code = e.keyCode;
            var op = _this.keyOp['key'+code];
            if(op){
                op(_this);
            }
        })
    }

    this.init = function(){
        this.createAircraft();
        this.addListener();
    }
    this.init();
}