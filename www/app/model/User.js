Ext.define('Zermelo.model.User', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'code',						type: 'string'},
			{name: 'firstName', 				type: 'string'},
			{name: 'extendedName',				type: 'string'},
			{name: 'id',						type: 'string'},
			{name: 'name',						type: 'string'},
			{name: 'prefix', 					type: 'string'},
			{name: 'lastName', 					type: 'string'},
			{name: 'remoteId', 					type: 'string'},
			{name: 'type', 						type: 'string'}
		]
	}
});