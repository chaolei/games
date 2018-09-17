var score = 0, challenger;
var main = {
    init: function(){
        this.addListner();
    },
    start: function(){
        var bg = document.querySelector(".lang-bg");
        bg.setAttribute("class", "lang-bg go");
        challenger = new challenger();
        var enemy1 = new Enemy();
        var enemy2 = new Enemy();
        var enemy3 = new Enemy();
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