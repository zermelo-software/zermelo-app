Ext.define('Charts.model.PieScroller', {
    extend : 'Ext.data.Model',

    config : {
        fields : [
            { name : 'id',     type : 'int' },
            { name : 'color1', type : 'string' },
            { name : 'color2', type : 'string' },
            { name : 'color3', type : 'string' },
            { name : 'color4', type : 'string' },
            { name : 'name',   type : 'string' },
            { name : 'value',  type : 'int' }
        ]
    }
});