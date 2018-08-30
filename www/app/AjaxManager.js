Ext.define('Zermelo.AjaxManager', {
	alternateClassName: 'AjaxManager',
	requires: ['Zermelo.UserManager', 'Zermelo.ErrorManager'],
	singleton: true,
	mixins: ['Ext.mixin.Observable'],
	pendingRequests: {},

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
		var user = Zermelo.UserManager.getUser();
		var type = Zermelo.UserManager.getType();
		if(!user || !type)
			return null;

		this.addAccessTokenToParams(params);
		if(type == 'group')
			params.containsStudentsFromGroupInDepartment = user;
		else if(type == 'dept')
			params.departmentOfBranch = user;
		else if(type == 'location')
			params.locationsOfBranch = user;
		else
			params.user = user;

		return params;
	},

	refresh: function() {
		Ext.getStore('Appointments').fetch();
		this.getAnnouncementData();
	},

	periodicRefresh: function() {
		if(this.queuedRefresh)
			clearInterval(this.queuedRefresh);
		this.queuedRefresh = setInterval(Ext.bind(this.refresh, this), 1000 * 60 * 20);
	},

	refreshIfStale: function() {
		var twentyMinutesAgo = Date.now() - 20 * 60 * 1000;
		var lastRefresh = localStorage.getItem("lastRefresh");
		if (!lastRefresh || (twentyMinutesAgo > lastRefresh)) {
			this.refresh();
			this.periodicRefresh();
		}
	},

	getLogin: function(institution, code, callback) {
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
			scope: this,
			success: function (response) {
				// If the user is already logged in, this is a token upgrade attempt
				var upgrade = Zermelo.UserManager.loggedIn();
				var decoded = JSON.parse(response.responseText);
				Zermelo.UserManager.saveLogin('~me', institution, decoded.access_token);
				Ext.getCmp('main').setActiveItem(1);
				Ext.getCmp('fullCalendarView').updateView();
				Zermelo.AjaxManager.getSelf(upgrade);
				this.on('tokenupdated', this.refresh, this);
				Ext.Viewport.unmask();
				if(callback)
					callback();
			},

			failure: function (response) {
				Ext.Viewport.unmask();
				var errorKey = 'error.network';
				if (response.status == 400)
					errorKey = 'error.wrong_code'
				if (response.status == 404 || response.status == 503)
					errorKey = 'error.wrong_address'
				Zermelo.ErrorManager.showErrorBox(errorKey);
			}
		});
	},
	
	getAnnouncementData: function() {
		if (!Zermelo.UserManager.loggedIn()) {
			return;
		}
		if (this.selfPending()) {
			console.log("Delaying getAnnouncementData");
			this.on('tokenupdated', function() {this.getAnnouncementData()}, this);
			return;
		}

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
				announcementStore.suspendEvents();

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
				announcementStore.mySort();

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
		if (!Zermelo.UserManager.loggedIn() || this.appointmentsPending) {
			return;
		}
		if (this.selfPending()) {
			console.log("Delaying getAppointment");
			this.on('tokenupdated', function() {this.getAppointment(startTime, endTime)}, this);
			return;
		}
		if (Zermelo.UserManager.isParentOnly() && Zermelo.UserManager.userIsSelf()) {
			console.log("Skipped getAppointment because we're a parent");
			Ext.getStore('Appointments').fireEvent('refresh');
			return;
		}
		console.log("Doing getAppointment");
		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			locale: {
				message: 'loading'
			},

			indicator: true
		});
		Zermelo.AjaxManager.appointmentsPending = true;

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
					var A_before_B = -1, B_before_A = 1;
					// Sort the earliest start time first
					if(a.start < b.start)
						return A_before_B;
					if(a.start > b.start)
						return B_before_A;
					// Then sort the highest priority first
					if (getPriority(a) > getPriority(b))
						return A_before_B;
					if (getPriority(a) < getPriority(b))
						return B_before_A;
					// Then sort the latest end time first
					if(a.end > b.end)
						return A_before_B;
					if(a.end < b.end)
						return B_before_A;
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
				var currentCollision, validCollisionCount, j, collisionEnd, highestPrioIndex;
				// Walk the list of appointments looking for collisions
				// Starting from an element i, we determine the last element j that collides with it and log all elements in the range [i, j] as colliding
				// Note that this algorithm depends on the sorting done above
				for(var i = 0; i < decoded.length; i++) {
					highestPrioIndex = i;
					currentCollision = [];
					validCollisionCount = 0;
					// Determine the range that collides with the element at i
					for(j = i;j < decoded.length && decoded[j].start >= decoded[i].start && decoded[j].end <= decoded[i].end; j++) {
						currentCollision.push(decoded[j].id);
						validCollisionCount += decoded[j].valid;
						highestPrioIndex = getPriority(decoded[j]) > getPriority(decoded[highestPrioIndex]) ? j : highestPrioIndex;
					}
					j--;
					collisionEnd = j;
					// Move the element with the highest priority to the front
					if(i != highestPrioIndex) {
						var tmp = decoded[highestPrioIndex];
						decoded[highestPrioIndex] = decoded[i];
						decoded[i] = tmp;
						// Also change the order of currentCollision
						tmp = currentCollision[highestPrioIndex - i];
						currentCollision[highestPrioIndex - i] = currentCollision[0];
						currentCollision[0] = tmp;
					}
					currentCollision = currentCollision.join(',');
					// Move back from j to i and set the collision attributes on each element
					while(j >= i) {
						decoded[j].collidingIds = currentCollision;
						decoded[j].validCollisionCount = validCollisionCount;
						j--;
					}
					// Jump over all elements that were part of this collisison
					i = collisionEnd;
				}
				
				appointmentStore.add(decoded).forEach(function(record) {record.setDirty()});
				appointmentStore.resetFilters();
				appointmentStore.resumeEvents(true);
				appointmentStore.fireEvent('refresh');
				appointmentStore.queueDelayedEvents();
				Ext.Viewport.unmask();
				Zermelo.AjaxManager.appointmentsPending = false;
				localStorage.setItem("lastRefresh", Date.now());
			},
			failure: function (response) {
				var error_msg = 'error.network';
				if (response.status == 403) {
					error_msg = 'error.permissions';
					Zermelo.UserManager.setUser();
				}
				if (response.status == 401) {
					error_msg = 'error.generic';
					Zermelo.UserManager.setUser();
				}

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
				Zermelo.AjaxManager.appointmentsPending = false;
			}
		});
	},

	saveUsers: function(users, saveToDB) {
		if(saveToDB)
			localforage.setItem('Zermelo.store.UserStore', JSON.stringify({"createdAt": new Date().valueOf(), "data": users}));

		var UserStore = Ext.getStore('Users');

		UserStore.addData(users);
		UserStore.resumeEvents(true);
		UserStore.fireEvent('refresh');
		Ext.Viewport.unmask();
	},


	getUsersByType: function(request) {
		// // Check whether at least one of the requires permissions is set to PORTAL
		if(request.requires.split(',').every(function(permission) {
				return Zermelo.UserManager.getPermission(permission) < 5;
			}))
		{
			this.userByTypeReturn(request.endpoint, 403);
			return;
		}

		// We actually use the /users endpoint for employees and students, so we replace them here and undo the change in the success callback
		var endpoint = (request.endpoint == 'students' || request.endpoint == 'employees') ? 'users' : request.endpoint;

		Ext.Ajax.request({			
			url: this.getUrl(endpoint),
			disableCaching: false,
			params: this.addAccessTokenToParams(request.params),
			userRequest: true,
			method: "GET",
			useDefaultXhrHeader: false,
			scope: this,
			success: function (response) {
				var responseData = JSON.parse(response.responseText).response.data;
                // The employees and students endpoints were replaced with users above. We're undoing that change here
                if(request.endpoint == 'users')
                    request.endpoint = responseData[0].isEmployee ? 'employees' : 'students';
				this.userByTypeReturn(request.endpoint, response.status, responseData);
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

		['students', 'employees'].forEach(function(endpoint) {
            if(allCompleted([endpoint])) {
            	var userType = (endpoint == 'students') ? 'student' : 'employee';
                this.userResponse[endpoint].forEach(function(item) {
                    this.formattedArray.push({
                    	type: userType,
						code: item.code,
						firstName: item.firstName,
						lastName: item.lastName,
						prefix: item.prefix
					});
                }, this);
                this.userResponse[endpoint] = 200;
            }
		}, this);

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

		// Groups depend on all subtables of branches, so we can't set any subtable to complete to mark branches complete without also
		// interrupting groups. We bundle them to save headaches.
		if(allCompleted(['groupindepartments', 'departmentsofbranches', 'branchesofschools', 'schoolsinschoolyears'])) {
			// Create an entry for each branch
			this.userResponse['departmentsofbranches'].forEach(function(item) {
				var branchOfSchool = this.userResponse['branchesofschools'].find(function(branch) {return branch.id == item.branchOfSchool});
				if(this.userResponse['schoolsinschoolyears'].find(function(school) {return school.id == branchOfSchool.schoolInSchoolYear}))
					if(!item.code.toLowerCase().includes('#uit')) {
						this.formattedArray.push({
							type: 'dept',
							prefix: item.schoolInSchoolYearName,
							code: branchOfSchool.branch + '.' + item.code,
							remoteId: item.id
						});
					}
			}, this);

			// Create an entry for each group
			this.userResponse['groupindepartments'].forEach(function(item) {
				var departmentOfBranch = this.userResponse['departmentsofbranches'].find(function(mapping) {return mapping.id == item.departmentOfBranch});
				if (departmentOfBranch == undefined) return;
				var branchOfSchool = this.userResponse['branchesofschools'].find(function(branch) {return branch.id == departmentOfBranch.branchOfSchool});
				if(this.userResponse['schoolsinschoolyears'].find(function(school) {return school.id == branchOfSchool.schoolInSchoolYear}))
					if(!item.extendedName.toLowerCase().includes('#uit') && !item.extendedName.toLowerCase().includes('#allen')) {
						this.formattedArray.push({
							type: 'group',
							prefix: departmentOfBranch.schoolInSchoolYearName,
							code: item.extendedName,
							remoteId: item.id
						});
					}
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
				var A_before_B = -1, B_before_A = 1;
				if(a.type != b.type) {
					if(a.type == 'employee')
						return A_before_B;
					if(b.type == 'employee')
						return B_before_A;
					if(a.type == 'student')
						return A_before_B;
					if(b.type == 'student')
						return B_before_A;
					if(a.type == 'location')
						return A_before_B;
					if(b.type == 'location')
						return B_before_A;
				}
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

			this.saveUsers(this.formattedArray, true);
			if(errorCount != 0)
				Zermelo.ErrorManager.showErrorBox(errorCount == this.types.length ? 'error.user.all' : 'error.user.some');
		}
	},

	loadOrGetUsers: function() {
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

		// If Users is in localStorage, we remove it and save it to localforage
		var fromLocalStorage = localStorage.getItem('Users');
		if(fromLocalStorage) {
			localStorage.removeItem('Users');
			this.saveUsers(JSON.parse(fromLocalStorage), true);
		}
		else {
			localforage.getItem('Zermelo.store.UserStore', function(err, value) {
				if((value == null)) {
                    Zermelo.AjaxManager.getUsers();
                }
				else {
					var userCache = JSON.parse(value);
					var createdAt = userCache.createdAt || 0;
					var maxAge = (7 * 24 * 60 * 60 * 1000);
					if (createdAt < (new Date().valueOf() - maxAge))
						Zermelo.AjaxManager.getUsers();
					else {
						Zermelo.AjaxManager.saveUsers(userCache.data, false);
					}
				}
			});
		}
	},

	getUsers: function() {
		if (this.selfPending()) return;

		var options = Zermelo.UserManager.getOptions();
		// If we don't know what this token can do, we need to fetch that first
		if(options.refreshFirst) {
			this.refreshUsers();
			return;
		}

		// Creating the user list requires a join on multiple requests. Unformatted responses will be stored in userResponse.
		// When a pair of responses is available, the correct formatting is applied by userByTypeReturn and appended to formattedArray.
		// When all requests have been formatted, formattedArray is added to UserStore
		// The values requires and requireLevel are used to check whether the current token has the correct rights to view the schedules of this type
		// We check that _token_[permissions.requires] >= requireLevel
		this.userResponse = {};
		this.formattedArray = [];
		var schoolYear = (new Date()).getFullYear() - ((new Date()).getMonth() < 7);
		var studentFields = options.includeNames ? "code,firstName,prefix,lastName" : "code";
		var employeeFields = options.includeNames ? ("code,prefix,lastName" + (Zermelo.UserManager.getUserAttributes().isEmployee ? ",firstName" : "")) : "code";

		this.types = [
			// users (students and teachers)
			{endpoint: 'students', params: {archived: false, isStudent: true, fields: studentFields}, requires: 'readScheduleStudents'}, // The field firstName isn't always available so we ask for everything and see what we get
			{endpoint: 'employees', params: {archived: false, isEmployee: true, fields: employeeFields}, requires: 'readScheduleTeachers'}, // The field firstName isn't always available so we ask for everything and see what we get

			// groups
			{endpoint: 'groupindepartments', params: {fields: 'departmentOfBranch,extendedName,id'}, requires: 'readScheduleGroups'},

			// departments (also required for groups)
			{endpoint: 'departmentsofbranches', params: {fields: 'code,branchOfSchool,schoolInSchoolYearName,id'}, requires: 'readScheduleGroups'},

			// locations
			{endpoint: 'locationofbranches', params: {fields: 'branchOfSchool,name,id'}, requires: 'readScheduleLocations'},

			// required for groups, departments and locations
			{endpoint: 'branchesofschools', params: {fields: 'schoolInSchoolYear,branch,id'}, requires: 'readScheduleGroups,readScheduleLocations'},
			{endpoint: 'schoolsinschoolyears', params: {archived: false, fields: 'id', year: schoolYear}, requires: 'readScheduleGroups,readScheduleLocations'}
		];

		this.types.forEach(function(type) {
			if (options.includeProjects) {
				if (type.endpoint == "students" || type.endpoint == "employees") {
					type.params.schoolInSchoolYear = options.projects.join(",");
				}
			}
			if (options.skipRoleCheck) {
				// If rights to view this are obtained through SF settings, we don't need to check the requires permissions
				type.requires = "";
			}
		});

		if(Zermelo.UserManager.isParentOnly()) {
			this.types = [{endpoint: 'students', params: {archived: false, familyMember: Zermelo.UserManager.getUserAttributes().code}, requires: ''}];
		}

		this.types.forEach(this.getUsersByType, this);
	},

	refreshUsers: function() {
		this.on('tokenupdated', this.loadOrGetUsers, this, {single: true});
		localforage.removeItem('Zermelo.store.UserStore', this.getSelf.bind(this));
		localStorage.removeItem('Users')
	},

	selfPending: function() {
		for (var key in this.pendingRequests) {
			if (this.pendingRequests.hasOwnProperty(key) && this.pendingRequests[key] == "pending") {
				return true;
			}
		}
		return false;
	},

	getSelf: function(upgrade) {
		if(!Zermelo.UserManager.loggedIn())
			return;

		if (this.selfPending()) return;

		var requests = ['tokens/~current', 'users/~me', 'schoolfunctionsettings', 'schoolfunctiontasks'];

		var handleReturn = function(endpoint, status) {
			this.pendingRequests[endpoint] = status;
			if (!this.selfPending()) {
				this.pendingRequests = {};
				this.fireEvent('tokenupdated');
			}
			
		}.bind(this);

		this.pendingRequests['tokens/~current'] = 'pending';
		Ext.Ajax.request({
			url: this.getUrl('tokens/~current'),
			params: {
				access_token: Zermelo.UserManager.getAccessToken()
			},
			method: "GET",
			useDefaultXhrHeader: false,
			scope: this,
			handleReturn: handleReturn,

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

				handleReturn('tokens/~current', 'completed');
			},

			failure: function (response) {
				handleReturn('tokens/~current', 'error');
				var error_msg = response.status == 403 ? 'error.permissions' : 'error.network';

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
			}
		});

		this.pendingRequests['users/~me'] = 'pending';
		Ext.Ajax.request({
			url: this.getUrl('users/~me'),
			params: {
				access_token: Zermelo.UserManager.getAccessToken(),
				fields: 'code,isFamilyMember,isEmployee,isStudent,isApplicationManager'
			},
			method: "GET",
			useDefaultXhrHeader: false,
			scope:this,
			handleReturn: handleReturn,

			success: function (response) {
				Zermelo.UserManager.setUserAttributes(JSON.parse(response.responseText).response.data[0]);

				handleReturn('users/~me', 'completed');
			},

			failure: function (response) {
				handleReturn('users/~me', 'error');
				var error_msg = response.status == 403 ? 'error.permissions' : 'error.network';

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
			}
		});

		this.pendingRequests['schoolfunctionsettings'] = 'pending';
		Ext.Ajax.request({
			url: this.getUrl('schoolfunctionsettings'),
			params: {
				access_token: Zermelo.UserManager.getAccessToken()
			},
			method: "GET",
			useDefaultXhrHeader: false,
			scope:this,
			handleReturn: handleReturn,

			success: function (response) {
				Zermelo.UserManager.setSchoolFunctionSettings(JSON.parse(response.responseText).response.data);

				handleReturn('schoolfunctionsettings', 'completed');
			},

			failure: function (response) {
				handleReturn('schoolfunctionsettings', 'error');
				var error_msg = response.status == 403 ? 'error.permissions' : 'error.network';

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
			}
		});

		this.pendingRequests['schoolfunctiontasks'] = 'pending';
		Ext.Ajax.request({
			url: this.getUrl('schoolfunctiontasks'),
			params: {
				access_token: Zermelo.UserManager.getAccessToken()
			},
			method: "GET",
			useDefaultXhrHeader: false,
			scope:this,
			handleReturn: handleReturn,

			success: function (response) {
				Zermelo.UserManager.setSchoolFunctionTasks(JSON.parse(response.responseText).response.data);

				handleReturn('schoolfunctiontasks', 'completed');
			},

			failure: function (response) {
				handleReturn('schoolfunctiontasks', 'error');
				var error_msg = response.status == 403 ? 'error.permissions' : 'error.network';

				Zermelo.ErrorManager.showErrorBox(error_msg);
				Ext.Viewport.unmask();
			}
		});
	}
})