$(document).ready(function(){
    settings.initialize();
});

var settings = {
    counter : 0,
    timestamp : 0,
    timestamp_start : 0,
    wlan : 'wlan',
    elem : '',
    apmode : '',
    dhcp_status : '',
    lora_obj : null,
    spread : null,
    bandwidth : null,
    codingrate : null,
    power : null,
    interval : null,
    timeout : 0,
    LORA_CHECK_TIMEOUT : 90000,
    LORA_POLL_CHECK: 2000,
    lora_check_time_out : 0,
    lora_poll_check_time : 0,
    send_interval : [],
    lora_type : '',
    update_type : 0,
    check_counter : 0,
    reboot_counter : 60,
    error_msg : [ '',
                'Der eingegebene Schl&uuml;ssel ist nicht korrekt, oder die Gegenstelle ist nicht erreichbar.',
                'Die Systemzeit konnte nicht eingestellt werden.',
                'Die Konfiguration konnte nicht übernommen werden.'],
    success_msg : ['',
                'Der eingegebene Schlüssel wurde erfolgreich übertragen.',
                'Das System wurde erfolgreich auf die neue Zeit eingestellt.',
                'LoRa Einstellungen wurden erfolgreich übertragen.'],

    initialize : function(){
        //calculate_on_air_time : function (Npreamble,PL,BW,SF,CRC,IH,DE,CR){
        //settings.calculate_on_air_time(12, 16, 125000, 6, 1, 1, 0, 4);

        settings.counter = settings.timestamp_start = settings.timestamp = 0;

        cnlib.checkUserLogin(
            function(){
                settings.getWlanModus();
                settings.getFile();
                settings.getPartnerKey();
                settings.getFunkSettings();
                settings.getTheVersion();
                settings.changeThePassword();
                settings.dropDownMenuChannel();
                settings.validNetworkElements();
                settings.formNetworkActivate();
                settings.clickOnTheRow();
                settings.submitFormFunk();
                settings.submitNetwork();
                settings.modifyThePassword();
                // WLAN Settings
                settings.collapsingWells();
                settings.checkBoxes();
                //settings.eventsForTheKeyFields();
                settings.dateAndTimeForSettings();
                settings.postDateAndTime();
                //settings.verifyTheForm();
                settings.postTheKey();
                settings.loadLogFile();
                settings.resetCounter();
                settings.ownWlanSettings();
            },
            function(){
                window.location = "index.html";
            }
        );
    },
    /************************ ADDED BY AC - 16.07.2015 ****************************************************************/
    /******************************************************************************************************************/
    ownWlanSettings : function(){
        $("#btn_connect_manual_wlan").on('click',
            function(){
                cnlib.checkUserLogin(
                    function(){
                        $('#passwd_field_and_btn').show();
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    /******************************************************************************************************************/
    /******************************************************************************************************************/
    getFile: function(){
        cnlib.loadFile('last.state','TEXT',function(data){
            console.log(settings.timestamp);
            console.log(settings.timestamp_start);

            var msg = data.split('\n');
            var ts = parseInt(msg[0].substring(10));

            if(settings.timestamp_start == 0){
                settings.timestamp_start = ts;
            }

            if(settings.timestamp == 0){
                settings.timestamp = ts;
            }else if(settings.timestamp < ts){
                settings.timestamp = ts;
                settings.counter++;
            }
            //console.log(ts);
            var diff = settings.timestamp - settings.timestamp_start;
            console.log(diff);
            if(settings.lora_obj != undefined) {
                if(settings.lora_obj.interval != undefined) {
                    console.log(settings.lora_obj.interval);

                    console.log("TEST:" + settings.interval);

                    var inter = 1;
                    switch(parseInt(settings.lora_obj.interval)) {
                        case 0: return;
                        case 1: inter = 5; break;
                        case 2: inter = 15; break;
                        case 3: inter = 30; break;
                        case 4: inter = 60; break;
                        case 5: inter = 300; break;
                        case 6: inter = 600; break;
                        case 7: inter = 900; break;
                        case 8: inter = 3600; break;
                        default: console.log("default"); inter = 1;
                    }
                }
            }

            if(diff > 0) {
                //var d = new Date(diff * 1000);
                var count_max = Math.round(diff / inter);

                console.log(diff);
                console.log(inter);
                console.log(count_max);
                var time = parseInt(diff / 60) + ':' + ("00" + (diff % 60)).slice(-2);
                $("#msg_counter").html('Anzahl: ' + settings.counter + '/' + count_max + '&nbsp; Dauer: ' + time + ' min');
            } else {
                $("#msg_counter").html('Anzahl: 0/0&nbsp; Dauer: 0:00 min');
            }
        });

        setTimeout(function(){settings.getFile();},5000);
    },
    resetCounter : function(){
        $('#msg_counter_reset').click(function(){
            settings.counter = settings.timestamp_start = settings.timestamp = 0;
            $("#msg_counter").html('Anzahl: 0/0&nbsp; Dauer: 0:00 min');
        });
    },
    getPartnerKey : function(){
        cnlib.putGetPostData('api/lora/key','JSON','GET', '', function(partner_key){
            var key = partner_key[0].PartnerKey;

            if(key.length == 0) { return; }
            var bytes = key.split(':');
            var count = 0;

            $('#first_key_field').val(bytes[count++] + bytes[count++] + bytes[count++] + bytes[count++]);
            $('#second_key_field').val(bytes[count++] + bytes[count++] + bytes[count++] + bytes[count++]);
            $('#third_key_field').val(bytes[count++] + bytes[count++] + bytes[count++] + bytes[count++]);
            $('#fourth_key_field').val(bytes[count++] + bytes[count++] + bytes[count++] + bytes[count++]);

        });
    },
    dateAndTimeForSettings : function(){
        $('#datetime').datetimepicker({
            format: 'DD/MM/YYYY HH:mm',
        });
    },
    /*verifyTheForm : function(){
        $('#KEY').keyup(function(){
            var first_element = document.getElementById('first_key_field').value;
            var second_element = document.getElementById('second_key_field').value;
            var third_element = document.getElementById('third_key_field').value;
            var fourth_element = document.getElementById('fourth_key_field').value;

            if((first_element == '' && second_element == '' && third_element == '' && fourth_element == '') ||
                (first_element.length == 8 && second_element.length == 8 && third_element.length == 8 && fourth_element.length == 8)){
                $('#addTheKey').attr("disabled", false);

                settings.returnToOriginal('#first_key_field');
                settings.returnToOriginal('#second_key_field');
                settings.returnToOriginal('#third_key_field');
                settings.returnToOriginal('#fourth_key_field');
            }
        });
    },*/
    returnToOriginal : function(id){
        $(id).css(
            {
            '-webkit-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
            '-moz-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
            'box-shadow' : '0 1px 3px rgba(0,0,0,0.2)'
            }
        );
    },
    validateTheHexFields : function(){
        var first_element = document.getElementById('first_key_field');
        var second_element = document.getElementById('second_key_field');
        var third_element = document.getElementById('third_key_field');
        var fourth_element = document.getElementById('fourth_key_field');

        if($('#first_key_field').val().length > 0) {
            cnlib.validate(first_element,'#first_key_field',1);
        }
        if($('#second_key_field').val().length > 0) {
            cnlib.validate(second_element,'#second_key_field',1);
        }
        if($('#third_key_field').val().length > 0) {
            cnlib.validate(third_element,'#third_key_field',1);
        }
        if($('#fourth_key_field').val().length > 0) {
            cnlib.validate(fourth_element,'#fourth_key_field',1);
        }
    },
    toTheNext : function(elem,content){

        var first_element = document.getElementById('first_key_field').value;
        var second_element = document.getElementById('second_key_field').value;
        var third_element = document.getElementById('third_key_field').value;
        var fourth_element = document.getElementById('fourth_key_field').value;

        settings.returnToOriginal('#first_key_field');
        settings.returnToOriginal('#second_key_field');
        settings.returnToOriginal('#third_key_field');
        settings.returnToOriginal('#fourth_key_field');

        if((first_element == '' && second_element == '' && third_element == '' && fourth_element == '') ||
            (first_element.length == 8 && second_element.length == 8 && third_element.length == 8 && fourth_element.length == 8)){
            $('#addTheKey').attr("disabled", false);

        } else {
            $('#addTheKey').attr("disabled", true);
        }


        if (content.length==elem.maxLength){
            next=elem.tabIndex;

            if (next<document.key_form.elements.length){
                document.key_form.elements[next].focus();
            }
    	}

        settings.validateTheHexFields();
    },
    postTheKey : function(){
        $('#addTheKey').unbind();
        $('#addTheKey').on('click',function(){
            $('#overlay').show();

            var first_value = $('#first_key_field').val();
            var second_value = $('#second_key_field').val();
            var third_value = $('#third_key_field').val();
            var fourth_value = $('#fourth_key_field').val();

            var val_of_all = first_value + second_value + third_value + fourth_value;
            var nibble = '';

            console.log(val_of_all.length);

            for(var i=0;i<val_of_all.length;i++){
                nibble = nibble + val_of_all[i++] + val_of_all[i] + ':';
                console.log(nibble);
            }
            nibble = nibble.substr(0, nibble.length - 1).toUpperCase();

            cnlib.checkUserLogin(
                function(){
                    //if(val_of_all){
                        console.log(val_of_all);
                        console.log(nibble);
                        //var json_key = '[{"id" : "1", "key" : "' + val_of_all + '"}]';
                        var json_key = '[{"id" : "1", "key" : "' + nibble + '"}]';

                        cnlib.putGetPostData('api/lora/setkey','JSON','post',json_key, function(result){});
                        /*cnlib.checkUserLogin(
                            function(){*/
                                //cnlib.putGetPostData('api/lora/lora?1', 'JSON', 'POST', obj , function(obj){});
                                settings.lora_check_time_out = setTimeout(function(){
                                    $('#overlay').hide();
                                    if(settings.lora_poll_check_time != 0) {
                                        clearTimeout(settings.lora_poll_check_time);
                                        settings.lora_poll_check_time = 0;
                                    }

                                    settings.messageBox("LoRa Einstellungen","Der Schlüssel konnte nicht ausgetauscht werden.");
                                    settings.update_type = 0;
                                    return;
                                }, settings.LORA_CHECK_TIMEOUT);

                                settings.update_type = 1;
                                settings.checkLoraSettings('[{"id":"1", "type":"key"}]');

                            /*},
                            function(){
                                window.location = "index.html";
                            }
                        );*/
                       //$('.new-password-modal-dialog').modal('hide');
                    /*}else{
                        $('input[name=_key]').css('border','2px solid #F7650A');
                        setTimeout(function(){
                            $('input[name=_key]').css('border','1px solid #ccc');
                        },5000);

                        $('input[name=_key]').val('');
                    }*/
                },
                function(){
                    window.location = "index.html";
                }
            );

        });
    },
    postDateAndTime : function(){
        $('#setTime').unbind();
            $('#setTime').on('click',function(){

                var date_time = $('#datetime').val();
                var mom = moment(date_time, "DD/MM/YYYY HH:mm");

                var date = Date.parse(mom.toDate()) / 1000;
                var json_date = '[{"id" : "1", "date" : "' + date + '"}]';

//              var date = Date.parse(date_time) / 1000;

                cnlib.checkUserLogin(
                    function(){
                        if( date_time != '' ){
                            console.log(date_time);
                            cnlib.putGetPostData('api/lora/settime','JSON','post',json_date, function(json_date){});
                            $('#overlay').show();

//cnlib.checkUserLogin(
//function(){
//cnlib.putGetPostData('api/lora/lora?1', 'JSON', 'POST', obj , function(obj){});

                            settings.lora_check_time_out = setTimeout(function(){
                                $('#overlay').hide();

                                if(settings.lora_poll_check_time != 0) {
                                    clearTimeout(settings.lora_poll_check_time);
                                    settings.lora_poll_check_time = 0;
                                }
                                settings.update_type = 0;
                                settings.messageBox("LoRa Einstellungen","Die Systemzeit konnte nicht geändert werden.");
                                return;
                            }, settings.LORA_CHECK_TIMEOUT);
                            settings.update_type = 2;
                            settings.checkLoraSettings('[{"id":"1", "type":"time"}]');

//    },
//    function(){
//        window.location = "index.html";
//    }
//);
//});
                        }else{
                            settings.messageBox("Einstellungen","Bitte geben Sie ein g&uuml;ltiges Datum ein.");
                        }
                    },
                    function(){
                        window.location = "index.html";
                    }
                );

            });
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
                        if((actual_passwd != '') && (first_passwd != '') && (first_passwd == second_passwd) ){
                            cnlib.putGetPostData('api/user/changepassword','JSON','post',string_passwd,
                                function(string_passwd){
                                    $('.new-password-modal-dialog').modal('hide');
                                    window.location = "index.html";
                                }
                            );
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
    countdown : function(){
    console.log("countdown();");
    console.log("countdown" + settings.reboot_counter);
        $('#timeout_counter').html("Sie werden in " + settings.reboot_counter + " Sekunden weiter geleitet.");

        settings.reboot_counter--;

        if(settings.reboot_counter <= 0) {
            window.location = "index.html";
            return;
        }
        setTimeout(function(){settings.countdown();}, 1000);
    },
    clickOnTheRow : function(){
        $('#passwd_field_and_btn').hide();

        $('.wlan-station-row').unbind();
        $('.wlan-station-row').click(
            function(){
                clearTimeout(settings.timeout);
                var name = $(this).attr('name');

                cnlib.checkUserLogin(
                    function(){
                        $('#wlan-ssid').val(name);
                        $('#passwd_field_and_btn').show();
                        $('#btn_connect_to_wlan').attr('name',name);
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
        $('#btn_connect_to_wlan').unbind();
        $('#btn_connect_to_wlan').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        var passwd = $('#passwd_wlan').val();
                        var name = $('#btn_connect_to_wlan').attr('name');
                        var name_wlan = $('#wlan-ssid').val();
                        var g_ssid = '';

                        /**
                        MODIFIED
                        **/
                        //var ssid ? name : name_wlan;

                        if(name){ g_ssid=name; }
                        else if(name_wlan){ g_ssid = name_wlan; }

                        var data = JSON.stringify( [{'id': '1','password' : passwd, 'ssid' : g_ssid, 'apmode' : '0'}] );


                        if(name_wlan == ''){
                            settings.messageBox('Warnung','Bitte w&auml;hlen Sie ein g&uuml;ltiges WLAN-Netzwerk aus,<br/>oder geben Sie die SSID des Netzwerkes ein<br />mit dem Sie sich verbinden m&ouml;chten.');
                            return;
                        }

                        if(passwd != ''){
                            cnlib.putGetPostData('api/network/wlan?1','JSON','POST',data,function(data){
                                if(data[0].ack == "1"){
//                                    $('.reboot_anmeldung').modal('show');
                                    $('.reboot_anmeldung').modal({backdrop: 'static', keyboard: false});
                                    settings.countdown();

                                    cnlib.putGetPostData('api/system/reboot','','GET',' ',function(){});                /************ modified 1************/

                                    /*added 07.04.2015 -- AC*/
                                    clearTimeout(settings.loadLogFile);
                                }
                            });
                        }else{
                            settings.messageBox('Warnung','Bitte geben Sie ein g&uuml;ltiges Passwort ein.');
                        }
                        /*uncomment 07.04.2015 -- AC*/
                        //settings.pollWlanStations();
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
        $('#apply_wlan').unbind();
        $('#apply_wlan').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        var passwd = $('#ap-pwd').val();
                        var ssid = $('#ap-ssid').val();
                        var channel = $('#ap-channel').val();
                        var data = JSON.stringify( [{'id': '1','password' : passwd, 'ssid' : ssid, 'apmode' : '1', 'channel' : channel }] );

                        if(ssid == ''){
                            settings.messageBox('Warnung','Bitte geben Sie einen Namen f&uuml;r das Netzwerk ein.');
                            return;
                        }

                        if(passwd != '' && passwd.length >= 8){
                            cnlib.putGetPostData('api/network/wlan?1','JSON','POST',data,function(data){
                                if(data[0].ack == "1"){
                                    //$('.reboot_anmeldung').modal('show');
                                    $('.reboot_anmeldung').modal({backdrop: 'static', keyboard: false});
                                    settings.countdown();

                                    cnlib.putGetPostData('api/system/reboot','','GET',' ',function(){});                /************ modified 2************/
                                }
                            });

                        }else{
                            settings.messageBox('Warnung','Passwort ung&uuml;ltig');
                            $('input[type=password]').css('border','2px solid #F7650A');
                            setTimeout(function(){
                                $('input[type=password]').css('border','1px solid #ccc');
                            },5000);
                        }
                        //settings.pollWlanStations();
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    collapsingWells : function(){
        $('.well-rwe-coll').click(
            function(){
                var name = $(this).attr('name');
                var type = '#' + name + '_content';
                $(type).collapse('toggle');

                cnlib.checkUserLogin(
                    function(){
//                        $(type).collapse('toggle');
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
                clearTimeout(settings.timeout);

                if($('#wlan_content').attr('aria-expanded') == 'false') {
                    if($('#prop_station_mode_content').attr('aria-expanded')  == 'true') {
                        settings.pollWlanStations();
                    }
                }
            }
        );
        $('#prop_access_point').click(
            function(){
                var name = $(this).attr('name');
                var type = '#' + name + '_content';

                cnlib.checkUserLogin(
                    function(){
                        $(type).collapse('toggle');
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
        $('#prop_station_mode').click(
            function(){
                var name = $(this).attr('name');
                var type = '#' + name + '_content';

                cnlib.checkUserLogin(
                    function(){
                        $(type).collapse('toggle');
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
        $('#prop_station_mode_content').on('hidden.bs.collapse',
            function () {
                clearTimeout(settings.timeout);
            }
        );
        $('#prop_station_mode_content').on('shown.bs.collapse',
            function () {

                /*modified by AC - 16.07.2015*/
                if(settings.apmode == 1){
                    settings.showWlans();
                }else{
                    settings.pollWlanStations();
                }
            }
        );
    },
    setAccessPoint : function(checked) {
        var access_checked = checked;

        if(access_checked === true){
            clearTimeout(settings.timeout);

            $('#settings_access_point').show();
            document.getElementById('station_mode_check').checked=false;      //<--------------------------modified-------------------------------->
            $('#settings_station_mode').hide();
                if($('#prop_station_mode_content').is(':visible')){
                    $('#prop_station_mode_content').collapse('hide');
                };
        }else if(access_checked === false){
             $('#prop_access_point_content').collapse('hide');
             $('#settings_access_point').hide();
        }
    },
    setStationMode : function (checked) {
        var station_checked = checked;

        if(station_checked === true){
            //we call the function that loads the WLANs Stations

            /*added 07.04.2015 -- AC*/
            settings.showWlans();

            $('#settings_station_mode').show();
            document.getElementById('access_point_check').checked=false;
             $('#settings_access_point').hide();
              if($('#prop_access_point_content').is(':visible')){
                 $('#prop_access_point_content').collapse('hide');
              };
        }else{
            settings.timeout = 0;
            $('#settings_station_mode').hide();
            $('#prop_station_mode_content').collapse('hide');
        }
    },
    checkBoxes : function(){
        $('#access_point_check').click(
            function(){
                //define the variables that contain the states of the checkboxes
                var access_checked = $(this).is(':checked');
                cnlib.checkUserLogin(
                    function(){
                        settings.setAccessPoint(access_checked);
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
        $("#station_mode_check").click(
            function(){
                var station_checked = $(this).is(':checked');
                cnlib.checkUserLogin(
                    function(){
                        settings.setStationMode(station_checked);
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    changeThePassword : function(){
        $('.user-account').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        $('.new-password-modal-dialog').modal('show');
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
   /************************************** BEGINNING OF DROPDOWN EVENTS ***********************************************/
   /*******************************************************************************************************************/
    dropDownMenuChannel : function(){
        $(".dropdown-channel li a").click(
            function(e){
                e.preventDefault();
                var selText = $(this).text();
                cnlib.checkUserLogin(
                    function(){
                        $('#ap-channel').val(selText);

                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    dropDownMenuSpreading : function(){
        $(".dropdown-spread li a").click(
            function(e){
                e.preventDefault();

                var selText = $(this).text();
                $("#spread_value").val(selText);
                $("#spread_value").attr('spread_id', $(this).attr('id'));

                cnlib.checkUserLogin(
                    function(){
                        settings.update_lora_view();
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    dropDownPower : function() {
        $(".dropdown-power li a").click(
            function(e){
                e.preventDefault();

                var selText = $(this).text();
                $("#power_value").val(selText);
                $("#power_value").attr('power_id', $(this).attr('id'));

                cnlib.checkUserLogin(
                    function(){
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    dropDownInterval : function() {
        $(".dropdown-interval li a").unbind();
        $(".dropdown-interval li a").click(
            function(e){
                e.preventDefault();

                var selText = $(this).text();
                $("#interval_value").val(selText);
                $("#interval_value").attr('interval_id', $(this).attr('id'));

                cnlib.checkUserLogin(
                    function(){
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    dropDownMenuBandW : function(){
        $(".dropdown-band-width li a").click(
            function(e){
                e.preventDefault();
                var selText = $(this).text();
                $("#band_width_value").val(selText);
                $("#band_width_value").attr('band_id',$(this).attr('id'));

                cnlib.checkUserLogin(
                    function(){
                        settings.update_lora_view();
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    dropDownMenuCodeRate : function(){
        $(".dropdown-coding-rate li a").click(
            function(e){
                e.preventDefault();
                var selText = $(this).text();
                $("#coding_rate_value").val(selText);
                $("#coding_rate_value").attr('coding_id',$(this).attr('id'));

                cnlib.checkUserLogin(
                    function(){
                        settings.update_lora_view();
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
   /************************************** DROPDOWN EVENTS FINISH *****************************************************/
   /*******************************************************************************************************************/
    setNetworkFormState : function(){
        var controls = document.getElementById('form_network').getElementsByTagName('input');

        //var is_dhcp = $('#dhcp_check').attr('checked');
        //$('#apply_network').attr("disabled", is_dhcp);

        var checked = $('#dhcp_check').is(':checked');
        for(var i=0; i < controls.length; ++i){
            controls[i].disabled = checked;
        }

        //for(var i=0; i < controls.length; ++i){
            if(checked == true){
                settings.dhcp_status = '1';
        //        controls[i].disabled = true;
            }else{
                settings.dhcp_status = '0';
        //        controls[i].disabled = false;
            }
        //}

        $('#apply_network').attr("disabled", false);
    },
    formNetworkActivate : function(){
            settings.getNetworkSettings();
            //define what Controls are
            //Describe what is happening when the checkbox will be clicked
            $('#dhcp_check').click(
                function(){
                    cnlib.checkUserLogin(
                        function(){
                            settings.setNetworkFormState();
                        },
                        function(){
                            window.location = "index.html";
                        }
                    );
                }
            );
        },
    /************************ We CALL for the Data from API Server ****************************************************/
    /******************************* ***************************  *****************************************************/
    createWlanEntry : function(wlan) {
        var html = '';

        w_quality = wlan.quality.split('/');
        w_quality = (w_quality[0] / w_quality[1]) * 100;

        html += '<tr class="wlan-station-row" name="' + wlan.ssid + '">';
        html += '<td id="wlan_' + wlan.ssid +' ">' + wlan.ssid + '</td>';
        html += '<td id="signal_' + wlan.ssid + ' ">';
            if((w_quality >= 75) && (w_quality <= 100)) {
                html += '<span class="glyphicon glyphicon-signal glyph-edit" style="color:#208C39;float:right"></span>';
            }else if( (w_quality < 75) && (w_quality >= 50) ) {
                html += '<span class="glyphicon glyphicon-signal glyph-edit" style="color:#4970BA;float:right"></span>';
            }else if( (w_quality < 50) && (w_quality >= 25) ){
                html += '<span class="glyphicon glyphicon-signal glyph-edit" style="color:#8F9603;float:right"></span>';
            }else if( (w_quality < 25) && (w_quality >= 0) ){
                html += '<span class="glyphicon glyphicon-signal glyph-edit" style="color:#C44018;float:right"></span>';
            }
         +'</td>';
        if(wlan.connect == '1'){
//            html += '<h5 id="title_connected" style="color:green;margin-top:1px;">Verbunden<br/>0.0.0.0</h5>';
            html += '<h5 id="title_connected" style="margin-top:1px;"></h5>';
        }
        html += '</tr>';

        return html;
    },
    showWlans : function(){
        cnlib.putGetPostData('api/network/wlans','JSON','GET','',function(data){

            var result = '';
            var html = '';
            data.sort(function(a,b){return b.value - a.value;});

            for(var i=0; i < data.length;++i){
                wlan = data[i];

                console.log(wlan);
                if(wlan.connect == '1') {
                    result += settings.createWlanEntry(wlan);
                } else {
                    html += settings.createWlanEntry(wlan);
                }
            }
            result += html;
            $('#wlan_networks').html(result);

            cnlib.putGetPostData('api/network/wlan?2','JSON','GET','',function(data){


                $('#title_connected').html('Verbunden<br/>' + data.ipaddr);


                //{"id":"1", "apmode" : "0", "ssid" : "CNBS01", "channel":"3", "ipaddr":"192.168.7.178", "netmask":"255.255.255.0", "gateway":"192.168.7.1", "nameserver":"192.168.7.23", "dhcp":"1"}

            });


            settings.clickOnTheRow();
        });
    },
    pollWlanStations : function(){
            clearTimeout(settings.timeout);
            settings.showWlans();
            settings.timeout = setTimeout(function(){settings.pollWlanStations();}, 30000);
    },
    getWlanModus : function(){
        console.log("i am INSIDE");
        cnlib.putGetPostData('api/network/wlan?1','json','GET','',
            function(data){

                console.log("i am INSIDE 2");

                console.log(data.apmode);

                if(data.apmode == 1){

                    data.apmode = settings.apmode;
                    $('#access_point_check').attr('checked',true);
                    settings.setAccessPoint(true);

                    console.log(data.apmode);
                    console.log(settings.apmode);
                }else{
                    $('#station_mode_check').attr('checked',true);
                    settings.setStationMode(true);
                }
                $('#ap-ssid').val(data.ssid);
                $('#ap-channel').val(data.channel);

            },function(err){
                console.log(err);
            }
        );
    },
    getIntervalTime : function(interval){
        if(interval == 0) {
            return "Deaktiviert";
        } else if(interval < 60) {
            return interval + " sek";
        } else return (interval / 60) + " min";
    },
    updateLoraView : function(obj) {
        console.log(obj);

        for(var i=0; i < settings.spread.length; ++i){
            var obj = settings.spread[i];

            if(obj.idx == settings.lora_obj.spreadingfactor){
                $("#spread_value").val(obj.text);
                $("#spread_value").attr('spread_id', obj.idx);

                break;
            }
        }
        for(var i=0; i < settings.bandwidth.length; ++i){
            var obj = settings.bandwidth[i];

            if(obj.idx == settings.lora_obj.bandwidth){
                $("#band_width_value").val(obj.text);
                $("#band_width_value").attr('band_id', obj.idx);

                break;
            }
        }
        for(var i=0; i < settings.codingrate.length; ++i){
            var obj = settings.codingrate[i];

            if(obj.idx == settings.lora_obj.codingrate){
                $("#coding_rate_value").val(obj.text);
                $("#coding_rate_value").attr('coding_id', obj.idx);

                break;
            }
        }
        for(var i=0; i < settings.power.length; ++i){
            var obj = settings.power[i];

            if(obj.idx == settings.lora_obj.power){
                $("#power_value").val(obj.text);
                $("#power_value").attr('power_id', obj.idx);

                break;
            }
        }
        for(var i=0; i < settings.interval.length; ++i){
            var obj = settings.interval[i];

            if(obj.idx == settings.lora_obj.interval){
                $("#interval_value").val(obj.text);
                $("#interval_value").attr('interval_id', obj.idx);

                break;
            }
        }
    },
    getFunkSettings : function(){

        cnlib.putGetPostData('api/lora/spreadingranges','JSON','get','',function(spread){
            cnlib.createComboBoxValues('#dropdowm_menu_spreading',spread);
            settings.spread = spread;

            cnlib.putGetPostData('api/lora/bandwidthranges','JSON','get','',function(widthrange){
                cnlib.createComboBoxValues('#dropdowm_bandwidth',widthrange);
                settings.bandwidth = widthrange;

                cnlib.putGetPostData('api/lora/codingrateranges','JSON','get','',function(codingrate){
                    cnlib.createComboBoxValues('#dropdowm_coding_rate',codingrate);
                    settings.codingrate = codingrate;

                    cnlib.putGetPostData('api/lora/powerranges', 'JSON', 'get','',function(power){
                        console.log(power);
                        cnlib.createComboBoxValues('#dropdowm_power',power);
                        settings.power = power;

                        cnlib.putGetPostData('api/lora/intervalranges', 'JSON', 'get','',function(interval){
                            console.log(interval);
                            var string = JSON.stringify(interval);
                            settings.send_interval = JSON.parse(string);

                            for(var pos = 0; pos < interval.length; ++pos) {
                                var obj = interval[pos];
                                var it = "0";
                                if(obj.text == 240) { it = "300"; }
                                else if(obj.text == 241) { it = "600"; }
                                else if(obj.text == 242) { it = "900"; }
                                else if(obj.text == 243) { it = "1800"; }
                                else if(obj.text == 244) { it = "3600"; }
                                else { it = obj.text; }

                                obj.text = settings.getIntervalTime(it);
                            }
                            //cnlib.createComboBoxValues('#dropdowm_interval', interval);
                            settings.interval = interval;



                            cnlib.putGetPostData('api/lora/lora?1', 'JSON', 'get', '' , function(obj){
                                settings.lora_obj = obj;

                                settings.updateLoraView(obj);
                                settings.update_lora_view();
                                settings.updateLoraView(obj);

                                settings.dropDownMenuSpreading();
                                settings.dropDownMenuBandW();
                                settings.dropDownMenuCodeRate();

                                settings.dropDownPower();
                                settings.dropDownInterval();

                            });
                        });
                    });
                });
            });
        });
    },
    /********* Here we define the GET request for the Network Form from API-Server *************************************/
    getNetworkSettings : function(){
        cnlib.putGetPostData('api/network/eth?1','JSON','GET','',function(data){
            $('#ip_addr').val(data.ipaddr);
            $('#subnetmask').val(data.netmask);
            $('#gateway').val(data.gateway);
            $('#nameserver').val(data.nameserver);

            /*here we have the values from the API - DHCP*/
            if(data.dhcp == '0'){
                $('#dhcp_check').attr('checked',false);
            }else if(data.dhcp == '1'){
                $('#dhcp_check').attr('checked',true);
            }
        settings.setNetworkFormState();
        });
    },
    /********* Here we define the POST request for the Network Form ****************************************************/
    postNetworkSettings : function(){
        var ip = $('#ip_addr').val();
        var subnet = $('#subnetmask').val();
        var gateway = $('#gateway').val();
        var nameserver = $('#nameserver').val();
        var obj = JSON.stringify( [{'id' : '1','ipaddr' : ip , 'netmask' : subnet, 'gateway' : gateway, 'nameserver' : nameserver, 'dhcp' : settings.dhcp_status}] );

        /*we send our values to the API - Network Settings*/
        cnlib.putGetPostData('api/network/eth?1','JSON','POST',obj,function(obj){
            cnlib.putGetPostData('api/system/reboot','','GET',' ',function(){});                /************ modified 1************/
            settings.countdown();
            //$('.reboot_anmeldung').modal('show');
            $('.reboot_anmeldung').modal({backdrop: 'static', keyboard: false});
        });
    },
    /********************************************************************************************************************/
    checkLoraSettings : function(type) {
        settings.lora_type = type;
        settings.check_counter++;

        if(settings.check_counter >= 10){
        settings.check_counter = 0;
            cnlib.checkUserLogin(
                function(){
                },
                function(){
                    console.log("Keine Anmeldung mehr vorhanden.");//window.location = "index.html";
                }
            );
        }

        cnlib.putGetPostData('api/lora/checklorasettings','JSON','GET',settings.lora_type,function(data){


            console.log(data);
            console.log(settings.update_type);
            var kill = false;
            if(data[0].ack == "1") {
                $('#overlay').hide();

                settings.messageBox("LoRa Einstellungen",settings.success_msg[settings.update_type]);
                if(settings.update_type == 3) {
                    settings.getFunkSettings();
                }
                kill = true;
            }
            if(data[0].ack == "0") {
                $('#overlay').hide();

                settings.messageBox("LoRa Einstellungen",settings.error_msg[settings.update_type]);
                //settings.updateLoraView(settings.lora_obj);
                kill = true;
            }

            if(kill === true) {
                if(settings.lora_check_time_out != 0) {
                    clearTimeout(settings.lora_check_time_out);
                    settings.lora_check_time_out = 0;
                }
                return;
            }
            settings.lora_poll_check_time = setTimeout(function() {
                settings.checkLoraSettings(settings.lora_type);
            }, settings.LORA_POLL_CHECK);


        }, function() {
            settings.lora_poll_check_time = setTimeout(function() {
                settings.checkLoraSettings(settings.lora_type);
            }, settings.LORA_POLL_CHECK);
        
        });

    },
    /********************************************************************************************************************/
    messageBox : function(header,message){
        $('#dialog_header').html(header);
        $('#dialog_message').html(message);
        $('.dialog').modal('show');
    },
    submitFormFunk : function(){
        $('#apply_lora').click(
            function(){
                $('#overlay').show();

                var spread_id = $('#spread_value').attr('spread_id');
                var band_id = $('#band_width_value').attr('band_id');
                var coding_id = $('#coding_rate_value').attr('coding_id');
                var power_id = $('#power_value').attr('power_id');
                var interval_id = $('#interval_value').attr('interval_id');

                console.log(spread_id);
                console.log(band_id);
                console.log(coding_id);
                console.log(power_id);
                console.log(interval_id);
                var obj = JSON.stringify( [{'id' : '1', 'spreadingfactor' : spread_id, 'bandwidth' : band_id, 'codingrate' : coding_id, 'interval':interval_id, 'power' : power_id }] );

                console.log(obj);

                cnlib.checkUserLogin(
                    function(){
                        cnlib.putGetPostData('api/lora/lora?1', 'JSON', 'POST', obj , function(obj){});
                        settings.lora_check_time_out = setTimeout(function(){

                            $('#overlay').hide();
                            if(settings.lora_poll_check_time != 0) {
                                clearTimeout(settings.lora_poll_check_time);
                                settings.lora_poll_check_time = 0;
                            }
                            settings.update_type = 0;
                            settings.messageBox("LoRa Einstellungen","Die LoRa-Parameter konnten nicht &uuml;bertragen werden.");
                            return;
                        }, settings.LORA_CHECK_TIMEOUT);

                        settings.update_type = 3;
                        settings.checkLoraSettings('[{"id":"1", "type":"config"}]');

                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    submitNetwork : function(){
        $('#apply_network').click(
            function(){
                cnlib.checkUserLogin(
                    function(){
                        settings.postNetworkSettings();
                    },
                    function(){
                        window.location = "index.html";
                    }
                );
            }
        );
    },
    checkNetworkSettings : function(){
        var check = true;
        var ip = document.getElementById('ip_addr');
        var subnetmask = document.getElementById('subnetmask');
        var gateway = document.getElementById('gateway');
        var nameserver = document.getElementById('nameserver');

        if(cnlib.validate(ip,'#ip_addr',cnlib.IP) == false){
            check = false;
        }
        if(cnlib.validate(subnetmask,'#subnetmask',cnlib.IP) == false){
            check = false;
        }
        if(cnlib.validate(gateway,'#gateway',cnlib.IP) == false){
            check = false;
        }
        if(cnlib.validate(nameserver,'#nameserver',cnlib.IP) == false){
            check = false;
        }

        if(check == false){
            $('#apply_network').attr("disabled", true);
        }else{
            $('#apply_network').attr("disabled", false);
        }
    },
    validNetworkElements : function(){
        $('#ip_addr').keyup(
            function(){
                settings.checkNetworkSettings();

                if($(this).val().length == 0){
                    $(this).css({
                        '-webkit-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        '-moz-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        'box-shadow' : '0 1px 3px rgba(0,0,0,0.2)'
                        }
                    );
                }
            }
        );
        $('#subnetmask').keyup(
            function(){
                settings.checkNetworkSettings();

                if( $(this).val().length == 0 ){
                    $(this).css(
                        {
                        '-webkit-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        '-moz-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        'box-shadow' : '0 1px 3px rgba(0,0,0,0.2)'
                        }
                    );
                }
            }
        );
        $('#gateway').keyup(
            function(){
                settings.checkNetworkSettings();

                if( $(this).val().length == 0 ){
                    $(this).css(
                        {
                        '-webkit-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        '-moz-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        'box-shadow' : '0 1px 3px rgba(0,0,0,0.2)'
                        }
                    );
                }
            }
        );
        $('#nameserver').keyup(
            function(){
                settings.checkNetworkSettings();

                if( $(this).val().length == 0 ){
                    $(this).css(
                        {
                        '-webkit-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        '-moz-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                        'box-shadow' : '0 1px 3px rgba(0,0,0,0.2)'
                        }
                    );
                }
            }
        );
    },
    /*
        PL = payload;
        BW = bandwidth;
        SF = spreading factor;
        CRC = check sume (optional);
        IH = 0 when the header is enabled, IH=1 when no header is present;
        DE = 1 when LowDataRateOptimize=1, DE=0 otherwise;
        CR = coding rate;
    */
    calculate_on_air_time : function (Npreamble,PL,BW,SF,CRC,IH,DE,CR){

        var Tsym = 1 / (BW / Math.pow(2,SF));
        var Tpreamble = (Npreamble + 4.25) * Tsym;
        var Denominator = (8*PL - 4*SF + 28 + 16*CRC - 20*IH);
        var Numerator = 4*(SF - 2*DE);
        var Npay = 8 + Math.max(Math.ceil(Denominator/Numerator) * (CR + 4),0);
        var Tpay = Npay * Tsym;
        var Tpack = Tpreamble + Tpay;

        return Tpack;
    },
    update_lora_view : function() {

        var spread = parseInt($('#spread_value').val());
        var bw = parseFloat($('#band_width_value').val());
        var cr_text = $('#coding_rate_value').val();
        var cr = 1;

        if(cr_text == '4/5'){
            cr == '1';
        }else if(cr_text == '4/6'){
            cr == '2';
        }else if(cr_text == '4/7'){
            cr == '3';
        }else if(cr_text == '4/8'){
            cr == '4';
        }
        var toa = settings.calculate_on_air_time(12,16,bw*1000,spread,0,0,1,cr);

        cnlib.deleteComboBoxValues('#dropdowm_interval');

        var interval = JSON.parse(JSON.stringify(settings.send_interval));
        var values = [];

        for(var pos = 0; pos < interval.length; ++pos) {
            var obj = interval[pos];

            var it = "0";
            if(obj.text == "240") { obj.text = "300"; }
            else if(obj.text == "241") { obj.text = "600"; }
            else if(obj.text == "242") { obj.text = "900"; }
            else if(obj.text == "243") { obj.text = "1800"; }
            else if(obj.text == "244") { obj.text = "3600"; }
            else if(obj.text == "0") { values.push(obj); }
            else { obj.text = obj.text; }

            if(toa * 10 < parseInt(obj.text)) {
                values.push(obj);
            }
        }
        var int_id = $("#interval_value").attr('interval_id');

        for(pos = 0; pos < values.length; pos++) {
            var obj = values[pos];
            obj.text = settings.getIntervalTime(obj.text);
        }
        cnlib.createComboBoxValues('#dropdowm_interval', values);

        for(var id_count = 0; id_count < values.length; id_count++) {
            var obj2 = values[id_count];

            if(parseInt(obj2.idx) >= parseInt(int_id)) {
                $("#interval_value").val(obj2.text);
                $("#interval_value").attr('interval_id', obj2.idx);
                break;
            }
        }

        settings.dropDownInterval();
    },
    getTheVersion : function(){
        cnlib.putGetPostData('api/system/version ','JSON','GET', '',function(version){
            console.log(version);
            $('#version').html(version[0].version);
        });
    },
    loadLogFile : function() {
        cnlib.loadFile('lora.log','text',function(log){
            logging = log.split("\n");

            length = logging.length;
            if(length == 0) { return; }

            substract = 0;

            if(length > 102) {
                substract = 102;
            } else {
                substract = length - 2;
            }

            output = "<ul>";
            for(var i = length - 2; i > length - substract; i--) {
                output += '<li>' + logging[i] + '</li>' ;// + "\n";
            }
            output += "</ul>";
            $('#log_data').html(output);

            /*logging = null;
            output = null;
            log = null;*/
        });

        setTimeout(function(){ settings.loadLogFile(); }, 10000);
    }
/*    loadLogFile : function() {
        cnlib.loadFile('lora.log','text',function(log){
            var logging = log.split("\n");

            var length = logging.length;
            if(length == 0) { return; }

            var substract = 0;

             if(length > 102) {
                substract = 102;
             } else {
                substract = length - 2;
             }

            var output = "<ul>";
            for(var i = length - 2; i > length - substract; i--) {
                output += '<li>' + logging[i] + '</li>' ;// + "\n";
            }
            output += "</ul>";
            $('#log_data').html(output);

            logging = null;
            output = null;
            log = null;
        });

        setTimeout(function(){ settings.loadLogFile(); }, 5000);
    }*/
};