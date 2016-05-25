Ext.define('Charts.view.piescroller.Chart', {
    extend: 'Ext.Panel',
    xtype: 'piescrollerchart',

    requires: [
        'Ext.chart.PolarChart',
        'Ext.chart.series.Pie',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.field.Select'
    ],

    config: {
        layout: 'fit',
        seriesType: 'pie'
    },

    initialize: function () {
        var me = this,
            rainbow = new Rainbow(),
            colors = [];

        rainbow.setNumberRange(1, 20);
        for (var i = 1; i <= 20; i++) {
            colors.push('#' + rainbow.colourAt(i));
        }

        me.add({
            xtype: 'polar',
            innerPadding: 10,
            store: 'PieScroller',
            animate: false,

            colors: colors,

            interactions: [
                {
                    type: 'rotate',
                    listeners: {
                        rotate: function (rotateInteraction, angle) {
                            // Update the List position
                            me.scrollToRotatedRecord(rotateInteraction.getChart().getSeries()[0].getItemForAngle(90 * Math.PI / 180 - angle).index);
                        },
                        rotationEnd: function (rotateInteraction, angle) {
                            // Snap to center of rotated item
                            if (me.lastAngle !== angle) {
                                var sprite = rotateInteraction.getChart().getSeries()[0].getItemForAngle(90 * Math.PI / 180 - angle).sprite,
                                    currentAngle = (sprite.attr.startAngle + sprite.attr.endAngle) / 2;

                                currentAngle -= (90 * Math.PI / 180);
                                rotateInteraction.rotateTo(-currentAngle);
                            }
                        }
                    }
                }
            ],

            series: [
                {
                    type: 'pie',
                    field: 'value',
                    donut: 65
                }
            ]
        });

        me.callParent();

        me.chart = me.down('polar');

        me.chart.on({
            itemtap: 'onItemTap',
            scope: me
        });

        me.centerLabel = Ext.create('Ext.Component', {
            cls: 'centered-label',
            height: 200,
            width: 200,
            renderTo: me.chart.element,
            tpl: [
                '<div class="x-centered">',
                '<div class="wheel-label-content">',
                '<div>{labelText}</div>',
                '<div class="wheel-red-font">${labelValue}</div>',
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

        me.on({
            painted: 'onPainted',
            scope: me
        });
    },

    onPainted: function(element) {
        var me = this;
        me.triangleRef = Ext.DomHelper.append(element, '<div class="outer-triangle"></div><div class="triangle"></div>', true);

        // delay the call to ensure the triangle got inserted into the DOM
        Ext.defer(function () {
            me.listRef = me.up('piescrollerpanel').down('list');

            var series = me.chart.getSeries()[0],
                sprite = series.getSprites()[0],
                currentAngle = (sprite.attr.startAngle + sprite.attr.endAngle) / 2;

            // match to bottom position
            currentAngle -= (90 * Math.PI / 180);

            me.chart.getInteractions()[0].rotateTo(-currentAngle);

            me.colorListItemRectangles();
        }, 20, me);
    },

    scrollToRotatedRecord: function (index) {
        var me = this,
            list = me.listRef,
            store = list.getStore(),
            record = store.getAt(index),
            lastIndex = me.lastIndex;

        if (lastIndex === index) {
            return;
        }
        else {
            me.lastIndex = index;
        }

        me.centerLabel.setData({
            labelText: record.get('name'),
            labelValue: record.get('value') + ',000'
        });

        list.scrollToRecord(record, false, true);
        list.select(record);
    },

    colorListItemRectangles: function () {
        var me = this,
            chart = me.chart,
            list = me.listRef,
            colors = chart.getColors(),
            i = 0;

        Ext.Array.each(list.listItems, function (item) {
            item.element.down('.coloredRectangle').setStyle({
                backgroundColor: colors[i % colors.length]
            });

            i++;
        });
    },


    onItemTap: function(series, item) {
        var sprite = item.sprite,
            currentAngle = (sprite.attr.startAngle + sprite.attr.endAngle) / 2;

        currentAngle -= (90 * Math.PI / 180);
        series.getChart().getInteractions()[0].rotateTo(-currentAngle);
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