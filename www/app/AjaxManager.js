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
	
	getAnnouncementData: function() {   
		if (!Zermelo.UserManager.loggedIn())
			return;

		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			locale: {
				message: 'loading'
			},

			indicator: true
		});
		
		Ext.Ajax.request({
			url: this.getUrl('announcements'),
			params: {
				user: '~me',
				access_token: Zermelo.UserManager.getAccessToken(),
				current: true
			},
			method: "GET",
			useDefaultXhrHeader: false,

			success: function (response, opts) {
				var decoded = Ext.JSON.decode(response.responseText).response.data;
				var announcementStore = Ext.getStore('Announcements');
				announcementStore.suspendEvents(true);

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

				announcementStore.resumeEvents(false);

				Ext.Viewport.setMasked(false);

				if(announcementStore.getCount() == 0 && messageShow) {
					Zermelo.ErrorManager.showErrorBox('announcement.no_announcement_msg');
				}
			},
			failure: function (response) {
				if (response.status != 403) {
					Zermelo.ErrorManager.showErrorBox('network_error');
				}

				Ext.Viewport.setMasked(false);
			}
		});
	},

	getAppointment: function(startTime, endTime, callback) {
		if (!Zermelo.UserManager.loggedIn())
			return;
		
		// Real unix timestamps use seconds, javascript uses milliseconds
		startTime = Math.floor(startTime / 1000);
		endTime = Math.floor(endTime / 1000);

		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			locale: {
				message: 'loading'
			},
			indicator: true
		});
		
		// send request to server using ajax
		Ext.Ajax.request({
			url: this.getUrl('appointments'),
			params: {
				user: Zermelo.UserManager.getUser(),
				access_token: Zermelo.UserManager.getAccessToken(),
				start: startTime,
				end: endTime
			},
			method: "GET",
			useDefaultXhrHeader: false,
			success: function (response) {
				// myNewTimer = Date.now();
				var decoded = Ext.JSON.decode(response.responseText).response.data;
				var currentUser = Zermelo.UserManager.getUser();
				window.localStorage.setItem('startApp',"True");
				window.localStorage.setItem('refresh_time_interval',new Date().getTime());
				window.localStorage.setItem('refreshTime', Date.now());

				var appointmentStore = Ext.getStore('Appointments');
				appointmentStore.suspendEvents();
				appointmentStore.each(function(record) {
					if (record.get('start') >= startTime && record.get('end') <= endTime && record.get('user') == currentUser)
						appointmentStore.remove(record);
				});

				decoded.forEach(function(record) {
					record.start = new Date(record.start * 1000);
					record.end = new Date(record.end * 1000);
					record.user = currentUser;

					appointmentStore.add(record);
				});

				// appointmentStore.filter(appointmentStore.filters);
				appointmentStore.detectCollisions();
				appointmentStore.queueDelayedEvents();

				appointmentStore.resumeEvents(true);

				Ext.Viewport.setMasked(false);
				Ext.getCmp('fullCalendarView').refreshOrStart();
				if(callback) 
					callback(appointmentStore);
				// appointmentStore.filter();
				// console.log('time spent: ' + (Date.now() - myNewTimer) + ' ms.');
			},
			failure: function (response) {
				var error_msg = 'network_error';
				if (response.status == 403) {
					error_msg = 'insufficient_permissions';
					Zermelo.UserManager.setUser();
				}
				Zermelo.ErrorManager.showErrorBox(error_msg);

				Ext.Viewport.setMasked(false);
			}
		}); // end ajax request
	}
})