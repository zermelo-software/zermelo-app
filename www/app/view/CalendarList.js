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
							this.up('CalendarList').setWindow(-1);
						}
					},{
						xtype: 'button',
						itemId: 'dateButton',
						ui: 'plain',
						centered: true,
						html: (new Date()).toLocaleDateString(Ux.locale.Manager.getLanguage(), {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}),
						labelCls: 'zermelo-button-week-day'
					},{
						// next button
						xtype: 'button',
						iconCls: 'zermelo-next-button-' + imageType,
						docked: 'right',
						ui: 'plain',
						handler: function () {
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
				itemCls: 'zermelo-calendar-list-item',
				selectedCls: 'zermelo-menu-list-item-select',
				itemTpl: new Ext.XTemplate(
					'<div class="{[this.getClass(values)]} fc-event fc-event-vert fc-event-content z-calendar-list-parent">',
						'<div class="z-calendar-list-number">',
							'{startTimeSlot}',
						'</div>',
						'<div style="display: table-cell;">',
							'<span class="z-calender-list-left">',
								'<b>{subjects}</b>',
							'</span>',
							'<span class="z-calender-list-right">',
								'{start:date("H:i")} - {end:date("H:i")}',
							'</span>',
							'<div>',
								'<span class="z-calender-list-left">',
									'{teachers}',
								'</span>',
								'<span class="z-calender-list-right">',
									'{groups}',
								'</span>',
							'</div>',
							'<div>',
								'<span class="z-calender-list-left">',
									'{locations}',
								'</span>',
								'<span class="z-calender-list-right">',
									
								'</span>',
							'</div>',
							'<tpl if="values.remark != \'\'">',
								'<div class="z-calendar-list-center">',
									'<i>{remark}</i>',
								'</div>',
							'</tpl>',
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
					painted: {
						fn: function() {
							localStorage.setItem('lastView', 'calendarList');
							this.getStore().setWindowDay();
						},
						options: {
							order: 'before'
						}
					},
					itemtap: function(scope, index, target, record, e, eOpts) {
						var eventDetails = record.getData();
						this.parent.getAppointmentDetailView().setAndShow(eventDetails, this.parent.parent.parent.parent);
					}
				}
			}
		]
	},

	getAppointmentDetailView: function() {
		if (!this.appointmentDetailView) {
			this.appointmentDetailView = Ext.getCmp('appointmentDetails_view');
			if (!this.appointmentDetailView) {
				this.appointmentDetailView = Ext.create('Zermelo.view.AppointmentDetails');
				Ext.Viewport.add(this.appointmentDetailView);
			}
		}
		return this.appointmentDetailView;
	},

	setWindow: function(direction) {
		var store = Ext.getStore('Appointments');
		store.setWindow(direction);
		this.down('#dateButton').setHtml(store.windowStart.toLocaleDateString(Ux.locale.Manager.getLanguage(), {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}));
	}
});