var socket = null, room;
var Utils = {
    cardWords: {
        card10:'<span class="spe10">10</span>',
        card11:'J',
        card12:'Q',
        card13:'K',
        card14:'A',
        card15:'2',
        card16:'<span class="small-j">JOKER</span>',
        card17:'<span class="big-j">JOKER</span>'

    },
    cardType: {
        dan: 1,
        duizi: 2,
        san: 3,
        san1: 4,
        shunzi: 5,
        liandui: 6,
        feiji: 7,
        feiji1: 8,
        zhadan: 9,
        wangzha: 10,
        sidaier: 11,
        buyao: 12,
    },
    posOhter: {//根据当前顺序确定其他两个玩家顺序
        pos01: 2,
        pos02: 1,
        pos11: 0,
        pos12: 2,
        pos21: 1,
        pos22: 0,
    },
    oCards: null,
    $: function(cls){
        return document.querySelector(cls);
    },
    $All: function(cls){
        return document.querySelectorAll(cls);
    },
    checkCard_2: function(cards){//两张牌，可能是对子或王炸
        var cardTypeObj = {cardType: -1};
        if(cards[0] == cards[1]){
            cardTypeObj.cardType = Utils.cardType.duizi;
            cardTypeObj.keyCard = cards[0];
        }else if(cards[0] == 16 && cards[1] == 17){
            cardTypeObj.cardType = Utils.cardType.wangzha;
        }
        return cardTypeObj;
    },
    checkCard_3: function(cards){
        var cardTypeObj = {cardType: -1};
        if(cards[0] == cards[1] && cards[1] == cards[2]){
            cardTypeObj.cardType = Utils.cardType.san;
            cardTypeObj.keyCard = cards[0];
        }
        return cardTypeObj;
    },
    checkCard_4: function(cards){//四张牌，可能是三带一或炸弹
        var cardTypeObj = {cardType: -1};
        if(cards[0] == cards[1] && cards[1] == cards[2] && cards[2] == cards[3]){
            cardTypeObj.cardType = Utils.cardType.zhadan;
            cardTypeObj.keyCard = cards[0];
        }else if(cards[0] == cards[1] && cards[1] == cards[2]){

            cardTypeObj.cardType = Utils.cardType.san1;
            cardTypeObj.keyCard = cards[0];
        }else if(cards[1] == cards[2] && cards[2] == cards[3]){

            cardTypeObj.cardType = Utils.cardType.san1;
            cardTypeObj.keyCard = cards[1];
        }
        return cardTypeObj;
    },
    checkCard_more: function(cards){ //5张以上情况太多，可能是顺子，连队，飞机不带，飞机带，四带二等
        var cardTypeObj = {cardType: -1}, typeObj;

        typeObj = Utils.isShunZi(cards);
        if(typeObj.cardType != -1) {
            return typeObj;
        }

        typeObj = Utils.isLianDui(cards);
        if(typeObj.cardType != -1) {
            return typeObj;
        }

        typeObj = Utils.isFeiJiBuDai(cards);
        if(typeObj.cardType != -1) {
            return typeObj;
        }

        typeObj = Utils.isFeiJiDai(cards);
        if(typeObj.cardType != -1) {
            return typeObj;
        }

        typeObj = Utils.isSiDaiEr(cards);
        if(typeObj.cardType != -1) {
            return typeObj;
        }

        return cardTypeObj;
    },
    isShunZi: function(cards){
        var cardTypeObj = {cardType: -1};
        var lastCard = cards[cards.length - 1], flag = true;
        if(lastCard >= 15  || cards.length > 12) return cardTypeObj; //2、大小王不能加入顺子
        
        for(var i=0; i<cards.length-1; i++){
            if(cards[i+1] - cards[i] != 1){
                flag = false;
                break;
            }
        }
        if(flag){
            cardTypeObj.cardType = Utils.cardType.shunzi;
            cardTypeObj.keyCard = cards[0];
        }

        return cardTypeObj;
    },
    isLianDui: function(cards){
        var cardTypeObj = {cardType: -1};
        var cleng = cards.length, lastCard = cards[cards.length - 1], flag = true;
        if(cleng < 6 || cleng%2 != 0) return cardTypeObj; //须为双数
        if(lastCard >= 15 || cards.length > 12) return cardTypeObj; //2、大小王不能加入连队        
        
        for(var i=0; i<cards.length; i=i+2){
            if(cards[i + 1] != cards[i]){
                flag = false;
                break;
            }
            if(i < cleng - 2){
                if(cards[i + 2] - cards[i] != 1){
                    flag = false;
                    break;
                }
            }
        }

        if(flag){
            cardTypeObj.cardType = Utils.cardType.liandui;
            cardTypeObj.keyCard = cards[0];
        }

        return cardTypeObj;
    },
    isFeiJiBuDai: function(ocards){
        var cardTypeObj = {cardType: -1};
        var cards = [].concat(ocards);
        var cleng = cards.length, lastCard = cards[cards.length - 1], flag = true;
        if(cleng%3 != 0 || lastCard>=15) return cardTypeObj;
        var num = cleng / 3, carSan = [];

        for(var n=0; n<num; n++){//循环得到
            if(Utils.checkCard_3(cards.splice(n*3, 3))){
                carSan.push(cards[n*3]);
            }else{
                flag = false;
                return false;
            }
        }

        for(var m=0; m<num-1; m++){
            if(carSan[m+1] - carSan[m] != 1){
                flag = false;
                break;
            }
        }

        if(flag){
            cardTypeObj.cardType = Utils.cardType.feiji;
            cardTypeObj.keyCard = carSan[0];
        }

        return cardTypeObj;
    },
    isFeiJiDai: function(cards){
        var cardTypeObj = {cardType: -1};
        var cleng = cards.length, flag = true;
        if(cleng%4 != 0) return cardTypeObj;
        var num = cleng / 4, carSan = [];

        for(var n=0; n<cleng-2; n++){//循环得到
            if(cards[n] == cards[n+1] && cards[n] == cards[n+2]){
                carSan.push(cards[n]);
                n = n+2;
            }
        }
        if(carSan.length == num && carSan[carSan.length-1] < 15){//三个2不能连
            for(var m=0;m<carSan.length-1;m++){
                if(carSan[m+1] - carSan[m] != 1){
                    flag =  false;
                    break;
                }
            }
        }else{
            flag =  false;
        }

        if(flag){
            cardTypeObj.cardType = Utils.cardType.feiji1;
            cardTypeObj.keyCard = carSan[0];
        }

        return cardTypeObj;
    },
    isSiDaiEr: function(cards){//暂未支持四带二飞机
        var cardTypeObj = {cardType: -1};
        var cleng = cards.length, flag = true;
        if(cleng != 6) return cardTypeObj;
        var num = cleng / 4, carSan = [];

        for(var n=0; n<cleng-3; n++){//循环得到
            if(cards[n] == cards[n+1] && cards[n] == cards[n+2] && cards[n] == cards[n+3]){
                carSan.push(cards[n]);
                n = n+3;
            }
        }

        if(carSan.length == 0){
            flag = false;
        }

        if(flag){
            cardTypeObj.cardType = Utils.cardType.sidaier;
            cardTypeObj.keyCard = carSan[0];
        }

        return cardTypeObj;
    },
    checkCard: function(cards){
        var length = cards.length, flag = false, cardTypeObj = {cardType: -1};
        switch(length){
            case 1: cardTypeObj.cardType = Utils.cardType.dan;cardTypeObj.keyCard = cards[0]; break;
            case 2: cardTypeObj = Utils.checkCard_2(cards); break;
            case 3: cardTypeObj = Utils.checkCard_3(cards); break;
            case 4: cardTypeObj = Utils.checkCard_4(cards); break;
            default: cardTypeObj = Utils.checkCard_more(cards);
        }

        if(cardTypeObj.cardType != -1 && Utils.compareCards(cardTypeObj, cards)){//正常牌型且比别人出牌大
            flag = true;
            Games.cardNum = Games.cardNum - cards.length;
            var isComplete = false;
            if(Games.cardNum == 0){//出完了
                isComplete = true; 
            }
           
            setTimeout(function(){               
                socket.send(JSON.stringify({method:'postCards', data:{isDiZhu: Games.isDiZhu, isComplete: isComplete, room: room, pos: Games.pos, cardType: cardTypeObj.cardType, cards: cards, keyCard: cardTypeObj.keyCard}}));
            },400);
        }
        return flag;
    },
    compareCards: function(cardTypeObj, cards){
        var curCards = Utils.curCards, flag = false;
        if(!curCards) return true; //第一个出牌，不用比较
        if(curCards.pos == Games.pos){//自己出的牌，别人都不要
            Utils.curCards = null;
            return true;
        }
        if(curCards.cardType == cardTypeObj.cardType){//牌型相同
            if(curCards.cards.length == cards.length && cardTypeObj.keyCard > curCards.keyCard){
                flag = true;
            }
        }else{//牌型不相同
            if(cardTypeObj.cardType == Utils.cardType.wangzha || cardTypeObj.cardType == Utils.cardType.zhadan){ //王炸或炸弹大于其他何牌
                flag = true;
            }
        }
        return flag;

    },
    testRandomCards: function(){
        var allCards = [3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,17];
        var tempCards = [].concat(allCards);
        tempCards.sort(Utils.randomsort);
        var acards = [], bcards=[], ccards=[];
        for(var i=0; i<6; i++){//算法有点垃圾，玩家abc三人各拿5手三张，再拿一手2张，最后三张是地主牌
            if(i == 5){
                acards.push(tempCards[i*9+0]);
                acards.push(tempCards[i*9+1]);
                bcards.push(tempCards[i*9+2]);
                bcards.push(tempCards[i*9+3]);
                ccards.push(tempCards[i*9+4]);
                ccards.push(tempCards[i*9+5]);
            }else{
                acards.push(tempCards[i*9+0]);
                acards.push(tempCards[i*9+1]);
                acards.push(tempCards[i*9+2]);
                bcards.push(tempCards[i*9+3]);
                bcards.push(tempCards[i*9+4]);
                bcards.push(tempCards[i*9+5]);
                ccards.push(tempCards[i*9+6]);
                ccards.push(tempCards[i*9+7]);
                ccards.push(tempCards[i*9+8]);
            }
        }
        return acards.sort(Utils.sortNumber);
    },
    randomsort: function(a, b) {
        return Math.random()>.5 ? -1 : 1;
    },
    sortNumber: function(a,b){
        return a - b;
    },
    getShowText: function(num){
        var txt = num+'';
        if(num > 9){
            txt = Utils.cardWords['card'+num];
        }
        return txt;
    },
    getArgs: function(akey){
        var url = document.location.href;
        var val = url.split(akey+"=")[1];
        if(val){
            return val.split("&")[0]; 
        }else{
            return '';
        }
    },
    showDiZhu: function(pos){
        Games.showDiZhu(pos);
    },
    showPostOp: function(pos){
        Utils.$(".my-op").setAttribute("class", "my-op show");
    },
    handleData: function(datas){
        var data = JSON.parse(datas);
        switch(data.method){
            case 'joinRoom': Utils.showUser(data.data); break;
            case 'giveCards': Utils.showCards(data.data); break;
            case 'postCards': Utils.showPostCards(data.data); break;
            case "showDiZhu": Utils.showDiZhu(data.data.dpos); break;
            case "showJiaoDiZhu": Utils.showJiaoDiZhu(data.data.pos); break;
            case "postCardFlag": Utils.showPostOp(); break;
            case "gameOver": Utils.showGameOver(data.data); break;
            case "destoryRoom": Utils.showDestoryInfo(); break;
                   
        }
    },
    showJiaoDiZhu: function(pos){
        if((Games.dFlag == 0 && pos == 2) || (Games.dFlag == 1 && pos == 0) || (Games.dFlag == 2 && pos == 1)){
            Utils.getOtherCards();
            socket.send(JSON.stringify({method:'jiaoDiZhu', data:{room:room, pos: pos}}));
        }else{
            Utils.$(".jiao-dizhu").setAttribute("class", "jiao-dizhu show");
        }        
    },
    showUser: function(data){
        if(data.status === 0){
            Utils.showToast("加入房间失败，请换房间", "warning");
            return ;
        }
        if(Utils.$(".play1.show")){
            Utils.$(".play2").setAttribute("class","play2 show");
            Utils.$(".game-loading").setAttribute("class","game-loading hide");
        }else{
            Utils.$(".play1").setAttribute("class","play1 show");
        }
    },
    showCards: function(data){
        Utils.oCards = data.ocards;
        Games.pos = data.pos;
        Games.dFlag = data.dFlag;
        Games.showMyCards(data.cards, data.pos);
    },
    showBuYao: function(pos){
        var nodes = Utils.$All(".headimg");
        for(var i=0;i<nodes.length;i++){
            if(nodes[i].getAttribute("data-pos") == pos){
                nodes[i].querySelector(".buyao-tips").setAttribute("class", "buyao-tips show");
            }
        }
    },
    hideBuYao: function(){
        var nodes = Utils.$All(".headimg");
        for(var i=0;i<nodes.length;i++){
            nodes[i].querySelector(".buyao-tips").setAttribute("class", "buyao-tips");
        }
    },
    showPostCards: function(data){
        var cards = data.cards;
        var cNode, cArea = Utils.$(".post-cards");       
        
        if(data.nextPost == Games.pos) Utils.showPostOp(Games.pos);
        if(data.cardType == 12){//不要
            Utils.showBuYao(data.pos);
            return ;
        }


        Utils.curCards = data;
        Utils.hideBuYao();
        cArea.innerHTML = "";
        for(var i=0; i< cards.length; i++){
            cNode = document.createElement("div");
            cNode.innerHTML = Utils.getShowText(cards[i]);
            cNode.setAttribute("class", "postcard");
            cNode.setAttribute("data-card", cards[i]);
            cArea.appendChild(cNode);
        }
    },
    getOtherCards: function(){//获取地主牌
        let cards = Utils.oCards, cNode, tnode, tnum, tpos;
        let myCards = Utils.$All(".mycard");
        let pNode = Utils.$(".my-cards");

        Games.cardNum = 20;//地主20张牌
        Games.isDiZhu = true;
        for(var i=0;i<cards.length;i++){

            cNode = document.createElement("div");
            cNode.innerHTML = Utils.getShowText(cards[i]);
            cNode.setAttribute("class", "mycard");
            cNode.setAttribute("data-card", cards[i]);
            tpos = -1;

            for(var n=0;n<myCards.length;n++){
                tnode = myCards[n];
                tnum = +tnode.getAttribute("data-card");
                if(tnum >= cards[i]){
                    tpos = n;
                    break;
                }
            }
            if(tpos != -1){
                pNode.insertBefore(cNode, pNode.children[tpos+i]);
            }else{
                pNode.appendChild(cNode);
            }
        }
    },
    showToast: function(msg, type, time){
        var tcon = Utils.$(".toast");
        var tNode = document.createElement("div");
        var txtNode = document.createElement("span");
        txtNode.setAttribute("class", "mes "+type);
        txtNode.innerText = msg;
        tNode.appendChild(txtNode);

        tcon.appendChild(tNode);
        if(!time){
            setTimeout(function(){
                tNode.remove();
            },2000);
        }
    },
    checkSayBuYao: function(){
        var flag = false;
        if(Utils.$All(".buyao-tips.show").length == 2){//自己出牌，但是之前有两个不要的时候，自己必须出牌，不能不出
            flag = true;  
        }
        return flag;
    },
    showGameOver: function(data){
        var mes;
        if(data.isDiZhu == Games.isDiZhu){
            mes = "恭喜，获得胜利！";
        }else{
            mes = "对不起，你输了！";
        }
        Utils.showToast(mes, "warning", true);
    },
    showDestoryInfo: function(){
        var mes = "有玩家退出了房间，房间解散，将返回首页。";
        Utils.showToast(mes, "warning", true);
        setTimeout(()=> {
            location.href = "./index.html";
        },2500);
    }
}
var Games = {
    pos: 0,
    cardNum: 17,//默认17张牌
    isDiZhu: false,
    ohterCards: null,
    init: function(){
        this.addEventListener();
        socket = new WebSocket("ws://118.25.216.97:8080");
        room = Utils.getArgs("roomId");
        document.querySelector(".game-roomnum span").innerText = room;
        console.log(room);
        socket.onopen = function(){
            socket.send(JSON.stringify({method:'joinRoom', data:{room:room}}));
        };
        socket.onmessage = function(evt){
            var data = evt.data;
            Utils.handleData(data);
        };
        socket.onclose = function(evt){
            Utils.showToast("链接服务器失败", "error");
        };
        socket.onerror = function(evt){
            Utils.showToast("链接服务器失败", "error");
        };
    },
    addEventListener: function(){
        var cards = Utils.$(".my-cards");
        var outcard = Utils.$(".outcard");
        var cancel = Utils.$(".cancelcard");
        var jiaodizhu = Utils.$(".jiaodizhu");
        var bujiao = Utils.$(".bujiao");
        cards.addEventListener("touchstart",function(e){
            var card = e.target;
            var cls = card.getAttribute("class");
            if(cls.indexOf("mycard") == -1) {
                if(cls.indexOf("small-j") > -1 || cls.indexOf("big-j") > -1){
                    cls = cls.parentNode;
                }else{
                    return;
                }
            }
            if(cls.indexOf("selected") == -1) {
                card.setAttribute("class","mycard selected");
            }else{
                card.setAttribute("class","mycard");
            }
        });
        outcard.addEventListener("touchstart",function(e){
            var cards = Utils.$All(".mycard.selected"),arr=[];
            if(cards.length == 0) return ;
            for(var i=0;i<cards.length;i++){
                arr.push(+cards[i].getAttribute("data-card"));               
            }
            var outObj = Utils.checkCard(arr);

            if(outObj){
                for(var i=0;i<cards.length;i++){
                    cards[i].setAttribute("class","mycard outcard");                
                }
                setTimeout(function(card){
                    for(var i=0;i<cards.length;i++){
                        cards[i].remove();                    
                    }
                }, 500);
                Utils.$(".my-op").setAttribute("class", "my-op");
            }else{
                Utils.showToast("不能这样出牌或出牌太小", "warning");
            }
            
        });
        cancel.addEventListener("touchstart",function(e){
            if(Utils.checkSayBuYao()) {
                Utils.showToast("不能不要，必须出牌", "warning");
                return ;
            }
            var cards = Utils.$All(".mycard.selected");
            for(var i=0;i<cards.length;i++){                
                cards[i].setAttribute("class","mycard");
            }
            Utils.$(".my-op").setAttribute("class", "my-op");
            socket.send(JSON.stringify({method:'postCards', data:{room:room, pos: Games.pos, cardType: Utils.cardType.buyao}}));
        });
        jiaodizhu.addEventListener("touchstart",function(e){
            Utils.getOtherCards();
            socket.send(JSON.stringify({method:'jiaoDiZhu', data:{room:room, pos: Games.pos}}));
            Utils.$(".jiao-dizhu").setAttribute("class", "jiao-dizhu");
        });
        bujiao.addEventListener("touchstart",function(e){
            socket.send(JSON.stringify({method:'bujiaoDiZhu', data:{room:room, pos: Games.pos}}));
            Utils.$(".jiao-dizhu").setAttribute("class", "jiao-dizhu");
        });
    },
    /*根据拿到的牌显示给用户 */
    showMyCards: function(cards, pos){
        var cNode, cArea = Utils.$(".my-cards");
        this.addPlayerFlag(pos);
        
        for(var i=0; i< cards.length; i++){
            cNode = document.createElement("div");
            cNode.innerHTML = Utils.getShowText(cards[i]);
            cNode.setAttribute("class", "mycard");
            cNode.setAttribute("data-card", cards[i]);
            cArea.appendChild(cNode);
        }
    },
    addPlayerFlag: function(pos){
        Utils.$(".my-headimg").setAttribute("data-pos", pos);
        Utils.$(".play1 .play-headimg").setAttribute("data-pos", Utils.posOhter["pos"+pos+"1"]);
        Utils.$(".play2 .play-headimg").setAttribute("data-pos", Utils.posOhter["pos"+pos+"2"]);
    },
    showDiZhu: function(pos){
        var nodes = Utils.$All(".headimg");
        for(var i=0;i<nodes.length;i++){
            if(nodes[i].getAttribute("data-pos") == pos){
                nodes[i].querySelector("img").setAttribute("src", "./images/dizhu.png");
            }
        }
    }
}

Games.init();
//var mycards = Utils.testRandomCards();
//Games.showMyCards(Utils.testRandomCards());