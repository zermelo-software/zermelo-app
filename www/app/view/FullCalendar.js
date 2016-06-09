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

var width;
var screenWidth;

function doRefresh(me) {
    var currentweekdate = new Date();
    currentweekdate = new Date(currentweekdate.getFullYear(), currentweekdate.getMonth(), currentweekdate.getDate());
    currentweekdate.setDate(currentweekdate.getDate() - currentweekdate.getDay() + 1);
    var startTime = Math.round(currentweekdate.getTime() / 1000);
    var endTime = Math.round(currentweekdate.setDate(currentweekdate.getDate() + 12) / 1000);
    // call appointment api and annoucement api at start
    var refreshMin=0;
    //  console.log(refreshMin);
    if(window.localStorage.getItem('refresh_time_interval')!=null)
    {
        var date=new Date();
        var currentTime=date.getTime();
        var refreshTime=window.localStorage.getItem('refresh_time_interval');

        refreshMin=parseInt(((currentTime -refreshTime)/(1000*60*60))%24*60);
        // console.log(refreshMin);
    }
    // de "refresh later update" call werkt helemaal niet, tekent geen rooster
    //if( window.localStorage.getItem('startApp')=='True' && refreshMin >=15){
    //    console.log('Refresh later update');
    //    Zermelo.AjaxManager.getAppointment(Ext.getCmp('schedule'), me, true, startTime, endTime, true, '', false);
    //} else {
        Zermelo.AjaxManager.getAppointment(Ext.getCmp('schedule'), me, false, startTime, endTime, false, '', false);
    //}

    Zermelo.AjaxManager.getAnnouncementData(Ext.getCmp('messageList'));
}

