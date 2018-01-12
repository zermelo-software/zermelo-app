Ext.define('Zermelo.ErrorManager', {
	alternateClassName: 'ErrorManager',
	requires: ['Ux.locale.Manager', 'Ext.MessageBox'],
	singleton: true,

    getButton: function(key) {
	    return {
            itemId: key,
            locales: {
                text: key
            },
            ui: 'normal',
            margin: '10px'
        };
    },

    getMsgConfig: function(key) {
	    return {
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
            buttons: [this.getButton('ok')]
        };
    },
	
	showErrorBox: function(key) {
        Ext.Msg.show(this.getMsgConfig(key));
    }
})