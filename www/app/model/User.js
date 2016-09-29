Ext.define('Zermelo.model.User', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'code',
		fields: [
			{name: 'code',						type: 'auto',		isUnique: true},
			{name: 'firstName',					type: 'string'},
			{name: 'prefix', 					type: 'string'},
			{name: 'lastName', 					type: 'string'},
		]
	}
});