Ext.define('Zermelo.UserManager', {
	alternateClassName: 'UserManager',
	requires: ['Ux.locale.Manager'],
	singleton: true,
	code: window.localStorage.getItem('code') || '~me',
	name: window.localStorage.getItem('name'),
	type: window.localStorage.getItem('type'),
	institution: window.localStorage.getItem('institution'),
	accessToken: window.localStorage.getItem('accessToken'),
	tokenAttributes: JSON.parse(window.localStorage.getItem('tokenAttributes') || '{}'),
	userAttributes: JSON.parse(window.localStorage.getItem('userAttributes') || '{}'),

	loggedIn: function() {
		return this.accessToken ? true : false;
	},

	userIsSelf: function() {
		return this.getUser() == '~me';
	},

	getUser: function() {
		return this.code;
	},

	getName: function() {
		return this.name;
	},

	getType: function() {
		return this.type;
	},

	getUserSuffix: function() {
		if(this.type == 'user')
			return this.getUser();
		if(this.type == 'group')
			return 'g' + this.getUser();
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
		if (this.tokenAttributes.schedule >= 1)
			return false;

		// Parents only need to be able to read info for their children, everyone else needs to be able to read everything
		if(this.isParentOnly()) {
			return !this.tokenAttributes.effectivePermissions ||
				this.tokenAttributes.effectivePermissions.readScheduleStudents < 2 ||
				this.tokenAttributes.effectivePermissions.readScheduleTeachers < 2 ||
				this.tokenAttributes.effectivePermissions.readScheduleGroups < 2 ||
				this.tokenAttributes.effectivePermissions.readScheduleLocations < 2;
		}
		else {
			return !this.tokenAttributes.effectivePermissions ||
				this.tokenAttributes.effectivePermissions.readNames < 5 ||
				this.tokenAttributes.effectivePermissions.readScheduleStudents < 5 ||
				this.tokenAttributes.effectivePermissions.readScheduleTeachers < 5 ||
				this.tokenAttributes.effectivePermissions.readScheduleGroups < 5 ||
				this.tokenAttributes.effectivePermissions.readScheduleLocations < 5;
		}
	},

	isParentOnly: function() {
		return this.userAttributes.isFamilyMember && !this.userAttributes.isStudent && !this.userAttributes.isEmployee;
	},

	setCode: function(newCode) {
		localStorage.setItem('code', newCode);
		this.code = newCode;
	},

	setName: function(newName) {
		localStorage.setItem('name', newName);
		this.name = newName;
	},

	setType: function(type) {
		localStorage.setItem('type', type);
		this.type = type;
	},	

	setInstitution: function(newInstitution) {
		this.institution = newInstitution;
		window.localStorage.setItem('institution', newInstitution);
	},

	setAccessToken: function(newAccessToken) {
		this.accessToken = newAccessToken;
		window.localStorage.setItem('accessToken', newAccessToken);
	},

	setTokenAttributes: function(tokenAttributes) {
		this.tokenAttributes = tokenAttributes;
		console.log(tokenAttributes);
		window.localStorage.setItem('tokenAttributes', JSON.stringify(tokenAttributes));
	},

	setUserAttributes: function(userAttributes) {
		this.userAttributes = userAttributes;
		console.log(userAttributes);
		window.localStorage.setItem('userAttributes', JSON.stringify(userAttributes));
	},

	saveLogin: function(code, institution, accessToken) {
		this.setCode(code);
		this.setType('user');
		this.setInstitution(institution);
		this.setAccessToken(accessToken);
	},

	logout: function() {
		navigator.splashscreen.show();
		localStorage.clear();
		window.location.reload();
	},

	getTitle: function() {
		var key_suffix = this.userIsSelf() ? 'self' : 'other';
		var suffix = this.userIsSelf() ? '' : this.getName();
		return Ux.locale.Manager.get('menu.schedule_' + key_suffix) + suffix;
	},

	setTitles: function() {
		var header;
		var key_suffix = this.userIsSelf() ? 'self' : 'other';
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
			if(newUser.get('type') == 'user') {
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
		this.setTitles();
		Ext.getStore('Appointments').prepareData();
	},

	getScheduleTitle: function() {
		return Ux.locale.Manager.get('menu.schedule_self');
	}
});