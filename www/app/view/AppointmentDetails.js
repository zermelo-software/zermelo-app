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

// This class contains information related to appointment details which is set into calendar.
Ext.define('Zermelo.view.AppointmentDetails', {
    extend: 'Ext.Container',
    xtype: 'appointmentDetails',
    id: 'appointmentDetails_view',
    setAndShow: function(eventDetails, parentView) {
        this.parentView = parentView;
        this.eventDetails = eventDetails;
        Ext.Viewport.setActiveItem(this);
    },
    config: {
        eventDetails: null,
        listeners: {
            //show event of view
            show: function() {
                appointment_detail_open = true;
                thisObj = this;
                var collidingIds = this.eventDetails.collidingIds.split(',');
                appointmentStore = Ext.getStore('Appointments');

                for (i = 0; i < collidingIds.length; i++) {
                    var appointmentData = appointmentStore.findRecord('id', collidingIds[i]).getData();
                    var container = Ext.create('Ext.Container', {
                        style: {
                            'font-size': '14px'
                        },
                        // padding top left bottom right
                        padding: '20 20 10 20',

                        items: [{
                                // teacher container with horizontal box
                                xtype: 'container',
                                layout: 'hbox',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                items: [{
                                        //teacher label
                                        xtype: 'label',
                                        flex: 1,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        //multiple language
                                        locales: {
                                            html: 'appointment.teacher'
                                        }
                                    }, {
                                        // teacher value label
                                        xtype: 'label',
                                        flex: 1.5,
                                        // css class resouces/css/app.css
                                        html: appointmentData.teachers,
                                        cls: 'zermelo-announcement-label'
                                    }]
                                    //end teacher container   
                            }, {
                                // subject container with horizontal box
                                xtype: 'container',
                                layout: 'hbox',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                items: [{
                                        // subject label
                                        xtype: 'label',
                                        flex: 1,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        //multiple language
                                        locales: {
                                            html: 'appointment.subject'
                                        }
                                    }, {
                                        // subject value label
                                        xtype: 'label',
                                        flex: 1.5,
                                        html: appointmentData.subjects,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label'
                                    }]
                                    // end subject container
                            }, {
                                // room container with horizontal box
                                xtype: 'container',
                                layout: 'hbox',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                items: [{
                                        //room lebel
                                        xtype: 'label',
                                        flex: 1,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        //multiple language
                                        locales: {
                                            html: 'appointment.room'
                                        }
                                    }, {
                                        //room value lebel
                                        xtype: 'label',
                                        flex: 1.5,
                                        html: appointmentData.locations,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label'
                                    }]
                                    //end room container
                            }, {
                                // group container with horizontal box
                                xtype: 'container',
                                layout: 'hbox',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                items: [{
                                        //group label
                                        xtype: 'label',
                                        flex: 1,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        //multiple language
                                        locales: {
                                            html: 'appointment.group'
                                        }
                                    }, {
                                        // group value label
                                        xtype: 'label',
                                        flex: 1.5,
                                        html: appointmentData.groups,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label'
                                    }]
                                    //end group container
                            }, {
                                // type container with horizontal box
                                xtype: 'container',
                                layout: 'hbox',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                items: [{
                                        //type label
                                        xtype: 'label',
                                        flex: 1,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        //multiple language
                                        locales: {
                                            html: 'appointment.type'
                                        }
                                    },{
                                         xtype: 'label',
                                        flex: 1.5,
                                         // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        locales: {
                                             html: 'type.' + appointmentData.type
                                        }
                                    }]
                                    //end type container
                            }, {
                                // Starttime container with horizontal box
                                xtype: 'container',
                                layout: 'hbox',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                items: [{
                                        //starttime label
                                        xtype: 'label',
                                        flex: 1,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        //multiple language
                                        locales: {
                                            html: 'appointment.startTime'
                                        }
                                    }, {
                                        //starttime value label
                                        xtype: 'label',
                                        flex: 1.5,
                                        // css class resouces/css/app.css
                                        html: Ext.Date.format(new Date(appointmentData.start), 'd M. Y H:i'),
                                        cls: 'zermelo-announcement-label'
                                    }]
                                    //end starttime container
                            }, {
                                // end time container with horizontal box
                                xtype: 'container',
                                layout: 'hbox',
                                style: {
                                    'margin-bottom': '20px'
                                },
                                items: [{
                                        // endtime label
                                        xtype: 'label',
                                        flex: 1,
                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label',
                                        //multiple language
                                        locales: {
                                            html: 'appointment.endTime'
                                        }
                                    }, {
                                        //endtime value label
                                        xtype: 'label',
                                        flex: 1.5,
                                        html: Ext.Date.format(new Date(appointmentData.end), 'd M. Y H:i'),

                                        // css class resouces/css/app.css
                                        cls: 'zermelo-announcement-label'
                                    }]
                                    //end endtime container
                            }, {
                                // remark label
                                xtype: 'label',
                                // id: 'appointmentDetails_remarks_lbl',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                //multiple language
                                locales: {
                                    html: 'appointment.remark'
                                },
                                hidden: appointmentData.remark.length == 0
                            }, {
                                //remark value label
                                xtype: 'label',
                                style: {
                                    'margin-bottom': '20px'
                                },
                                html: appointmentData.remark,
                                hidden: appointmentData.remark.length == 0
                            }, {
                                //description label
                                xtype: 'label',
                                style: {
                                    'margin-bottom': '10px'
                                },
                                //multiple language
                                locales: {
                                    html: 'appointment.changeDescription'
                                },
                                hidden: appointmentData.changeDescription.length == 0
                            }, {
                                //description value label
                                xtype: 'label',
                                style: {
                                    'margin-bottom': '20px'
                                },
                                html: appointmentData.changeDescription,
                                hidden: appointmentData.changeDescription.length == 0
                            },
                            {
                                xtype:'container',
                                html:'<hr></hr>'
                            }
                            ] //end body container


                    });
                     
                    
                    Ext.getCmp('details').add(container);
                }
                
                Ext.getCmp('details').getScrollable().getScroller().scrollTo(0, 0);
            }, //end show
            hide: function() {
                   Ext.getCmp('details').removeAll();
                } //end hide
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'titlebar',
            docked: 'top',
            cls: 'zermelo-toolbar-main',
            height: '47px',
            locales: {
                title: 'appointment.title'
            },
            items: [{
                    xtype: 'button',
                    id: 'appointmentDetails_back',
                    // css class resouces/css/app.css
                    icon: '/www/resources/images/back_arrow.' + imageType,
                    iconCls: 'zermelo-back-button-' + imageType,
                    align: 'left',
                    ui: 'plain',
                    style: {
                        'padding-left': '0px'
                    },
                    locales: {
                        text: 'back.back'
                    },
                    handler: function() {
                        Ext.Viewport.setActiveItem(this.parent.parent.parent.parentView);
                    }
                }]
        }, {
            xtype: 'container',
            id: 'details',
            scrollable: true,
            height: '100%',
            scrollable: {
                direction: 'vertical',
                directionLock: false
            }
        }]
    }
});
