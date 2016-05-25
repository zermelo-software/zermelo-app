Ext.define('Charts.view.PieWithLabel', {
    extend: 'Ext.Container',
    xtype: 'piewithlabel',

    requires: [
        'Ext.chart.PolarChart'
    ],

    config: {
        layout: 'fit',
        items: [
            {
                xtype: 'polar',
                store: 'PieLabel',
                innerPadding: 10,
                series: [
                    {
                        type: 'pie',
                        field: 'amount',
                        donut: 75,
                        showInLegend: false,
                        style: {
                            stroke: '#AAA',
                            miterLimit: 10,
                            lineCap: 'miter',
                            lineWidth: 5
                        }
                    }
                ]
            }
        ]
    },

    initialize: function () {
        var me = this,
            rainbow = new Rainbow(),
            colors = [],
            chart, i, record;

        me.callParent();

        rainbow.setSpectrum('#E2A524', '#EB3B34');
        rainbow.setNumberRange(1, 10);

        for (i = 1; i <= 10; i++) {
            colors.push('#' + rainbow.colourAt(i));
        }

        chart = me.chart = me.down('polar');

        chart.setColors(colors);

        chart.on({
            itemtap: 'onItemTap',
            scope: me
        });

        me.centerLabel = Ext.create('Ext.Component', {
            cls: 'centered-label',
            height: 200,
            width: 200,
            renderTo: me.element,
            tpl: [
                '<div class="x-centered">',
                '<div class="centered-label-content">',
                '<div>{labelText}</div>',
                '<div class="red-font">${labelValue}</div>',
                '</div>',
                '</div>'
            ],
            listeners: {
                painted: function () {
                    this.updateCenteredLabelPosition();
                },
                scope: me
            }
        });

        record = chart.getStore().getAt(1);
        me.centerLabel.setData({
            labelText: record.get('name'),
            labelValue: record.get('amount') + ',000'
        });

        me.on('resize', me.updateCenteredLabelPosition, me);
    },

    onItemTap: function(series, item) {
        var record = item.record;
        this.centerLabel.setData({
            labelText: record.get('name'),
            labelValue: record.get('amount') + ',000'
        });
    },

    updateCenteredLabelPosition: function () {
        var me = this,
            centerLabel = me.centerLabel,
            center = me.getChartCenter(),
            top = center.y - Math.round(centerLabel.getHeight() / 2),
            left = center.x - Math.round(centerLabel.getWidth() / 2);

        centerLabel.setStyle({
            top: top + 'px',
            left: left + 'px'
        });
    },

    getChartCenter: function () {
        var me = this,
            chart = me.chart,
            series = chart.getSeries()[0],
            x = Math.round(me.renderElement.getWidth() / 2),
            y = Math.round(me.renderElement.getHeight() / 2),
            originalX = x + series.getOffsetX(),
            originalY = y + series.getOffsetY();

        return {
            x: originalX,
            y: originalY
        };
    },

    destroy: function () {
        this.centerLabel.destroy();

        this.callParent(arguments);
    }
});