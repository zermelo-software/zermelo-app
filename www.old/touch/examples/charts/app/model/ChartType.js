Ext.define('Charts.model.ChartType', {
    extend : 'Ext.data.Model',
    config : {
        fields : [
            { name : 'id',    type : 'int' },
            { name : 'title', type : 'string' }
        ]
    }
});