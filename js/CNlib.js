var cnlib = {
    IP : 0,
    regex_list : [/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/,
    				/^[0-9a-fA-F]+$/ 													/*this is available only for HEX*/
    			 ],
	/* Through this function we can load JSON , JS , TXT files from any given location */
	loadFile : function(filename, type, success) {
		var ret_val = null;
		$.ajax({
			type : "GET",
			async : true,
			url : filename, // for example http://192.168.0.100/test.txt
			cache : false,
			dataType : type, // for example: "text",
			success : function(res) {
				//ret_val = res;
				success(res);
				ret_val = null;
			},
			error : function(res, errMsg) {
				//ret_val = "";
				//console.log(ret_val);
				console.log(errMsg);
				ret_val = null;
			}
		});
		return ret_val;
	},
	createComboBoxValues :function(id, obj) {
        var html = '';

        for(var i=0; i < obj.length; ++i){
            var idx = obj[i].idx;
            var txt = obj[i].text;

            html += '<li><a href="#" id="' + idx.trim() + ' ">' + txt.trim() + '</a></li>';
        }

        $(id).html(html);
	},
	deleteComboBoxValues : function(id) {
		$(id).html("");
	},
	putGetPostData : function(filename, type, method, sdata, success_callback, error_callback) {
		var ret_val = "";
		$.ajax({
			type : method,
			async : true,
			url : filename, // for example http://192.168.0.100/test.txt
			cache : false,
			dataType : type, // for example: "text",
			contentType: "application/json; charset=utf-8",
			data : sdata,
			success : function(res) {
			console.log("success 1");
				ret_val = res;
				success_callback(res);
			},
			error : function(res, errMsg) {
			console.log("error 1");
				ret_val = "";
				if(error_callback != undefined){
				    error_callback(res, errMsg);
				}
				console.log(ret_val);
				console.log(errMsg);
			}
		});
        return ret_val;
	},

	//User authentication
    checkUserLogin : function(success_callback ,error_callback){
        cnlib.putGetPostData('/api/auth/check', 'JSON', 'get', '' ,
            function(res){
                if(res[0].ack == 1){
                    if(success_callback != undefined) {
                        success_callback();
                    }
                }else{
                    if(error_callback != undefined) {
                        error_callback();
                    }
                }
            },
            function(res){
                if(error_callback != undefined) {
                    error_callback();
                }
            }
        );
    },
    userLogout : function(success_callback, error_callback) {
        cnlib.putGetPostData('/api/auth/logout', 'JSON', 'POST', '',
            function(res){
                if(res[0].ack == 1){
                    if(success_callback != undefined) {
                        success_callback();
                    }
                }else{
                    if(error_callback != undefined) {
                        error_callback();
                    }
                }
            },
            function(res) {
                if(error_callback != undefined) {
                    error_callback();
                }
            }
        );
    },
	restartTimer : function(id, callback, timeout){
        if(id > 0){
            clearTimeout(id);
        }
        return setTimeout(callback, timeout);
	},
	/*	this function can be used to reverse the DATE to the European notation
	*	or any string that needs to be reversed (in this case every two positions)
	*	String.charAt() is the standard and it works in all the browsers. Better than str[x];
	*/
	reverseStr : function(string){
		var str = '';
		
		//'j' will save the length of the string WITHOUT the last two positions
		//we will extract two positions from the string so long 'j' will be bigger or equal with '0'  
		for(j=(string.length-2);j >= 0; j-=2){
			
			//in 'str' we will save the values of two consecutive positions
			str += string.charAt(j) + string.charAt(j+1);

			//let's see what is there !!
			console.log(str);			
		}
		//return the 'str' , the result of this function 
		return str;
	},
	/*This function can be used for prohibate any letters-input in text-fields*/
	isNumberKey : function(event){
		var charCode = (event.which) ? event.which : event.keyCode;
		if(charCode > 31 && (charCode < 48 || charCode > 57))
			return false;
		return true;
	},
	queryStringURL : function(){
		var query_string = {};
		var query = window.location.search.substring(1);
	},
	validate : function(element, id, to_validate) {
        var valid = false;

        if (element.value.match(cnlib.regex_list[to_validate])) {
            $(id).css(
                {
                '-webkit-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                '-moz-box-shadow' : '0 1px 3px rgba(0,0,0,0.2)',
                'box-shadow' : '0 1px 3px rgba(0,0,0,0.2)'
                }
            );
            valid = true;
        } else {
            $(id).css(
                {
                    '-webkit-box-shadow' : '0 1px 3px rgba(255,0,0,1.00)',
                    '-moz-box-shadow' : '0 1px 3px rgba(255,0,0,1.00)',
                    'box-shadow' : '0 1px 3px rgba(255,0,0,1.00)'
                }
            );
        }
        return valid;
    },
    changeThePassword : function(elem,modal){
		$(elem).click(
			function(){
				console.log("Change Password Dialog");
				cnlib.checkUserLogin(
					function(){
						$(modal).modal('show');
					},
					function(){
						window.location = "index.html";
					}
				);
			}
		);
	}
};
