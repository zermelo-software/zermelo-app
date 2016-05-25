Ext.define('Flickr.profile.Tablet', {
    extend: 'Ext.app.Profile',
    
    config: {
        views: ['Main'],
        controllers: ['Search']
    },
    
    isActive: function() {
        return Ext.os.is.Tablet || true;
    },
    
    launch: function() {
        Ext.create('Flickr.view.tablet.Main');
    }
});