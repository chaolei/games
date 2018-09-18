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

var EnemyBoss = function(){
    this.area = 700;
    this.aircraft = '';
    this.isDead = false;
    this.frameId = "";
    this.canMove = false;//展示废弃
    this.canShot = false;
    this.num = 0;
    this.x = 250;
    this.y = 0;
    this.beatNum = 0;
    this.direct = 'right';

    this.createAircraft = function(){
        var aircraft = document.createElement("div");
        aircraft.setAttribute("class", "boss");
        aircraft.style.left = this.x + "px";
        this.aircraft = aircraft;
        document.querySelector(".land").appendChild(aircraft);
    }

    this.shot = function(){
        var _this = this;
        if( _this.isDead) {
            window.clearTimeout(this.timer);
            return ; 
        }       
        var num = enemyBullets.length;
        var bullet = new EnemyBullet(_this.x+22, _this.y+153, num);        
        enemyBullets.push(bullet);

        var bullet2 = new EnemyBullet(_this.x+92, _this.y+184, ++num);        
        enemyBullets.push(bullet2);

        var bullet3 = new EnemyBullet(_this.x+162, _this.y+153, ++num);        
        enemyBullets.push(bullet3);

        var time = Math.floor(Math.random() * 4000);
        this.timer = setTimeout(_this.shot.bind(_this),time);
    }

    this.checkDead = function(){
        var bullet;
        for(var i=0;i<challengerBullets.length;i++){
            if(!challengerBullets[i]) continue;
            bullet = challengerBullets[i];
            if(bullet.x > this.x+70 && bullet.x < this.x+145 && bullet.y<= this.y+180){
                this.beatNum++;
                main.showBoom(bullet.x, bullet.y);
                bullet.destory();
                beatAudio.pause();
                beatAudio.currentTime = 0;
                beatAudio.play();
                if(this.beatNum >= 100){
                    main.showBigBoom(this.x, this.y);
                    this.isDead = true;
                    this.destory();                    
                    score += 200;
                    document.querySelector(".score-val").innerText = score;
                }                
                break;
            }
        }
    }

    this.move = function(){
        var _this = this;
        var top = this.aircraft.offsetTop + 1;
        
        if(top < 0){
            _this.aircraft.style.top = top +"px";
            _this.y = top;
        }else{//boss出现后左右移动
            var bleft = this.aircraft.offsetLeft;
            var left = this.direct == 'right' ? bleft + 1 : bleft - 1;
            if(left >= this.area-200){
                this.direct = "left";
            }
            if(left <= 0 && this.direct=="left"){
                this.direct = "right";
            }
            _this.aircraft.style.left = left +"px";
            _this.x = left; 
        }

        _this.frameId = window.requestAnimationFrame(_this.move.bind(_this));
        if(top >= 0 && !_this.canShot){
            _this.canShot = true;
            _this.shot();
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