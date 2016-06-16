Ext.define('Zermelo.UserManager', {
    alternateClassName: 'UserManager',
    requires: ['Ux.locale.Manager'],
    singleton: true,
    code: window.localStorage.getItem('user_code') ? window.localStorage.getItem('user_code') : '~me',
    institution: window.localStorage.getItem('institution'),
    accessToken: window.localStorage.getItem('accessToken'),
    userChanged: false,

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
		window.localStorage.setItem('user_code', newCode);
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
    },

    setTitles: function() {
    	var header;
        var key_suffix = this.userIsSelf() ? 'self' : 'other';
        var suffix = this.userIsSelf() ? '' : this.getUser();

    	header = Ext.getCmp("toolbar_main");
        if (header) {
            header.setTitle(Ux.locale.Manager.get('menu.schedule_' + key_suffix) + suffix);
        }

    	header = Ext.getCmp("toolbar_day_back");
    	if (header) {
    		header.setTitle(Ux.locale.Manager.get('menu.schedule_' + key_suffix) + suffix);
        }
    },

    setUser: function(newCode) {
        if(!newCode)
            newCode = '~me';
    	if (this.code == newCode)
    		return;

        this.userChanged = true;
    	this.setCode(newCode);
        Ext.getStore('Appointments').changeUser(newCode);
    	this.setTitles();
    },

    getScheduleTitle: function() {
        return Ux.locale.Manager.get('menu.schedule_self');
    }
});