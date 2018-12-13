var Game = {
    _init: function(){
        this.addListener();
    },
    addListener: function(){
        document.querySelector(".create-room").addEventListener("click", function(){
            Game.createRoom();
        });
        document.querySelector(".create-room").addEventListener("touchstart", function(){
            Game.createRoom();
        });
    },
    createRoom: function(){
        var tstr = new Date().getMilliseconds();
        var roomid = tstr + '' + Math.floor(Math.random() * 10);

        location.href = "room.html?roomId="+ roomid;
    }
}


Game._init();