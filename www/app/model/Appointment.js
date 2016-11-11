Ext.define('Zermelo.model.Appointment', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'allDay',					type: 'bool'},
			{name: 'appointmentInstance',		type: 'int'},
			{name: 'cancelled', 				type: 'bool'},
			{name: 'changeDescription', 		type: 'string'},
			{name: 'collidingIds',				type: 'auto'},		// type: array
			{name: 'created', 					type: 'int'},
			{name: 'end', 						type: 'date', dateFormat: "l, F d, Y g:i:s A"},
			{name: 'endTimeSlot', 				type: 'int'},
			{name: 'endTimeSlotName', 			type: 'string'},
			{name: 'groups', 					type: 'string'},
			{name: 'id',						type: 'auto',		isUnique: true},
			{name: 'lastModified', 				type: 'int'},
			{name: 'locations', 				type: 'string'},
			{name: 'modified', 					type: 'bool'},
			{name: 'moved', 					type: 'bool'},
			{name: 'new', 						type: 'bool'},
			{name: 'refreshFlag',				type: 'bool'},
			{name: 'remark', 					type: 'string'},
			{name: 'start', 					type: 'date', dateFormat: "l, F d, Y g:i:s A"},
			{name: 'startTimeSlot', 			type: 'int'},
			{name: 'startTimeSlotName',			type: 'string'},
			{name: 'subjects', 					type: 'string'},
			{name: 'teachers', 					type: 'string'},
			{name: 'type', 						type: 'string'},
			{name: 'user',						type: 'string'},
			{name: 'valid', 					type: 'bool'},
			{name: 'validCollisionCount',		type: 'int'}
		]
	}
});