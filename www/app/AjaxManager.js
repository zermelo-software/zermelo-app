Ext.define('Zermelo.AjaxManager', {
	alternateClassName: 'AjaxManager',
	requires: ['Zermelo.UserManager', 'Zermelo.ErrorManager'],
	singleton: true,
	mixins: ['Ext.mixin.Observable'],

	getUrl: function(target, institution) {
		if(!institution)
			institution = Zermelo.UserManager.getInstitution();
		return (
			'https://' + institution + '.zportal.nl/api/v3/' +
			target
		)
	},

	addAccessTokenToParams: function(params) {
		params.access_token = Zermelo.UserManager.getAccessToken();
		return params;
	},

	addVieweeToParams: function(params) {
		var type = Zermelo.UserManager.getType();
		var user = Zermelo.UserManager.getUser();

		this.addAccessTokenToParams(params);

		if(type == 'user')
			params.user = user;
		else if(type == 'group')
			params.containsStudentsFromGroupInDepartment = user;
		else if(type == 'location')
			params.locationsOfBranch = user;
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

	getLogin: function(institution, code) {
		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			locale: {
				message: 'loading'
			},

			indicator: true
		});

		Ext.Ajax.request({
			url: this.getUrl('oauth/token', institution),
			params: {
				grant_type: 'authorization_code',
				code: code
			},
			method: "POST",
			useDefaultXhrHeader: false,
			success: function (response) {
				// If the user is already logged in, this is a token upgrade attempt
				var upgrade = Zermelo.UserManager.loggedIn();
				var decoded = JSON.parse(response.responseText);
				Zermelo.UserManager.saveLogin('~me', institution, decoded.access_token);
				Ext.getCmp('main').setActiveItem(1);
				Ext.getCmp('fullCalendarView').updateView();
				Zermelo.AjaxManager.refresh();
				Zermelo.AjaxManager.getSelf(upgrade);
				Ext.Viewport.unmask();
			},

			failure: function (response) {
				Ext.Viewport.unmask();
				Zermelo.ErrorManager.showErrorBox(response.status == 400 ? 'error.wrong_code' : 'error.network');
			}
		});
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
		if (!Zermelo.UserManager.loggedIn() || this.appointmentsPending)
			return;
		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			locale: {
				message: 'loading'
			},

			indicator: true
		});

		this.appointmentsPending = true;

		Ext.Ajax.request({
			url: this.getUrl('appointments'),
			params: this.addVieweeToParams({
				// Real unix timestamps use seconds, javascript uses milliseconds
				start: Math.floor(startTime / 1000),
				end: Math.floor(endTime / 1000)
			}),
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
					var A_B = -1, B_A = 1;
					// Sort the earliest start time first
					if(a.start < b.start)
						return A_B;
					if(a.start > b.start)
						return B_A;
					// Then sort the highest priority first
					if (getPriority(a) > getPriority(b))
						return A_B;
					if (getPriority(a) < getPriority(b))
						return B_A;
					// Then sort the latest end time first
					if(a.end > b.end)
						return A_B;
					if(a.end < b.end)
						return B_A;
				})
				.forEach(function(record) {
					record.start = new Date(record.start * 1000);
					record.end = new Date(record.end * 1000);
					record.user = Zermelo.UserManager.getUserSuffix();
					record.id += Zermelo.UserManager.getUserSuffix();
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
			}
		});
	},

	getUsersByType: function(request) {
		// Check whether at least one of the requires permissions is set to PORTAL
		if(request.requires.split(',').every(function(permission) {
				return Zermelo.UserManager.getTokenAttributes().effectivePermissions[permission] < 5;
			}))
		{
			this.userByTypeReturn(request.endpoint, 403);
			return;
		}

		Ext.Ajax.request({			
			url: this.getUrl(request.endpoint),
			disableCaching: false,
			params: this.addAccessTokenToParams(request.params),
			userRequest: true,
			method: "GET",
			useDefaultXhrHeader: false,
			scope: this,
			success: function (response) {
				this.userByTypeReturn(request.endpoint, response.status, JSON.parse(response.responseText).response.data);
			},
			failure: function (response) {
				this.userByTypeReturn(request.endpoint, response.status);
			}
		});
	},

	// Each of the user sub-requests calls this method.
	// When we have responses for all requests belonging to a user type we format that user type.
	// When all requests have been formatted or errored we save the data we found.
	userByTypeReturn: function(endpoint, status, responseData) {
		if(status == 200)
			this.userResponse[endpoint] = responseData;
		else
			this.userResponse[endpoint] = status;

		var allCompleted = Ext.bind(function(types) {
			return types.every(function(type) {
				return Array.isArray(this.userResponse[type]);
			}, this);
		}, this);

		if(allCompleted(['users'])) {
			this.userResponse['users'].forEach(function(item) {
				item.type = 'user';
				this.formattedArray.push(item);
			}, this);

			this.userResponse['users'] = 200;
		}

		if(allCompleted(['locationofbranches', 'branchesofschools', 'schoolsinschoolyears'])) {
			this.userResponse['locationofbranches'].forEach(function(item) {
				var branchOfSchool = this.userResponse['branchesofschools'].find(function(branch) {return branch.id == item.branchOfSchool});
				if(this.userResponse['schoolsinschoolyears'].find(function(school) {return school.id == branchOfSchool.schoolInSchoolYear}))
					this.formattedArray.push({
						code: branchOfSchool.branch + '.' + item.name,
						type: 'location',
						remoteId: item.id
					});
			}, this);

			this.userResponse['locationofbranches'] = 200;
		}

		if(allCompleted(['groupindepartments', 'departmentsofbranches', 'branchesofschools', 'schoolsinschoolyears'])) {
			this.userResponse['groupindepartments'].forEach(function(item) {
				var departmentOfBranch = this.userResponse['departmentsofbranches'].find(function(mapping) {return mapping.id == item.departmentOfBranch});
				var branchOfSchool = this.userResponse['branchesofschools'].find(function(branch) {return branch.id == departmentOfBranch.branchOfSchool});
				if(this.userResponse['schoolsinschoolyears'].find(function(school) {return school.id == branchOfSchool.schoolInSchoolYear}))
					this.formattedArray.push({
						type: 'group',
						prefix: departmentOfBranch.schoolInSchoolYearName,
						code: item.extendedName,
						remoteId: item.id
					});
			}, this);

			this.userResponse['groupindepartments'] = 200;
		}

		var errorCount = 0;
		var allReturned = true;
		this.types.forEach(function(type) {
			if(typeof(this.userResponse[type.endpoint]) == 'undefined')
				allReturned = false;
			else
				errorCount += (this.userResponse[type.endpoint] != 200 && typeof(this.userResponse[type.endpoint]) == 'number');
				
		}, this)
		if(allReturned) {
			var UserStore = Ext.getStore('Users');
			UserStore.removeAll();
			this.formattedArray.sort(function(a, b) {
				if(a.firstName < b.firstName)
					return -1;
				if(a.firstName > b.firstName)
					return 1;
				if(a.lastName < b.lastName)
					return -1;
				if(a.lastName > b.lastName)
					return 1;
				if(a.code < b.code)
					return -1;
				if(a.code > b.code)
					return 1;
			});

			// This list is quite big so some webviews may not allow it to be stored.
			try {
				localStorage.setItem('Users', JSON.stringify(this.formattedArray));
			}
			catch (e) {
				localStorage.removeItem('Users');
			}
			UserStore.addData(this.formattedArray);
			UserStore.resumeEvents(true);
			UserStore.fireEvent('refresh');
			Ext.Viewport.unmask();
			if(errorCount != 0)
				Zermelo.ErrorManager.showErrorBox(errorCount == this.types.length ? 'error.user.all' : 'error.user.some');
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
		var UserStore = Ext.getStore('Users');
		// removeAll triggers clearing the current search value field so we allow it to fire before suspendEvents
		UserStore.removeAll();
		UserStore.suspendEvents();


		var userArray = localStorage.getItem('Users')
		if(userArray) {
			UserStore.addData(JSON.parse(userArray));
			UserStore.resumeEvents(true);
			UserStore.fireEvent('refresh');
			Ext.Viewport.unmask();
			return;
		}
		if(!Zermelo.UserManager.getTokenAttributes().effectivePermissions) {
			this.refreshUsers();
			return;
		}

		// Creating the user list requires a join on multiple requests. Unformatted responses will be stored in userResponse.
		// When a pair of responses is available, the correct formatting is applied by userByTypeReturn and appended to formattedArray.
		// When all requests have been formatted, formattedArray is added to UserStore
		// The values requires and requireLevel are used to check whether the current token has the correct rights to view the schedules of this type
		// We check that _token_[permissions.requires] >= requireLevel
		this.userResponse = {};
		this.formattedArray = [{firstName: '', lastName: '', prefix: 'Eigen rooster', code: '', type: 'user'}];
		this.types = [
			// users (students and teachers)
			{endpoint: 'users', params: {archived: false, isStudent: true}, requires: 'readScheduleStudents'}, // The field firstName isn't always available so we ask for everything and see what we get
			{endpoint: 'users', params: {archived: false, isEmployee: true}, requires: 'readScheduleTeachers'}, // The field firstName isn't always available so we ask for everything and see what we get

			// groups
			{endpoint: 'groupindepartments', params: {fields: 'departmentOfBranch,extendedName,id'}, requires: 'readScheduleGroups'},
			{endpoint: 'departmentsofbranches', params: {fields: 'branchOfSchool,schoolInSchoolYearName,id'}, requires: 'readScheduleGroups'},

			// locations
			{endpoint: 'locationofbranches', params: {fields: 'branchOfSchool,name,id'}, requires: 'readScheduleLocations'},

			// required for groups and locations
			{endpoint: 'branchesofschools', params: {fields: 'schoolInSchoolYear,branch,id'}, requires: 'readScheduleGroups,readScheduleLocations'},
			{endpoint: 'schoolsinschoolyears', params: {archived: false, fields: 'id'}, requires: 'readScheduleGroups,readScheduleLocations'}
		]

		if(Zermelo.UserManager.isParentOnly()) {
			this.types = [{endpoint: 'users', params: {archived: false, familyMember: Zermelo.UserManager.getUserAttributes().code}, requires: ''}];
		}

		this.types.forEach(this.getUsersByType, this);
	},

	refreshUsers: function() {
		this.getSelf();
		localStorage.removeItem('Users');
		this.on('tokenupdated', this.getUsers, this, {single: true});
	},

	getSelf: function(upgrade) {
		Ext.Ajax.request({
			url: this.getUrl('tokens/~current'),
			params: {
				access_token: Zermelo.UserManager.getAccessToken()
			},
			method: "GET",
			useDefaultXhrHeader: false,
			scope: this,

			success: function (response) {
				var tokenAttributes = JSON.parse(response.responseText).response.data[0];
				Zermelo.UserManager.setTokenAttributes(tokenAttributes);
				if(upgrade) {
					if(!tokenAttributes.schedule) {
						localStorage.setItem('skipTokenUpgrade', 'true');
						Zermelo.ErrorManager.showErrorBox('login.upgrade.failure');
					}
					else {
						Ext.getCmp('home').selectItem('userChange');
					}
				}
				this.fireEvent('tokenupdated');
			},

			failure: function (response) {
				var error_msg = response.status == 403 ? 'error.permissions' : 'error.network';

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
			}
		});

		Ext.Ajax.request({
			url: this.getUrl('users/~me'),
			params: {
				access_token: Zermelo.UserManager.getAccessToken(),
				fields: 'code,isFamilyMember,isEmployee,isStudent'
			},
			method: "GET",
			useDefaultXhrHeader: false,

			success: function (response) {
				Zermelo.UserManager.setUserAttributes(JSON.parse(response.responseText).response.data[0]);
			},

			failure: function (response) {
				var error_msg = response.status == 403 ? 'error.permissions' : 'error.network';

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
			}
		});
	}
})