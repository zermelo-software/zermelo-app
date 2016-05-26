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

    refreshData: function() {
        deleteappointmentdatas();
        var store = Ext.getStore('AnnouncementStore');
        store.getProxy().clear();
        store.data.clear();
        store.sync();
    },

    setTitles: function() {
    	var title;

    	title = Ext.getCmp("toolbar_main");
    	if (title)
    		title.setTitle(this.getScheduleTitle());

    	title = Ext.getCmp("toolbar_day_back");
    	if (title)
    		title.setTitle(this.getScheduleTitle());

    	title = Ext.getCmp("message_title");
    	if (title)
    		title.setTitle(this.getAnnouncementsTitle());
    },

    setUser: function(newCode) {
        if(!newCode)
            newCode = '~me';
    	if (this.code == newCode)
    		return;

    	this.setCode(newCode);
    	this.refreshData();
    	this.setTitles();
        Ext.getCmp('fullCalendarView').renderFullCalendar();
    },

    getScheduleTitle: function() {
    	if (loc == 'nl')
    		return this.code == '~me' ? "Rooster" : "Rooster van " + this.code;
    	else
    		return this.code == '~me' ? "Schedule" : "Schedule for " + this.code;
    },

    getAnnouncementsTitle: function() {
    	if (loc == 'nl')
    		return this.code == '~me' ? "Mededelingen" : "Mededelingen voor " + this.code;
    	else
    		return this.code == '~me' ? "Announcements" : "Announcements for " + this.code;
    }
});