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
var imageType = 'svg';
var version = 3;

Ext.application({
	name : 'Zermelo',

	//overriede component for multiple langauge
	requires : [
			'Ux.locale.Manager',
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
			'AppointmentDetails', 'CalendarList', 'UserSearch'
	],

	models : ['Appointment', 'Announcement'],

	// controller load
	controllers : ['MainController'],

	// store load
	stores : [ 'AnnouncementStore', 'AppointmentStore'],

	isIconPrecomposed : true,

	// Launch application

	launch : function() {
		// This should've been the name to begin with... grumble grumble
		localForage = localforage;
		Ext.Msg.defaultAllowedConfig.showAnimation = false;
		// display magnified glass press on textbox
		Ext.event.publisher.TouchGesture.prototype.isNotPreventable = /^(select|a|input|textarea)$/i;

		// check device's default language

		if (navigator.language.split('-')[0] == 'en'
				|| navigator.language.split('-')[0] == 'nl') {
			loc = navigator.language.split('-')[0];
		} else {
			//default set english
			loc = 'en';
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
		// Pass setTitles into init to run setTitles as soon as locale.Manager in initialized
		Ux.locale.Manager.init(Ext.bind(Zermelo.UserManager.setTitles, Zermelo.UserManager));
		//set datepicker months in Dutch
		if (loc == 'nl') {
			Ext.Date.monthNames = [ "Januari", "Februari", "Maart",
					"April", "Mei", "Juni", "Juli", "Augustus",
					"September", "Oktober", "November", "December" ];
			Ext.Date.dayNames = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
		}
	}
});
