Ext.define('Zermelo.UserManager', {
	alternateClassName: 'UserManager',
	requires: ['Ux.locale.Manager'],
	singleton: true,

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
		localforage.setItem('Zermelo.UserManager.code', newCode);
		this.code = newCode;
	},

	setName: function(newName) {
		localforage.setItem('Zermelo.UserManager.name', newName);
		this.name = newName;
	},

	setType: function(type) {
		localforage.setItem('Zermelo.UserManager.type', type);
		this.type = type;
	},	

	setInstitution: function(newInstitution) {
		this.institution = newInstitution;
		window.localforage.setItem('Zermelo.UserManager.institution', newInstitution);
	},

	setAccessToken: function(newAccessToken) {
		this.accessToken = newAccessToken;
		window.localforage.setItem('Zermelo.UserManager.accessToken', newAccessToken);
	},

	setTokenAttributes: function(tokenAttributes) {
		this.tokenAttributes = tokenAttributes;
		window.localforage.setItem('Zermelo.UserManager.tokenAttributes', JSON.stringify(tokenAttributes));
	},

	setUserAttributes: function(userAttributes) {
		this.userAttributes = userAttributes;
		window.localforage.setItem('Zermelo.UserManager.userAttributes', JSON.stringify(userAttributes));
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
		localforage.clear();
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
	},

	loadFromLocalForage: function() {
		var fields = ['code','name', 'type', 'institution', 'accessToken', 'tokenAttributes', 'userAttributes'];
		var setFromLocalForage = function(field) {
			var fromLocalStorage = localStorage.getItem(field);
			if(fromLocalStorage) {
				if(fromLocalStorage.startsWith('"{'))
					fromLocalStorage = JSON.parse(fromLocalStorage);

				localforage.setItem('Zermelo.UserManager.' + field, fromLocalStorage);
				localStorage.removeItem(field);
				this[field] = fromLocalStorage;
			}
			else {
                localforage.getItem('Zermelo.UserManager.' + field, function (err, result) {
                    if(result != null) {
                        Zermelo.UserManager[field] = result;
					if(field == 'accessToken')
						Ext.getCmp('main').setActiveItem(1) // Main screen instead of login screen
					if(field == 'name' || field == 'code')
						Zermelo.UserManager.setTitles();
                    }
                });
            }
		};
		fields.forEach(setFromLocalForage, this);
	}
});