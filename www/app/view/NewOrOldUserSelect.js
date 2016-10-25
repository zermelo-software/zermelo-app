Ext.define('Zermelo.view.NewOrOldUserSelect', {
extend: 'Ext.MessageBox',
	xtype: 'tokenupgrade',
	config: {
		baseCls: 'z-msgbox',
		itemCls: 'z-msgbox-item',
		showAnimation: false,
		hideAnimation: false,
		items: [
		{
			xtype: 'label',
			baseCls: 'z-msgbox-text',
			locales: {
				html: 'login.upgrade.intro_message'
			}
		},
		{
			xtype: 'button',
			cls: 'z-msgbox-button',
			itemId: 'upgrade',
			locales: {
				text: 'login.upgrade.upgrade'
			},
			ui: 'normal',
			handler: function() {
				Ext.create('Zermelo.view.TokenUpgrade').show();
				this.parent.destroy();
			}
		},
		{
			xtype: 'button',
			cls: 'z-msgbox-button',
			itemId: 'later',
			locales: {
				text: 'login.upgrade.later'
			},
			handler: function() {
				Ext.create('Zermelo.view.OldUserSelect').show();
				this.parent.destroy();
			}
		},
		{
			xtype: 'button',
			cls: 'z-msgbox-button',
			itemId: 'never',
			locales: {
				text: 'login.upgrade.never'
			},
			ui: 'normal',
			handler: function() {
				localStorage.setItem('skipTokenUpgrade', 'true');
				Ext.create('Zermelo.view.OldUserSelect').show();
				this.parent.destroy();
			}
		}]
	}
});