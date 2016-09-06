Ext.define('Charts.view.piescroller.Panel', {
    extend: 'Ext.Panel',
    xtype: 'piescrollerpanel',

    requires: [
        'Charts.view.piescroller.Chart'
    ],

    config: {
        layout: 'vbox',
        align: 'stretch',
        cls: 'piescrollerpanel',
        style: 'border-left: 2px solid black; border-right: 2px solid black;',

        items: [
            {
                xtype: 'piescrollerchart',
                flex: 1
            },
            {
                xtype: 'list',
                flex: 1,
                store: 'PieScroller',

                itemTpl: [
                    '<div class= "coloredRectangle"></div>',
                    '<div style="margin-left: 40px;">{name}',
                        '<div class="myListValue">${value},000</div>',
                    '</div>'
                ],

                listeners: {
                    itemtap: function (list, index) {
                        var chart = this.up('piescrollerpanel').down('polar'),
                            series = chart.getSeries()[0],
                            sprite = series.getSprites()[index],
                            currentAngle = (sprite.attr.startAngle + sprite.attr.endAngle) / 2;

                        // match to bottom position
                        currentAngle -= (90 * Math.PI / 180);

                        chart.getInteractions()[0].rotateTo(-currentAngle);
                    }
                }
            }
        ]
    }
});