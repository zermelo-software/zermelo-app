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
        newCode = newCode ? newCode : '~me';
    	if (this.code == newCode)
    		return;

    	this.setCode(newCode);
    	this.refreshData();
    	this.setTitles();
        Ext.getCmp('fullCalendarView').renderFullCalendar();
    },

    getScheduleTitle: function() {
        var ret = (this.code == '~me' && Ux.locale.Manager.isLoaded()) ?
                Ux.locale.Manager.get('menu.schedule_self') : 
                Ux.locale.Manager.get('menu.schedule_other') + this.code;
        console.log('return: ', ret);
        return ret;
    },

    getAnnouncementsTitle: function() {
        var ret = (this.code == '~me' && Ux.locale.Manager.isLoaded()) ? 
                Ux.locale.Manager.get('menu.announcement_self') : 
                Ux.locale.Manager.get('menu.announcement_other') + this.code;
        console.log('return: ', ret);
        return ret;
    }
});