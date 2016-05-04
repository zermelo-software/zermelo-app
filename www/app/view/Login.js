/* 
 * This file is part of the Zermelo App.
 * 
 * Copyright (c) Zermelo Software B.V. and contributors
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// This page includes login functionality with proper validation.
Ext.define('Zermelo.view.Login', {
    extend: 'Ext.Container',
    xtype: 'login',
    id: 'login',
    requires: [
        'Ext.Img',
        'Ext.Label',
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.data.JsonP'
    ],
    config: {
        listeners: {
            show: function () {
                thisObj = this;
            }
        },
        layout: {
            type: 'vbox',
            align: 'stretch',
        },
        cls: 'zermelo-login-background',
        padding: '0 5% 0 5%',
        scrollable: true,
        items: [{
                //zermelo logo
                xtype: 'container',
                pack: 'center',
                padding: '30 0 0 0',
                html: '<div align="center"><img src="resources/images/LogoZermelo.png" height="100" align="middle"/></div>'
            }, {
                // info text
                xtype: 'container',
                padding: '10 0 10 0',
                locales: {
                    html: 'login.text',
                },
                style: {
                    'font-size': '10pt'
                }
            }, {
                // institute text field , building logo ,code textfield and password icon conatiner
                xtype: 'container',
                layout: 'vbox',
                items: [{
                    // institute text field and building logo container
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch',
                    },
                    items: [{
                        //building logo
                        xtype: 'label',
                        html: '<img height="46px" width="46px" src="resources/images/building_icon.png" style="margin-top: 1px;">',
                    }, {
                        // text field container
                        xtype: 'container',
                        flex: 1,
                        items: [{
                            xtype: 'fieldset',
                            items: [{
                                // institution text field
                                xtype: 'textfield',
                                width: '100%',
                                name: 'institution',
                                id: 'text_login_institution',
                                locales: {
                                    placeHolder: 'login.institution',
                                },
                                listeners: {
                                    keyup: function (thisField, e) {
                                        //check enter button set focus to next textbox
                                        if (e.browserEvent.keyCode == 13)
                                            Ext.getCmp('number_login_code').focus();
                                    },
                                    blur: function () {
                                        //set lowcase valule of institution
                                        this.setValue(this.getValue().toLowerCase());
                                    }
                                }
                            }]
                        }]
                    }]
                }, {
                    //below code shows the numberfield (for entering the code out of the portal) and password icon container
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        //set password icon
                        xtype: 'label',
                        html: '<img height="46px" src="resources/images/password_icon.png" style="margin-top: 1px;">',
                    }, {
                        xtype: 'fieldset',
                        flex: 1,
                        items: [{
                            // code for numberfield
                            xtype: 'numberfield',
                            name: 'cdoe',
                            id: 'number_login_code',
                            locales: {
                                placeHolder: 'login.code',
                            },
                            listeners: {
                                keyup: function (thisField, e) {
                                    //check press enter button 
                                    if (e.browserEvent.keyCode == 13)
                                        authentication();
                                }
                            }
                        }]
                    }]
                }]
                //end container 
            }, {
                // login button
                xtype: 'button',
                id: 'btn_login_login',
                locales: {
                    text: 'login.login'
                },
                // css class resources/css/app.css
                cls: 'zermelo-login-button',
                // css class resources/css/app.css when pressed button
                pressedCls: 'zermelo-login-button-pressed',
                // pressed button event handle
                handler: function () {
                    authentication();
                } //end handler
            } //end login button
        ] // end items
    } //end config
});
// authentication function call while press login button and go button
function authentication() {
    document.getElementsByName('cdoe').item(0).blur();
    // get textfields object
    var number_code = Ext.getCmp('number_login_code');
    var text_institution = Ext.getCmp('text_login_institution');

    // regular expression for institution and code
    var institution_reg = /^[a-z0-9-]*$/;
    var code_reg = /^[0-9]*$/;

    var text_flag = false;
    var number_flag = false;

    var msg = '';
    var login = Ext.getCmp('login');
    var home = Ext.getCmp('home');
    // check text_institution and numner_code validation
    if (text_institution.getValue().length == 0 && number_code.getValue().length == 0) {
        // both textfields are empty
        //show error message
        Ext.Msg.show({
            items: [{
                xtype: 'label',
                cls: 'zermelo-error-messagebox',
                locales: {
                    html: 'login.institution_code_error_msg'
                }
            }],
            buttons: [{
                itemId: 'ok',
                locales: {
                    text: 'ok',
                },
                ui: 'action'
            }],
        });
    } else {
        // get textfields data
        var value_institution = text_institution.getValue().trim();
        var value_code = number_code.getValue();

        if (value_institution.length != 0 && value_institution.length <= 100 && institution_reg.exec(value_institution)) {
            // text_institution field is valid
            text_flag = true;
        }
        if (number_code.getValue() != 0 && code_reg.exec(number_code.getValue())) {
            // number_code field is valid
            number_flag = true;
        }
        //if
        if (text_flag && number_flag) {
            // text_flag and number_flag are true

            // show loading screen
            thisObj.setMasked({
                xtype: 'loadmask',
                        message: LoadingMessage,

                indicator: true
            });
            //send request to authorization API
            Ext.Ajax.request({
                url: 'https://' + value_institution + '.zportal.nl/api/v2/oauth/token?grant_type=authorization_code&code=' + value_code,
                method: "POST",
                useDefaultXhrHeader: false,
                //success
                success: function (response) {
                    console.log('login succesful');
                    // hide loading screen
                    thisObj.unmask();
                    // decode response
                    var decoded = Ext.JSON.decode(response.responseText);
                    // save accessToken and institution in localstorage
                    window.localStorage.setItem('accessToken', decoded.access_token);
                    window.localStorage.setItem('institution', value_institution);
                    window.localStorage.setItem('user_code',"~me");
                     window.localStorage.setItem('startApp',"True");
                    number_code.setValue("");
                    text_institution.setValue("");
                    Ext.getCmp('main').setActiveItem(1);
                    doRefresh(Ext.getCmp('fullCalendarView'));
                },
                //failure
                failure: function (response) {
                  //  console.log(response);
                   // console.log("fail");
                    thisObj.unmask();
                    Ext.Msg.show({
                        items: [{
                            xtype: 'label',
                            cls: 'zermelo-error-messagebox',
                            locales: {
                                html: 'network_error'
                            }
                        }],
                        buttons: [{
                            itemId: 'ok',
                            locales: {
                                text: 'ok',
                            },
                            ui: 'normal'
                        }],
                    });
                }
            });
        } else {
            //text field and code field both are invalid
            if (!text_flag && !number_flag) {
                //show message
                Ext.Msg.show({
                    items: [{
                        xtype: 'label',
                        cls: 'zermelo-error-messagebox',
                        locales: {
                            html: 'login.institution_code_error_msg'
                        }
                    }],
                    buttons: [{
                        itemId: 'ok',
                        locales: {
                            text: 'ok',
                        },

                        ui: 'normal'
                    }],
                });
            } else if (!text_flag) {
                Ext.Msg.show({
                    items: [{
                        xtype: 'label',
                        cls: 'zermelo-error-messagebox',
                        locales: {
                            html: 'login.institution_error_msg'
                        }
                    }],
                    buttons: [{
                        itemId: 'ok',
                        locales: {
                            text: 'ok',
                        },

                        ui: 'normal'
                    }],
                });
            } else if (!number_flag) {
                Ext.Msg.show({
                    items: [{
                        xtype: 'label',
                        cls: 'zermelo-error-messagebox',
                        locales: {
                            html: 'login.code_error_msg'
                        }
                    }],
                    buttons: [{
                        itemId: 'ok',
                        locales: {
                            text: 'ok',
                        },

                        ui: 'normal'
                    }],
                });
            } //end else if
        } //end else
    } //end else
}
