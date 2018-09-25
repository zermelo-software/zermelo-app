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


Ext.define('Zermelo.view.Main', {
    extend: 'Ext.Container',
    xtype: 'main',
    id: 'main',
    requires: [
        'Zermelo.view.SlideView',
        'Zermelo.view.Home'
    ],
    config: {
        listeners: {
            show: function () {
                if (Zermelo.UserManager.loggedIn()) {
                    //set home view
                    this.setActiveItem(1)
                } else {
                    // set login view
                    this.setActiveItem(0)
                }
            }
        },
        layout: 'card',
        items: [{
            xtype: 'login'
        }, {
            xtype: 'container',
			layout: 'vbox',
            fullscreen: true,
            items: [
				{
					// set toolbar with menu, refresh, announcement buttons
					xtype: 'toolbar',
					//css class resources/images/app.css
					cls: 'zermelo-toolbar',
					height: '47px',
					width: '100%',
					// title: Zermelo.UserManager ? Zermelo.UserManager.getTitle() : '',
					docked: 'top',
					// Add two buttons refresh and new announcement
					items: [
                        {
							xtype: 'button',
							iconMask: true,
							ref: '../menuButton',
							docked: 'left',
							iconCls: 'zermelo-menu-button-' + imageType,
							name: 'slidebutton',
							style: {
								'padding-left': '0px'
							},
							ui: 'plain',
                            handler: function() {
                                var home = Ext.getCmp('home');
                                home.toggleContainer.bind(home, 100)();
                            }
                        },
						{
							xtype: 'container',
							layout: 'vbox',
							style: 'text-align: center;',
							width: '100%',
							align: 'center',
							items: [
								{
									id: 'user_label',
									xtype: 'label',
									html: ''
								},
								{
									id: 'refresh_time_label',
									xtype: 'label',
									style: 'font-size: 0.6em; font-weight: lighter',
									html: ''
								}
							]
						},
						{
							// refresh button
							xtype: 'button',
							//css class resources/images/app.css
							iconCls: 'zermelo-refresh-button-' + imageType,
							docked: 'right',
							ui: 'plain',
							id:'button_week_refresh',
							style: {
								'padding-right': '4px'
							},
							handler: function () {
								var slideView = Ext.getCmp('home');
								if (slideView && slideView.getActiveItemName() === 'userChange') {
									Zermelo.AjaxManager.getUsers();
								}
								else {
									Zermelo.AjaxManager.refresh();
								}
							}
						}]
				},
				{
				    id: 'home',
					xtype: 'home',
					width: '100%',
					height: '100%'
				}
            ]
        }]
    }
});
