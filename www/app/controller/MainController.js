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

Ext.define('Zermelo.controller.MainController', {
    extend: 'Ext.app.Controller',
    config: {
        refs: {
            // ids
            announcementlist: '#messageList',
            messageDetails_back: '#messageDetails_back',
            appointmentDetails_back: '#appointmentDetails_back',

            // views xtype
            messageList: 'messageList',
            messageDetails: 'messageDetails',
            home: 'home',
            appointmentDetails: 'appointmentDetails',
            calendarList: 'CalendarList'
        },
        control: {
            announcementlist: {
                itemtap: 'onItemTap'
            },
            messageDetails_back: {
                tap: 'onBackButton'
            },
            appointmentDetails_back: {
                tap: 'onBackButton'
            }

        }
    },
    // Announcement list item tap
    onItemTap: function (list, index, target, record) {
        var messageDetailsView = this.getMessageDetails() || Ext.create('Zermelo.view.MessageDetails');
        messageDetailsView.message = record.getData();
        Ext.Viewport.add(messageDetailsView);
        Ext.Viewport.setActiveItem(messageDetailsView);
    },
    
    // tap back button on annoucement detail view
    onBackButton: function() {
        var item = Ext.Viewport.getActiveItem();
        if(item.getItemId() != 'main') {
            Ext.Viewport.setActiveItem(Ext.getCmp('main'));
            return;
        }
        item = item.getActiveItem();
        if(item.getItemId() != 'login') {
            var itemName = item.getActiveItemName();
            if(itemName == 'messageList' || itemName == 'userChange') {
                item.selectItem(localStorage.getItem('lastView'));
                return;
            }
        }
        navigator.Backbutton.goBack(function() {}, function() {});
    },

    // Determines whether there are any pending announcements
    // MessageList isn't instantiated until it is opened so putting this function there doesn't work
    updateNewMessagesIndicator: function() {
        var announcementStore = Ext.getStore('Announcements');
        var count = 0;
        announcementStore.each(function(record) {
            if(!record.get('read') && record.valid()) {
                count++;
            }
        });

        var home = this.getHome() || Ext.getCmp('home');
        home._slideButtonConfig.setBadgeText(count);

        if(count != 0) {
            document.getElementById('messageCount').style.display="";
            document.getElementById('messageCount').innerHTML=count;
        }
        else {
            document.getElementById('messageCount').style.display="none";
        }
    },

    launch: function() {
        if (Ext.os.is('Android')) {
            document.addEventListener("backbutton", this.onBackButton, false);
        }

        document.addEventListener("resume", Zermelo.AjaxManager.refreshIfStale.bind(Zermelo.AjaxManager));

        var onUsersLoaded = function() {
            if(!Zermelo.UserManager.getTokenAttributes())
                Zermelo.AjaxManager.getSelf();
            Zermelo.AjaxManager.periodicRefresh();
            Ext.Viewport.add(Ext.create('Zermelo.view.Main'));

            var announcementStore = Ext.getStore('Announcements');
            announcementStore.onAfter('addrecords', this.updateNewMessagesIndicator, this);
            announcementStore.onAfter('removerecords', this.updateNewMessagesIndicator, this);
            announcementStore.onAfter('updaterecord', this.updateNewMessagesIndicator, this);
            announcementStore.loadFromLocalForageOrStorage();

            Ext.getStore('Appointments').loadFromLocalForageOrStorage();

            Ext.fly('appLoadingIndicator').destroy();
            if (!navigator.userAgent.toLowerCase().includes('windows')) {
                setTimeout(navigator.splashscreen.hide, 50);
            }
        }.bind(this);

        Zermelo.UserManager.loadFromLocalForageOrStorage(onUsersLoaded);
    }
});
