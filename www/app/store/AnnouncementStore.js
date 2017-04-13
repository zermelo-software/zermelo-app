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
    extend: 'Zermelo.store.ZStore',
    requires: ['Zermelo.model.Announcement'],
    config: {
        model: 'Zermelo.model.Announcement',
        storeId: 'Announcements'
    },

    initialize: function () {
        this.onAfter('addrecords', this.saveToLocalForage, this, {buffer: 500});
        this.onAfter('removerecords', this.saveToLocalForage, this, {buffer: 500});
        this.onAfter('updaterecord', this.saveToLocalForage, this, {buffer: 500});
    },

    mySort: function() {
        this.sort({
            sorterFn: function(a, b) {
                if (a.get('read') != b.get('read'))
                    return a.get('read') ? 1 : -1;
                if (a.get('start') != b.get('start'))
                    return a.get('start') < b.get('start') ? -1 : 1;
                if (a.get('end') != b.get('end'))
                    return a.get('end') < b.get('end') ? -1 : 1;
            }
        });
    },

    fetch: function() {
        Zermelo.AjaxManager.getAnnouncementData();
    },

    resetFilters: function() {
        this.clearFilter();
        this.filterBy(function(record) {
            return record.valid();
        });
    }
});