var weeknumbers = [];
// This page managess the fucntionality and designing of calender.
Ext.define('Zermelo.view.FullCalendar', {
    extend: 'Ext.Container',
    requires: ['Ext.SegmentedButton', 'Ext.util.DelayedTask','Ext.LoadMask'],
    id: 'fullCalendarView',
    xtype: 'fullcalendarpanel',
    config: {
        placeholderid: Ext.id() + '-fullcalendar',
        defaultview: 'agendaWeek',
        scrollable: 'vertical'
    },
    initialize: function () {
        // get screen width
        screenWidth = Ext.getBody().getSize().width;
        // set days button width
        width = (screenWidth - 49) / 5.2;
        full_calendar_obj=this;
        var me = this;
        me.callParent(arguments);
        me.on('activate', function(){
        	doRefresh(me);
        }, me, {
            single: true
        });
        // me.on('painted', function(){
        //    console.log('FullCalendar activate');
        // 	doRefresh(me);
        // }, me, {
        //    single: true
        // });
        // create topbar contaier with vertical box and top
        me.topBar = Ext.create('Ext.Container', {
            xtype: 'container',
            docked: 'top',
            layout: 'vbox'
        });
        // days button container with hbox
        me.day = Ext.create('Ext.Container', {
            xtype: 'container',
            // css class resources/css/app.css
            cls: 'zermelo-schedule-days',
            style: {
                'display': '-webkit-box !important'
            },

            layout: 'hbox',
            //initial hidden

            // buttons which show weekdays of the week.
            items: [{
                //balnk label
                xtype: 'label',
                width: '50px'
            }, {
                // Monday button 
                xtype: 'button',
                id: 'day1',
                width: width + 1,
                // css class resources/css/app.css
                // cls: 'fc-day-button',
                // button type plain
                ui: 'plain',
                handler: function () {
                    var date = dayData[0].split("T")[0].split("-");
                    var selectedDate = new Date(date[0], date[1] - 1, date[2]);
                    openDayView(selectedDate, me);
                }
            }, {
                // Tuesday button    
                xtype: 'button',
                id: 'day2',
                width: width + 1,
                // css class resources/css/app.css
                // cls: 'fc-day-button',
                // button type plain
                ui: 'plain',
                handler: function () {
                    var date = dayData[1].split("T")[0].split("-");
                    var selectedDate = new Date(date[0], date[1] - 1, date[2]);
                    //console.log(selectedDate);
                    openDayView(selectedDate, me);
                }
            }, {
                //Wednesday button
                xtype: 'button',
                id: 'day3',
                width: width + 1,
                // css class resources/css/app.css
                //cls: 'fc-day-button',
                // button type plain
                ui: 'plain',
                handler: function () {
                    var date = dayData[2].split("T")[0].split("-");
                    var selectedDate = new Date(date[0], date[1] - 1, date[2]);
                    openDayView(selectedDate, me);
                }
            }, {
                //Thursday button
                xtype: 'button',
                id: 'day4',
                width: width + 1,
                // css class resources/css/app.css
                //cls: 'fc-day-button',
                // button type plain
                ui: 'plain',
                handler: function () {
                    var date = dayData[3].split("T")[0].split("-");
                    var selectedDate = new Date(date[0], date[1] - 1, date[2]);
                    openDayView(selectedDate, me);
                }
            }, {
                //Friday button
                xtype: 'button',
                id: 'day5',
                width: width - 2,
                // css class resources/css/app.css
                // cls: 'fc-day-button',
                // button type plain
                ui: 'plain',
                handler: function () {
                    var date = dayData[4].split("T")[0].split("-");
                    var selectedDate = new Date(date[0], date[1] - 1, date[2]);
                    openDayView(selectedDate, me);
                }
            }]
        }); // end day container

        // line create below days container
        me.line = Ext.create('Ext.Container', {
            html: '<hr>'
        });

        //create toolbar with current week or current day title, prev, next and schedule button 
        me.topToolBar = Ext.create('Ext.Toolbar', {
            xtype: 'toolbar',
            cls: 'zermelo-toolbar-week-day',
            items: [{
                //schedule button only day view visible its visible
                xtype: 'button',
                id: 'schedule_btn',
                //css class resouces/css/app.css
                icon: null, // for Sencha Touch Open Source support
                iconCls: 'zermelo-schedule-button-' + imageType,
                //left side
                docked: 'left',
                ui: 'plain',
                handler: function () {
                    picker_open = true;
                    //change to week view
                    if (dayview == "dayview") {
                        datePicker = Ext.create('Ext.picker.Date', {
                            //css class resources/images/app.css
                            cls: 'zermelo-toolbar',
                            requires: ['Ext.picker.Date'],
                            name: 'datePicker',
                            doneButton: {
                                //done button text in multiple language
                                locales: {
                                    text: 'done'
                                },
                                ui: 'noraml',
                                handler: function (btn) {

                                    if (!Ext.os.is.iOS) {
                                        //check webkitversion 
                                        if (webkitVersion < 537.36) {
                                            clickButton = true;
                                            setClickButton();
                                        }
                                    }
                                    var currentmonth = datePicker.getValue(true).getDate();
                                    // skip weekend days like sat and sun
                                    if (datePicker.getValue(true).getDay() == 0) {
                                        currentmonth = datePicker.getValue(true).getDate() + 1;
                                    } else if (datePicker.getValue(true).getDay() == 6) {
                                        currentmonth = datePicker.getValue(true).getDate() + 2;
                                    }
                                    var day = new Date(datePicker.getValue(true).getFullYear(), datePicker.getValue(true).getMonth(), currentmonth)
                                    gotoWeek_Day(day, me);
                                    picker_open = false;

                                }
                            },
                            cancelButton: {
                                locales: {
                                    text: 'cancel'
                                },
                                handler: function () {
                                    picker_open = false;
                                    if (!Ext.os.is.iOS) {
                                        if (webkitVersion < 537.36) {
                                            clickButton = true;
                                            setClickButton();
                                        }
                                    }
                                }
                            },
                            // start year from currentyear-1
                            yearFrom: new Date().getFullYear() - 1,
                            // end year to currentyear + 10
                            yearTo: new Date().getFullYear() + 10,
                            // set current date
                            value: new Date()
                        });
                        Ext.Viewport.add(datePicker);
                        datePicker.show();
                    } else {
                        // week picker 
                        picker_open = true;
                        // weeks array and 
                        var weekArray = new Array();

                        // set current date, startweek date currentyear-1,endweek date currentyear+1
                        var currentDate = new Date();
                        var startWeek = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
                        var endWeek = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

                        //get start week number, end week number and current week number
                        var startWeeks = getISOWeeks(startWeek.getFullYear());
                        var endWeeks = getISOWeeks(endWeek.getFullYear());
                        var currentWeeks = getISOWeeks(currentDate.getFullYear());

                        //get total weeks numbers
                        var totalNumberOfWeek = startWeeks - startWeek.getWeek() + 1;
                        totalNumberOfWeek = totalNumberOfWeek + currentWeeks;
                        totalNumberOfWeek = totalNumberOfWeek + endWeek.getWeek();

                        startWeek.setDate(startWeek.getDate() - startWeek.getDay() + 1);
                        //add data for week picker view 
                        for (i = 0; i < totalNumberOfWeek; i++) {
                            startWeek = new Date(startWeek.getFullYear(), startWeek.getMonth(), startWeek.getDate());
                            var dateString = ('0' + startWeek.getDate()).slice(-2) + "-" + ('0' + (startWeek.getMonth() + 1)).slice(-2) + "-" + startWeek.getFullYear();

                            var weekString = startWeek.getWeek();
                            weekArray.push({
                                text: "<div style='padding-left: 13%;padding-right: 13%;'><font style='font-weight: bold;float:left'>Week " + weekString + "</font><div style='position: relative;float: right;'>&nbsp;&nbsp;&nbsp;&nbsp;" + dateString + "</div></div>",
                                value: new Date(startWeek.getFullYear(), startWeek.getMonth(), startWeek.getDate()).toString()
                            });
                            startWeek.setDate(startWeek.getDate() + 7);
                        }
                        var currentmonth = currentDate.getDate();
                        if (currentDate.getDay() == 0) {
                            currentmonth = currentDate.getDate() + 1;
                        } else if (currentDate.getDay() == 6) {
                            currentmonth = currentDate.getDate() + 2;
                        }
                        currentDate.setDate(currentmonth);
                        currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)

                        var defaultValue = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                        //open custom week picker view
                        datePicker = Ext.create('Ext.Picker', {
                            modal: true,
                            cls: 'zermelo-toolbar',
                            value: {
                                'week': new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).toString()
                            },
                            slots: [{
                                name: 'week',
                                data: weekArray
                            }],
                            doneButton: {
                                locales: {
                                    text: 'done'
                                },
                                ui: 'noraml',
                                handler: function () {
                                    if (!Ext.os.is.iOS) {
                                        if (webkitVersion < 537.36) {
                                            clickButton = true;
                                            setClickButton();
                                        }
                                    }
                                    var week = datePicker.getValue().week;
                                    week = new Date(week);
                                    gotoWeek_Day(week, me);
                                    picker_open = false;
                                }
                            },
                            cancelButton: {
                                locales: {
                                    text: 'cancel'
                                },
                                handler: function () {
                                    picker_open = false;
                                    if (!Ext.os.is.iOS) {
                                        if (webkitVersion < 537.36) {
                                            clickButton = true;
                                            setClickButton();
                                        }
                                    }
                                }
                            }
                        });
                        Ext.Viewport.add(datePicker);
                        datePicker.show();
                    }
                }
            }, {
                xtype: "button",
                ui: 'plain',
                id: 'btn_datePicker',
                centered: true,
                labelCls: 'zermelo-button-weeK-day'
            }, {
                // prev button
                xtype: 'button',
                //css class resouces/css/app.css
                iconCls: 'zermelo-prev-button-' + imageType,
                docked: 'left',
                ui: 'plain',
                handler: function () {
                    getWeekData('right', me, dayview);
                }
            }, {
                // next button
                xtype: 'button',
                //css class resouces/css/app.css
                iconCls: 'zermelo-next-button-' + imageType,
                docked: 'right',
                ui: 'plain',
                handler: function () {
                    getWeekData('left', me, dayview);
                }
            }]
        });
        // add items in topBar button
        me.topBar.setItems([me.topToolBar, me.day, me.line]);

        //create calendar 
        me.calendarPanel = Ext.create('Ext.Container', {
            cls: 'zermelo-calendar',
            html: "<div id='" + me.getPlaceholderid() + "'></div>"
        });

        // add items in main container
        this.setItems([me.topBar, me.calendarPanel])

    }, // end initialize

    /**
     * Apply Fullcalendar widget to panel div
     */

    renderFullCalendar: function () {
        var me = this;
        var appointmentData = Ext.getStore('Appointments').getData();
        console.log(appointmentData);
        $('#' + me.getPlaceholderid()).fullCalendar({
            hideHeaders: true, //new property to hide full calendar header
            editable: false,
            events: eventArray, // set Appointents
            eventClick: function (calEvent, jsEvent, view) {
                me.fireEvent('eventclick', calEvent, jsEvent, view, this);
            },
            columnFormat: {
                month: 'ddd', // Mon
                week: (Ext.os.is('phone')) ? 'ddd' : 'ddd', // Mon 9/7
                agendaWeek: (Ext.os.is('phone')) ? 'ddd d' : 'ddd d', // Mon 9/7
                day: 'dddd M/d', // Monday 9/7
                agendaDay: 'dddd M/d' // Monday 9/7
            },
            titleFormat: {
                agendaDay: 'ddd d MMM, yyyy',
                agendaWeek: "{'W'}W {'&#8211;'} d-M { 'to' d-M, yyyy}"
            }
        });
        // me.setDefaultview('week');
        me.changeTitle();
        // refresh height of scroller, fixes it moving back up after every scroll
        me.getScrollable().getScroller().refreshMaxPosition();
        me.getScrollable().getScroller().refresh();
        // also scroll it so it redraws!
        me.getScrollable().getScroller().scrollTo(0, scrollTopHeight - (scrollTopHeight * 10 / 100));
   },
    renderCalendar: function () {
        var me = this;
      //  console.log("rerd");
        $('#' + me.getPlaceholderid()).fullCalendar('render');
    },
    destroyCalendar: function () {
        var me = this;
        $('#' + me.getPlaceholderid()).fullCalendar('destroy');
    },
    changeCalendarView: function (view) {
        var me = this;
        $('#' + me.getPlaceholderid()).fullCalendar('changeView', view);
        // to fix issue regarding the scroll area of week and day not taking full height. 
        if (view == "month") {
            $(".fc-view-month").removeAttr("style");
            $(".fc-view-agendaWeek").css({
                "position": 'relative'
            });
            $(".fc-view-agendaDay").css({
                "position": 'relative'
            });
            me.setDefaultview('month');
        } else if (view == "agendaWeek") {
            $(".fc-view-agendaWeek").removeAttr("style");
            $(".fc-view-agendaDay").css({
                "position": 'relative'
            });
            $(".fc-view-month").css({
                "position": 'relative'
            });
            me.setDefaultview('week');
        } else if (view == "agendaDay") {
            $(".fc-view-agendaDay").removeAttr("style");
            $(".fc-view-agendaWeek").css({
                "position": 'relative'
            });
            $(".fc-view-month").css({
                "position": 'relative'
            });
            me.setDefaultview('day');
        }
        me.changeTitle();
    },
    changeTitle: function () {
        var me = this;
        Ext.getCmp("btn_datePicker").setText($('#' + me.getPlaceholderid()).fullCalendar('getView').title);
    },

    viewToday: function () {
        $('#' + this.getPlaceholderid()).fullCalendar('today');
        this.changeTitle();
    },
    // navigate calendar next prev
    navigateCalendar: function (direction) {
        var me = this;
        if (direction == "left") {
            $('#' + me.getPlaceholderid()).fullCalendar('next');

        } else if (direction == "right") {
            $('#' + me.getPlaceholderid()).fullCalendar('prev');
        }
        me.changeTitle();
    }
});

