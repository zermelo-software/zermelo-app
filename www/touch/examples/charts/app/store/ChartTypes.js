Ext.define('Charts.store.ChartTypes', {
    extend : 'Ext.data.Store',

    requires : [
        'Charts.model.ChartType'
    ],

    config : {
        model  : 'Charts.model.ChartType',

        data : [
            { id : 0, title : 'Bar Chart' },
            { id : 1, title : 'Bar Chart Gradient' },
            { id : 2, title : 'Finance' },
            { id : 3, title : 'Multi-Series Pie' },
            { id : 4, title : 'Pie with Label' },
            { id : 5, title : 'Pie Scroller' },
        ]
    }
});
