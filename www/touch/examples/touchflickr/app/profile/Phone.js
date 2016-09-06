Ext.define('Flickr.profile.Phone', {
    extend: 'Ext.app.Profile',
    
    config: {
        views: ['Main'],
        controllers: ['Search']
    },
    
    isActive: function() {
        return Ext.os.is.Phone;
    },
    
    launch: function() {
        Ext.create('Flickr.view.phone.Main');
    }
});