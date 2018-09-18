/* 
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

Ext.define("Zermelo.view.MessageList", {
    extend: 'Ext.dataview.List',
    xtype: 'messageList',
    id: 'messageList',
    config: {
        listeners: {
            painted: function() {
                if(this.getStore().getCount() == 0) {
                    Zermelo.ErrorManager.showErrorBox('announcement.no_announcement_msg');
				}
            }
        },
        layout: 'fit',
        style: {
            'background': '#F0F0F0',
			'padding-bottom': '50px'
        },
        margin: '10 10 10 10',
        cls: 'zermelo-message-list',
        itemCls: 'zermelo-message-list-item',
        selectedCls: 'zermelo-menu-list-item-select',
        grouped: false,
        store: 'Announcements',
        itemTpl: new Ext.XTemplate("<tpl if='!read'>{title} <img src='resources/images/new.svg' class='zermelo-message-list-read-unread-icon'> <tpl else>{title} </tpl>")
    }
});
