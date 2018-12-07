var Player = {
    x: 100,
    y: 33,
    derect: 'front',
    jumping: false,
    node: document.querySelector(".player"),
    _init: function(){
        var _this = this;
        document.addEventListener('keydown', function(e){
            console.log(e.key);
            switch(e.key){
                case 'd': break;
                case 'd': break;
            }
        });
    }
}
Player._init();