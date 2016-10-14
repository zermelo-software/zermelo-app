Ext.define('Zermelo.model.User', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{name: 'branchOfSchool',			type: 'string'},
			{name: 'code',						type: 'string'},
			{name: 'firstName', 				type: 'string'},
			{name: 'departmentOfBranch',		type: 'string'},
			{name: 'extendedName',				type: 'string'},
			{name: 'id',						type: 'string'},
			{name: 'name',						type: 'string'},
			{name: 'prefix', 					type: 'string'},
			{name: 'lastName', 					type: 'string'},
			{name: 'remoteId', 					type: 'string'},
			{name: 'type', 						type: 'string'}
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