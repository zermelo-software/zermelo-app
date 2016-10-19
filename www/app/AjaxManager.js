Ext.define('Zermelo.AjaxManager', {
	alternateClassName: 'AjaxManager',
	requires: ['Zermelo.UserManager', 'Zermelo.ErrorManager'],
	singleton: true,

	getUrl: function(target) {
		return (
			'http://ulbeportal.zermelo.local/api/v3/' +
			target
		)
	},

	refresh: function() {
		Ext.getStore('Appointments').fetchWeek();
		this.getAnnouncementData();
		this.getSelf();
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
				var decoded = Ext.JSON.decode(response.responseText).response.data;
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
		if (!Zermelo.UserManager.loggedIn() || this.appointmentsPending)
			return;
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

		this.appointmentsPending = true;

		Ext.Ajax.request({
			url: this.getUrl('appointments'),
			params: Zermelo.UserManager.addVieweeParamsToObject({
				start: startTime,
				end: endTime
			}),
			method: "GET",
			useDefaultXhrHeader: false,
			scope: this,
			success: function (response) {
				var decoded = Ext.JSON.decode(response.responseText).response.data;

				var appointmentStore = Ext.getStore('Appointments');
				appointmentStore.suspendEvents();

				appointmentStore.clearWeek();
				decoded
				.sort(function(a, b) {
					if(a.start < b.start)
						return -1;
					if(a.start > b.start)
						return 1;
					if(a.end > b.end)
						return -1;
					if(a.end < b.end)
						return 1;
					return 0;
				})
				.forEach(function(record) {
					record.start = new Date(record.start * 1000);
					record.end = new Date(record.end * 1000);
					record.user = Zermelo.UserManager.getUserSuffix();
					record.id += Zermelo.UserManager.getUserSuffix();
					record.groups.sort();
					record.locations.sort();
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
				
				appointmentStore.add(decoded);
				appointmentStore.queueDelayedEvents();
				appointmentStore.resetFilters();
				appointmentStore.resumeEvents(true);
				appointmentStore.fireEvent('refresh');
				localStorage.setItem('refreshTime', Date.now());
				Ext.Viewport.unmask();
				this.appointmentsPending = false;
			},
			failure: function (response) {
				console.log(response);
				var error_msg = 'error.network';
				if (response.status == 403) {
					error_msg = 'error.permissions';
					Zermelo.UserManager.setUser();
				}

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
				this.appointmentsPending = false;
			}
		});
	},

	getUsersByType: function(type) {


			Ext.Ajax.request({			
				url: this.getUrl(type),
				disableCaching: false,
				params: {
					access_token: Zermelo.UserManager.getAccessToken()
				},
				userRequest: true,
				method: "GET",
				useDefaultXhrHeader: false,
				scope: this,
				success: function (response) {
					this.userByTypeReturn(type, response.status, Ext.JSON.decode(response.responseText).response.data);
				},
				failure: function (response) {
					this.userByTypeReturn(type, response.status);
				}
			});
	},

	userByTypeReturn: function(type, status, responseData) {
		console.log(arguments);
		if(status == 200)
			this.userResponse[type] = responseData;
		else
			this.userResponse[type] = status;

		if(Array.isArray(this.userResponse['users'])) {
			this.userResponse['users'].forEach(function(item) {
				item.type = 'user';
				this.formattedArray.push(item);
			}, this);

			this.userResponse['users'] = 200;
		}

		if(Array.isArray(this.userResponse['groupindepartments']) && Array.isArray(this.userResponse['departmentsofbranches'])) {
			this.userResponse['groupindepartments'].forEach(function(item) {
				this.formattedArray.push({
					type: 'group',
					prefix: this.userResponse['departmentsofbranches'].find(function(mapping) {return mapping.id == item.departmentOfBranch}).schoolInSchoolYearName,
					code: item.extendedName,
					remoteId: item.id
				});
			}, this);

			this.userResponse['groupindepartments'] = 200;
			this.userResponse['departmentsofbranches'] = 200;
		}

		if(Array.isArray(this.userResponse['locationofbranches']) && Array.isArray(this.userResponse['branchesofschools'])) {
			this.userResponse['locationofbranches'].forEach(function(item) {
				this.formattedArray.push({
					code: this.userResponse['branchesofschools'].find(function(mapping) {return mapping.id == item.branchOfSchool}).branch + '.' + item.name,
					type: 'location',
					remoteId: item.id
				});
			}, this);

			this.userResponse['locationofbranches'] = 200;
			this.userResponse['branchesofschools'] = 200;
		}

		var errorCount = 0;
		var allReturned = true;
		this.types.forEach(function(type) {
			if(typeof(this.userResponse[type]) == "number")
				errorCount += this.userResponse[type] != 200;
			else
				allReturned = false;
		}, this)
		if(allReturned) {
			console.log('allRetuned');
			var UserStore = Ext.getStore('Users');
			UserStore.removeAll();
			UserStore.addData(this.formattedArray);
			UserStore.sort([
				{
					property: 'firstName',
					direction: 'ASC'
				},
				{
					property: 'lastName',
					direction: 'ASC'
				},
				{
					property: 'code',
					direction: 'ASC'
				}
			]);
			UserStore.initSearch();
			UserStore.resumeEvents(true);
			UserStore.fireEvent('refresh');
			Ext.Viewport.unmask();
			if(errorCount != 0)
				Zermelo.ErrorManager.showErrorBox(errorCount == 5 ? 'error.user.all' : 'error.user.some');
		}
	},

	getUsers: function() {
		if (!Zermelo.UserManager.loggedIn())
			return;

		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			locale: {
				message: 'loading'
			},

			indicator: true
		});

		// Creating the user list requires a join on multiple requests. Unformatted responses will be stored in userResponse.
		// When a pair of responses is available, the correct formatting is applied by userByTypeReturn and appended to formattedArray
		// When all requests have been formatted, formattedArray is added to UserStore
		this.userResponse = {};
		this.formattedArray = [{firstName: '', lastName: '', prefix: 'Eigen rooster', code: '', type: 'user'}];
		this.types = [
			'branchesofschools',
			'departmentsofbranches',
			'users',
			'groupindepartments',
			'locationofbranches'
		]

		Ext.getStore('Users').suspendEvents();

		this.types.forEach(this.getUsersByType, this);
	},

	getSelf: function() {
		Ext.Ajax.request({
			url: this.getUrl('tokens/~current'),
			params: {
				access_token: Zermelo.UserManager.getAccessToken()
			},
			method: "GET",
			useDefaultXhrHeader: false,

			success: function (response) {
				// console.log(Ext.JSON.decode(response.responseText).response.data[0]);
			},

			failure: function (response) {
				console.log('faal');
			}
		});
	}
})