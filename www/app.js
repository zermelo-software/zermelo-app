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

/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
 */
// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides
//<debug>
Ext.Loader.setPath({
	'Ext' : 'touch/src',
	'Ux' : 'Ux'
});
Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false
});
//</debug>

// workaround for release mode
if (typeof Ext.Logger === 'undefined') {
	Ext.Logger = {
            log: function(message, priority) {
            },
            verbose: function(message) {
            },
            info: function(message) {
            },
            warn: function(message) {
            },
            error: function(message) {
            },
            deprecate: function(message) {
            }
        };
}

//Global variable
var loc = '';
var scrollTopHeight = 0;
var startFlag = false;
var currentView;
var dayData = [];
var dayview = "";
var week_day_view = "";
var picker_open = false;
var datePicker;
var todayFlag = false;
var appointment_detail_open = false;
var clickButton = false;
var picker_close = false;
var refreshDate;
var messageShow = false;
var userChange = false;
var full_calendar_obj;
Ext
		.application({
			name : 'Zermelo',

			//overriede component for multiple langauge
			requires : [ 'Ux.locale.Manager',
					'Ux.locale.override.st.Component',
					'Ux.locale.override.st.Button',
					'Ux.locale.override.st.Container',
					'Ux.locale.override.st.TitleBar',
					'Ux.locale.override.st.ToolBar',
					'Ux.locale.override.st.Title',
					'Ux.locale.override.st.Label',
					'Ux.locale.override.st.field.Field',
					'Ux.locale.override.st.field.DatePicker',
					'Ux.locale.override.st.form.FieldSet',
					'Ux.locale.override.st.picker.Picker',
					'Ux.locale.override.st.picker.Date',
					'Ux.locale.override.st.Msgbox',
					'Ux.locale.override.st.LoadMask',
					'Zermelo.UserManager',
					'Zermelo.ErrorManager',
					'Zermelo.AjaxManager'
					],

			// views load
			views : [ 'SlideView', 'Login', 'Main', 'Home', 'MessageList',
					'MessageDetails', 'Schedule', 'FullCalendar',
					'AppointmentDetails', 'CalendarList'
			],

			models : ['Appointment', 'Announcement'],

			// controller load
			controllers : ['MainController'],

			// store load
			stores : [ 'AnnouncementStore', 'AppointmentStore'],

			isIconPrecomposed : true,

			// Launch application

			launch : function() {
				// Ext.create('Zermelo.store.AppointmentStore');
				// Ext.create('Zermelo.store.AnnouncementStore');
				Ext.Msg.defaultAllowedConfig.showAnimation = false;
				// display magnified glass press on textbox
				Ext.event.publisher.TouchGesture.prototype.isNotPreventable = /^(select|a|input|textarea)$/i;
				
				// check device's default language

				if (Ext.os.is('Android') && version == 2) { // only for android 2.3 os

					if (navigator
							&& navigator.userAgent
							&& (loc = navigator.userAgent
									.match(/android.*\W(\w\w)-(\w\w)\W/i))) {
						loc = loc[1];
					}
					if (!loc && navigator) {
						if (navigator.language) {
							loc = navigator.language;
						} else if (navigator.browserLanguage) {
							loc = navigator.browserLanguage;
						} else if (navigator.systemLanguage) {
							loc = navigator.systemLanguage;
						} else if (navigator.userLanguage) {
							loc = navigator.userLanguage;
						}
						loc = loc.substr(0, 2);
					}
					if (loc == 'en' || loc == 'nl') {
						loc = loc;
					} else {
						loc = 'en';
					}

				} else {
					if (navigator.language.split('-')[0] == 'en'
							|| navigator.language.split('-')[0] == 'nl') {
						loc = navigator.language.split('-')[0];
					} else {
						//default set english
						loc = 'en';
					}
				}
				// set locale file
				Ux.locale.Manager.setConfig({
					ajaxConfig : {
						method : 'GET'
					},
					language : loc,
					tpl : 'locales/{locale}.json',
					type : 'ajax'
				});
				Ux.locale.Manager.init();
				//set datepicker months in Dutch
				if (loc == 'nl') {
					Ext.Date.monthNames = [ "Januari", "Februari", "Maart",
							"April", "Mei", "Juni", "Juli", "Augustus",
							"September", "Oktober", "November", "December" ];
				}
				// Add resume event listener
				document.addEventListener("resume", Ext.bind(onResume, this),
						false);
				// Method call on resume app
				function onResume() {
					//console.log("resume");
					if (window.localStorage.getItem('refreshTime') != null
							&& window.localStorage.getItem('refreshTime') != '') {
						var date = new Date();
						var currentTime = date.getTime();
						var refreshTime = window.localStorage
								.getItem('refreshTime');

						/*console.log(new Date(currentTime) + "  "
								+ new Date(parseInt(refreshTime)));*/
						var mintue = parseInt(((currentTime - refreshTime) / (1000 * 60 * 60)) % 24);
						if (mintue > 0) {

							Ext.getCmp('button_week_refresh').setIconCls(
									'zermelo-exclamation-button-' + imageType);
							Ext.getCmp('button_day_refresh').setIconCls(
									'zermelo-exclamation-button-' + imageType);
						} else {
							Ext.getCmp('button_week_refresh').setIconCls(
									'zermelo-refresh-button-' + imageType);
							Ext.getCmp('button_day_refresh').setIconCls(
									'zermelo-refresh-button-' + imageType);
						}
					} else {
						Ext.getCmp('button_week_refresh').setIconCls(
								'zermelo-refresh-button-' + imageType);
						Ext.getCmp('button_day_refresh').setIconCls(
								'zermelo-refresh-button-' + imageType);
					}
					if (window.localStorage.getItem('refresh_time_interval') != null
							|| window.localStorage
									.getItem('refresh_time_interval') != '') {
						var date = new Date();
						var currentTime = date.getTime();
						var refreshTime = window.localStorage
								.getItem('refresh_time_interval');

						refreshMin = parseInt(((currentTime - refreshTime) / (1000 * 60 * 60)) % 24 * 60);
						//console.log(refreshMin);
					}
					//on resume every 15 mintues call refresh function.
					if (window.localStorage.getItem('startApp') == 'True'
							&& refreshMin >= 15) {
						refresh();
					}
				}
				// Back button handle for android
				if (Ext.os.is('Android')) {
					document.addEventListener("backbutton", Ext.bind(
							onBackKeyDown, this), false);

					function onBackKeyDown(eve) {
						if (currentView == "messageDetail") {
							Ext.getCmp('messageDetails').hide();
							Ext.getCmp('home').list
									.removeCls('zermelo-menu-list');
							Ext.getCmp('home').show();
							currentView = "";
						} else if (currentView == "appointmentDetail") {
							appointment_detail_open = false;
							Ext.getCmp('appointmentDetails_view').hide();
							Ext.getCmp('home').list
									.removeCls('zermelo-menu-list');
							Ext.getCmp('home').show();
							currentView = "";
						} else if (Ext.getCmp('home').list.getSelection()[0].raw.index == "1") {
							var me = Ext.getCmp('home');
							me.list.select(0);
						} else if (Ext.getCmp('home').list.getSelection()[0].raw.index == "0") {
							// check date picker open or not
							if (picker_open) {
								datePicker.hide();
								picker_open = false;
							} else if (dayview == "dayview") {
								week_day_view = "agendaWeek";
								Ext.getCmp('fullCalendarView')
										.changeCalendarView('agendaWeek');
								Ext.getCmp('fullCalendarView').day.show();
								dayview = "";
								Ext.getCmp('toolbar_main').setHidden(false);
								Ext.getCmp('toolbar_day_back').setHidden(true);
							} else {
								 navigator.Backbutton.goHome(function() {
								   // console.log('success')
								 }, function() {
								   // console.log('fail')
								 });
								//window.MyCls.onPause();
							}

						} else {
							 navigator.Backbutton.goHome(function() {
							   // console.log('success')
							 }, function() {
							   // console.log('fail')
							 });
							//window.MyCls.onPause();
						}
					}
				}
				// Destroy the #appLoadingIndicator element
				Ext.fly('appLoadingIndicator').destroy();
				// Initialize the main view
				Ext.Viewport.add(Ext.create('Zermelo.view.Main'));
			},

			onUpdated : function() {
				Ext.Msg
						.confirm(
								"Application Update",
								"This application has just successfully been updated to the latest version. Reload now?",
								function(buttonId) {
									if (buttonId === 'yes') {
										window.location.reload();
									}
								});
			}
		});
