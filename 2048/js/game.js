Array.prototype.contains = function(num){
	for(var i=0;i<this.length;i++){
		if(this[i] == num){
			return true;
		}
	}
	return false;
}
Array.prototype.inverse = function(){
	var arr = [],m=0;
	for(var i=this.length-1;i>=0;i--){
		arr[m] = this[i];
		m++;
	}
	return arr;
}
Array.prototype.max = function(){
	var max=0;
	for(var i=this.length-1;i>=0;i--){
		if(this[i]>max){
			max = this[i];
		}
	}
	return max;
}
var Game = {
	nodes : $(".num"),
	result : [],
	arr1 : [],
	arr2 : [],
	arr3 : [],
	arr4 : [],
	start : function(){
		this.init();
		this.addKeyListener();
		this.give2();
		this.give2();
		this.show();
	},
	addKeyListener : function(){
		$("div.up").on("click",function(){Game.addUpDown('up');});
		$("div.down").on("click",function(){Game.addUpDown('down');});
		$("div.left").on("click",function(){Game.addLeftRight('left');});
		$("div.right").on("click",function(){Game.addLeftRight('right');});
		$(document).keypress(function(e){
			switch(e.keyCode){
				case 37 : //left
						console.log('left');
						Game.addLeftRight('left');
						break;						
				case 38 : //up
						console.log('up');
						Game.addUpDown('up');
						break;	
				case 39 : //right
						console.log('right');
						Game.addLeftRight('right');
						break;	
				case 40 : //down
						console.log('down');
						Game.addUpDown('down');
						break;	
			}
		});
	},
	init : function(){
		for(var i=0;i<16;i++){
			Game.result[i] = 0;
		}
	},
	give2 : function(){
		var num = Math.floor(Math.random()*17);
		if(Game.result[num] == 0){
			Game.result[num] = 2;
			return num;
		}
		Game.give2();
	},
	show : function(){
		Game.nodes.html("");
		var cnode;
		for(var i=0;i<Game.result.length;i++){
			cnode = Game.nodes.eq(i);
			cnode.removeClass();
			cnode.addClass("num");
			if(Game.result[i] > 0){				
				cnode.addClass("c"+Game.result[i]);
				cnode.html(Game.result[i]);				
			}
		}
	},
	addLeftRight : function(dre){
		this.clearArr();
		for(var i=0;i<Game.result.length;i++){
			if(i/4 < 1){
				Game.arr1.push(Game.result[i]);
				continue;
			}
			if(i/4 < 2){
				Game.arr2.push(Game.result[i]);
				continue;
			}
			if(i/4 < 3){
				Game.arr3.push(Game.result[i]);
				continue;
			}
			Game.arr4.push(Game.result[i]);
		}
		var arr1,arr2,arr3,arr4;
		if(dre == "left"){
			arr1 = Game.operateData(Game.arr1);
			arr2 = Game.operateData(Game.arr2);
			arr3 = Game.operateData(Game.arr3);
			arr4 = Game.operateData(Game.arr4);		
			Game.result = arr1.concat(arr2).concat(arr3).concat(arr4);
		}else{
			Game.arr1 = Game.arr1.inverse();
			Game.arr2 = Game.arr2.inverse();
			Game.arr3 = Game.arr3.inverse();
			Game.arr4 = Game.arr4.inverse();
			arr1 = Game.operateData(Game.arr1);
			arr2 = Game.operateData(Game.arr2);
			arr3 = Game.operateData(Game.arr3);
			arr4 = Game.operateData(Game.arr4);		
			Game.result = arr1.inverse().concat(arr2.inverse()).concat(arr3.inverse()).concat(arr4.inverse());
		}
		
		if(arr1.toString() != Game.arr1.toString()||arr2.toString() != Game.arr2.toString()||arr3.toString() != Game.arr3.toString()||arr4.toString() != Game.arr4.toString()){
			Game.give2();
		}else{
			Game.checkOver();
		}
		Game.show();
	},
	addUpDown : function(dre){
		this.clearArr();
		for(var i=0;i<Game.result.length;i++){
			if(i%4 == 0){
				Game.arr1.push(Game.result[i]);
				continue;
			}
			if(i%4 == 1){
				Game.arr2.push(Game.result[i]);
				continue;
			}
			if(i%4 == 2){
				Game.arr3.push(Game.result[i]);
				continue;
			}
			Game.arr4.push(Game.result[i]);
		}
		var arr,arr1,arr2,arr3,arr4;
		if(dre == "up"){
			arr1 = Game.operateData(Game.arr1);
			arr2 = Game.operateData(Game.arr2);
			arr3 = Game.operateData(Game.arr3);
			arr4 = Game.operateData(Game.arr4);		
			arr = [arr1,arr2,arr3,arr4];			
		}else{
			Game.arr1 = Game.arr1.inverse();
			Game.arr2 = Game.arr2.inverse();
			Game.arr3 = Game.arr3.inverse();
			Game.arr4 = Game.arr4.inverse();
			arr1 = Game.operateData(Game.arr1);
			arr2 = Game.operateData(Game.arr2);
			arr3 = Game.operateData(Game.arr3);
			arr4 = Game.operateData(Game.arr4);		
			arr = [arr1.inverse(),arr2.inverse(),arr3.inverse(),arr4.inverse()];
		}
		for(var i=0;i<Game.result.length;i++){
			Game.result[i] = arr[i%4][Math.floor(i/4)];
		}
		if(arr1.toString() != Game.arr1.toString()||arr2.toString() != Game.arr2.toString()||arr3.toString() != Game.arr3.toString()||arr4.toString() != Game.arr4.toString()){
			Game.give2();
		}else{
			Game.checkOver();
		}
		Game.show();
	},
	operateData : function(arr){
		//把能加的相加
		var arr1 = arr.slice(0);
		for(var i=0;i<arr1.length-1;i++){
			for(j=i+1;j<arr1.length;j++){
				if(arr1[j] !=0 && arr1[j] != arr1[i]){
					break;
				}
				if(arr1[i] == arr1[j] && arr1[i] != 0){
					arr1[i] += arr1[j];
					arr1[j] = 0;
				}
			}
		}
		for(i=0;i<arr1.length-1;i++){
			for(var j=i+1;j<arr1.length;j++){
				if(arr1[i] == 0 && arr1[j] != 0){
					arr1[i] = arr1[j];
					arr1[j] = 0;
				}
			}
		}
		return arr1;
	},
	checkOver : function(){
		if(!Game.result.contains(0)){
			var max = Game.result.max();
			var info = "你要多用脖子上的东西了，骚年。";
			switch(max){
				case 256 : info = '你入门了，骚年。';break;
				case 512 : info = '你掌握技巧了，骚年。';break;
				case 1024 : info = '你很精通了，骚年。';break;
				case 2048 : info = '你要逆天了，骚年。';break;
			}
			alert("Game Over\n\n"+info+"\n\nrefresh to play again!");
		}
	},
	clearArr : function(){
		Game.arr1 = [];
		Game.arr2 = [];
		Game.arr3 = [];
		Game.arr4 = [];
	}
}

