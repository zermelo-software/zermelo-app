Ext.define('Zermelo.AjaxManager', {
	alternateClassName: 'AjaxManager',
	requires: ['Zermelo.UserManager', 'Zermelo.ErrorManager'],
	singleton: true,

	getUrl: function(target) {
		return (
			'https://' + 
			Zermelo.UserManager.getInstitution() + 
			'.zportal.nl/api/v3/' +
			target +
			'?current=true&user=' + 
			Zermelo.UserManager.getUser() + 
			'&access_token=' + 
			Zermelo.UserManager.getAccessToken()
		);
	},
	
	getAnnouncementData: function(thisObj) {   
	    Ext.Viewport.setMasked({
	        xtype: 'loadmask',
	        locale: {
	            message: 'loading'
	        },

	        indicator: true
	        });
	    
	    // thisObj.hide();
	    console.log(this.getUrl('announcements'));
	    // send request to server using ajax with http GET
	    Ext.Ajax.request({
	        url: this.getUrl('announcements'),
	        method: "GET",
	        useDefaultXhrHeader: false,

	        success: function (response) {
	            var decoded = Ext.JSON.decode(response.responseText).response.data;

	            var announcementStore = Ext.getStore('Announcements');
	            announcementStore.each(function(record) {
	                var stillExists = 
	                decoded.some(function(entry, index) {
	                    if (record.announcement_id != entry.id)
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
	            announcementStore.sync();

	            console.log(decoded);
	            decoded.forEach(function(record) {
	                announcementStore.add({
	                    announcement_id: record.id,
	                    start: record.start,
	                    end: record.end,
	                    title: record.title,
	                    text: record.text
	                });
	            });
	            announcementStore.sync();
	            // loading screen disappear
	            Ext.Viewport.setMasked(false);
	            thisObj.show();
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
	            thisObj.show();
	        }
	    });
	}
})