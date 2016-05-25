Ext.define('Charts.view.Finance', {
    extend: 'Ext.Container',
    xtype: 'finance',

    requires: [
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie'
    ],

    config: {
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [
            {
                flex: 1,
                id: 'leagueCmp',
                xtype: 'component',
                style: 'padding-left: 10px;',
                html: '<div class="finance-header">My Cash</div>' +
                    '<div class="finance-detail">Spending Last 30 Days</div>'
            },
            {
                flex: 1,
                height: '50%',
                xtype: 'polar',
                store: 'Finance',

                innerPadding: 5,
                colors: [
                    "rgba(37, 231, 78, 1)",
                    "rgba(38, 230, 166, 1)",
                    "rgba(49, 219, 230, 1)",
                    "rgba(75, 199, 242, 1)",
                    "rgba(28, 165, 252, 1)",
                    "rgba(25, 155, 225, 1)",
                    "rgba(19, 117, 231, 1)"
                ],
                series: [
                    {
                        type: 'pie',
                        field: 'pct'
                    }
                ]
            },
            {
                flex: 2,
                xtype: 'list',
                store: 'Finance',
                itemTpl: [
                    '<div class= "coloredRectangle"></div>',
                    '<div style="margin-left: 40px;">{catagory}',
                        '<div class="finance-value">{amount}</div><div class="finance-pct">{pct}%</div>',
                    '</div>'
                ]
            }
        ]
    },

    initialize: function() {
        this.callParent();

        this.chart = this.down('polar');
        this.list = this.down('list');

        this.on({
            painted: 'colorListItemRectangles',
            scope: this
        });
    },

    colorListItemRectangles: function () {
        var me = this,
            chart = me.chart,
            list = me.list,
            colors = chart.getColors(),
            i = 0;

        Ext.Array.each(list.listItems, function (item) {
            item.element.down('.coloredRectangle').setStyle({
                backgroundColor: colors[i % colors.length]
            });

            i++;
        });
    }
});