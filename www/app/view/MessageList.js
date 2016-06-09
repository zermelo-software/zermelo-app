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

var mystore;

// This page shows  the listing of announcements which comes from webservice.

Ext.define("Zermelo.view.MessageList", {
    extend: 'Ext.Container',
    xtype: 'messageList',
    id: 'messageList',
    config: {
        listeners: {
            show: function () {
                messageShow=true;
                if (Ext.getStore('Announcements').getCount() == 0) {
                    Zermelo.ErrorManager.showErrorBox('announcement.no_announcement_msg');
                }
            }, //end show

            hide:function(){
                messageShow=false;
            },

            // record update with read and unread
            painted_disabled: function () {
                if (Ext.getStore('Announcements').getCount() == 0) {
                    Zermelo.ErrorManager.showErrorBox('announcement.no_announcement_msg');
                }
            } //end painted
        }, // end listeners
        layout: 'fit',
        style: {
            'background': '#F0F0F0'
        },
        items: [{
            // list view
            xtype: 'list',
            // padding top left bottom right
            margin: '10 10 10 10',
            style:{
                'top': '-50px',
                'padding-bottom': '50px'
            },
            id: 'announcementlist',
            // css class resources/css/app.css
            cls: 'zermelo-message-list',
            // css class resources/css/app.css list items
            itemCls: 'zermelo-message-list-item',
            // css class resources/css/app.css selected items
            selectedCls: 'zermelo-menu-list-item-select',
            grouped: false,
            store: 'Announcements',
            itemTpl: new Ext.XTemplate("<tpl for='.'>", "<tpl if='read == 0'>{title} <img src='resources/images/new."+imageType+"' class='zermelo-message-list-read-unread-icon'>", "<tpl else>{title}", "</tpl>", "</tpl>")
        }]
    }
});
