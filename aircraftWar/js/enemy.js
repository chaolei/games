var EnemyBullet = function(x, y, num){
    this.x = x;
    this.num = num;
    this.y = y;
    this.bullet = null;
    this.frameId = null;
    this.stepy = 1.5;
    this.stepx = 0;

    this.checkBeatChall = function(){
        if(!challenger) return ;
        if(this.x > challenger.x-9 && this.x < challenger.x+30 && this.y>= challenger.y+2){
            challenger.destory();
            main.showBoom(challenger.x+15,challenger.y+20);
            beatAudio.pause();
            beatAudio.currentTime = 0;
            beatAudio.play();
            setTimeout(main.loadChallenger, 500);
        }
    }

    this.move = function(){
        var top = this.bullet.offsetTop;
        var left = this.bullet.offsetLeft;
        top += this.stepy;
        left += this.stepx
        this.y = top;
        this.x = left;
        this.bullet.style.top = top + "px";
        this.bullet.style.left = left + "px";
        if(top >= window.innerHeight){
            this.bullet.remove();
            enemyBullets[this.num] = undefined;
            window.cancelAnimationFrame(this.frameId);
        }else{            
            this.frameId = window.requestAnimationFrame(this.move.bind(this));
            this.checkBeatChall();
        }
    }

    this.handleDirect = function(){
        var dy = challenger.y, dx = challenger.x;
        var ly = dy - this.y;
        var lx = dx - this.x;
        this.stepx = lx/(ly/this.stepy);
    }

    this.createBullet = function(){
        var bullet = document.createElement("div");
        bullet.setAttribute("class", "c-bullet");
        bullet.style.left = this.x + "px";
        bullet.style.top = this.y + "px";
        this.bullet = bullet;
        document.querySelector(".land").appendChild(bullet);
        this.handleDirect();
        this.frameId = window.requestAnimationFrame(this.move.bind(this));
    }

    this.createBullet();
}
var bulletPos = {
    type1: 16,
    type2: 10,
    type3: 13
};
var enemyWidth = {
    type1: 42,
    type2: 30,
    type3: 37
};
var enemyScore = {
    type1: 15,
    type2: 35,
    type3: 25
};

var Enemy = function(){
    this.area = 700;
    this.aircraft = '';
    this.isDead = false;
    this.frameId = "";
    this.canMove = false;//展示废弃
    this.canShot = false;
    this.num = 0;
    this.x = 0;
    this.y = 0;

    this.createAircraft = function(){
        var aircraft = document.createElement("div");
        var type = Math.ceil(Math.random() * 3);
        var left = this.area * Math.random();
        left = left > this.area - 50 ? this.area-50 : left;
        this.x = left;
        this.type = "type"+type;
        aircraft.setAttribute("class", "enemy "+this.type);
        aircraft.style.left = left + "px";
        this.aircraft = aircraft;
        document.querySelector(".land").appendChild(aircraft);

    }

    this.shot = function(){
        var _this = this;
        if(_this.y >= window.innerHeight || _this.isDead) {
            window.clearTimeout(this.timer);
            return ; 
        }       
        var num = enemyBullets.length;
        _this.num = num;
        var bullet = new EnemyBullet(_this.x+bulletPos[_this.type], _this.y+50, num);
        enemyBullets.push(bullet);
        var time = Math.floor(Math.random() * 5000);
        this.timer = setTimeout(_this.shot.bind(_this),time);
    }

    this.checkDead = function(){
        var bullet;
        for(var i=0;i<challengerBullets.length;i++){
            if(!challengerBullets[i]) continue;
            bullet = challengerBullets[i];
            if(bullet.x > this.x-9 && bullet.x < this.x+enemyWidth[this.type] && bullet.y<= this.y+45){
                main.showBoom(bullet.x, bullet.y);
                beatAudio.pause();
                beatAudio.currentTime = 0;
                beatAudio.play();
                this.isDead = true;
                this.destory();
                bullet.destory();
                score += enemyScore[this.type];
                document.querySelector(".score-val").innerText = score;
                main.loadEnemy();
                break;
            }
        }
    }

    this.move = function(){
        var _this = this;
        var top = this.aircraft.offsetTop + 1;
        _this.aircraft.style.top = top +"px";
        _this.y = top;
        _this.frameId = window.requestAnimationFrame(_this.move.bind(_this));
        if(top >= 0 && !_this.canShot){
            _this.canShot = true;
            _this.shot();
        }
        if(top > window.innerHeight - 50){  
            _this.isDead = true;          
            _this.destory();
            main.loadEnemy();
        }
        _this.checkDead();
    }

    this.destory = function(){
        window.cancelAnimationFrame(this.frameId);
        this.aircraft.remove(); 
    }

    this.showBoss = function(){
        if(enemyBoss) return ;
        enemyBoss = new EnemyBoss();
        enemyBullets = [];
        challengerBullets = [];
    }

    this.init = function(){
        if(enemyNum >= enemyMaxNum) { //达到最大敌机数后出现boss
            setTimeout(this.showBoss, 3000);
            return ;
        }     
        enemyNum ++ ;        
        var _this = this;
        _this.createAircraft();
        _this.frameId = window.requestAnimationFrame(_this.move.bind(_this));
    }

    this.init();
}