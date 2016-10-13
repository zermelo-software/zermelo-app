Ext.define('Zermelo.model.User', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'code',						type: 'auto',		isUnique: true},
			{name: 'firstName', 				type: 'string'},
			{name: 'id',						type: 'string'},
			{name: 'prefix', 					type: 'string'},
			{name: 'lastName', 					type: 'string'}
		]
	},

	getType: function() {
		if(this.get('lastName') || this.get('code') == '')
			return 'user';
		else if(this.get('id').toString().startsWith('ext'))
			return 'location';
		else
			return 'group';
	}
});