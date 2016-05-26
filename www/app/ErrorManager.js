Ext.define('Zermelo.ErrorManager', {
	alternateClassName: 'ErrorManager',
	requires: ['Ux.locale.Manager', 'Ext.MessageBox'],
	singleton: true,
	messageBox: Ext.create('Ext.MessageBox', 
	{
		// // workaround for bug in Sencha touch where messageboxes can't close due to animations
		showAnimation: false,
		items: [{
			xtype: 'label',
			cls: 'zermelo-error-messagebox'
		}],
		buttons: [{
			itemId: 'ok',
			text: 'OK',
			ui: 'normal',
			handler: function() {
				this.parent.parent.hide();
			}
		}]
	}),

	showErrorBox: function(key) {
		// hacky workaround
		Ext.defer(function() {
			this.messageBox.setMessage(Ux.locale.Manager.get(key));
			this.messageBox.show();
		}, 100, this);
	}
})