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
                // set title in multiple language
                locales: {
                    title: 'menu.schedule_self'
                },
                docked: 'top',
                // Add two buttons refresh and new announcement
                items: [{
                    // refresh button
                    xtype: 'button',
                    //css class resources/images/app.css
                   // iconCls: 'zermelo-refresh-button-' + imageType,
                    docked: 'right',
                    ui: 'plain',
                    id:'button_week_refresh',
                    style: {
                        'padding-right': '4px'
                    },
                    handler: function () {
                        refresh();
                    }
                }]
            }, {
                // set toolbar with menu, refresh, announcement buttons
                xtype: 'toolbar',
                //css class resources/images/app.css
                cls: 'zermelo-toolbar',

                id: 'toolbar_day_back',
                hidden: true,
                // set title in multiple language
                locales: {
                    title: 'menu.schedule_self'
                },
                docked: 'top',
                // Add two buttons refresh and new announcement 
                items: [{
                    // refresh button
                    xtype: 'button',
                    //css class resources/images/app.css
                    // iconCls: 'zermelo-refresh-button-' + imageType,
                    docked: 'right',
                    ui: 'plain',
                    id:'button_day_refresh',
                    style: {
                        'padding-right': '0px'
                    },
                    handler: function () {
                        refresh();
                    }
                }, {
                    // announcement button
                    xtype: 'button',
                    //css class resources/images/app.css
                    iconCls: 'zermelo-back-button-' + imageType,
                    docked: 'left',
                    locales: {
                        text: 'back.back'
                    },
                    ui: 'plain',
                    id: 'btn_day_back',
                    style: {
                        'padding-left': '0px'
                    },
                    handler: function () {
                        // call announcement screen
                        week_day_view = "agendaWeek";
                        Ext.getCmp('fullCalendarView').changeCalendarView('agendaWeek');
                        Ext.getCmp('fullCalendarView').day.show();
                        dayview = "";
                        Ext.getCmp('toolbar_main').setHidden(false);
                        Ext.getCmp('toolbar_day_back').setHidden(true);
                    }
                }]
            }, {
                // open schedule view
                xtype: 'schedule'
            }]
        }, {
            slideButton: true,
            urlLogo: 'resources/images/messages.' + imageType,
            title: 'Messages',
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
                        getannouncementsData(Ext.getCmp('messageList'))

                    }
                }]
            }, {
                // open message list view
                xtype: 'messageList'
            }]
        },
        {
            //switch user button
            urlLogo: 'resources/images/user_switch.' + imageType,
            title: 'swtich User'
        },
        {
            //logout and move to login screen
            urlLogo: 'resources/images/logout.' + imageType,
            title: 'logout'
        }
        ]
    }
});
// refresh schedule and announcement 
function refresh() {
    refreshDate=new Date();
    window.localStorage.setItem('refreshTime',refreshDate.getTime());
    window.localStorage.setItem('refresh_time_interval',refreshDate.getTime());
    var currentweekdate = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
    currentweekdate.setDate(currentweekdate.getDate() - currentweekdate.getDay() + 1);
    var startTime = Math.round(currentweekdate.getTime() / 1000);
    var endTime = Math.round(currentweekdate.setDate(currentweekdate.getDate() + 12) / 1000);

    // call appointment api and announcement api at start
    getAppointment(Ext.getCmp('schedule'), Ext.getCmp('fullCalendarView'), true, startTime, endTime, true, '', false);
    getannouncementData(Ext.getCmp('schedule'));
}

function getannouncementsData(thisObj) {   
    Ext.Viewport.setMasked({
        xtype: 'loadmask',
        locale: {
            message: 'loading'
        },

        indicator: true
        });
    
    thisObj.hide();

    // send request to server using ajax with http GET
    Ext.Ajax.request({
        url: 'https://' + Zermelo.UserManager.getInstitution() + '.zportal.nl/api/v3/announcements?current=true&user=' + Zermelo.UserManager.getUser() + '&access_token=' + Zermelo.UserManager.getAccessToken(), // url : this.getUrl(),
        method: "GET",
        useDefaultXhrHeader: false,

        success: function (response) {
            var decoded = Ext.JSON.decode(response.responseText).response.data;

            var announcementStore = Ext.getStore('Announcements');
            announcementStore.each(function(record) {
                var stillExists = 
                decoded.some(function(entry, index) {
                    if (record.announcement_id != entry.id)
                        return false;

                    record.set('start', decoded[index].start);
                    record.set('end', decoded[index].end);
                    record.set('title', decoded[index].title);
                    record.set('text', decoded[index].text);    
                    decoded.splice(index, 1);
                    return true;
                });

                if (!stillExists)
                    announcementStore.remove(record);
                record.commit();
            });
            announcementStore.sync();

            console.log(decoded);
            decoded.forEach(function(record) {
                // record.announcement_id = record.id;
                // // record.id = 0;
                // delete record.id;
                // announcement = Ext.create('Zermelo.model.Announcement');
                // announcement.set(record);
                announcementStore.add({
                    announcement_id: record.id,
                    start: record.start,
                    end: record.end,
                    title: record.title,
                    text: record.text
                });
            });
            announcementStore.sync();
            // loading screen disappear
            Ext.Viewport.setMasked(false);
            thisObj.show();
        },
        failure: function (response) {
            if (response.status == 403) {
                Zermelo.ErrorManager.showErrorBox('insufficient_permissions');
                Zermelo.UserManager.setUser();
            }
            else {
                Zermelo.ErrorManager.showErrorBox('network_error');
            }
            Ext.Viewport.setMasked(false);
            thisObj.show();
        }
    });
}
