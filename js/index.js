$(document).ready(function(){

    main.initialize();
//    main.loadingThePage();
});

function get_decimal(val) {
    var d;
    if(val < 10) {
        d = "0" + val;
    } else {
        d = val;
    }
    return d;
}

var main = {
    data : [0,0],
    graph : null,
    g4 : null,
    allData : [0,0],
    update_timeout : 0,
    load_data_timeout : 0,
    get_all_Data : false,

    initialize: function() {
        cnlib.checkUserLogin(

            function(){
                main.initGraph();
                main.getStateCounter();  //we load the data from Counter Reader
                cnlib.changeThePassword('.user-account','.new-password-modal-dialog');
                main.modifyThePassword();

                //take one week in seconds
                var one_week = 7*60*60*24;
                one_week = one_week.toString();
                //take the current day
                var now = new Date();
                console.log("GET ALL DATA");
                console.log(now.toString());
                now = Math.round(Date.parse(now.toString()) / 1000);
                var startWeek = now - one_week;
                console.log("NOW TIMESTAMP");
		console.log(now);
                //extract only the year from a date and substract one so we can now the last year
                var lastYear = new Date();
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                lastYear = Math.round(Date.parse(lastYear.toString()) / 1000);

//                main.getActualYear(lastYear, now);
                main.getAllData(lastYear, now);
                //main.getAllData();         /********************************************************************/

                main.buttonsTrigger();
                //main.collapseTheSecondNav();
            },
            function(){
                window.location = "index.html";
            }
        );
    },
    /*********************** Informations about the Date,Time,Electric Meter and the Quality of Network Connection ****/

    /*getDateAndTime : function(){

        window.setInterval(function(){
            var date = new Date();

            $('#date').html( date.toDateString() );
            $('#time').html( date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() );
        },1000);
    },*/

    /*collapseTheSecondNav : function(){                    / ------------------------------------------------------- -/
        $('#state_of_meter').click(function(){
            var name = $(this).attr('name');
            var content = '#' + name + '_content';

            $(content).collapse('toggle');
        });
    },*/
    getStateCounter : function(){
        cnlib.putGetPostData('api/graph/getcurcount','JSON','GET','',function(data){
                console.log(data[0].datetime);
                console.log(data[0].value);

                var date = data[0].datetime;
                var val = data[1].value;
                date = parseInt(date) * 1000;

                console.log(parseInt(date));

                var current_date = new Date(date);

                var weekday = new Array(7);
                weekday[0] = "So";
                weekday[1] = "Mo";
                weekday[2] = "Di";
                weekday[3] = "Mi";
                weekday[4] = "Do";
                weekday[5] = "Fr";
                weekday[6] = "Sa";

                var day = weekday[current_date.getDay()];
                var currDate = current_date.getDate();
                var month = current_date.getMonth()+1;
                var year = current_date.getFullYear();

                $('#time_and_date').html("<br />" + day + ' ' + get_decimal(currDate) +'.' + get_decimal(month) + '.' + year + ' ' + current_date.getHours() + ':' + get_decimal(current_date.getMinutes()));
                $('#electric_meter').html(val);
        });
        cnlib.putGetPostData('api/lora/lastrssi','JSON','GET','',function(data){
            console.log(data);

            if(data != undefined) {
                console.log("test");
                console.log(data[0].lastrssi);
                if(data[0].lastrssi != undefined) {
                    $('#quality').html("<br />" + data[0].lastrssi + ' dBm');

                }
            }
        });
        setTimeout(function() { main.getStateCounter(); }, 5000);
    },
    /******************************************************************************************************************/
    buttonsTrigger : function(){
        cnlib.checkUserLogin(
            function(){
                main.todayButton();
                main.weekButton();
                main.monthButton();
                main.yearButton();
            },
            function(){
                window.location = "index.html";
            }
        );
    },
    modifyThePassword : function(){
        $('#btn-save-passwd').click(
            function(e){
                e.preventDefault();
                var actual_passwd = $('#actual-passwd').val();
                var first_passwd = $('#new-passwd').val();
                var second_passwd = $('#repeat-passwd').val();
                var string_passwd = JSON.stringify( [{'id' : '1', 'currpassword' : actual_passwd, 'newpassword' : first_passwd, 'newpassword2' : second_passwd}] );

                cnlib.checkUserLogin(
                    function(){
                        if( (actual_passwd != '') && (first_passwd != '') && (first_passwd == second_passwd) ){
                            cnlib.putGetPostData('api/user/changepassword','JSON','post',string_passwd, function(string_passwd){});
                            $('.new-password-modal-dialog').modal('hide');
                        }else{
                            $('input[type=password]').css('border','2px solid #F7650A');
                            setTimeout(function(){
                                $('input[type=password]').css('border','1px solid #ccc');
                            },5000);
                        }
                        $('input[type=password]').val('');
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    /*intervalStart : function(){

        if(main.window) { return; }

        main.window = setInterval(function(){
            var x = new Date();
            var y = Math.random();
            main.data.push([x,y]);
            //main.graph.updateOptions({'file' : main.data});
        }, 3000);
    },*/
    getSelectedData : function (start, end) {
        if(main.get_all_Data === true) {
            main.get_all_Data = false;
            return;
        }
        main.waitForData();

        var newstart = new Date(start * 1000);
        var min = newstart.getMinutes();

        if(min < 15) { min = 0; }
            else if(min < 30) { min = 15; }
            else if(min < 45) { min = 30; }
            else if(min > 45) { min = 45; }

        newstart.setMinutes(min);
        newstart.setSeconds(0);

        start = newstart / 1000;

        var json = "start to male";
        var json = "start to ";
        var json = '[{"start":"' + start + '", "end":"' + end + '"}]';
        console.log(json);

        var link = 'api/graph/graph?data=' + json;//[{"start":"'+start+'","end":"'+end+'"}] ';

        cnlib.putGetPostData(decodeURI(link),'text','GET','',
            function(data){
                //console.log("Daten erhalten: " + data);
                main.data = data;
                main.wait_for_drawing();
                //main.initGraph();

                main.graph.updateOptions({
                    title:'Stromverbrauch : Leistung (W)',
                    'file' : main.data
                }, false);

                main.graph.resetZoom();
            },
            function() {
                console.log("Fehler vorhanden");
            }
        );
    },
    getActualYear : function (start, end) {
        var json = '[{"start":"' + start + '", "end":"' + end + '"}]';

        var link = 'api/graph/graph?data=' + json;//[{"start":"'+start+'","end":"'+end+'"}] ';

        cnlib.putGetPostData(decodeURI(link),'text','GET','',
            function(data){
                //console.log("Daten erhalten: " + data);
                //main.allData = data;
                main.data = data;
                main.graph.updateOptions({
                    title:'Stromverbrauch : Leistung (W)',
                    'file' : main.allData
                });
                main.g4.updateOptions({
                    'file' : main.data,
                    showInRangeSelector : true
                });
            },
            function() {
                console.log("Fehler vorhanden");
            }
        );
    },
    getThisWeek : function (start, end) {
/*        var json = '[{"start":"' + start + '", "end":"' + end + '"}]';

        var link = 'api/graph/graph?data=' + json;//[{"start":"'+start+'","end":"'+end+'"}] ';

        cnlib.putGetPostData(decodeURI(link),'text','GET','',
            function(data){
                //console.log("Daten erhalten: " + data);
                main.allData = data;
                //main.initGraph();
                main.graph.updateOptions({
                    title:'Stromverbrauch : Leistung (W)',
                    'file' : main.allData
                });
            },
            function() {
                console.log("Fehler vorhanden");
            }
        );*/
        main.updateRangeTime(start, end);
    },
    getThisMonth : function (start, end) {
/*        var json = '[{"start":"' + start + '", "end":"' + end + '"}]';

        var link = 'api/graph/graph?data=' + json;//[{"start":"'+start+'","end":"'+end+'"}] ';

        cnlib.putGetPostData(decodeURI(link),'text','GET','',
            function(data){
                //console.log("Daten erhalten: " + data);
                main.allData = data;
                //main.initGraph();
                main.graph.updateOptions({
                    title:'Stromverbrauch : Leistung (W)',
                    'file' : main.allData
                });
            },
            function() {
                console.log("Fehler vorhanden");
            }
        );*/
        main.updateRangeTime(start, end);
    },
    getLast24Hours : function (start, end) {
         /*var json = '[{"start":"' + start + '", "end":"' + end + '"}]';

         var link = 'api/graph/graph?data=' + json;//[{"start":"'+start+'","end":"'+end+'"}] ';

         cnlib.putGetPostData(decodeURI(link),'text','GET','',
             function(data){
                 //console.log("Daten erhalten: " + data);
                 main.allData = data;
                 //main.initGraph();
                 main.graph.updateOptions({
                     title:'Stromverbrauch : Leistung (W)',
                     'file' : main.allData
                 });
                 main.updateRange();
                 console.log(main.g4.toString());
             },
             function() {
                 console.log("Fehler vorhanden");
             }
         );*/
         main.updateRangeTime(start, end);
//         main.getSelectedData(Math.round(start / 1), Math.round(end / 1));
     },
    getAllData : function(start, end){
        var json = '[{"start":"' + start + '", "end":"' + end + '"}]';

        var link = 'api/graph/graph?data=' + json;//[{"start":"'+start+'","end":"'+end+'"}] ';

        main.waitForData();

        cnlib.putGetPostData(decodeURI(link),'text','GET','',
            function(data){
                main.data = data;
                main.g4.updateOptions({
                    'file' : main.data,
                    showInRangeSelector : true
                });

                main.graph.updateOptions({
                    title:'Stromverbrauch : Leistung (W)',
                    'file' : main.data
                }, false);

                main.get_all_Data = true;
                main.wait_for_drawing();
                main.updateRangeTime(start, end); //the added function

            },
            function() {
                console.log("Fehler vorhanden");
            }
        );
    },
/*    move : function (event, g, context) {
    	console.log("move");
    	console.log(context);
        if (context.isPanning) {
		console.log("pan");
                                    Dygraph.movePan(event, g, context);
                                            } else if (context.isZooming) {
                                                        console.log("zoom");
                                                                    Dygraph.moveZoom(event, g, context);
                                                                            }
                                                                                },*/
    initGraph : function(){

        main.graph = new Dygraph(document.getElementById("graphdiv"),

            main.allData ,
            {
                title: 'Aktueller Stromverbrauch',
                //ylabel: 'Leistung (kW)',
                labelsDivStyles: { 'textAlign': 'center' },
                color : '#286090',
                showRangeSelector: false,
                rangeSelectorHeight: 40,
                rangeSelectorPlotStrokeColor: '#286090',
                rangeSelectorPlotFillColor:'#286090',
                xAxisHeight: 30,
                interactionModel: {
                	//'mousemove' : main.move
                },
                /*xValueFormatter : Dygraph.dateString_,
                xValueParser: function(x) { return 1000*parseInt(x); },
                xTicker: Dygraph.dateTicker,
                axes: {
                    x: {
                        axisLabelFormatter: function(d, gran, opts) {
                            return Dygraph.dateAxisLabelFormatter(new Date(d.getTime()), gran, opts);
                        }
                    }
                },*/
                zoomCallback: main.updateRange, // aktiv BP
            }
        );

        main.g4 = new Dygraph(document.getElementById("nochart"),
            main.data,
            {
                labelsDivWidth: 0,
                drawXAxis: false,
                showRangeSelector: true,
                rangeSelectorHeight: 40,
                /*xValueFormatter : Dygraph.dateString_,
                xValueParser: function(x) { return 1000*parseInt(x); },
                xTicker: Dygraph.dateTicker,
                axes: {
                    x: {
                        axisLabelFormatter: function(d, gran, opts) {
                            return Dygraph.dateAxisLabelFormatter(new Date(d.getTime()), gran, opts);
                        }
                    }
                },*/
                rangeSelectorPlotStrokeColor: '#286090',
                rangeSelectorPlotFillColor:'#286090',
                drawCallback: main.updateZoom
            }
        );
    },
    isThisALeapYear : function (year){
        return ((year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0)));
    },
    todayButton : function(){
        $('#btn_graph_today').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        main.loadingThePage();

                        //take one week in seconds
                        var one_day = 60*60*24;
                        one_day = one_day.toString();

                        //take the current day
                        var now = new Date();
                        now = Math.round(Date.parse(now.toString()) / 1000);
                        var startDay = now - one_day;

                        main.getLast24Hours(startDay, now);
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    weekButton : function(){
        $('#btn_graph_week').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        main.waitForData();
                        //take one week in seconds
                        var one_week = 7*60*60*24;
                        one_week = one_week.toString();

                        //take the current day
                        var now = new Date();
                        now = Math.round(Date.parse(now.toString()) / 1000);
                        var startWeek = now - one_week;

                        //we call the function that gives us the values for the last week
                        main.getThisWeek(startWeek, now);
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    monthButton : function(){
        $('#btn_graph_month').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        /*var monthsWith31Days = [
                                                    {'month':'Januar', 'val':'0'}, {'month':'Maerz','val':'2'},
                                                    {'month':'Mai', 'val':'4'}, {'month':'Juli','val':'6'},
                                                    {'month':'August','val':'7'},{'month':'Oktober' , 'val':'9'},
                                                    {'month':'Dezember','val':'11'}
                                                ];

                        var monthsWithout31Days = [

                                                        {'month':'Februar','val':'1'},{'month':'April','val':'3'},
                                                        {'month':'Juni','val':'5'},{'month':'September','val':'8'},
                                                        {'month':'November','val':'10'}

                                                   ];*/

                        //take the current day
                        main.waitForData();

                        var now = new Date();
                        var currYear = now.getFullYear();
                        var thisMonth = now.getMonth();
                        now = Math.round(Date.parse(now.toString()) / 1000);
                        //extract only the year from a date and substract one so we can now the last year

                        var month30d = 30*60*60*24;     //seconds
                        var month31d = 31*60*60*24;     //seconds
                        var month28d = 28*60*60*24;     //seconds
                        var month29d = 29*60*60*24;

                        switch(thisMonth) {
                            case 0:
                            case 2:
                            case 4:
                            case 6:
                            case 7:
                            case 9:
                            case 11:    startMonth = now - month31d;
                                        main.getThisMonth(startMonth,now);
                                        break;
                            case 1: {
                                if(main.isThisALeapYear(currYear)) {
                                    startMonth = now - month29d;
                                    main.getThisMonth(startMonth,now);
                                } else {
                                    startMonth = now - month28d;
                                    main.getThisMonth(startMonth,now);
                                }
                                        break;
                            }
                            case 3:
                            case 5:
                            case 8:
                            case 10:    startMonth = now - month30d;
                                        main.getThisMonth(startMonth,now);
                                        break;
                        }


                        /*for(var i=0; i < monthsWith31Days.length; ++i){
                            var curr_month_val = monthsWith31Days[i].val;

                            if(thisMonth == curr_month_val){
                                console.log('am 31 de zile');
                                startMonth = now - month31d;
                            }else{
                                if( (thisMonth == '1') && (main.isThisALeapYear(currYear) == true) ){
                                    startMonth = now - month29d;
                                    console.log('sunt an bisect');
                                }else if( (thisMonth == '1') && (main.isThisALeapYear(currYear) == false) ){
                                    console.log('nu sunt an bisect');
                                    startMonth = now - month28d;
                                }else{
                                console.log("test");
                                    startMonth = now - month30d;
                                }
                            }
                        }*/
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    yearButton : function(){
        $('#btn_graph_year').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        main.waitForData();
                        /*

                        var now = new Date();
                        now = Math.round(Date.parse(now.toString()) / 1000);

                        //extract only the year from a date and substract one so we can now the last year
                        var lastYear = new Date();
                        lastYear.setFullYear(lastYear.getFullYear() - 1);
                        lastYear = Math.round(Date.parse(lastYear.toString()) / 1000);

                        main.getActualYear(lastYear, now);*/

                        var now = new Date();
                        now = Math.round(Date.parse(now.toString()) / 1000);

                        var lastYear = new Date();
                        lastYear.setFullYear(lastYear.getFullYear() - 1);
                        lastYear = Math.round(Date.parse(lastYear.toString()) / 1000);

                       //main.getActualYear(lastYear, now);
                        main.getAllData(lastYear, now);
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    updateRange : function (g) {
        console.log("testing range drawing updateRange");

        if(main.graph == null) { return; }

        var val = main.graph.xAxisRange();

        console.log(val);

        main.g4.updateOptions({
            dateWindow: val
        });
    },
    updateRangeTime : function (start, end) {
        console.log("testing range drawing updateRange");

        if(main.graph == null) { return; }

        var val = [];//main.graph.xAxisRange();
        val.push(start * 1000);
        val.push(end * 1000);

        main.g4.updateOptions({
            dateWindow: val
        });
    },
    updateZoom : function (g) {
        console.log("testing range drawing updateZoom");

        if(main.g4 == null) { return; }
        //console.log(main.g4.xAxisRange());

        var val = main.g4.xAxisRange();

        if(main.update_timeout != 0) {
            clearTimeout(main.update_timeout);
            main.update_timeout = 0;
        }

        main.update_timeout = setTimeout(function(){
            main.getSelectedData(Math.round(val[0] / 1000), Math.round(val[1] / 1000));
//            main.getSelectedData(Math.round(val[0]), Math.round(val[1]));
            main.update_timeout = 0;
        }, 250);

        /*main.graph.updateOptions({
            dateWindow: val,
            'file': main.data
        });*/
    },
    settingsPage : function(){
                return window.location.href="settings.html";
    },
    loadingThePage : function(){

            setInterval(function(){
                $('#logo_loading').fadeIn(500,function(){
                    $(this).fadeOut(500);
                });
            },200);


/**************************************************************************************/
       /*function onReady(callback) {
            var intervalID = window.setInterval(checkReady, 4500);

        function checkReady() {

                if (document.getElementsByTagName('body')[0] !== undefined) {
                    window.clearInterval(intervalID);
                    callback.call(this);
                }

            }
        }
        function show(id, value) {
            document.getElementById(id).style.display = value ? 'block' : 'none';
        }

        onReady(function(){
            show('body_of_loading',false);
            show('graphdiv',true);
        });*/
    },
    setTheTimeout : function(){
        window.setTimeout(function(){
            $('#body_of_loading').css('display','none');
        },5000);
    },
    waitForData : function(){

        if(main.load_data_timeout) {
            clearTimeout(main.load_data_timeout);
            main.load_data_timeout = 0;
        }
        $('#body_of_loading').css('display','block');
        main.loadingThePage();

        main.load_data_timeout = window.setTimeout(function(){
            $('#body_of_loading').css('display','none');
        },20000);
    },
    wait_for_drawing : function() {
        if(main.load_data_timeout) {
            clearTimeout(main.load_data_timeout);
            main.load_data_timeout = 0;
        }
        main.load_data_timeout = window.setTimeout(function(){
            $('#body_of_loading').css('display','none');
        },2500);
    }
};

//main.initialize();
