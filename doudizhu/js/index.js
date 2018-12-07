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
    $: function(cls){
        return document.querySelector(cls);
    },
    $All: function(cls){
        return document.querySelectorAll(cls);
    },
    checkCard: function(cards){
        var length = cards.length;
        switch(length){
            case 1: break;
        }
        //判断牌型
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
        console.log(acards.sort(Utils.sortNumber));
        console.log(bcards.sort(Utils.sortNumber));
        console.log(ccards.sort(Utils.sortNumber));
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
    }
}
var Games = {
    init: function(){
        this.addEventListener();
    },
    addEventListener: function(){
        var cards = Utils.$(".my-cards");
        var outcard = Utils.$(".outcard");
        var cancel = Utils.$(".cancelcard");
        cards.addEventListener("touchstart",function(e){
            var card = e.target;
            var cls = card.getAttribute("class");
            if(cls.indexOf("mycard") == -1) return;
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
                cards[i].setAttribute("class","mycard outcard");                
            }
            var outObj = Utils.checkCard(arr);
            setTimeout(function(card){
                for(var i=0;i<cards.length;i++){
                    cards[i].remove();                    
                }
            }, 500);
        });
        cancel.addEventListener("touchstart",function(e){
            var cards = Utils.$All(".mycard.selected");
            for(var i=0;i<cards.length;i++){                
                cards[i].setAttribute("class","mycard");
            }
        });
    },
    /*根据拿到的牌显示给用户 */
    showMyCards: function(cards){
        var cNode, cArea = Utils.$(".my-cards");
        for(var i=0; i< cards.length; i++){
            cNode = document.createElement("div");
            cNode.innerHTML = Utils.getShowText(cards[i]);
            cNode.setAttribute("class", "mycard");
            cNode.setAttribute("data-card", cards[i]);
            cArea.appendChild(cNode);
        }
    }
}

Games.init();
//var mycards = Utils.testRandomCards();
Games.showMyCards(Utils.testRandomCards());