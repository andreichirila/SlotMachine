$(document).ready(function(){
    login.init();
});

var login = {
    init : function(){
        $(document).keypress(
            function(e) {
                if(e.which == 13) {
                    login.signIn();
                }
            }
        );
        $('#btn_sign_in').click(
            function(){
                login.signIn();
            }
        );
    },
    messageBox : function(header,message){
        $('#dialog_header').html(header);
        $('#dialog_message').html(message);
        $('.dialog').modal('show');
    },
    signIn : function() {
        var passwd = document.getElementById('psswd_input').value;
        var user = document.getElementById('user_input').value;

        authent = JSON.stringify([{'username':user,'password':passwd}]);

        cnlib.putGetPostData('/api/auth/login', 'JSON', 'POST', authent ,function(res){
            console.log(res.length);

            if(res[0].ack == 1){
                 login.main_page();
            }else{
                  //login.messageBox('Warnung','Bitte geben Sie ein g&uuml;ltiges Passwort oder einen g&uuml;ltigen Namen ein.');
                  $('#error_msg').html('Der eingegebene Benutzername oder das Passwort ist falsch<br /><br />');
                  $('#login-well').css('border','2px solid #F7650A');
                  setTimeout(function(){$('#login-well').css('border','1px solid #9cc7e1');},5000);
            }
        });
        /*if(passwd == '0407'){
            login.main_page();
        }else{
             $('#login-well').css('border','2px solid #F7650A');
             setTimeout(function(){$('#login-well').css('border','1px solid #9cc7e1');},5000);
        }*/
    },
    main_page : function() {
        window.location="main.html";
    }
}
