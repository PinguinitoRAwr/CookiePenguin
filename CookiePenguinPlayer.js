
var interval = 900;
var autoBuy = true;
var autoBuyTxt = 'on';
var keepForGolden = true;
var keepForGoldenTxt = 'on';
var name;
var price;
var cpsItem;
var selected = 0;
var currentCps = Game.cookiesPs;
document.addEventListener('keydown', function (event) {
    if (event.keyCode == 65) {
        autoBuy = !autoBuy;
        autoBuyTxt = autoBuy ? 'on' : 'off';
    } 
    else if (event.keyCode == 71) {
        keepForGolden = !keepForGolden;
        keepForGoldenTxt = keepForGolden ? 'on' : 'off';
    } 
    else if (event.keyCode == 82) {
        selected = 0;
    }
});
function OptimalItem()
{
    var cpc = Number.MAX_VALUE;
    var sel;
    for (i = Game.UpgradesInStore.length - 1; i >= 0; i--)
    {
        var cps1 = 0;
        var me = Game.UpgradesInStore[i];
        var x = Game.UpgradesInStore[i].id;
        if (x != 64 && x != 74 && x != 84 && x != 85 && x != 227)
        {
            Game.UpgradesById[x].toggle();
            Game.CalculateGains();
            for (j = Game.ObjectsById.length - 1; j >= 0; j--)
            {
                cps1 += Game.ObjectsById[j].cps() * Game.ObjectsById[j].amount;
            }
            var cps2 = cps1 * Game.globalCpsMult;
            Game.UpgradesById[x].toggle();
            Game.CalculateGains();
            var myCps = cps2 - currentCps;
            var cpsUpgrade = me.basePrice / myCps;
            if (cpsUpgrade < cpc && myCps >= 0.1)
            {
                cpc = cpsUpgrade;
                sel = me;
                cpsItem = myCps;
                name = me.name;
                price = Math.round(me.basePrice);
            }
        }
    }
    for (i = Game.ObjectsById.length - 1; i >= 0; i--) {
        var cps1 = 0;
        var me = Game.ObjectsById[i];
        me.amount++;
        Game.CalculateGains();
        for (j = Game.ObjectsById.length - 1; j >= 0; j--) {
            cps1 += Game.ObjectsById[j].cps() * Game.ObjectsById[j].amount;
        }
        var cps2 = cps1 * Game.globalCpsMult;
        me.amount--;
        Game.CalculateGains();
        var myCps = cps2 - currentCps;
        var cpsBuilding = me.price / myCps;
        if (cpsBuilding < cpc && myCps >= 0.1)
        {
            cpc = cpsBuilding;
            sel = me;
            cpsItem = myCps;
            name = me.name;
            price = Math.round(me.price);
        }
    }
    selected = 1;
    return sel;
}
function Display()
{
    var mult = 1;
    if (Game.frenzy > 0) mult = Game.frenzyPower;
    var time;
    if (!keepForGolden) {
        time = (price - Game.cookies) / Game.cookiesPs;
    } 
    else if (Game.UpgradesById[86].bought) {
        time = 84000 / mult + (price - Game.cookies) / Game.cookiesPs;
    } 
    else {
        time = 12000 / mult + (price - Game.cookies) / Game.cookiesPs;
    }
    time = time < 0 ? 0 : Beautify(time);
    var numb = (Math.abs(Game.computedMouseCps / Game.cookiesPs));
    numb = numb.toFixed(3);
    var mult = 1;
    if (Game.frenzy > 0) mult = Game.frenzyPower;
    var cookiesNow = Game.cookies;
    var myCpS = Game.cookiesPs;
    var precioUno = price + (myCpS + cpsItem) * 84000 / mult;
    Game.Ticker = 'Buying ' + name + ' for ' + Beautify(price) + ' at ' + Beautify(Math.round(price / (cpsItem * Game.globalCpsMult))) + ' cookies per CPS!' +
    '<br>Auto-buy is currently ' + autoBuyTxt + '<br>Maximisation is currently ' + keepForGoldenTxt + ' and we are saving ' + Beautify(precioUno) ;
    Game.TickerAge = interval;
}
var cookieBot = setInterval(function () {
    if (Game.UpgradesInStore.indexOf(Game.Upgrades['Elder Pledge']) != - 1) {
        Game.Upgrades['Elder Pledge'].buy();
    }
    if (Game.goldenCookie.life > 0) {
        Game.goldenCookie.click();
    }
    var mult = 1;
    if (Game.frenzy > 0) mult = Game.frenzyPower;
    var cookiesNow = Game.cookies;
    var myCpS = Game.cookiesPs;
    var precioUno = price + (myCpS + cpsItem) * 84000 / mult - cookiesNow;
    var precioDos = price + (myCpS + cpsItem) * 12000 / mult - cookiesNow;
    if (autoBuy && selected == 1 && !keepForGolden && cookiesNow >= price) {
        OptimalItem() .buy();
        selected = 0;
    } 
    else if (autoBuy && selected == 1 && keepForGolden && Game.UpgradesById[86].bought && precioUno < 0) {
        OptimalItem() .buy();
        selected = 0;
    } 
    else if (autoBuy && selected == 1 && keepForGolden && !Game.UpgradesById[86].bought && precioDos < 0) {
        OptimalItem() .buy();
        selected = 0;
    } 
    else if (selected == 0) {
        currentCps = Game.cookiesPs;
        OptimalItem();
    }
    Display();
}, interval
);
/*setInterval(function() {Game.goldenCookie.life = 1;}, 120000);*/
