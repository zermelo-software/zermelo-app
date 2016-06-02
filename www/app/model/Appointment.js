Ext.define('Zermelo.model.Appointment', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            {name: 'appointment_id', 		type: 'uuid'},
            {name: 'start_time', 			type: 'int'},
            {name: 'end_time', 				type: 'int'},
            {name: 'subjects', 				type: 'string'},
            {name: 'teacher', 				type: 'string'},
            {name: 'groups', 				type: 'string'},
            {name: 'locations', 			type: 'string'},
            {name: 'type', 					type: 'string'},
            {name: 'remark', 				type: 'string'},
            {name: 'valid', 				type: 'string'},
            {name: 'cancelled', 			type: 'string'},
            {name: 'modified', 				type: 'string'},
            {name: 'moved', 				type: 'string'},
            {name: 'new_appointment', 		type: 'string'},
            {name: 'original_appointment', 	type: 'int'},
            {name: 'updated_appointment', 	type: 'int'},
            {name: 'change_description', 	type: 'string'},
            {name: 'weeknumber', 			type: 'string'},
            {name: 'refreshFlag', 			type: 'bool'}
        ]
    }
});