Ext.define('Charts.view.MultiPieSeries', {
    extend: 'Ext.Container',
    xtype: 'multipie',

    requires: [
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.chart.interactions.Rotate'
    ],

    config: {
        layout: 'fit',
        items: {
            xtype: 'polar',
            store: 'Pie',

            interactions: [
                'rotate'
            ],

            innerPadding: 5,
            series: [
                {
                    type: 'pie',
                    field: 'g1',
                    legendField: 'name',
                    radiusFactor: 50,
                    donut: 30
                },
                {
                    type: 'pie',
                    field: 'g2',
                    donut: 60,
                    showInLegend: false
                }
            ]
        }
    },
    initialize: function () {
        this.callParent();

        var me = this,
            rainbow1 = new Rainbow(),
            rainbow2 = new Rainbow(),
            colors1 = [],
            colors2 = [],
            chart, i;

        me.callParent();

        rainbow1.setSpectrum('#00261C', '#96ED89');
        rainbow1.setNumberRange(1, 10);
        rainbow2.setSpectrum('#ADD5F7', '#16193B');
        rainbow2.setNumberRange(1, 10);

        for (i = 1; i <= 10; i++) {
            colors1.push('#' + rainbow1.colourAt(i));
            colors2.push('#' + rainbow2.colourAt(i));
        }

        chart = me.chart = me.down('polar');

        chart.getSeries()[0].setColors(colors1);
        chart.getSeries()[1].setColors(colors2);

        Ext.getStore('Pie').generateData(10);
    }
});