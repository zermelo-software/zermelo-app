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

// This page shows the necessary detail of announcement which comes from webservice.
Ext.define('Zermelo.view.MessageDetails', {
    extend: 'Ext.Container',
    xtype: 'messageDetails',
    id: 'messageDetails',
    message: null,
    config: {
        listeners: {
            show: function () {
                // check if this message is unread then add in localstoreage message id as read
                if (!this.message.read) {
                    console.log('this.message', this.message);
                    var announcementStore = Ext.getStore('Announcements');
                    var announcement = announcementStore.findRecord('announcement_id', this.message.announcement_id);
                    console.log(announcement);
                    announcement.set('read', true)
                    announcement.commit();
                    Ext.getCmp('messageList').refresh();
                }
                // set message details in labels
                Ext.getCmp('messageDetails_title_lbl').setHtml(this.message.title);
                //Ext.getCmp('messageDetails_startDate_lbl').setHtml(Ext.Date.format(new Date(messageDetails.start * 1000), 'F j, Y'));
                //Ext.getCmp('messageDetails_endDate_lbl').setHtml(Ext.Date.format(new Date(new Date(messageDetails.end * 1000).setSeconds(-1)), 'F j, Y'));
                Ext.getCmp('messageDetails_description_lbl').setHtml(this.message.text);
            }
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        scrollable: true,
        items: [{
                // titlebar
                xtype: 'titlebar',
                id: 'messageDetails_title',
                docked: 'top',
                cls: 'zermelo-toolbar-main',
                height: '47px',
                locales: {
                    title: 'menu.announcement_self'
                },
                items: [{
                    //back button in title bar
                    xtype: 'button',
                    locales: {
                        text: 'back.back'
                    },
                    style: {
                        'padding-left': '0px'
                    },
                    iconCls: 'zermelo-back-button-' + imageType,
                    align: 'left',
                    ui: 'plain',
                    id: 'messageDetails_back'
                }]
            }, { //body container
                xtype: 'container',
                style: {
                    'font-size': '14px'
                },
                //padding top left bottom right
                padding: '20 20 10 20',
                items: [{
                    //message title
                    xtype: 'label',
                    id: 'messageDetails_title_lbl',
                    cls: 'zermelo-messagedetail-title'
                }, /*{
                    // start date container
                    xtype: 'container',
                    layout: 'hbox',
                    style: {
                        'margin-bottom': '10px'
                    },
                    items: [{
                        //start date label
                        xtype: 'label',
                        flex: 1,
                        locales: {
                            html: 'announcement.startDate',
                        },
                        cls: 'zermelo-announcement-label',
                    }, {
                        // start date value label
                        xtype: 'label',
                        flex: 1.5,
                        id: 'messageDetails_startDate_lbl',
                        // html:'dfksf',
                        cls: 'zermelo-announcement-label',
                    }]
                    //end start date container
                }, {
                    // end date container
                    xtype: 'container',
                    layout: 'hbox',
                    style: {
                        'margin-bottom': '20px'
                    },
                    items: [{
                        //end date label
                        xtype: 'label',
                        flex: 1,
                        locales: {
                            html: 'announcement.endDate',
                        },
                        cls: 'zermelo-announcement-label',
                    }, {
                        //end date value label
                        xtype: 'label',
                        flex: 1.5,
                        id: 'messageDetails_endDate_lbl',

                        cls: 'zermelo-announcement-label',
                    }]
                    //end end date container
                }, */{
                    //description label
                    xtype: 'label',
                    locales: {
                        html: 'announcement.description'
                    },
                    margin: '10 0 10 0'

                }, {
                    //description value label
                    xtype: 'label',
                    id: 'messageDetails_description_lbl'

                }]
            } //end body container

        ]
    } //end config
});
