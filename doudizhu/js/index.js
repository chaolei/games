var Game = {
    _init: function(){
        this.addListener();
    },
    addListener: function(){
        document.querySelector(".create-room").addEventListener("click", function(e){
            e.preventDefault();
            Game.createRoom();
        });
        document.querySelector(".create-room").addEventListener("touchstart", function(e){
            e.preventDefault();
            Game.createRoom();
        });

        document.querySelector(".join-room").addEventListener("click", function(e){
            e.preventDefault();
            Game.showNumWind();
        });
        document.querySelector(".join-room").addEventListener("touchstart", function(e){
            e.preventDefault();
            Game.showNumWind();
        });

        document.querySelector(".input-roomnum").addEventListener("click", function(e){
            e.preventDefault();
            Game.hideNumWind();
        });
        document.querySelector(".input-roomnum").addEventListener("touchstart", function(e){
            e.preventDefault();
            Game.hideNumWind();
        });

        document.querySelector(".input-con").addEventListener("click", function(e){           
            e.stopPropagation();
        });
        document.querySelector(".input-con").addEventListener("touchstart", function(e){
            e.stopPropagation();
        });

        document.querySelector(".enter-room").addEventListener("click", function(e){           
            e.preventDefault();
            Game.enterRoom();
        });
        document.querySelector(".enter-room").addEventListener("touchstart", function(e){
            e.preventDefault();
            Game.enterRoom();
        });

       
    },
    createRoom: function(){
        var tstr = new Date().getMilliseconds();
        var roomid = tstr + '' + Math.floor(Math.random() * 10);

        location.href = "room.html?roomId="+ roomid;
    },
    showNumWind: function(){
        var win = document.querySelector(".input-roomnum");
        win.setAttribute("class", "input-roomnum show");
    },
    hideNumWind: function(){
        var win = document.querySelector(".input-roomnum");
        win.setAttribute("class", "input-roomnum");
    },
    enterRoom: function(){
        var inputNode = document.querySelector(".room-num");
        var roomid = inputNode.value;
        if(roomid.length ==0) return ;

        location.href = "room.html?roomId="+ roomid;
    }
}


Game._init();