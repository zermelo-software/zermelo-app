Ext.define('Zermelo.store.AppointmentStore', {
	id: 'appointment_store',
	extend: 'Ext.data.Store',
	requires: ['Ext.data.proxy.LocalStorage'],
	uses: 'Zermelo.model.Appointment',
	config: {
		model: 'Zermelo.model.Appointment',
		autoload: true,
		proxy: {
			type: 'localstorage',
			id: 'appointment_store'
		}
	}
});