//Below function opens dayview with selected date
function openDayView(selectedDate, me) {
    if (!Ext.os.is.iOS) {
        if (webkitVersion < 537.36) {
            clickButton = true;
            var timer = $.timer(function () {
                clickButton = false;
                timer.stop();
            });
            if (version == 2)
                timer.set({
                    time: 6000,
                    autostart: true
                });
            else
                timer.set({
                    time: 4000,
                    autostart: true
                });
        }
    }
    week_day_view = "agendaDay";
    me.changeCalendarView('agendaDay');
    $('#' + me.getPlaceholderid()).fullCalendar('gotoDate', selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    me.day.hide();
    Ext.getCmp('toolbar_main').setHidden(true);
    Ext.getCmp('toolbar_day_back').setHidden(false);
    currentDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    dayview = "dayview";
}
// update redline every 5 mins only current day is open
function updateView(me) {
    var timer = $.timer(function () {
        if (!appointment_detail_open) {
            if ((todayFlag && Ext.getCmp('home').list.getSelection()[0].raw.index == "0")) {
                me.destroyCalendar();
                me.renderFullCalendar();
                if (dayview == "dayview")
                    me.changeCalendarView('agendaDay');
            }
        }
    });
    timer.set({
        time: 60000,
        autostart: true
    });
}

function setClickButton() {
    var timer = $.timer(function () {
        clickButton = false;
        timer.stop();
    });
    timer.set({
        time: 1000,
        autostart: true
    });
}

// Returns the ISO week of the date.
Date.prototype.getWeek = function() {
    return Ext.Date.getWeekOfYear(this);
}

// get no weeks of year
function getISOWeeks(y) {
    var d,
        isLeap;

    d = new Date(y, 0, 1);
    isLeap = new Date(y, 1, 29).getMonth() === 1;

    //check for a Jan 1 that's a Thursday or a leap year that has a 
    //Wednesday jan 1. Otherwise it's 52
    return d.getDay() === 4 || isLeap && d.getDay() === 3 ? 53 : 52;
}

// 

function getWeekData(nextprev, me, dayview) {
    // set current day for get data on swipe
    if (dayview != "dayview") {
        currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
        currentDay.setDate(currentDay.getDate() - currentDay.getDay() + 1);
        if (nextprev == "left")
            currentDay.setDate(currentDay.getDate() - currentDay.getDay() + 8);
        else
            currentDay.setDate(currentDay.getDate() - currentDay.getDay() - 1);
    } else {
        currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());

        if (nextprev == "left") {
            if (currentDay.getDay() == 0) {
                currentDay.setDate(currentDay.getDate() + 1)
            } else if (currentDay.getDay() == 5) {
                currentDay.setDate(currentDay.getDate() + 2);
            }
            currentDay.setDate(currentDay.getDate() + 1);
        } else {
            if (currentDay.getDay() == 1) {
                currentDay.setDate(currentDay.getDate() - 2);
            } else
                currentDay.setDate(currentDay.getDate() - 1);
        }
    }
    var weeknumber = new Date(Math.round(currentDay.getTime())).getWeek();
    weeknumber = weeknumber + "" + new Date(Math.round(currentDay.getTime())).getFullYear();

    var flag = true;
  //  console.log(weeknumbers);
    for (var i = 0; i < weeknumbers.length; i++) {
        if (weeknumbers[i].week == weeknumber) {
            flag = false;
            break;
        }
    }
    // if already get data from server ,next time does not go on server for getting data
    if (flag || true) {
        var appointmentStore = Ext.getStore('Appointments');
        appointmentStore.filter(function(record) {return record.get('start') * 1000 > Date.now();});
        var count = appointmentStore.getCount();
        console.log(count);
        appointmentStore.clearFilter();
        // var query = 'SELECT count(*) as count FROM APPOINTMENTS WHERE weeknumber=? & refreshFlag=?';
        // console.log(query, weeknumber);
        if (count == 0) {
            var starttime = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
            var startTime = Math.round(starttime.getTime() / 1000);
            if (nextprev == "left") {
                var endTime = Math.round(starttime.setDate(starttime.getDate() + 12) / 1000);
                Zermelo.AjaxManager.getAppointment(Ext.getCmp('schedule'), me, true, startTime, endTime, false, nextprev, false);
            } else {
                var endTime = Math.round(starttime.setDate(starttime.getDate() - 12) / 1000);
                Zermelo.AjaxManager.getAppointment(Ext.getCmp('schedule'), me, true, endTime, startTime, false, nextprev, false);
            }

        } else {
            me.navigateCalendar(nextprev);
        }
        if (dayview == 'dayview' && nextprev == 'right') {
            if (currentDay.getDay() == 6) 
                currentDay.setDate(currentDay.getDate() - 1);
        }
    }
    else {
        me.navigateCalendar(nextprev);
        if (dayview == 'dayview' && nextprev == 'right')
            if (currentDay.getDay() == 6) {
                currentDay.setDate(currentDay.getDate() - 1);
            }
    }

}

