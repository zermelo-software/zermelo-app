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
		'Ext.Title',
        'Zermelo.view.CalendarList'
    ],
    config: {
        slideSelector: 'x-toolbar',
        containerSlideDelay: 10,
        selectSlideDuration: 100,
        itemMask: true,
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
        listPosition: 'left',
        items: [{
            slideButton: true,
            urlLogo: 'resources/images/myschedule.' + imageType,
            items: [
                {
                    xtype: 'schedule'
                }
            ]
        },
        {
            slideButton: true,
            urlLogo: 'resources/images/list.' + imageType,
            title: 'CalendarList',

            items: [
                {
                    xtype: 'CalendarList'
                }
            ]
        }, 
        {
            slideButton: true,
            urlLogo: 'resources/images/messages.' + imageType,
            title: 'Messages',
            itemId: 'messageList',
            items: [
                {
                    xtype: 'messageList'
                }
            ]
        },
        {
            urlLogo: 'resources/images/user_switch.' + imageType,
            title: 'Switch user',
            itemId: 'userChange',
            items: [
                {
                    xtype: 'UserSearch'
                }
            ]
        },
        {
            urlLogo: 'resources/images/logout.' + imageType,
            title: 'logout'
        }
        ]
    }
});
