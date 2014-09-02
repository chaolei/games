var Game = function(){
	var _this = this;
	var bird = $(".bird"),con = $(".game-container"),map = $(".map"),bartmp = "<div class='bar &barnum'></div>";
	var barnum = 0,downtimeout,checktimeout,points=[],point={};
	this.start = function(){
		_this.scrollMap();
		_this.birdDown();
		_this.checkBoom();
		$(document).keyup(function(e){
			if(e.keyCode == 38){
				window.clearTimeout(downtimeout);
				bird.css("top",bird.offset().top-bird.height()-20+"px");
				_this.birdDown();
			}
		});
	}
	this.init = function(){
		con.scrollLeft(0);
		bird.css("top","200px");
		var i=0;
		while(i<20){
			_this.addBar();
			i++;
		}		
	}
	this.scrollMap = function(){			
		con.animate({scrollLeft:map.width()-con.width()+"px"},24000,null);
		bird.animate({left:map.width()-con.width()+"px"},24000,function(){
			alert("恭喜你，过关啦，刷新重来：）");
			window.clearInterval(downtimeout);
			window.clearInterval(checktimeout);
			con.stop();
			bird.stop();
		});
	}
	this.addBar = function(){
		var random = Math.random();
		var height = Math.floor(300*random);
		height = height<100?100:height;
		var cls = "bar"+barnum;
		var bar = bartmp.replace("&barnum",cls);
		map.append(bar);
		var left = (barnum+1)*150,top1,top2;
		if(random < 0.5){
			top1 = 0;
			top2 = height;
			$("."+cls).css("top","0").css("height",height+"px").css("left",left+"px");
		}else{
			top1 = 400-height;
			top2 = 400;
			$("."+cls).css("bottom","0").css("height",height+"px").css("left",left+"px");
		}
		point = {left1:left,left2:left+20,top1:top1,top2:top2};
		points.push(point);
		barnum++;
	}
	this.birdDown = function(){
		downtimeout = window.setInterval(function(){
			bird.css("top",bird.offset().top-bird.height()+5+"px");
		},100);
	}
	this.checkBoom = function(){
		var l1,l2,t1,t2,l,t,point;
		checktimeout = window.setInterval(function(){
			l = bird.css("left").replace("px","");
			t = bird.css("top").replace("px","");
			l1 = +l;
			l2 = l1+30;
			t1 = +t;
			t2 = t1+20;
			//到了最下方或最上方
			if(t2 >= 400 || t1<=0){
				_this.gameOver();
			}
			//是否撞上柱子
			for(var i=0;i<points.length;i++){
				point = points[i];
				if(l1 > point.left2){//路过的不管
					continue;
				}
				if(t2 > point.top1 && t2 < point.top2 && l2 > point.left1 && l2 < point.left2){
					_this.gameOver();
					break;
				}
				if(t2 > point.top1 && t2 < point.top2 && l2 > point.left1 && l2 < point.left2){
					_this.gameOver();
					break;
				}
				if(t2 > point.top1 && t2 < point.top2 && l1 > point.left1 && l1 < point.left2){
					_this.gameOver();
					break;
				}
				if(t1 > point.top1 && t1 < point.top2 && l1 > point.left1 && l1 < point.left2){
					_this.gameOver();
					break;
				}
			}			
		},100);
	}
	this.gameOver = function(){
		alert("Game Over");
		window.clearInterval(downtimeout);
		window.clearInterval(checktimeout);
		con.stop();
		bird.stop();
		return ;
	}
}
