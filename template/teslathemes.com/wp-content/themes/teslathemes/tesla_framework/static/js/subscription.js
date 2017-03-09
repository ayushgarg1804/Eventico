//=============Tesla Themes Subscription =======================================
(function($) {
    "use strict";

    function insert_subscription(form_data,form,options){
        $.ajax({
            type: 'POST',
            url: ajaxurl,
            data: form_data,
            success: function(response){
                //console.log(response);
                process_result(response,form,options);
            },
            error: function (request, status, error) {
                //console.log(request.responseText);
                process_result(request.responseText,form,options);
            },
            dataType: 'json',
        });
    }

    function process_result(result,form,options){
        console.log(result)
        if(config.result_wrapper){
            $(config.result_wrapper.tag,config.result_wrapper.attr).text(result).appendTo(config.result_container_selector);
        }else{
            $(form).find(config.result_container_selector).html(result);
        }
        if (result === 'Subscribed' || result === config.success_msg){
            options.success(result,config,form);     //calling success function callback
            $(form).find(config.result_container_selector).addClass(config.success_class);
            form.reset();
        //-------------------All good state end---------------------------------------
        }else{//-------------------PHP errors state start---------------------------------------
            options.error(result,config,form);       //calling error function callback
            $(form).find(config.result_container_selector).addClass(config.error_class);
        }//-------------------PHP errors state end---------------------------------------
    }

    function check_required(form,configs){
        var all_required_checker = true;   //checker for all required fields

        //Checking if all required fields are not empty
        $(form).find('[data-tt-subscription-required]').each(function(){
            if(!$(this).val()){
                all_required_checker = false;
                $(this).addClass(configs.required_class);
            }
        });

        return all_required_checker;
    }

    function validate_emails(form,configs){
        var all_emails_checker = true;  //checker for all emails validation

        $(form).find('[data-tt-subscription-type=email]').each(function(){
            if( !validateEmail($(this).val()) ){
                all_emails_checker = false;
                $(this).addClass(configs.invalid_email_class);
            }
        });

        return all_emails_checker;
    }

    function validateEmail(sEmail) {
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (filter.test(sEmail)) {
            return true;
        }
        else {
            return false;
        }
    }

    function clean_result_container(configs){
        $(configs.result_container_selector).removeClass(configs.error_class+' '+configs.success_class+ ' ' +configs.animation_done_class).html('');
    }

    function destroy_result_container(form,configs){
        $(configs.result_container_selector).removeClass(configs.error_class+' '+configs.success_class).addClass(configs.animation_done_class);
        if ( configs.input_timeout ){
            $(form).find('input').removeClass(configs.required_class+' '+configs.invalid_email_class);
        }
    }

    $.fn.extend({
        tt_subscription: function(options,arg) {
            var defaults = {
                success : function(result,config,form){},
                error:function(error,config,form){},
                required:function(config,form){},
                invalid_email:function(config,form){}
            };
            //if (options && typeof(options) === 'object') {
                options = $.extend( {}, defaults, options );
            //}

            // this creates a plugin for each element in
            // the selector or runs the function once per
            // selector.  To have it do so for just the
            // first element (once), return false after
            // creating the plugin to stop the each iteration 
            this.each(function() {
                new $.tt_subscription(this, options, arg );
            });
            return;
        }
    });

    var config = {"error_class":"error","required_class":"s_error","required_msg":"Please insert email","invalid_email_class":"invalid_email","invalid_email_msg":"Invalid Email","input_timeout":true,"success_class":"success","animation_done_class":"animation_done","result_timeout":3000,"result_container_selector":".result_container","date_format":"F j, Y, g:i a","date_headline":"Date","no_data_posted":"No data received","error_open_create_files_msg":"Error writing to disk","success_msg":"Successfully Subscribed","error_writing_msg":"Couldn't write to file"};

    $.tt_subscription = function( form, options, arg ) {

        if (options && typeof(options) === 'string') {
           if (options === 'mymethod1') {
               tt_subscription_method1( arg );
           }
           else if (options === 'mymethod2') {
               tt_subscription_method2( arg );
           }
           return;
        }
        var result_timeout_id;
        var input_timeout_id;
        $(form).on('submit',function(event){
            //preventing from normal submition
            event.preventDefault();

            clearTimeout(result_timeout_id);    //clearing interval if it was set

            var form_data = $(form).serialize();
            form_data = form_data + "&action=insert_subscription"; //adding action for correct ajax call hook
            
            clean_result_container(config);

            if(check_required(form,config)){

                if(validate_emails(form,config)){
                    //-------------------All good state start---------------------------------------
                    var result = insert_subscription(form_data,form,options);    //inserting subscription
                }else{//-------Email not valid state start-----------------------
                    options.invalid_email(config,form);       //calling invalid_email function callback
                    $(form).find(config.result_container_selector).addClass(config.error_class);
                    if(config.result_wrapper){
                        $(config.result_wrapper.tag,config.result_wrapper.attr).text(config.invalid_email_msg).appendTo(config.result_container_selector);
                    }else{
                        $(form).find(config.result_container_selector).html(config.invalid_email_msg);
                    }
                }//-------Email not valid state end-----------------------
            }else{//-------Required fields not filled state start-----------------------
                options.required(config,form);       //calling required function callback
                $(form).find(config.result_container_selector).addClass(config.error_class);
                if(config.result_wrapper){
                    $(config.result_wrapper.tag,config.result_wrapper.attr).text(config.required_msg).appendTo(config.result_container_selector);
                }else{
                    $(form).find(config.result_container_selector).html(config.required_msg);
                    console.log($(form).find(config.result_container_selector),config.result_container_selector)
                }
            }//-------Required fields not filled state end-----------------------

            result_timeout_id = setTimeout(function(){destroy_result_container(form,config);},config.result_timeout); //hiding results after a certain time
            //clearTimeout(result_timeout_id);
        });

        function tt_subscription_method1(arg)
        {
            //...do method1 with this and arg
        }

        function tt_subscription_method2(arg)
        {
            //...do method2 with this and arg
        }

    };


    $(document).ready(function($){
        $('form[data-tt-subscription]').tt_subscription(); //selecting elements from DOM for subscription plugin (init)
    });
})(jQuery);