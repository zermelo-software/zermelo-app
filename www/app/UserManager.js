Ext.define('Zermelo.UserManager', {
	alternateClassName: 'UserManager',
	requires: ['Ux.locale.Manager'],
	singleton: true,
	fields: ['code','name', 'type', 'institution', 'accessToken'],

	loggedIn: function() {
		return this.accessToken ? true : false;
	},

	userIsSelf: function() {
		return this.getUser() == '~me';
	},

	getUser: function() {
		return this.code || '~me';
	},

	getName: function() {
		return (this.code == '~me' || this.code == undefined) ? '' : this.name;
	},

	getType: function() {
		return this.type || 'user';
	},

	getUserSuffix: function() {
		if(this.type == 'user' || this.type == 'student' || this.type == 'employee')
			return this.getUser();
		if(this.type == 'group')
			return 'g' + this.getUser();
		if(this.type == 'dept')
			return 'd' + this.getUser();
		return 'l' + this.getUser();
	},

	getInstitution: function() {
		return this.institution;
	},

	getAccessToken: function() {
		return this.accessToken;
	},

	getTokenAttributes: function() {
		return this.tokenAttributes;
	},

	getUserAttributes: function() {
		return this.userAttributes;
	},

	needsTokenUpgrade: function() {
		return this.tokenAttributes.schedule == 0;
	},

	isParentOnly: function() {
		return this.userAttributes.isFamilyMember && !this.userAttributes.isStudent && !this.userAttributes.isEmployee;
	},

	setCode: function(newCode) {
		this.code = newCode;
	},

	setName: function(newName) {
		this.name = newName;
	},

	setType: function(type) {
		this.type = type;
	},

	setInstitution: function(newInstitution) {
		this.institution = newInstitution;
	},

	setAccessToken: function(newAccessToken) {
		this.accessToken = newAccessToken;
	},

	setTokenAttributes: function(tokenAttributes) {
		this.tokenAttributes = tokenAttributes;
	},

	setUserAttributes: function(userAttributes) {
		this.userAttributes = userAttributes;
	},

	setSchoolFunctionSettings: function(schoolFunctionSettings) {
		this.schoolFunctionSettings = schoolFunctionSettings;
	},

	setSchoolFunctionTasks: function(schoolFunctionTasks) {
		this.schoolFunctionTasks = schoolFunctionTasks;
	},

	getOptions: function() {
		var ret = {
			includeProjects: false,
			projects: [],
			includeNames: true,
			refreshFirst: false
		}

		if (!this.getTokenAttributes() || !this.getTokenAttributes().effectivePermissions || !this.schoolFunctionTasks || !this.schoolFunctionSettings) {
			ret.refreshFirst = true;
			return ret;
		}


		var userType = this.getType();
		var settingName = userType == "employee" ? "employeeCanViewProjectSchedules" : "studentCanViewProjectSchedules";

		this.schoolFunctionTasks.forEach(function(task) {
			if (task.task == "viewProjectSchedules") {
				var project = task.selections.project.value;
				this.schoolFunctionSettings.forEach(function(setting) {
					if ((setting.schoolInSchoolYear == project) && setting[settingName]) {
						ret.includeProjects = true;
						ret.projects.push(project);
						ret.includeNames = ret.includeNames && ((userType == "employee") || setting["studentCanViewProjectNames"]);
					}
				});
			}
		}, this);

		ret.includeNames = ret.includeNames || (this.getPermission("readNames") >= 5);

		return ret;
	},

	getPermission: function(permissionName) {
		return this.getTokenAttributes().effectivePermissions[permissionName];
	},

	saveLogin: function(code, institution, accessToken) {
		this.setCode(code);
		this.setType('user');
		this.setName('');
		this.setInstitution(institution);
		this.setAccessToken(accessToken);
		this.persist();
	},

	logout: function() {
		navigator.splashscreen.show();
		localStorage.clear();
		localforage.clear(function() {
			NativeStorage.clear(
				function() {
					window.location.reload()
				},
				function() {
					Zermelo.UserManager.logout();
				}
			)
		});
	},

	getTitle: function() {
		var key_suffix = this.userIsSelf() ? 'self' : 'other';
		var suffix = this.userIsSelf() ? '' : this.getName();
		return Ux.locale.Manager.get('menu.schedule_' + key_suffix) + suffix;
	},

	setTitles: function() {
		var header;
		var title = this.getTitle();

		['toolbar_main', 'calendar_list_title'].forEach(function(field) {
			header = Ext.getCmp(field);
			if (header) {
				header.setTitle(title);
			} 
		});
	},

	setUser: function(newUser) {
		var newCode, newType, newName;
		// Empty input, set to self
		if(!newUser) {
			newCode = '~me';
			newType = 'user';
			newName = '';
		}
		// Old user select input sends strings and can only select users
		else if(typeof(newUser) == 'string') {
			newCode = newUser;
			newType = 'user';
			newName = newUser;
		}
		// New user select input
		else {
			if(newUser.get('type') == 'user' || newUser.get('type') == 'student' || newUser.get('type') == 'employee') {
				newCode = newUser.get('code') || '~me';
				newType = 'user';
			}
			else {
				newCode = newUser.get('remoteId');
				newType = newUser.get('type');
			}
			newName = newUser.get('firstName') || newUser.get('lastName') || newUser.get('code') || '';
		}

		if (this.code == newCode)
			return;

		this.setCode(newCode);
		this.setType(newType);
		this.setName(newName);
		this.persist();
		this.setTitles();
		Ext.getStore('Appointments').prepareData();
	},

	loadFromLocalForageOrStorage: function(callback) {
		if(localStorage.getItem('accessToken')) {
			this.fields.forEach(function(field) {
				this[field] = localStorage.getItem(field);
				localStorage.removeItem(field);
			}, this);
			this.persist();
			if(typeof callback == 'function')
				callback();
		}
		else {
			var loadResult = function(result) {
				this.fields.forEach(function (field) {
					this[field] = result[field];
				}, this);
				this.persist();
				if(typeof callback == 'function')
					callback();
			}
			loadResult = loadResult.bind(this);

			var setFromLocalForage = function(err, result) {
				if(result != null && result.accessToken != null) {
					loadResult(result)
				}
				else {
					var setFromNativeStorage = function(result) {
						loadResult(result);
					}
					setFromNativeStorage = setFromNativeStorage.bind(this);
					NativeStorage.getItem(Ext.getClassName(this), setFromNativeStorage, callback);
				}
			};
			setFromLocalForage = setFromLocalForage.bind(this);
			localforage.getItem(Ext.getClassName(this), setFromLocalForage);
		}
	},

	persist: function() {
		var toSave = {};
		this.fields.forEach(function(field) {
			toSave[field] = this[field];
		}, this);
		localforage.setItem(Ext.getClassName(this), toSave);
		NativeStorage.setItem(Ext.getClassName(this), toSave, function() {}, function() {});
	}
});