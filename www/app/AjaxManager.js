Ext.define('Zermelo.AjaxManager', {
	alternateClassName: 'AjaxManager',
	requires: ['Zermelo.UserManager', 'Zermelo.ErrorManager'],
	singleton: true,

	getUrl: function(target) {
		return (
			'https://' + 
			Zermelo.UserManager.getInstitution() + 
			'.zportal.nl/api/v3/' +
			target
		)
	},

	getParams: function() {
		return {
			current: true,
			user: Zermelo.UserManager.getUser(),
			access_token: Zermelo.UserManager.getAccessToken()
		}
	},
	
	getAnnouncementData: function(currentView) {   
	    Ext.Viewport.setMasked({
	        xtype: 'loadmask',
	        locale: {
	            message: 'loading'
	        },

	        indicator: true
	    });
	    
	    Ext.Ajax.request({
	        url: this.getUrl('announcements'),
	        params: this.getParams(),
	        method: "GET",
	        useDefaultXhrHeader: false,

	        success: function (response, opts) {
	            var decoded = Ext.JSON.decode(response.responseText).response.data;

	            var announcementStore = Ext.getStore('Announcements');
	            announcementStore.each(function(record) {
	                var stillExists = 
	                decoded.some(function(entry, index) {
	                    if (record.get('announcement_id') != entry.id)
	                        return false;

	                    record.set('start', decoded[index].start);
	                    record.set('end', decoded[index].end);
	                    record.set('title', decoded[index].title);
	                    record.set('text', decoded[index].text);    
	                    decoded.splice(index, 1);
	                    return true;
	                });

	                if (!stillExists)
	                    announcementStore.remove(record);
	                
	                record.commit();
	            });

	            decoded.forEach(function(record) {
	                announcementStore.add({
	                    announcement_id: record.id,
	                    start: record.start,
	                    end: record.end,
	                    title: record.title,
	                    text: record.text
	                });
	            });
	            Ext.Viewport.setMasked(false);
	        },
	        failure: function (response) {
	            if (response.status == 403) {
	                Zermelo.ErrorManager.showErrorBox('insufficient_permissions');
	                Zermelo.UserManager.setUser();
	            }
	            else {
	                Zermelo.ErrorManager.showErrorBox('network_error');
	            }
	            Ext.Viewport.setMasked(false);
	        }
	    });
	}
})