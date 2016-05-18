$(document).ready(function(){
/*
    cnlib.checkUserLogin(
        function(){

        }
        ,function(){
            window.location = "index.html";
        }
    );

    $(this).click(function(){
        cnlib.checkUserLogin(
            function(){

            }
            ,function(){
                window.location = "index.html";
            }
        );
    });
*/
    counter.takeCurrentCounter();
    //config.init();

    img_height_init = $('#back_image').height();

    $('.vertical').width(img_height_init);
    $('.vertical').offset({top:60});

    //setTimeout(function(){stylesheet.init();},20);

    stylesheet.init();
    config.showInformations();	
});

$(window).resize(function(){
        stylesheet.calculatePositions();
});
/**** define the positions of the numbers ****/
var counter = {
    currMeter : 0,
    //numbersArray : [],
    counterNmbrs : [],
    timeout : 0,
    random_count : true,
    one_time : true,

    init : function(){

        counter.takeCurrentCounter();
        //counter.showNumbersInDoc();
    },
    takeCurrentCounter : function(){
        cnlib.putGetPostData('config/currcount.json','JSON','GET','', function(data){
		console.log(JSON.stringify(data));

		 console.log('takeCurrentCounter '+counter.currMeter);

            counter.currMeter = data[1];

            console.log("Current Metter " + counter.currMeter.value);
            console.log("Aktueller Zaehlerstand : " + JSON.stringify(counter.currMeter));

            var allCount = data[1].value.split(".").splice(0,1);

            var beforePoint = [];
            beforePoint.length = 6;

            for(var i = 5; i >= 0; --i) {
                beforePoint[i] = allCount % 10;
                allCount = parseInt(allCount / 10);
            }

            counter.counterNmbrs = beforePoint;
            //console.log('Brunos Array '+counter.counterNmbrs);
            counter.showNumbersInDoc();

            if(counter.one_time === true){
                config.getConfig();
                counter.one_time = false;
            }
	},
	function() {
	});
       /*
	    cnlib.putGetPostData('api/graph/getcurcount','JSON','GET','',function(data){
            console.log('takeCurrentCounter '+counter.currMeter);

            counter.currMeter = data[1];

            console.log("Current Metter " + counter.currMeter.value);
            console.log("Aktueller Zaehlerstand : " + JSON.stringify(counter.currMeter));

            var allCount = data[1].value.split(".").splice(0,1);

            var beforePoint = [];
            beforePoint.length = 6;

            for(var i = 5; i >= 0; --i) {
                beforePoint[i] = allCount % 10;
                allCount = parseInt(allCount / 10);
            }

            counter.counterNmbrs = beforePoint;
            //console.log('Brunos Array '+counter.counterNmbrs);
            counter.showNumbersInDoc();

            if(counter.one_time === true){
                config.getConfig();
                counter.one_time = false;
            }

        },function(err){
            console.log(err);
        });*/

        // Zaehlerstand alle 10 Sekunden abfragen
        counter.timeout = setTimeout(function(){
    //        counter.takeCurrentCounter();
        },10000);
    },
    showNumbersInDoc : function(nr){
        var html = '';

        var digit = counter.counterNmbrs;
        console.log(digit);

        for (var i=0; i<digit.length; ++i){
            //html += '<div width="50px" height="70"><img src="img/DigitalZahl/'+digit[i]+'.svg" class="digital" id="'+digit[i]+'"></div>';
           // html += '<img src="img/DigitalZahl/'+digit[i]+'.svg" class="digital" id="'+digit[i]+'">';
            //html += '<div style="background-image: url(../img/DigitalZahl/'+digit[i]+'.svg)" class="digital" id="'+digit[i]+'"></div>';

            html += '<img src="img/DigitalZahlPNG/'+digit[i]+'.png" class="digital" id="'+digit[i]+'">';
        }
        $('.counter_numbers').html(html);
        console.log(counter.counterNmbrs);

        if(counter.random_count === true) {
            machine.init();
            counter.random_count = false;
        }
        stylesheet.init();
    }
}
var config = {
    game : null,

    /*init : function(){
        config.getConfig();
    },*/
    writeInformations : function(){
        var info = '';

        info += '<div class="modal fade" id="info_game">';
        info += '<div class="modal-dialog">';
        info += '<div class="modal-content">';
        info += '<div class="modal-header">';
        info += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        info += '<h4 class="modal-title header-info">Spielbeschreibung</h4>';
        info += '</div>';
        info += '<div class="modal-body">';

        /*info += '<h4> Die zwei Zahlenreihen kennzeichen den aktuellen Zählerstand, ohne Nachkommastellen, sowie das Ergebnis des Spiels.</h4>';
        info += '<h4> Der aktuelle Z&auml;hlerstand ist die obere Zahl und das Resultat wird in der unteren Zahl angezeigt.</h4>';
        info += '<h4> Durch bet&auml;tigen der Start-Taste wird das Spiel gestartet.</h4>';
        info += '<h4> Um das Spiel zu stoppen muss f&uuml;r jede Ziffer die Stopp-Taste bet&auml;tigt werden.</h4>';
        info += '<h4> Bei gleichen Zahlen an der selben Position erhalten Sie 50 Punkte.</h4>';
        info += '<h4> Nach zehn Spielen oder erreichen von einer Punktzahl von 1000 wird das Punktekonto zur&uuml;ck gesetzt.</h4>';
        info += '<h4> Der aktuelle Spielstand wird für sp&auml;tere Spiele auf dem Ger&auml;t gespeichert.</h4>';
        info += '<h4> Am unteren Rand der Webseite wird Ihnen der Verbrauch zwischen den letzten Spielen sowie seit dem ersten Spiel angezeigt.</h4>';*/

        info += '<h4 class="titlu">Ziel des Spiels </h4>';
        info += '<h4 class="margin_top_nul"> Treffe deinen Z&auml;hlerstand und sammle bis zu 1.000 Punkte in max.<br />10 Spielen.</h4>';
        info += '<h4 class="titlu">Punktesystem</h4>';
        info += '<h4 class="margin_top_nul"> Je getroffener Z&auml;hlerstelle erh&auml;ltst du 50 Punkte.</h4>';
        info += '<h4 class="titlu">Spiel Funktion</h4>';
        info += '<h4 class="margin_top_nul">Starte den einarmigen Banditen mit Klick auf „Start !“ und klicke je Z&auml;hlerstelle einmal auf „Stopp !“.</h4>';
        info += '<h4 class="titlu">Highscore</h4>';
        info += '<h4 class="margin_top_nul">Deinen aktuellen Punktestand innerhalb der 10 Spiele zeigt dir der blaue Highscore am Bildrand an. Nach 10 Spielen oder erreichten 1.000 Punkten wird der Highscore wieder auf 0 gesetzt.</h4>';
        info += '<h4 class="titlu">Energieverbrauch</h4>';
        info += '<h4 class="margin_top_nul">Am unteren Bildrand wird dir stets dein Energieverbrauch seit dem letzten Spiel und seit dem ersten Spiel angezeigt.</h4>';
        info += '</div>';
        info += '<div class="modal-footer">';
        info += '<button type="button" class="btn btn-default" data-dismiss="modal">Schlie&szlig;en</button>';
        info += '</div>';
        info += '</div><!-- /.modal-content -->';
        info += '</div><!-- /.modal-dialog -->';
        info += '</div><!-- /.modal -->';

        $('#informations').html(info);

        $('#info_game')
        .modal({
            backdrop: 'static',
            keyboard: 'false'
        });

        $('#info_game').modal('show');
    },
    showInformations : function(){

        $('.glyphicon-info-sign').unbind('click');
        $('.glyphicon-info-sign').click(function(){

            config.writeInformations();
        });
    },	

    getConfig : function(){
        cnlib.putGetPostData('config/game.json','JSON','GET','',
            function(data){

                console.log('Get Configuration '+ counter.currMeter.value);

                config.game = JSON.parse(JSON.stringify(data));
                console.log(config.game);

                if(config.game.total_games < 0) {
                    config.game.total_games = 10;
                }
                machine.totalGames = config.game.total_games

                $('.progress-bar').css('width',compare.progress * (config.game.counter/compare.step)+'%');
                console.log(machine.totalGames);

                //compare.updateTheScore();

                var diff = 0;

                if(config.game.meter_data.length == 1){
                    //diff = parseInt((config.game.meter_data[0] - config.game.init_meter) * 1000000);
                    diff = parseInt((counter.currMeter.value - config.game.init_meter) * 1000000);
                    diff /= 1000000;

                    console.log('Differenz für ein element 147 - '+diff);

			$('#sinceLastGame').html(diff.toLocaleString('de-DE',{minimumFractionDigits: 6 }) +' kWh');
                    //$('#sinceLastGame').html(diff+' kW');
                }else{
                    var len = config.game.meter_data.length;
                    diff = counter.currMeter.value - config.game.meter_data[len-1];
                    diff = parseInt(diff * 1000000);
                    diff /= 1000000;

                    console.log('Differenz für mehrere elemente 156 - '+diff);

			$('#sinceLastGame').html(diff.toLocaleString('de-DE',{minimumFractionDigits: 6 }) +' kWh');
                    //$('#sinceLastGame').html(diff+' kW');
                }
                diff = counter.currMeter.value - config.game.init_meter;
                diff = parseInt(diff * 1000000);
                diff /= 1000000;
                //$('#sinceFirstGame').html(diff +' kW');
		$('#sinceFirstGame').html(diff.toLocaleString('de-DE',{minimumFractionDigits: 6 }) +' kWh');

            },function(error){
                //machine.init();
                console.log("config/game.json not avail");

                var conf ={
                    'counter' : 0,
                    'init_meter' : 0,
                    'total_games' : 10,
                    'meter_data' : []
                }

                config.game = conf;

                console.log(JSON.stringify(conf));
                console.log("Aktueller Zaehlerstand in Config : " + counter.currMeter);
                console.log("Aktueller Zaehlerstand in Config value : " + counter.currMeter.value);

                machine.totalGames = config.game.total_games;
            }
        );
    },
    postConfig : function(){
        var data = JSON.stringify(config.game);

        cnlib.putGetPostData('api/graph/set_config','JSON','POST',data,
            function(){
                console.log(data);
            },function(error){
                console.log(error);
            }
        );
    }
}
var compare = {
    caught : 0,
    totalPointsForOneGame : 0,
    totalPointsHistory : {
        points : 0
    },
    step : 50,
    progress : 5,       // Immer step / 10
    progress_bar : 0,

    compareValues : function(){

        for(var i=0;i<6;++i){
            if(parseInt($(".counter_numbers img").eq(i).attr('id')) == machine.activeNumbers[i]){
                compare.caught++;
                console.log("we have " + compare.caught);
            }
        }
    },
    updateTheScore : function(){

        console.log(machine.totalGames);

        compare.totalPointsForOneGame = compare.caught * compare.step;

        config.game.counter += compare.totalPointsForOneGame;
        console.log("You have "+compare.totalPointsForOneGame+" points for this one game");
        compare.totalPointsHistory.points += compare.totalPointsForOneGame;

        $('.progress-bar').css('width', (compare.progress * (config.game.counter/compare.step))+'%');
        console.log("GAME COUNTER:" + config.game.counter);

    }
}


