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

Ext.define('Zermelo.view.FullCalendar', {
    extend: 'Ext.Container',
    requires: ['Ext.SegmentedButton', 'Ext.util.DelayedTask','Ext.LoadMask'],
    id: 'fullCalendarView',
    xtype: 'fullcalendarpanel',
    config: {
        placeholderid: Ext.id() + '-fullcalendar',
        defaultview: 'agendaWeek',
        scrollable: 'vertical',
        store: 'Appointments',
        listeners: {
            show: {
                fn: function() {
                    this.updateView();
                },
                options: {
                    order: 'before'
                }
            }
        }
    },
    initialize: function () {
        // get screen width
        var screenWidth = window.innerWidth;
        // set days button width
        var width = (screenWidth - 49) / 5.2;
        var me = this;
        me.callParent(arguments);
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

            selectDay: function(dayNumber) {
                var appointmentStore = this.parent.parent.getStore();
                appointmentStore.setWindowDay();
                appointmentStore.setWindow(dayNumber - (new Date()).getDay());

                this.up('home').selectItem('calendarList');
            },

            items: [{
                //balnk label
                xtype: 'label',
                width: '50px'
            }, {
                // Monday button 
                xtype: 'button',
                id: 'day1',
                width: width + 1,
                ui: 'plain',
                handler: function () {
                    this.parent.selectDay(1);
                }
            }, {
                // Tuesday button    
                xtype: 'button',
                id: 'day2',
                width: width + 1,
                ui: 'plain',
                handler: function () {
                    this.parent.selectDay(2);
                }
            }, {
                //Wednesday button
                xtype: 'button',
                id: 'day3',
                width: width + 1,
                ui: 'plain',
                handler: function () {
                    this.parent.selectDay(3);
                }
            }, {
                //Thursday button
                xtype: 'button',
                id: 'day4',
                width: width + 1,
                ui: 'plain',
                handler: function () {
                    this.parent.selectDay(4);
                }
            }, {
                //Friday button
                xtype: 'button',
                id: 'day5',
                width: width - 2,
                ui: 'plain',
                handler: function () {
                    this.parent.selectDay(5);
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
                            ui: 'normal',
                            handler: function () {
                                var week = datePicker.getValue().week;
                                week = new Date(week);
                                me.gotoWeek_Day(week);
                                datePicker.destroy();
                            }
                        },
                        cancelButton: {
                            locales: {
                                text: 'cancel'
                            },
                            handler: function () {
                                datePicker.destroy();
                            }
                        }
                    });
                    Ext.Viewport.add(datePicker);
                    datePicker.show();
                }
            }, {
                xtype: "button",
                ui: 'plain',
                id: 'btn_datePicker',
                centered: true,
                labelCls: 'zermelo-button-week-day'
            }, {
                // prev button
                xtype: 'button',
                //css class resouces/css/app.css
                iconCls: 'zermelo-prev-button-' + imageType,
                docked: 'left',
                ui: 'plain',
                handler: function () {
                    me.getWeekData('left');
                }
            }, {
                // next button
                xtype: 'button',
                //css class resouces/css/app.css
                iconCls: 'zermelo-next-button-' + imageType,
                docked: 'right',
                ui: 'plain',
                handler: function () {
                    me.getWeekData('right');
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
        this.setItems([me.topBar, me.calendarPanel]);
        this.store = Ext.getStore('Appointments');
        this.getStore().on('refresh', this.handleRefresh, this, {buffer: 5});
        // this.up('home').onBefore('select', this.initScroller, this);
        this.initScroller();
        this.on('painted', this.renderFullCalendar, this, {single: true, buffer: 5});
    },

    /**
     * Apply Fullcalendar widget to panel div
     */
    renderFullCalendar: function() {
        var me = this;
        $('#' + me.getPlaceholderid()).fullCalendar({
            hideHeaders: true, //new property to hide full calendar header
            editable: false,
            events: this.getStore().getAsArray(), // set Appointments source
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
        this.gotoWeek_Day();
        me.changeTitle();
    },

    prepareToShow: function() {
        this.gotoWeek_Day();
        localStorage.setItem('lastView', 'fullCalendarView');
        this.gotoWeek_Day();
        this.setUpdateViewInterval();
    },

    destroyCalendar: function () {
        var me = this;
        $('#' + me.getPlaceholderid()).fullCalendar('destroy');
    },
    changeTitle: function () {
        var me = this;
        var text = $('#' + me.getPlaceholderid()).fullCalendar('getView').title;
        Ext.getCmp("btn_datePicker").setText(text);
    },

    // navigate calendar next prev
    navigateCalendar: function (direction) {
        var me = this;
        if (direction == "right") {
            $('#' + me.getPlaceholderid()).fullCalendar('next');
        } else if (direction == "left") {
            $('#' + me.getPlaceholderid()).fullCalendar('prev');
        }
        me.changeTitle();
    },

    handleRefresh: function() {
        if(this.up('home').getActiveItemName() == 'fullCalendarView')
            this.refreshEvents();
        else
            this.on('activate', this.refreshEvents, this, {single: true, buffer: 5});
    },

    refreshEvents: function () {
        $('#' + this.getPlaceholderid()).fullCalendar('removeEvents');
        var array = this.getStore().getAsArray();
        $('#' + this.getPlaceholderid()).fullCalendar('addEventSource', array);
    },

    getDate: function() {
        return $('#' + this.getPlaceholderid()).fullCalendar('getDate');
    },

    initScroller: function() {
        // Quite magical...
        // (new Date()).getHours() is the current hour, 
        // -6 because the view starts at 6:00, 
        // *60 because this neatly brings the bottom of the view to the bottom of the table at the end of the day
        this.getScrollable().getScroller().scrollTo(0, ((new Date()).getHours() - 6) * 60);
    },

    // Calling destroyCalendar and renderFullCalendar updates the red line
    updateView: function() {
        if(Date.now() - this.lastUpdateView < 100000)
            return;
        
        this.lastUpdateView = Date.now();
        var scroller = this.getScrollable().getScroller();
        var currentY = scroller.position.y;

        this.destroyCalendar();
        this.renderFullCalendar();

        scroller.scrollTo(0, currentY);
    },

    setUpdateViewInterval: function() {
        if(!this.updateViewInterval) {
            this.updateViewInterval = setInterval(Ext.bind(this.updateView, this), 100000);

            var clearUpdateViewInterval = Ext.bind(this.clearUpdateViewInterval, this)

            Ext.getCmp('home').on('select', clearUpdateViewInterval);
            document.addEventListener('pause', clearUpdateViewInterval)
        }
    },

    clearUpdateViewInterval: function() {
        if(this.updateViewInterval)
            this.updateViewInterval = clearInterval(this.updateViewInterval);
    },

    // Changes the currently shown week or day
    getWeekData: function(nextprev) {
        // subtract days for left, add for right
        var direction = nextprev == 'left' ? -7 : 7;

        this.getStore().setWindow(direction);

        this.navigateCalendar(nextprev);
    },

    // Changes the currently shown week to @param week
    gotoWeek_Day: function(week) {
        var appointmentStore = this.getStore();
        // Don't do anything if we're already in the correct view
        if(!week && appointmentStore.inScope(this.getDate()) && appointmentStore.getView() == 'week')
            return;

        week = appointmentStore.setWindowWeek(week);
        $('#' + this.getPlaceholderid()).fullCalendar('gotoDate', week);
        this.changeTitle();
    },

    getStore: function() {
        return this.store;
    }
});

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
