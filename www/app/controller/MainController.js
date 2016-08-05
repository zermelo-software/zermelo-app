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
            announcementlist: '#announcementlist',
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
                tap: 'back_messageList'
            }
            // ,
            // appointmentDetails_back: {
            //     tap: 'back_schedule'
            // }
        }
    },
    // Announcement list item tap
    onItemTap: function (list, index, target, record) {
        var home = this.getHome() || Ext.create('Zermelo.view.Home');
        var messageDetailsView = this.getMessageDetails() || Ext.create('Zermelo.view.MessageDetails');
        var record = list.getStore().getAt(index);

        messageDetailsView.message = record.getData();
        Ext.Viewport.add(messageDetailsView);
        messageDetailsView.show();
        home.hide();
        currentView="messageDetail";
    },
    
    // tap back button on annoucement detail view
    back_messageList: function () {
        var home = this.getHome() || Ext.create('Zermelo.view.Home');
        home.list.removeCls('zermelo-menu-list');

        var messageDetailsView = this.getMessageDetails() || Ext.create('Zermelo.view.MessageDetails');
        messageDetailsView.hide();
        home.show();
        currentView="";
    },

    // // tap back button on appointment detail view
    // back_schedule: function () {
    //     console.log(arguments);
    //     console.log(this);
    //     appointment_detail_open=false;
    //     var home = this.getHome() || Ext.create('Zermelo.view.Home');
    //     home.list.removeCls('zermelo-menu-list');
    //     appointmentDetail = this.getAppointmentDetails() || Ext.create('Zermelo.view.AppointmentDetails');
    //     home.show();
    //     appointmentDetail.hide();
    //     currentView="";
    // },

    updateNewMessagesIndicator: function() {
        var announcementStore = Ext.getStore('Announcements');
        var count = 0;
        announcementStore.each(function(record) {
            if(!record.get('read') && record.valid()) {
                count++;
            }
        });

        var home = this.getHome() || Ext.create('Zermelo.view.Home');
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
        Ext.getStore('Announcements').addAfterListener('addrecords', this.updateNewMessagesIndicator, this);
        Ext.getStore('Announcements').addAfterListener('removerecords', this.updateNewMessagesIndicator, this);
        Ext.getStore('Announcements').addAfterListener('updaterecord', this.updateNewMessagesIndicator, this);
        this.updateNewMessagesIndicator();
        
        var onResume = function() {
            if(Date.now() - localStorage.getItem('refreshTime') > 30 * 60 * 1000) {
                Ext.getStore('Appointments').fetchWeek();
                Ext.getStore('Announcements').fetchAnnouncements();
                localStorage.setItem('refreshTime', Date.now());
            }
        };
        document.addEventListener('resume', Ext.bind(onResume, this), false);
        onResume();
    }
});
