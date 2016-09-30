Ext.define("Zermelo.view.CalendarList", {
	xtype: 'CalendarList',
	extend: 'Ext.Container',
	config: {
		// height: '1000px',
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
						'<div class={[values.valid && !values.cancelled ? "z-calendar-list-number-valid" : "z-calendar-list-number-invalid"]}>',
							'{startTimeSlotName}',
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
									'{[this.getIcon(values)]}',
								'</span>',
							'</div>',
						'</div>',
					'</div>',
					{
						getClass: function(event) {
							if(!event.valid)
								return 'fc-event-skin-valid-false';
							if (event.cancelled)
								return 'fc-event-skin-cancelled';
							if (event.type == 'lesson')
								return 'fc-event-skin-lesson';
							if (event.type == 'exam')
								return 'fc-event-skin-exam';
							if (event.type == 'activity')
								return 'fc-event-skin-activity';
							if (event.type == 'choice')
								return 'fc-event-skin-unknown';
							if (event.type == 'unknown' || event.type == 'other')
								return 'fc-event-skin-unknown';
							return '';
						},
						compiled: true
					},
					{
						getIcon: function(event) {
							var stringHead = '<img src="resources/images/';
							var stringTail = '.' + imageType + '" class="z-calendar-list-icon"/>';

							if(event.cancelled)
								return stringHead + "cancel" + stringTail;
							if(event.moved)
								return stringHead + "move" + stringTail;
							if(event['new'])
								return stringHead + "new" + stringTail;
							if(event.modified)
								return stringHead + "edit" + stringTail;
						},
						compiled: true
					}
				),
				listeners: {
					painted: {
						fn: function() {
							localStorage.setItem('lastView', 'calendarList');
							this.getStore().setWindowDay();
							this.parent.setDateButtonText();
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

	setDateButtonText: function() {
		var formatString;
		if(Ux.locale.Manager.getLanguage() == 'nl')
			formatString = "l d F, Y";
		else
			formatString = "l, F d, Y";

		this.down('#dateButton').setHtml(Ext.Date.format(Ext.getStore('Appointments').windowStart, formatString));
	},

	setWindow: function(direction) {
		Ext.getStore('Appointments').setWindow(direction);
		this.setDateButtonText();
	}
});