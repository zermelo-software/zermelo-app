Ext.define('Zermelo.model.Appointment', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'appointmentInstance', 		type: 'int'},
			{name: 'cancelled', 				type: 'bool'},
			{name: 'changeDescription', 		type: 'string'},
			{name: 'created', 					type: 'int'},
			{name: 'end', 						type: 'date', dateFormat: "l, F d, Y g:i:s A"},
			{name: 'endTimeSlot', 				type: 'int'},
			{name: 'groups', 					type: 'string'},
			{name: 'lastModified', 				type: 'int'},
			{name: 'locations', 				type: 'string'},
			{name: 'modified', 					type: 'bool'},
			{name: 'moved', 					type: 'bool'},
			{name: 'new', 						type: 'bool'},
			{name: 'remark', 					type: 'string'},
			{name: 'start', 					type: 'date', dateFormat: "l, F d, Y g:i:s A"},
			{name: 'startTimeSlot', 			type: 'int'},
			{name: 'subjects', 					type: 'string'},
			{name: 'teachers', 					type: 'string'},
			{name: 'type', 						type: 'string'},
			{name: 'refreshFlag',				type: 'bool'}
		]
	}
});