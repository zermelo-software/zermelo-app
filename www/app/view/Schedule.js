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

// This page handles the scheduling of calendar.
var appointmentdetailView;
Ext.define("Zermelo.view.Schedule", {
    extend: 'Ext.Container',
    xtype: 'schedule',
    id: 'schedule',
    config: {
        listeners: {
            show: function() {
                appointmentdetailView = Ext.create('Zermelo.view.AppointmentDetails');
                changeRefreshIcon();
                messageShow = false;
                Zermelo.UserManager.setTitles();
            },
        },
        items: [{
            xtype: 'fullcalendarpanel',
            height: '100%',
            listeners: {
                eventclick: function(calEvent, jsEvent, view, fc) {
                    // get selected event data
                    // console.log("click");
                    //  console.log(clickButton);
                    if (clickButton) {
                        clickButton = false;
                    } else {
                        eventDetails = calEvent;
                        // create home view object

                        var home = Ext.getCmp('home');
                        // add appointment detail viewport
                        Ext.Viewport.add(appointmentdetailView);
                        //hide home view 
                        home.hide();
                        // show appointment detail
                        appointmentdetailView.show();
                        currentView = "appointmentDetail";
                    }
                },
            }
        }]
    }
});

function changeRefreshIcon() {
    
    Ext.getCmp('button_week_refresh').setIconCls('zermelo-refresh-button-' + imageType);
    Ext.getCmp('button_day_refresh').setIconCls('zermelo-refresh-button-' + imageType);
}
