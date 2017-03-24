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
    requires: [
        'Ext.Img',
        'Ext.Label',
        'Ext.form.FieldSet',
        'Ext.field.Number',
        'Ext.data.JsonP'
    ],
    config: {
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        cls: 'zermelo-login-background',
        padding: '0 5% 0 5%',
        scrollable: true,
        items: [{
                xtype: 'container',
                pack: 'center',
                padding: '30 0 0 0',
                html: '<div align="center"><img src="resources/images/LogoZermelo.png" height="100" align="middle"/></div>'
            }, {
                xtype: 'container',
                padding: '10 0 10 0',
                locales: {
                    html: 'login.text'
                },
                style: {
                    'font-size': '10pt'
                }
            }, {
                xtype: 'container',
                layout: 'vbox',
                items: [{
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'stretch'
                    },
                    items: [{
                        xtype: 'label',
                        html: '<img height="46px" width="46px" src="resources/images/building_icon.png" style="margin-top: 1px;">'
                    }, {
                        xtype: 'container',
                        flex: 1,
                        items: [{
                            xtype: 'textfield',
                            width: '100%',
                            locales: {
                                placeHolder: 'login.institution'
                            },
                            autocomplete: 'off',
                            autocorrect: 'off',
                            autocapitalize: 'off',
                            spellcheck: false,
                            listeners: {
                                keyup: function (thisField, e) {
                                    thisField.setValue(thisField.getValue().toLowerCase().replace(/ /g, ''));
                                    this.up('login').institution = thisField.getValue();
                                    if (e.browserEvent.keyCode == 13)
                                        Ext.getCmp('number_login_code').focus();
                                }
                            }
                        }]
                    }]
                }, {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [{
                        xtype: 'label',
                        html: '<img height="46px" src="resources/images/password_icon.png" style="margin-top: 1px;">'
                    }, {
                        xtype: 'textfield',
                        component: {
                            type: 'tel'
                        },
                        locales: {
                            placeHolder: 'login.code'
                        },
                        flex: 1,
                        listeners: {
                            keyup: function (thisField, e) {
                                var cleaned = (thisField.getValue() || '').replace(/[^0-9]/g, '');
                                thisField.setValue(cleaned);
                                this.up('login').code = cleaned;
                                if (e.browserEvent.keyCode == 13)
                                    this.up('login').authenticate();
                            }
                        }
                    }]
                }]
            }, {
                xtype: 'button',
                locales: {
                    text: 'login.login'
                },
                cls: 'zermelo-login-button',
                pressedCls: 'zermelo-login-button-pressed',
                handler: function () {
                    this.parent.authenticate();
                }
            }
        ]
    },
    authenticate: function() {
        var institution_regex = /^[a-z0-9-]*$/;
        var code_regex = /^[0-9]*$/;
        this.institution = (this.institution || '').toLowerCase().replace(/ /g, '');
        this.code = (this.code || '').replace(/[^0-9]/g, '');

        if(this.institution == undefined || !institution_regex.test(this.institution) || this.institution.length == 0) {
            Zermelo.ErrorManager.showErrorBox('login.institution_code_error_msg');
            return;
        }
        if(this.code == undefined || !code_regex.test(this.code) || this.code.length == 0) {
            Zermelo.ErrorManager.showErrorBox('login.code_error_msg');
            return;
        }
        while (this.code.length < 12) {
            this.code = '0' + this.code;
        }

        Zermelo.AjaxManager.getLogin(this.institution, this.code, Ext.bind(this.destroy, this));
    }
});