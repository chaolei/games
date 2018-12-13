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
        var type = -1;
        if(cards[0] == cards[1]){
            type = Utils.cardType.duizi;
        }else if(cards[0] == 16 && cards[1] == 17){
            type = Utils.cardType.wangzha;
        }
        return type;
    },
    checkCard_3: function(cards){
        var type = -1;
        if(cards[0] == cards[1] && cards[1] == cards[2]){
            type = Utils.cardType.san;
        }
        return type;
    },
    checkCard_4: function(cards){//四张牌，可能是三带一或炸弹
        var type = -1;
        if(cards[0] == cards[1] && cards[1] == cards[2] && cards[2] == cards[3]){
            type = Utils.cardType.zhadan;
        }else if((cards[0] == cards[1] && cards[1] == cards[2]) ||  (cards[1] == cards[2] && cards[2] == cards[3])){
            type = Utils.cardType.san1;
        }
        return type;
    },
    checkCard_more: function(cards){ //5张以上情况太多，可能是顺子，连队，飞机不带，飞机带，四带二等
        var type = -1;
        if(Utils.isShunZi(cards)) return Utils.cardType.shunzi;
        if(Utils.isLianDui(cards)) return Utils.cardType.liandui;
        if(Utils.isFeiJiBuDai(cards)) return Utils.cardType.feiji;
        if(Utils.isFeiJiDai(cards)) return Utils.cardType.feiji1;
        if(Utils.isFeiJiDai(cards)) return Utils.cardType.feiji1;
        if(Utils.isSiDaiEr(cards)) return Utils.cardType.sidaier;
        return type;
    },
    isShunZi: function(cards){
        var lastCard = cards[cards.length - 1], flag = true;
        if(lastCard >= 15  || cards.length > 12) return false; //2、大小王不能加入顺子
        
        for(var i=0; i<cards.length-1; i++){
            if(cards[i+1] - cards[i] != 1){
                flag = false;
                break;
            }
        }
        return flag;
    },
    isLianDui: function(cards){
        var cleng = cards.length, lastCard = cards[cards.length - 1], flag = true;
        if(cleng < 6 || cleng%2 != 0) return false; //须为双数
        if(lastCard >= 15 || cards.length > 12) return false; //2、大小王不能加入连队        
        
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
        return flag;
    },
    isFeiJiBuDai: function(ocards){
        var cards = [].concat(ocards);
        var cleng = cards.length, lastCard = cards[cards.length - 1], flag = true;
        if(cleng%3 != 0 || lastCard>=15) return false;
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

        return flag;
    },
    isFeiJiDai: function(cards){
        var cleng = cards.length, flag = true;
        if(cleng%4 != 0) return false;
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
        return flag;
    },
    isSiDaiEr: function(cards){//暂未支持四带二飞机
        var cleng = cards.length, flag = true;
        if(cleng != 6) return false;
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

        return flag;
    },
    checkCard: function(cards){
        var length = cards.length, flag = false, cardType = -1;
        switch(length){
            case 1: cardType = Utils.cardType.dan; break;
            case 2: cardType = Utils.checkCard_2(cards); break;
            case 3: cardType = Utils.checkCard_3(cards); break;
            case 4: cardType = Utils.checkCard_4(cards); break;
            default: cardType = Utils.checkCard_more(cards);
        }
        //判断牌型
        if(cardType != -1){
            flag = true;
            setTimeout(function(){
                socket.send(JSON.stringify({method:'postCards', data:{room:room, pos: Games.pos, cardType: cardType, cards:cards}}));
            },400);
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
    showToast: function(msg, type){
        var tcon = Utils.$(".toast");
        var tNode = document.createElement("div");
        var txtNode = document.createElement("span");
        txtNode.setAttribute("class", "mes "+type);
        txtNode.innerText = msg;
        tNode.appendChild(txtNode);

        tcon.appendChild(tNode);
        setTimeout(function(){
            tNode.remove();
        },2000);
    },
}
var Games = {
    pos: 0,
    ohterCards: null,
    init: function(){
        this.addEventListener();
        socket = new WebSocket("ws://127.0.0.1:8001");
        room = Utils.getArgs("roomId");
        console.log(room);
        socket.onopen = function(){
            socket.send(JSON.stringify({method:'joinRoom', data:{room:room}}));
        };
        socket.onmessage = function(evt){
            var data = evt.data;
            Utils.handleData(data);
        };
        socket.onclose = function(evt){
            Utils.showToast("WebSocketClosed", "error");
        };
        socket.onerror = function(evt){
            Utils.showToast("WebSocketError", "error");
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
                Utils.showToast("不能这样出牌", "warning");
            }
            
        });
        cancel.addEventListener("touchstart",function(e){
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