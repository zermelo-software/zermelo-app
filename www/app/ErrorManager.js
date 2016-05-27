Ext.define('Zermelo.ErrorManager', {
	alternateClassName: 'ErrorManager',
	requires: ['Ux.locale.Manager', 'Ext.MessageBox'],
	singleton: true,
	
	showErrorBox: function(key) {
        Ext.Msg.show({
            // // workaround for bug in Sencha touch where messageboxes can't close due to animations
            showAnimation: false,
            hideAnimation: false,
            items: [{
                xtype: 'label',
                cls: 'zermelo-error-messagebox',
                locales: {
                    html: key 
                }
            }],
            buttons: [{
                itemId: 'ok',
                locales: {
                    text: 'ok'
                },
                ui: 'normal'
            }]
        });
    }
})