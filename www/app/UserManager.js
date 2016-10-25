Ext.define('Zermelo.UserManager', {
	alternateClassName: 'UserManager',
	requires: ['Ux.locale.Manager'],
	singleton: true,
	code: window.localStorage.getItem('code'),
	name: window.localStorage.getItem('name'),
	type: window.localStorage.getItem('type'),
	institution: window.localStorage.getItem('institution'),
	accessToken: window.localStorage.getItem('accessToken'),
	permissions: JSON.parse(window.localStorage.getItem('permissions') || '{}'),

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

	getPermissions: function() {
		return this.permissions;
	},

	canViewUsers: function() {
		return this.getPermissions().readNames > 0;
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

	setPermissions: function(permissions) {
		this.permissions = permissions;
		console.log(permissions);
		window.localStorage.setItem('permissions', JSON.stringify(permissions));
	},

	saveLogin: function(code, institution, accessToken) {
		this.setCode(code);
		this.setType('user');
		this.setInstitution(institution);
		this.setAccessToken(accessToken);
	},

	logout: function() {
		localStorage.clear();
		window.location.reload();
	},

	setTitles: function() {
		// Sets the titles of the appointment views
		var header;
		var key_suffix = this.userIsSelf() ? 'self' : 'other';
		var suffix = this.userIsSelf() ? '' : this.getName();
		var titleFields = ['toolbar_main', 'toolbar_day_back', 'calendar_list_title'];

		titleFields.forEach(function(field) {
			header = Ext.getCmp(field);
			if (header) {
				header.setTitle(Ux.locale.Manager.get('menu.schedule_' + key_suffix) + suffix);
			} 
		});
	},

	setUser: function(newUser) {
		var newCode, newType;
		if(!newUser)
			newUser = Ext.create('Zermelo.model.User', {firstName: '', lastName: '', prefix: 'Eigen rooster', code: '', type: 'user'});
		if(newUser.get('type') == 'user') {
			newCode = newUser.get('code') || '~me';
			newType = 'user';
		}
		else {
			newCode = newUser.get('remoteId');
			newType = newUser.get('type');
		}
		newName = newUser.get('firstName') || newUser.get('lastName') || newUser.get('code') || '';

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