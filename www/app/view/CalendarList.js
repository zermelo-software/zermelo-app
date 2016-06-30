Ext.define("Zermelo.view.CalendarList", {
	xtype: 'CalendarList',
	extend: 'Ext.Container',
	windowStart: null,
	windowEnd: null,
	config: {
		layout: 'fit',
		fullscreen: true,
		items:[
			{
				xtype: 'toolbar',
				cls: 'zermelo-toolbar-week-day',
				items: [{
					// prev button
					xtype: 'button',
					iconCls: 'zermelo-prev-button-' + imageType,
					docked: 'left',
					ui: 'plain',
					handler: function () {
						Ext.getStore('Appointments').setWindow(-1);
					}
				},{
					xtype: 'button',
					ui: 'plain',
					centered: true,
					labelCls: 'zermelo-button-week-day',
					text: 'hoi'
				},{
					// next button
					xtype: 'button',
					iconCls: 'zermelo-next-button-' + imageType,
					docked: 'right',
					ui: 'plain',
					handler: function () {
						Ext.getStore('Appointments').setWindow(1);
					}
				}]
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
				flex: 1,
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
					},
				}
			}
		]
	}
});