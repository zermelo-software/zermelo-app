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

// IE is streets behind so we need to polyfill all these methods
(function() {
	if (!Array.prototype.find) {
		Object.defineProperty(Array.prototype, 'find', {
			value: function(predicate) {
			 'use strict';
			 if (this == null) {
				 throw new TypeError('Array.prototype.find called on null or undefined');
			 }
			 if (typeof predicate !== 'function') {
				 throw new TypeError('predicate must be a function');
			 }
			 var list = Object(this);
			 var length = list.length >>> 0;
			 var thisArg = arguments[1];
			 var value;

			 for (var i = 0; i < length; i++) {
				 value = list[i];
				 if (predicate.call(thisArg, value, i, list)) {
					 return value;
				 }
			 }
			 return undefined;
			}
		});
	}

	if (!String.prototype.startsWith) {
		String.prototype.startsWith = function(searchString, position){
			position = position || 0;
			if(!searchString)
				return true;
			return this.substr(position, searchString.length) === searchString;
		};
	}

	if (!String.prototype.includes) {
		String.prototype.includes = function(search, start) {
			'use strict';
			if (typeof start !== 'number') {
				start = 0;
			}
			
			if (start + search.length > this.length) {
				return false;
			} else {
				return this.indexOf(search, start) !== -1;
			}
		};
	}
})();

Ext.application({
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
        Zermelo.UserManager.readLocalForage();
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
		// Pass setTitles into init to run setTitles as soon as locale.Manager in initialized
		Ux.locale.Manager.init(Ext.bind(Zermelo.UserManager.setTitles, Zermelo.UserManager));
		//set datepicker months in Dutch
		if (loc == 'nl') {
			Ext.Date.monthNames = [ "Januari", "Februari", "Maart",
					"April", "Mei", "Juni", "Juli", "Augustus",
					"September", "Oktober", "November", "December" ];
			Ext.Date.dayNames = ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"];
		}
		
		// Destroy the #appLoadingIndicator element
		Ext.fly('appLoadingIndicator').destroy();
		// Initialize the main view
		// setTimeout(function() {
            var mainView = Ext.create('Zermelo.view.Main');
            Ext.Viewport.add(mainView);
            if (!navigator.userAgent.toLowerCase().includes('windows')) {
                console.log('this ain\'t windows', navigator.userAgent);
                setTimeout(navigator.splashscreen.hide, 100);
            }
        // }, 100);
	}
});