/***** define the machines properties ****/
var machine = {
    totalGames : 10,
    activeNumbers : [],
    started : 0,
    ENABLE_START : 1000,

    machine1 : null,
    machine2 : null,
    machine3 : null,
    machine4 : null,
    machine5 : null,
    machine6 : null,

    init : function(){

        machine.drawMachines();

        machine.machine1 = $("#machine1").slotMachine({
            active  : 1,
            delay   : 550,
        });

        machine.machine2 = $("#machine2").slotMachine({
            active  : 2,
            delay   : 500,
        });

        machine.machine3 = $("#machine3").slotMachine({
            active  : 3,
            delay   : 340,
        });

        machine.machine4 = $("#machine4").slotMachine({
            active  : 4,
            delay   : 280,
        });

        machine.machine5 = $("#machine5").slotMachine({
            active  : 5,
            delay   : 450,
        });
        machine.machine6 = $("#machine6").slotMachine({
            active  : 1,
            delay   : 350,
        });

        machine.startMachines();
        machine.stopMachines();
    },
/******* lets draw the Machines now ******/
    drawMachines : function(){
        var i=0;
        var html='';

        for(;i < 6; ++i){
            var m = i+1;
            var mach = "machine" +m;
            var rand = parseInt(Math.random() * 1000000) % 10;

            html += '<div id="machine'+m+'" class="slotMachine" >';

            html += '<div id="'+mach+'_0" class="slot slot'+rand+'" name="'+rand+'"></div>';
            rand = parseInt(Math.random() * 1000000) % 10;
            html += '<div id="'+mach+'_1" class="slot slot'+rand+'" name="'+rand+'"></div>';
            html += '<div id="'+mach+'_2" class="slot slot'+counter.counterNmbrs[i]+'" name="'+counter.counterNmbrs[i]+'"></div>';
            rand = parseInt(Math.random() * 1000000) % 10;
            html += '<div id="'+mach+'_3" class="slot slot'+rand+'" name="'+rand+'"></div>';
            rand = parseInt(Math.random() * 1000000) % 10;
            html += '<div id="'+mach+'_4" class="slot slot'+rand+'" name="'+rand+'"></div>';

            html += '</div>';

            /*html += '<div id="machine'+i+'" class="slotMachine" >';
            html += '<div class="slot slot'+counter.counterNmbrs[0]+'"></div>';
            html += '<div class="slot slot'+counter.counterNmbrs[1]+'"></div>';
            html += '<div class="slot slot'+counter.counterNmbrs[2]+'"></div>';
            html += '<div class="slot slot'+counter.counterNmbrs[3]+'"></div>';
            html += '<div class="slot slot'+counter.counterNmbrs[4]+'"></div>';
            html += '<div class="slot slot'+counter.counterNmbrs[5]+'"></div>';
            html += '</div>';*/

        }
        $('.all_machines').html(html);
    },
    startMachines : function(){
        $("#slotMachineButtonShuffle").unbind();
        $("#slotMachineButtonShuffle").click(function(){


		var temp = (parseInt(Math.random() * 1000000)) / 1000000;
		console.log("CLICKING: " + counter.currMeter.value + "  " + temp);
		counter.currMeter.value = parseFloat(counter.currMeter.value) + temp;

		console.log("CLICK: " + counter.currMeter.value);

            machine.init();
            stylesheet.calculatePositions();

            console.log("TIMEOUT: " + counter.timeout);
            if(counter.timeout != 0) {
            console.log("TIMEOUTEN WIR NUN");
                clearTimeout(counter.timeout);
                counter.timeout = 0;
            } else {
                console.log("liusadfzgowlhergopa");
            }

            if(machine.totalGames == 0) {
                machine.totalGames = 10;
            }
            if(machine.totalGames == 10) {

                config.game.counter = 0;
                $('.progress-bar').css('width','0%');
            }
            machine.totalGames--;
            config.game.total_games = machine.totalGames;

            if(config.game.init_meter == 0){
                config.game.init_meter = counter.currMeter.value;
            }

            config.game.meter_data.push(counter.currMeter.value);

            if(config.game.meter_data.length > 10){
                config.game.meter_data.splice(0,1);
            }

            console.log('Slot Machine Shuffle : '+ JSON.stringify(config.game));

            compare.caught = 0;
            machine.started = 6;

            machine.machine1.shuffle();
            machine.machine2.shuffle();
            machine.machine3.shuffle();
            machine.machine4.shuffle();
            machine.machine5.shuffle();
            machine.machine6.shuffle();

            $(this).addClass('disabledbutton');
        });
    },
    showModal : function(points){

        var warning = '';

        warning += '<div class="modal fade" id="tenGames">';
        warning += '<div class="modal-dialog">';
        warning += '<div class="modal-content">';
        warning += '<div class="modal-header">';
        warning += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        warning += '<h4 class="modal-title header-info">Herzlichen Gl&uuml;ckwunsch</h4>';
        warning += '</div>';
        warning += '<div class="modal-body">';
        if(machine.totalGames == 0){
            warning += '<center><h4 class="navbar-a">Sie haben 10 Spiele gespielt und insgesamt ' + points + ' Punkte erreicht !</h4></center>';
        }
        if(config.game.counter >= 1000){
            warning += '<center><h4 class="navbar-a">Herzlichen Gl&uuml;ckwunsch ! Sie haben '+points+' Punkte erreicht !</h4></center>';
        }
        warning += '</div>';
        warning += '<div class="modal-footer">';
        warning += '<button type="button" class="btn btn-default" data-dismiss="modal">Schlie&szlig;en</button>';
        warning += '</div>';
        warning += '</div><!-- /.modal-content -->';
        warning += '</div><!-- /.modal-dialog -->';
        warning += '</div><!-- /.modal -->';

        $('#nachricht').html(warning);

        $('#tenGames')
        .modal({
            backdrop: 'static',
            keyboard: 'false'
        });

        $('#tenGames').modal('show');

        machine.totalGames = 10;
    },
    equivalent : function(a){
         return counter.counterNmbrs[a];
    },
    stopMachines : function(){
        $("#slotMachineButtonStop").unbind();
        $("#slotMachineButtonStop").click(function(){

        switch(machine.started){
            case 6:
                machine.machine1.stop();

                var m1 = $('#machine1_'+machine.machine1.active).attr('name');
                console.log(m1);

                //machine.machine1.active = machine.equivalent(machine.machine1.active);
                //console.log(machine.machine1.active);
                machine.activeNumbers.push(m1);

                break;
            case 5:
                machine.machine2.stop();
                var m2 = $('#machine2_'+machine.machine2.active).attr('name');
                console.log(m2);

                //machine.machine2.active = machine.equivalent(machine.machine2.active);
                //console.log(machine.machine2.active);
                machine.activeNumbers.push(m2);

                break;
            case 4:
                machine.machine3.stop();
                var m3 = $('#machine3_'+machine.machine3.active).attr('name');
                console.log(m3);
                //machine.machine3.active = machine.equivalent(machine.machine3.active);
                //console.log(machine.machine3.active);
                machine.activeNumbers.push(m3);

                break;
            case 3:
                machine.machine4.stop();
                var m4 = $('#machine4_'+machine.machine4.active).attr('name');
                console.log(m4);

                //machine.machine4.active = machine.equivalent(machine.machine4.active);
                //console.log(machine.machine4.active);
                machine.activeNumbers.push(m4);

                break;
            case 2:
                machine.machine5.stop();
                var m5 = $('#machine5_'+machine.machine5.active).attr('name');
                console.log(m5);

                //machine.machine5.active = machine.equivalent(machine.machine5.active);
                //console.log(machine.machine5.active);
                machine.activeNumbers.push(m5);

                break;
            case 1:
                machine.machine6.stop();
                var m6 = $('#machine6_'+machine.machine6.active).attr('name')
                console.log(m6);

                //machine.machine6.active = machine.equivalent(machine.machine6.active);
                //console.log(machine.machine6.active);
                machine.activeNumbers.push(m6);

                // Button disablen
                $('#slotMachineButtonShuffle').addClass('disabledbutton');
                // Hier wird das auslesen neu gestartet.
                setTimeout(function(){
                    //counter.takeCurrentCounter();
                    $('#slotMachineButtonShuffle').removeClass('disabledbutton');
                }, machine.ENABLE_START);

                var diff = 0;
                var len = config.game.meter_data.length;
                if(config.game.meter_data.length == 1){
                    diff = parseInt((config.game.meter_data[0] - config.game.init_meter) * 1000000);
                    diff /= 1000000;

                    console.log('Differenz für ein element '+diff);

//                    $('#sinceLastGame').html(diff+' kW');
			$('#sinceLastGame').html(diff.toLocaleString('de-DE',{minimumFractionDigits: 6 }) +' kWh');
                }else{
                    len = config.game.meter_data.length;
                    diff = config.game.meter_data[len-1] - config.game.meter_data[len-2];
                    diff = parseInt(diff * 1000000);
                    diff /= 1000000;

                    console.log('Differenz für mehrere elemente '+diff);

//                    $('#sinceLastGame').html(diff+' kW');
			$('#sinceLastGame').html(diff.toLocaleString('de-DE',{minimumFractionDigits: 6 }) +' kWh');
                }
		console.log("SPIEL BEENDET: " + len);
		console.log(typeof config.game.init_meter);
		console.log(config.game.init_meter);
		console.log(JSON.stringify(config.game));
                console.log(typeof config.game.meter_data[len-1]);
                console.log(config.game.meter_data[len-1]);
                diff = config.game.meter_data[len-1] - config.game.init_meter;
                diff = parseInt(diff * 1000000);
                diff /= 1000000;
//                $('#sinceFirstGame').html(diff +' kW');
		$('#sinceFirstGame').html(diff.toLocaleString('de-DE',{minimumFractionDigits: 6 }) +' kWh');

                break;
        }

        machine.started--;

        if(machine.started == 0){

            compare.compareValues();
            compare.updateTheScore();
            config.postConfig();
            machine.activeNumbers = [];

            if( machine.totalGames <= 0  ){
                machine.showModal(config.game.counter);

                config.game.total_games = 10;
                config.game.counter = 0;
            }
        }

        if(config.game.counter >= 1000){

            machine.showModal(config.game.counter);
            config.game.counter = 0;
            machine.totalGames = 10;
        }

        });
    }
}
/*
    Here we define the stylesheet for the Slot Machines

    - we defined more than 6 machines
*/
var stylesheet = {
    init : function(){
        stylesheet.calculatePositions();
    },
    calculateOffsetTopDigit : function(height) {
        return (height / 100)*71;
    },
    calculateOffsetTopColoured : function(height) {
        return (height / 100)*88.5;
    },
    setWidthForTheClass : function(clas,procent){
        $(clas).css('width',procent+'%');
    },
    setHeightForTheClass : function(clas,val){
        $(clas).css('height',val);
    },
    horizontalBarPoint : function(){
        $('.vertical')
        .css({
            'transform' : 'rotate(0deg)',
            'width' : '100%'
        })
        .offset({top : 0})
        .addClass('container');
    },
    glyphiconPosition : function(clas, r, t){
        $(clas).css({
            'right': r+'%',
            'top' : t+'%'
        });
    },
    digitalOriginalCss: function(){
        $('.digital').css({
            'padding':'1px',
            'margin-right' : '1.6em',
            'margin-left' : '0.6em'
        });
    },
    blockLandscape : function(){
        $(window).bind('orientationchange', function(e) {
            switch ( window.orientation ) {
             case 0:
               $('.turnDeviceNotification').css('display', 'none');
               // The device is in portrait mode now
             break;

             case 180:
               $('.turnDeviceNotification').css('display', 'none');
               // The device is in portrait mode now
             break;

             case 90:
               // The device is in landscape now
               $('.turnDeviceNotification').css('display', 'block');
             break;

             case -90:
               // The device is in landscape now
               $('.turnDeviceNotification').css('display', 'block');
             break;
            }
        });
    },
    calculatePositionsForNumbers : function(){

        console.log("I am here 0 !");

        var imgHeight = $('#back_image').height();
        var top_off_digit = stylesheet.calculateOffsetTopDigit(imgHeight);
        var top_off_bottom = stylesheet.calculateOffsetTopColoured(imgHeight);

        $('.counter_numbers').offset({
            top : top_off_digit,
        });

        $('.all_machines').offset({
            top : top_off_bottom
        });
    },
    showTheHighScore : function(clas,margin){
        $(clas).css({
            'margin-left': margin+'%',
            'font-weight': 'bold',
            'padding':'0 !important'
        });
    },
    calculatePositions : function(){

        console.log("I am here 1 !");

        var doc_width = $(document).width();
        var imgHeight = $('#back_image').height();

        if( doc_width > 1430){

            stylesheet.setWidthForTheClass('.all_machines',30);
            //stylesheet.setWidthForTheClass('.digital',30);
            stylesheet.setHeightForTheClass('.digital',imgHeight/13);
            stylesheet.digitalOriginalCss();
            stylesheet.showTheHighScore('.p0',1);
            stylesheet.showTheHighScore('.p250',22);
            stylesheet.showTheHighScore('.p500',48);
            stylesheet.showTheHighScore('.p750',73);
            stylesheet.showTheHighScore('.p1000',95);

       	stylesheet.glyphiconPosition('.glyphicon-info-sign',18,7);

            $('.vertical')
            .css({
                'transform':'rotate(-90deg)',
                'margin-left' : '0',
                'width' : img_height_init
            })
            .offset({top:60});

            $('.slotMachine').height('60px');
            $('.container-texts').removeClass('padding_6_em');
            $('.text-center').removeClass('padding_6_em');

            stylesheet.calculatePositionsForNumbers();

        }else if( 1183 < doc_width && doc_width <= 1430 ){

            stylesheet.setWidthForTheClass('.all_machines',30);
            stylesheet.setHeightForTheClass('.digital',imgHeight/13);
            stylesheet.horizontalBarPoint();
            stylesheet.digitalOriginalCss();
            $('.slotMachine').height('60px');
            $('.container-texts').removeClass('padding_6_em');
            $('.text-center').removeClass('padding_6_em');
            stylesheet.calculatePositionsForNumbers();
            stylesheet.showTheHighScore('.p0',1);
            stylesheet.showTheHighScore('.p250',22);
            stylesheet.showTheHighScore('.p500',48);
            stylesheet.showTheHighScore('.p750',73);
            stylesheet.showTheHighScore('.p1000',95);

	stylesheet.glyphiconPosition('.glyphicon-info-sign',10,7);

        }else if(978 < doc_width && doc_width <= 1183){

            stylesheet.setWidthForTheClass('.all_machines',35);
            stylesheet.setHeightForTheClass('.digital',imgHeight/13);
            stylesheet.horizontalBarPoint();
            stylesheet.digitalOriginalCss();
            $('.slotMachine').height('60px');
            $('.container-texts').removeClass('padding_6_em');
            $('.text-center').removeClass('padding_6_em');
            stylesheet.calculatePositionsForNumbers();
            stylesheet.showTheHighScore('.0',1);
            stylesheet.showTheHighScore('.p250',22);
            stylesheet.showTheHighScore('.p500',48);
            stylesheet.showTheHighScore('.p750',73);
            stylesheet.showTheHighScore('.p1000',95);

	stylesheet.glyphiconPosition('.glyphicon-info-sign',5,7);

        }else if(430 < doc_width && doc_width <= 978){
            console.log("i am here 3");

            stylesheet.setWidthForTheClass('.all_machines',47);
            stylesheet.setHeightForTheClass('.digital',imgHeight/13);
            stylesheet.horizontalBarPoint();
            stylesheet.digitalOriginalCss();
            $('.slotMachine').height('60px');
            $('.container-texts').removeClass('padding_6_em');
            $('.text-center').removeClass('padding_6_em');
            stylesheet.calculatePositionsForNumbers();

            stylesheet.showTheHighScore('.p',1);
            stylesheet.showTheHighScore('.p250',22);
            stylesheet.showTheHighScore('.p500',48);
            stylesheet.showTheHighScore('.p750',73);
            stylesheet.showTheHighScore('.p1000',95);

	stylesheet.glyphiconPosition('.glyphicon-info-sign',5,7);

        }else if(320 < doc_width && doc_width <=430){
            console.log("i am here 4");

		stylesheet.blockLandscape();

            $('.slotMachine').height('30px');
            $('.container-texts').addClass('padding_6_em');
            $('.text-center').addClass('padding_6_em');
            stylesheet.setWidthForTheClass('.all_machines',45);
            stylesheet.setHeightForTheClass('.digital',imgHeight/12);
            stylesheet.horizontalBarPoint();

            stylesheet.showTheHighScore('.p',1);
            stylesheet.showTheHighScore('.p250',22);
            stylesheet.showTheHighScore('.p500',48);
            stylesheet.showTheHighScore('.p750',73);
            stylesheet.showTheHighScore('.p1000',95);

	stylesheet.glyphiconPosition('.glyphicon-info-sign',1,7);

            $('.digital').css({
                'padding':'0px',
                'margin-right' : '5px'
            });

            $('.counter_numbers').offset({
                top : imgHeight-72,
            });

            $('.all_machines').offset({
                top : imgHeight-17
            });

            $('.slot').css({
                'background-size':'50%',
                'background-position':'50% 6%'
            });

        }else{
            stylesheet.blockLandscape();
            console.log("i am here 5");
            $('.slotMachine').height('30px');
            $('.container-texts').addClass('padding_6_em');
            $('.text-center').addClass('padding_6_em');

            stylesheet.setWidthForTheClass('.all_machines',45);
            stylesheet.setHeightForTheClass('.digital',imgHeight/12);
            stylesheet.horizontalBarPoint();

	stylesheet.glyphiconPosition('.glyphicon-info-sign',1,7);

            $('.digital').css({
                'padding':'0px',
                'margin-right' : '5px'
            });

            $('.counter_numbers').offset({
                top : "220",
            });

            $('.all_machines').offset({
                top : "267"
            });

            $('.slot').css({
                'background-size':'50%',
                'background-position':'50% 6%'
            });

            stylesheet.showTheHighScore('.p0',1);
            stylesheet.showTheHighScore('.p250',22);
            stylesheet.showTheHighScore('.p500',47);
            stylesheet.showTheHighScore('.p750',73);
            stylesheet.showTheHighScore('.p1000',95);

        }

        console.log("WINDOW width " + $(window).width());

    }
}

