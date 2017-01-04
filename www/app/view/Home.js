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

// This page is centralized page of the app
// User can move to scheduling page, announcement page also
// log out funcitonality implemented in this page.
Ext.define('Zermelo.view.Home', {
    extend: 'Zermelo.view.SlideView',
    xtype: 'home',
    id: 'home',
    requires: [
        'Ext.Container',
        'Ext.MessageBox',
        'Ext.Panel',
        'Ext.Toolbar',
        'Ext.event.publisher.Dom',
        'Ext.TitleBar',
        'Ext.tab.Panel',
        'Ext.Button',
        'Ext.field.Select',
        'Ext.field.DatePicker',
        'Ext.form.FieldSet',
        'Ext.Title'
    ],
    config: {
        fullscreen: true,
        //cls: 'zermelo-menu-container',
        /**
         *  Any component within the container with an 'x-toolbar' class
         *  will be draggable.  To disable draggin all together, set this
         *  to false.
         */
        slideSelector: 'x-toolbar',

        /**
         *  Container must be dragged 10 pixels horizontally before allowing
         *  the underlying container to actually be dragged.
         *
         *  @since 0.2.2
         */
        containerSlideDelay: 10,

        /**
         *  Time in milliseconds to animate the closing of the container
         *  after an item has been clicked on in the list.
         */
        selectSlideDuration: 100,

        /**
         *  Enable content masking when container is open.
         *
         *  @since 0.2.0
         */
        itemMask: true,

        /**
         *  Define the default slide button config.  Any item that has
         *  a `slideButton` value that is either `true` or a button config
         *  will use these values at the default.
         */
        slideButtonDefaults: {
            selector: 'toolbar'
        },
        list: {
            maxDrag: 100,
            width: 100,
            style: {
                'display': 'none'
            },
            items: []

        },
        defaults: {
            style: 'background: #fff',
            xtype: 'container'
        },
        /**
         *  Change this to 'right' to dock the navigation list to the right.
         */
        listPosition: 'left',
        // add items in slide menu list 
        items: [{
            // Enable the slide button using the defaults defined above in
            // `slideButtonDefaults`.
            slideButton: true,
            // display schedule image in slide menu list
            urlLogo: 'resources/images/myschedule.' + imageType,
            items: [{
                // set toolbar with menu, refresh, announcement buttons
                xtype: 'toolbar',
                //css class resources/images/app.css
                cls: 'zermelo-toolbar',
                id: 'toolbar_main',
                height: '47px',
                width: '100%',
                // title: Zermelo.UserManager ? Zermelo.UserManager.getTitle() : '',
                docked: 'top',
                // Add two buttons refresh and new announcement
                items: [{
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
                        Zermelo.AjaxManager.refresh();
                    }
                }]
            },{
                // open schedule view
                xtype: 'schedule'
            }]
        },
        {
            slideButton: true,
            urlLogo: 'resources/images/list.' + imageType,
            title: 'CalendarList',

            items: [{
                xtype: 'toolbar',
                //css class resources/images/app.css
                cls: 'zermelo-toolbar-main',
                height: '47px',
                // set title in multiple language
                id:'calendar_list_title',
                // title: Zermelo.UserManager ? Zermelo.UserManager.getTitle() : '',
                docked: 'top',
                items:[{
                    // refresh button
                    xtype: 'button',
                    //css class resources/images/app.css
                    iconCls: 'zermelo-refresh-button-' + imageType,
                    docked: 'right',
                    ui: 'plain',
                    style: {
                        'padding-right': '4px'
                    },
                    handler: function () {
                        Ext.getStore('Appointments').fetchWeek();
                    }
                }]
            }, {
                // open message list view
                xtype: 'CalendarList'
            }]
        }, 
        {
            slideButton: true,
            urlLogo: 'resources/images/messages.' + imageType,
            title: 'Messages',
            itemId: 'messageList',
            items: [{
                // set toolbar with menu, refresh, announcement buttons
                xtype: 'toolbar',
                //css class resources/images/app.css
                cls: 'zermelo-toolbar-main',
                height: '47px',
                // set title in multiple language
                id:'message_title',
                locales: {
                    title: 'menu.announcement_self'
                },
                docked: 'top',
                items:[{
                    // refresh button
                    xtype: 'button',
                    //css class resources/images/app.css
                    iconCls: 'zermelo-refresh-button-' + imageType,
                    docked: 'right',
                    ui: 'plain',
                    style: {
                        'padding-right': '4px'
                    },
                    handler: function () {
                        Zermelo.AjaxManager.getAnnouncementData(Ext.getCmp('messageList'))

                    }
                }]
            }, {
                // open message list view
                xtype: 'messageList'
            }]
        },
        {
            urlLogo: 'resources/images/user_switch.' + imageType,
            title: 'Switch user',
            itemId: 'userChange',
            items: [{
                xtype: 'toolbar',
                cls: 'zermelo-toolbar-main',
                height: '47px',
                locales: {
                    title: 'menu.user_select'
                },
                docked: 'top',
                items:[{
                    xtype: 'button',
                    iconCls: 'zermelo-refresh-button-' + imageType,
                    docked: 'right',
                    ui: 'plain',
                    style: {
                        'padding-right': '4px'
                    },
                    handler: function () {
                        Zermelo.AjaxManager.refreshUsers();
                    }
                }]
            }, {
                xtype: 'UserSearch'
            }]
        },
        {
            //logout and move to login screen
            urlLogo: 'resources/images/logout.' + imageType,
            title: 'logout'
        }
        ]
    }
});
