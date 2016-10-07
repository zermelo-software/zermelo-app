Ext.define('Zermelo.UserManager', {
	alternateClassName: 'UserManager',
	requires: ['Ux.locale.Manager'],
	singleton: true,
	code: '~me',
	institution: window.localStorage.getItem('institution'),
	accessToken: window.localStorage.getItem('accessToken'),

	loggedIn: function() {
		return this.accessToken ? true : false;
	},

	userIsSelf: function() {
		return this.getUser() == '~me';
	},

	getUser: function() {
		return this.code;
	},

	getInstitution: function() {
		return this.institution;
	},

	getAccessToken: function() {
		return this.accessToken;
	},

	setCode: function(newCode) {
		this.code = newCode;
	},

	setOwnCode: function(code) {
		if(!code)
			return;
		this.ownCode = code;
		localStorage.setItem('ownCode', code);
	},

	getOwnCode: function() {
		return this.ownCode;
	},

	setInstitution: function(newInstitution) {
		this.institution = newInstitution;
		window.localStorage.setItem('institution', newInstitution);
	},

	setAccessToken: function(newAccessToken) {
		this.accessToken = newAccessToken;
		window.localStorage.setItem('accessToken', newAccessToken);
	},

	saveLogin: function(code, institution, accessToken) {
		this.setCode(code);
		this.setInstitution(institution);
		this.setAccessToken(accessToken);
	},

	logout: function() {
		this.setCode('');
		this.setInstitution('');
		this.setAccessToken('');
		localStorage.clear();
		// Ext.StoreManager.each(function(store) {
		// 	console.log(store);
		// 	store.clear();
		// });
		// Ext.getCmp('main').selectItem('login');
		window.location.reload();
	},

	setTitles: function() {
		// Sets the titles of the appointment views
		var header;
		var key_suffix = this.userIsSelf() ? 'self' : 'other';
		var suffix = this.userIsSelf() ? '' : this.getUser();
		var titleFields = ['toolbar_main', 'toolbar_day_back', 'calendar_list_title'];

		titleFields.forEach(function(field) {
			header = Ext.getCmp(field);
			if (header) {
				header.setTitle(Ux.locale.Manager.get('menu.schedule_' + key_suffix) + suffix);
			} 
		});
	},

	setUser: function(newCode) {
		if(!newCode)
			newCode = '~me';

		newCode = newCode.toLowerCase();

		if (this.code == newCode)
			return;

		this.setCode(newCode);
		this.setTitles();
		Ext.getStore('Appointments').changeUser();
		Ext.getCmp('fullCalendarView').refreshEvents();
	},

	getScheduleTitle: function() {
		return Ux.locale.Manager.get('menu.schedule_self');
	}
});