/*
        switch(compare.caught){
            case 6 :
                    $('.progress-bar').css('width', (progres*6)+'%');
                    compare.totalPointsForOneGame = compare.caught * compare.step;

                    console.log("You have "+compare.totalPointsForOneGame+" points for this one game");

                    compare.totalPointsHistory.points += compare.totalPointsForOneGame;

                    break;
            case 5 :
                    $('.progress-bar').css('width', (progres*5)+'%');
                    compare.totalPointsForOneGame = compare.caught * compare.step;

                    console.log("You have "+compare.totalPointsForOneGame+" points for this one game");

                    compare.totalPointsHistory.points += compare.totalPointsForOneGame;

                    break;
            case 4 :
                    $('.progress-bar').css('width', (progres*4)+'%');
                    compare.totalPointsForOneGame = compare.caught * compare.step;

                    console.log("You have "+compare.totalPointsForOneGame+" points for this one game");

                    compare.totalPointsHistory.points += compare.totalPointsForOneGame;

                    break;
            case 3 :
                    $('.progress-bar').css('width', (progres*3)+'%');
                    compare.totalPointsForOneGame = compare.caught * compare.step;

                    console.log("You have "+compare.totalPointsForOneGame+" points for this one game");

                    compare.totalPointsHistory.points += compare.totalPointsForOneGame;

                    break;
            case 2 :
                    $('.progress-bar').css('width', (progres*2)+'%');
                    compare.totalPointsForOneGame = compare.caught * compare.step;

                    console.log("You have "+compare.totalPointsForOneGame+" points for this one game");

                    compare.totalPointsHistory.points += compare.totalPointsForOneGame;

                    break;
            case 1 :
                    $('.progress-bar').css('width', (progres*1)+'%');
                    compare.totalPointsForOneGame = compare.caught * compare.step;

                    console.log("You have "+compare.totalPointsForOneGame+" points for this one game");

                    compare.totalPointsHistory.points += compare.totalPointsForOneGame;

                    break;
            default : console.log("nothing");
                    compare.totalPointsForOneGame = compare.caught * compare.step;

                    console.log("You have "+compare.totalPointsForOneGame+" points for this one game");

                    break;
        }
        if(machine.totalGames <= 10){
            compare.progress_bar = $('.progress-bar').width();

            console.log($('.progress-bar').width());
        }

        console.log(compare.totalPointsHistory);
        if(compare.totalPointsHistory >= 1000){
            //machine.showModal(compare.);
        }
*/
/*            var beforePoint = allCount.toString().split("");
            beforePoint = beforePoint.reverse();

            beforePoint.length = 6;

            for(var i=0; i<beforePoint.length;++i){
                if(beforePoint[i] == undefined){
                    beforePoint[i] = "0";
                }

                beforePoint[i] = parseInt(beforePoint[i]);
            }

            beforePoint = beforePoint.reverse();
*/
