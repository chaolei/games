var enemyBullets = [];
var EnemyBullet = function(x, y, num){
    this.x = x;
    this.num = num;
    this.y = y;
    this.bullet = null;
    this.frameId = null;

    this.move = function(){
        var top = this.bullet.offsetTop;
        top += 2;
        this.y = top;
        this.bullet.style.top = top + "px";
        if(top >= window.innerHeight){
            this.bullet.remove();
            enemyBullets[this.num] = undefined;
            window.cancelAnimationFrame(this.frameId);
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
        if(_this.y >= window.innerHeight || _this.isDead) return ;        
        var num = enemyBullets.length;
        _this.num = num;
        var bullet = new EnemyBullet(_this.x+bulletPos[_this.type], _this.y+50, num);
        enemyBullets.push(bullet);
        var time = Math.floor(Math.random() * 3000);
        setTimeout(_this.shot.bind(_this),time);
    }
    this.checkDead = function(){
        var bullet;
        for(var i=0;i<challengerBullets.length;i++){
            if(!challengerBullets[i]) continue;
            bullet = challengerBullets[i];
            console.log(bullet.x+"/"+(this.x-9)+"/"+this.x+enemyWidth[this.type]+"/"+bullet.y+"/"+(this.y+45));
            if(bullet.x > this.x-9 && bullet.x < this.x+enemyWidth[this.type] && bullet.y<= this.y+45){
                this.isDead = true;
                this.destory();
                bullet.destory();
                score++;
                document.querySelector(".score-val").innerText = score;
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
            _this.destory();
        }
        _this.checkDead();
    }
    this.destory = function(){
        window.cancelAnimationFrame(this.frameId);
        this.aircraft.remove(); 
    }
    this.init = function(){
        var _this = this;
        _this.createAircraft();
        _this.frameId = window.requestAnimationFrame(_this.move.bind(_this));
    }
    this.init();
}