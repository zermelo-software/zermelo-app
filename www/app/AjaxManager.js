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

	addAccessTokenToParams: function(params) {
		params.access_token = Zermelo.UserManager.getAccessToken();
		return params;
	},
	refresh: function() {
		Ext.getStore('Appointments').fetchWeek();
		this.getAnnouncementData();
	},

	periodicRefresh: function() {
		if(this.queuedRefresh)
			clearInterval(this.queuedRefresh);
		this.refresh();
		this.queuedRefresh = setInterval(Ext.bind(this.refresh, this), 1000 * 60 * 20);
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
				var decoded = JSON.parse(response.responseText).response.data;
				var announcementStore = Ext.getStore('Announcements');
				announcementStore.suspendEvents(true);

				// Update the stored announcements and remove the ones that no longer exist
				announcementStore.each(function(record) {
					var stillExists = 
					decoded.some(function(entry, index) {
						if (record.get('id') != entry.id)
							return false;

						record.set('start', new Date(entry.start * 1000));
						record.set('end', new Date(entry.end * 1000));
						record.set('title', entry.title);
						record.set('text', entry.text);
						decoded.splice(index, 1);
						return true;
					});

					if (!stillExists)
						announcementStore.remove(record);
				});

				// Store new announcements
				decoded.forEach(function(entry) {
					var record = {
						id: entry.id.toString(),
						start: new Date(entry.start * 1000),
						end: new Date(entry.end * 1000),
						title: entry.title,
						text: entry.text
					};
					announcementStore.add(record);
				});

				announcementStore.resetFilters();

				announcementStore.resumeEvents(false);

				Ext.Viewport.unmask();
			},
			failure: function (response) {
				if (response.status == 403) {
					// If the result is 403 the user isn't allowed to view announcements.
					// We create a dummy announcement to let them know about this
					var announcementStore = Ext.getStore('Announcements');
					announcementStore.each(function(record) {
						if(record.get('id') != '0')
							announcementStore.remove(record);
					});
					if(!announcementStore.getById('0')) {					
						var record = {
							id: '0',
							title: Ux.locale.Manager.get('announcement.no_permission_title'),
							text: Ux.locale.Manager.get('announcement.no_permission_message')
						};

						announcementStore.add(record);
					}
				}
				else {
					Zermelo.ErrorManager.showErrorBox('error.network');
				}
				Ext.getStore('Announcements').resetFilters();
				Ext.Viewport.unmask();
			}
		});
	},

	getAppointment: function(startTime, endTime) {
		console.log('getAppointment try', performance.now(), this.appointmentsPending);
		if (!Zermelo.UserManager.loggedIn() || this.appointmentsPending)
			return;
		console.log('getAppointment start', performance.now(), this.appointmentsPending);
		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			locale: {
				message: 'loading'
			},

			indicator: true
		});
		
		// Real unix timestamps use seconds, javascript uses milliseconds
		startTime = Math.floor(startTime / 1000);
		endTime = Math.floor(endTime / 1000);
		
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
			scope: this,
			success: function (response) {
				var decoded = JSON.parse(response.responseText).response.data;

				var appointmentStore = Ext.getStore('Appointments');
				appointmentStore.suspendEvents();

				appointmentStore.clearWeek();
				var getPriority = function(a) {
					if(!a.valid) 				return 0;
					if(a.cancelled) 			return 1;
					if(a.type == "unknown") 	return 2;
					if(a.type == "other")	 	return 3;
					if(a.type == "choice")	 	return 4;
					if(a.type == "lesson") 		return 5;
					if(a.type == "activity") 	return 6;
					if(a.type == "talk")	 	return 7;
					if(a.type == "exam") 		return 8;
				};
				decoded
				.sort(function(a, b) {
					// Sort the earliest start time first
					if(a.start < b.start)
						return -1;
					if(a.start > b.start)
						return 1;
					// Then sort the latest end time first
					if(a.end > b.end)
						return -1;
					if(a.end < b.end)
						return 1;
					// Then sort the highest prio first (if prio(a) > prio(b) this will be negative)
					return (getPriority(b) - getPriority(a));
				})
				.forEach(function(record) {
					record.start = new Date(record.start * 1000);
					record.end = new Date(record.end * 1000);
					record.user = Zermelo.UserManager.getUser();
					record.id += Zermelo.UserManager.getUser();
					if(Array.isArray(record.groups))
						record.groups.sort();
					if(Array.isArray(record.locations))
						record.locations.sort();
					if(Array.isArray(record.teachers))
						record.teachers.sort();
					if(record.startTimeSlotName === undefined || record.startTimeSlotName === null)
						record.startTimeSlotName = record.startTimeSlot;
				});
				var currentCollision, validCollisionCount, j, collisionEnd;
				for(var i = 0; i < decoded.length; i++) {
					currentCollision = [];
					validCollisionCount = 0;
					for(j = i;j < decoded.length && decoded[j].start >= decoded[i].start && decoded[j].end <= decoded[i].end; j++) {
						currentCollision.push(decoded[j].id);
						validCollisionCount += decoded[j].valid;
					}
					j--;
					collisionEnd = j;
					currentCollision = currentCollision.join(',');
					while(j >= i) {
						decoded[j].collidingIds = currentCollision;
						decoded[j].validCollisionCount = validCollisionCount;
						j--;
					}
					i = collisionEnd;
				}
				
				appointmentStore.add(decoded).forEach(function(record) {record.setDirty()});
				appointmentStore.resetFilters();
				appointmentStore.resumeEvents(true);
				appointmentStore.fireEvent('refresh');
				appointmentStore.queueDelayedEvents();
				localStorage.setItem('refreshTime', Date.now());
				Ext.Viewport.unmask();
				this.appointmentsPending = false;
				console.log('getAppointment end', performance.now(), this.appointmentsPending);
			},
			failure: function (response) {
				var error_msg = 'error.network';
				if (response.status == 403) {
					error_msg = 'error.permissions';
					Zermelo.UserManager.setUser();
				}

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
				this.appointmentsPending = false;
				console.log('getAppointment fail', performance.now(), this.appointmentsPending);
			}
		});
	}
})