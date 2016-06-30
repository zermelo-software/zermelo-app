Ext.define("Zermelo.view.CalendarList", {
	xtype: 'CalendarList',
	extend: 'Ext.Container',
	config: {
		layout: 'fit',
		fullscreen: true,
		items:[
			{
				xtype: 'toolbar',
				cls: 'zermelo-toolbar-week-day',
				docked: 'top',
				items: [
					{
						// prev button
						xtype: 'button',
						iconCls: 'zermelo-prev-button-' + imageType,
						docked: 'left',
						ui: 'plain',
						handler: function () {
							console.log(this.up('CalendarList'));
							this.up('CalendarList').setWindow(-1);
						}
					},{
						xtype: 'button',
						itemId: 'dateButton',
						ui: 'plain',
						centered: true,
						html: (new Date()).toDateString(),
						labelCls: 'zermelo-button-week-day'
					},{
						// next button
						xtype: 'button',
						iconCls: 'zermelo-next-button-' + imageType,
						docked: 'right',
						ui: 'plain',
						handler: function () {
							console.log(this.up('CalendarList'));
							this.up('CalendarList').setWindow(1);
						}
					}
				]
			},{
				xtype: 'list',
				layout: 'fit',
				itemId: 'calendarList',
				store: 'Appointments',
				cls: 'zermelo-calendar-list',
				// css class resources/css/app.css list items
				itemCls: 'zermelo-calendar-list-item',
				// css class resources/css/app.css selected items
				selectedCls: 'zermelo-menu-list-item-select',
				useSimpleItems: true,
				padding: 0,
				height: 'auto',
				// flex: 1,
				grouped: false,
				itemTpl: new Ext.XTemplate(
					'<div class={[this.getClass(values)]}>',
						'<div>',
							'<b>{subjects}</b> {teachers}',
						'</div>',
						'<div>',
							'{start:date("H:i")} - {end:date("H:i")}',
						'</div>',
					'</div>',
					{
						getClass: function(event) {
							if (event.type == 'lesson')
								return ('fc-event-skin-lesson ');
							if (event.type == 'exam')
								return ('fc-event-skin-exam ');
							if (event.type == 'activity')
								return ('fc-event-skin-activity ');
							if (event.type == 'choice')
								return ('fc-event-skin-unknown ');
							if (event.type == 'unknown' || event.type == 'other')
								return ('fc-event-skin-unknown ');
							return '';
						},
						compiled: true
					}
				),
				listeners: {
					painted: function() {
						this.getStore().setWindow(0);
					}
				}
			}
		]
	},

	setWindow: function(direction) {
		var store = Ext.getStore('Appointments');
		store.setWindow(direction);
		this.down('#dateButton').setHtml(store.windowStart.toDateString());
	}
});