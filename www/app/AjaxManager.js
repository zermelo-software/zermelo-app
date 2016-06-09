Ext.define('Zermelo.AjaxManager', {
	alternateClassName: 'AjaxManager',
	requires: ['Zermelo.UserManager', 'Zermelo.ErrorManager'],
	singleton: true,

	getUrl: function(target) {
		return (
			'https://' + 
			Zermelo.UserManager.getInstitution() + 
			'.zportal.nl/api/v3/' +
			target
		)
	},

	getParams: function(additional_args) {
		return ret = Object.assign({
			user: Zermelo.UserManager.getUser(),
			access_token: Zermelo.UserManager.getAccessToken()
		}, additional_args);
	},
	
	getAnnouncementData: function(currentView) {   
	    Ext.Viewport.setMasked({
	        xtype: 'loadmask',
	        locale: {
	            message: 'loading'
	        },

	        indicator: true
	    });
	    
	    Ext.Ajax.request({
	        url: this.getUrl('announcements'),
	        params: this.getParams({current: true}),
	        method: "GET",
	        useDefaultXhrHeader: false,

	        success: function (response, opts) {
	            var decoded = Ext.JSON.decode(response.responseText).response.data;

	            var announcementStore = Ext.getStore('Announcements');
	            announcementStore.each(function(record) {
	                var stillExists = 
	                decoded.some(function(entry, index) {
	                    if (record.get('announcement_id') != entry.id)
	                        return false;

	                    record.set('start', decoded[index].start);
	                    record.set('end', decoded[index].end);
	                    record.set('title', decoded[index].title);
	                    record.set('text', decoded[index].text);    
	                    decoded.splice(index, 1);
	                    return true;
	                });

	                if (!stillExists)
	                    announcementStore.remove(record);
	                
	                record.commit();
	            });

	            decoded.forEach(function(record) {
	                announcementStore.add({
	                    announcement_id: record.id,
	                    start: record.start,
	                    end: record.end,
	                    title: record.title,
	                    text: record.text
	                });
	            });
	            Ext.Viewport.setMasked(false);
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
	        }
	    });
	},

	//below function fetches the list of appointments using webservice.
	getAppointment: function(me, currentobj, refresh, startTime, endTime, weekarrayemptyflag, nextprev, datepickerGo, week) {
	    me.setMasked({
	        xtype: 'loadmask',
	        locale: {
	            message: 'loading'
	        },
	        indicator: true
	    });
	    var thisMe = currentobj;
	    
	    if (!Zermelo.UserManager.loggedIn())
	        return;
	    // send request to server using ajax
	    Ext.Ajax.request({
	        url: this.getUrl('appointments'),
	        params: this.getParams({'start': startTime, 'end': endTime}),
	        method: "GET",
	        useDefaultXhrHeader: false,
	        success: function (response) {
	        	eventArray = [];
	        	var decoded = Ext.JSON.decode(response.responseText).response.data;
	            window.localStorage.setItem('startApp',"True");
	            window.localStorage.setItem('refresh_time_interval',new Date().getTime());
	            window.localStorage.setItem('refreshTime', Date.now());

	            var appointmentStore = Ext.getStore('Appointments');
	            appointmentStore.each(function(record) {
	                var stillExists = decoded.some(function(entry, index) {
	                    if (record.get('appointmentInstance') != entry.id)
	                        return false;
	                    if (!entry.valid || entry.hidden) {
	                    	appointmentStore.remove(record);
	                    	return true;
	                    }
	                    else if (record.get('lastModified') < entry.lastModified) {
		                    // do update
	                    }

	                    decoded.splice(index, 1);
	                    return true;
	                });

	                if (!stillExists)
	                	appointmentStore.remove(record);

	                record.commit();
	            });

	            decoded.forEach(function(record) {
	            	record.start = new Date(record.start * 1000);
	            	record.end = new Date(record.end * 1000);
	                appointmentStore.add(record);
	                eventArray.push(record);
	            });
	            console.log(eventArray);
	            me.setMasked(false);
	            currentobj.destroyCalendar();
                currentobj.renderFullCalendar();
	        },
	        failure: function (response) {
	            var error_msg = 'network_error';
	            if (response.status == 403) {
	                error_msg = 'insufficient_permissions';
	                Zermelo.UserManager.setUser();
	            }
	            Zermelo.ErrorManager.showErrorBox(error_msg);

	            me.setMasked(false);
	            thisObj.show();
	        }
	    }); // end ajax request
	},




//below function fetches the list of appointments using webservice.
ggetAppointment: function (me, currentobj, refresh, startTime, endTime, weekarrayemptyflag, nextprev, datepickerGo, week) {
    me.setMasked({
        xtype: 'loadmask',
        locale: {
            message: 'loading'
        },
        indicator: true
    });
    var thisMe = currentobj;
    
    if (!Zermelo.UserManager.loggedIn())
        return;
    // send request to server using ajax
    Ext.Ajax.request({
        url: 'https://' + Zermelo.UserManager.getInstitution() + '.zportal.nl/api/v3/appointments?user=' + Zermelo.UserManager.getUser() + '&access_token=' + Zermelo.UserManager.getAccessToken() + '&start=' + startTime + '&end=' + endTime, // url : this.getUrl(),
        method: "GET",
        useDefaultXhrHeader: false,
        success: function (response) {
            window.localStorage.setItem('startApp',"True");
            window.localStorage.setItem('refreshTime',new Date().getTime());
           // console.log(new Date().getTime());
         //   changeRefreshIcon();
            eventArray.length = 0;
            var startweeknumber = new Date(startTime * 1000).getWeek();
            startweeknumber = startweeknumber + "" + new Date(startTime * 1000).getFullYear();
            var endweeknumber = new Date(endTime * 1000).getWeek();
            endweeknumber = endweeknumber + "" + new Date(endTime * 1000).getFullYear();
            // when refresh schedule weeknumber array empty and appoiment's refresh flag with ture
            // if (refresh && weekarrayemptyflag) {
            //     var query = 'UPDATE APPOINTMENTS SET refreshFlag=?';
            //     updateRefreshFlag(query);
            //     weeknumbers.length = 0;
            //     Ext.getCmp('button_week_refresh').setIconCls('zermelo-refresh-button-' + imageType);
            //     Ext.getCmp('button_day_refresh').setIconCls('zermelo-refresh-button-' + imageType);
            // }
            // var weekobj = {
            //     week: startweeknumber
            // };
            // start week add in array
            // weeknumbers.push(weekobj);
            // weekobj = {
            //     week: endweeknumber
            // };
            // end week add in array
            // weeknumbers.push(weekobj);
            //delete appointments only start week and end week
            deleteappointmentdata(startweeknumber, endweeknumber);

            var decoded = response.responseText.replace(/\["/g, '\'');
            decoded = decoded.replace(/"\]/g, '\'');
            decoded = decoded.replace(/\[\]/g, '""');
            decoded = decoded.replace(/"new"/g, '"isNew"');

            decoded = Ext.JSON.decode(decoded);
           
            // insert data in db
            insertData(decoded.response.data, currentobj, refresh, me, nextprev, datepickerGo, week);
        },
        failure: function (response) {
            var error_msg = 'network_error';
            if (response.status == 403) {
                error_msg = 'insufficient_permissions';
                Zermelo.UserManager.setUser();
            }
            Zermelo.ErrorManager.showErrorBox(error_msg);

            Ext.Viewport.setMasked(false);
            thisObj.show();
        }
    }); // end ajax request
}





})