function gotoWeek_Day(week, me) {
    currentDay = new Date(week.getFullYear(), week.getMonth(), week.getDate());
    var currentweekdate = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
    currentweekdate.setDate(currentweekdate.getDate() - currentweekdate.getDay() + 1);
    var startTime = Math.round(currentweekdate.getTime() / 1000);
    var endTime = Math.round(currentweekdate.setDate(currentweekdate.getDate() + 12) / 1000);
    var weeknumber = new Date(Math.round(currentDay.getTime())).getWeek();
    weeknumber = weeknumber + "" + new Date(Math.round(currentDay.getTime())).getFullYear();
    var flag = true;
    for (var i = 0; i < weeknumbers.length; i++) {
        if (weeknumbers[i].week == weeknumber) {
            flag = false;
            break;
        }
    }
    if (flag)
        Zermelo.AjaxManager.getAppointment(Ext.getCmp('schedule'), Ext.getCmp('fullCalendarView'), true, startTime, endTime, false, '', true, week);
    else {
        $('#' + me.getPlaceholderid()).fullCalendar('gotoDate', week.getFullYear(), week.getMonth(), week.getDate());
        me.changeTitle();
    }
}
function getAppointments(me, currentobj, refresh, startTime, endTime, weekarrayemptyflag, nextprev, datepickerGo, week)
{
    console.log(currentObj);
    var appointmentStore = Ext.getStore('Appointments');
    if (refresh || true) {
        //calendar view only current day calendar view refresh
        if (todayFlag && !datepickerGo && nextPrev == '') {
            currentobj.destroyCalendar();
            currentobj.renderFullCalendar();
            if (dayview == "dayview")
                currentobj.changeCalendarView('agendaDay');
            currentobj.getScrollable().getScroller().scrollTo(0, scrollTopHeight - (scrollTopHeight * 10 / 100));
        } else if (nextprev != '') {
            currentobj.navigateCalendar(nextprev);

        } else if (datepickerGo) {
            $('#' + currentobj.getPlaceholderid()).fullCalendar('gotoDate', week.getFullYear(), week.getMonth(), week.getDate());
            currentobj.changeTitle();
        } else {
            currentobj.renderCalendar();
        }
        updateView(currentobj);
    }
    // only first time render after getting  data from server
    else {
        currentobj.renderFullCalendar();
        updateView(currentobj);
    }
}
