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

Ext.define('Zermelo.store.AnnouncementStore', {
    id: 'AnnouncementStore',
    extend: 'Ext.data.Store',
    requires: ['Ext.data.proxy.LocalStorage'],
    config: {
        model: 'Zermelo.model.Announcement',
        //sorting field name
        sorters: 'start',
        grouper: {
            sortProperty: 'start',
            groupFn: function (record) {
                // set group header
                var d = new Date(record.get('start') * 1000);
                var endDate = new Date(record.get('end') * 1000).setSeconds(-1);
                if (Ext.Date.format(d, 'F j, Y') == Ext.Date.format(new Date(endDate), 'F j, Y'))
                    return Ext.Date.format(d, 'F j, Y');
                else
                    return Ext.Date.format(d, 'F j, Y') + '-' + Ext.Date.format(new Date(endDate), 'F j, Y');
            }
        },
        proxy: {
            type: 'localstorage',
            id: 'announcementstore'
        },
        root: 'user',
        autoLoad: true
    }
});
