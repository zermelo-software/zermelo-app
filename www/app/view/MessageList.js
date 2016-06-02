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

var mystore;

// This page shows  the listing of announcements which comes from webservice.

Ext.define("Zermelo.view.MessageList", {
    extend: 'Ext.Container',
    requires: ['Ext.data.proxy.JsonP'],
    xtype: 'messageList',
    id: 'messageList',
    config: {
        listeners: {
            show: function () {
                messageShow=true;
                if (localStore.getCount() == 0) {
                    Zermelo.ErrorManager.showErrorBox('announcement.no_announcement_msg');
                }
				dataFilter(this, localStore);
				Zermelo.UserManager.setTitles();

            }, //end show
             hide:function(){
                messageShow=false;
             },
            // record update with read and unread
            painted_disabled: function () {
                if (localStore.getCount() == 0) {
                    Zermelo.ErrorManager.showErrorBox('announcement.no_announcement_msg');
                }
                dataFilter(this, localStore);
            } //end painted
        }, // end listeners
        layout: 'fit',
        style: {
            'background': '#F0F0F0'
        },
        items: [{
            // list view
            xtype: 'list',
            // padding top left bottom right
            margin: '10 10 10 10',
            style:{
                'top': '-50px',
                'padding-bottom': '50px'
            },
            id: 'announcementlist',
            // css class resources/css/app.css
            cls: 'zermelo-message-list',
            // css class resources/css/app.css list items
            itemCls: 'zermelo-message-list-item',
            // css class resources/css/app.css selected items
            selectedCls: 'zermelo-menu-list-item-select',
            //data store
            store: localStore,
            grouped: false,
            itemTpl: new Ext.XTemplate("<tpl for='.'>", "<tpl if='read == 0'>{title} <img src='resources/images/new."+imageType+"' class='zermelo-message-list-read-unread-icon'>", "<tpl else>{title}", "</tpl>", "</tpl>")
        }]
    },
    refresh: function() {
        getAnnoucementData(this);
    }
});

//below function fetches the list of annoucement using webservice.
function getAnnoucementData(thisObj) {       
    if (!Zermelo.UserManager.loggedIn())
		return;
    
    // send request to server using ajax
    Ext.Ajax.request({
        url: 'https://' + Zermelo.UserManager.getInstitution() + '.zportal.nl/api/v3/announcements?current=true&user=~me&access_token=' + Zermelo.UserManager.getAccessToken(), // url : this.getUrl(),
        method: "GET",
        useDefaultXhrHeader: false,

        success: function (response) {
            return;
            var decoded = Ext.JSON.decode(response.responseText);
            // create store
            mystore = Ext.create('Ext.data.Store', {
                fields: ['id', 'start', 'end', 'title', 'text', 'read', 'valid']
            });
            mystore.setData(decoded.response.data);
            var readStore = Ext.getStore('ReadmessageStore');
            // all data remove from localstore

            localStore = new Zermelo.store.AnnouncementStore();
            localStore.removeAll();
            // set data into sotre

            mystore.each(function (record) {
                var rec = {
                    announcement_id: record.data.id,
                    start: record.data.start,
                    end: record.data.end,
                    title: record.data.title,
                    text: record.data.text // in a real app you would not update a real field like this!
                };
                // add reocrd into localstore one bye one
                localStore.add(rec);
                localStore.sync(); // The magic! This command persists the records in the store to the browsers localStorage
            });
            dataFilter(thisObj, localStore);
            //thisObj.unmask();
        },
        failure: function (response) {
            if (response.status == 403) {
                Zermelo.ErrorManager.showErrorBox('insufficient_permissions');
                Zermelo.UserManager.setUser();
            }
            else {
                Zermelo.ErrorManager.showErrorBox('network_error');
            }
            Ext.Viewport.setMasked(false);
            thisObj.show();
        }
    });
}
// filter data with read, unread and valid with feature date
function dataFilter(thisObj, localStore) {
    var readStore = Ext.getStore('ReadmessageStore');
    var announcement_id=[];
    for(i=0;i<localStore.getCount();i++)
    {
        announcement_id.push({id:localStore.getAt(i).get('announcement_id')});
    }
    // read and unread data update
    for (i = 0; i < localStore.getCount(); i++) {
        var flag = false;
        var record = localStore.findRecord('announcement_id',announcement_id[i].id);
        var id = record.get('announcement_id');
        for (j = 0; j < readStore.getCount(); j++) {
            var readid = readStore.getAt(j);
            if (id == readid.get('readId')) {
                flag = true;
            }
        }
        if (flag) {
            record.set('read', 1);
        } else {
            record.set('read', 0);
        }
        localStore.sync();
    }
   
    //only feature date valid 
    for (i = 0; i < announcement_id.length; i++) {
        var record = localStore.findRecord('announcement_id',announcement_id[i].id);
        var startDate = new Date(record.get('start') * 1000);
        var endDate = new Date(record.get('end') * 1000);
        var current_date = new Date();
        var format_startDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate());
        var format_endDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate())
        var format_currentDate = new Date(current_date.getUTCFullYear(), current_date.getUTCMonth(), current_date.getUTCDate())
        if (format_startDate.getTime() > format_currentDate.getTime()) {
			// not visible yet
			record.set('valid', 'false');
        } else if (format_endDate.getTime() >= format_currentDate.getTime()) {
			// visible
            record.set('valid', 'true');
        } else {
			// no longer visible
            record.set('valid', 'false');
        }
        localStore.sync();
    }
    localStore.filter([{
        property: 'read',
        value: 0
    }, {
        property: 'valid',
        value: 'true'
    }]);
   
    Ext.getCmp('home')._slideButtonConfig.setBadgeText(localStore.getCount());
    // In menu announcement count display
    if(localStore.getCount()!=0)
    {
        document.getElementById('messageCount').style.display="";
        document.getElementById('messageCount').innerHTML=localStore.getCount();
    }
    else
    {
        document.getElementById('messageCount').style.display="none";
    }
    localStore.clearFilter();
    localStore.filter('valid', 'true');
    localStore.sort([{property:'start', direction:'ASC'},{property:'end', direction:'ASC'}]);
    
    var list = Ext.getCmp('announcementlist')
	if (list) {
		if (list.getStore() != null)
			list.getStore().removeAll(); // to prevent an error inside setStore
		list.setStore(localStore);
		list.refresh();
	}
}
