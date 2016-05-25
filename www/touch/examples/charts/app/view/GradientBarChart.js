Ext.define('Charts.view.GradientBarChart', {
    extend: 'Ext.Panel',
    xtype: 'gradientbarchart',

    requires: [
        'Ext.chart.Chart',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category'
    ],

    config: {
        cls: 'card1',
        layout: 'fit',
        items: [
            {
                xtype: 'chart',
                store: 'Bar',
                background: 'white',
                flipXY: true,

                series: [
                    {
                        type: 'bar',
                        xField: 'name',
                        yField: ['amount'],

                        style: {
                            maxBarWidth: 50,
                            radius: 4
                        },
                        label: {
                            field: 'amount',
                            display: 'insideStart',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: 14
                        },

                        renderer: function (sprite, config, rendererData, index) {
                            var amount = rendererData.store.getAt(index).get('amount');
                            if (amount >= 750) {
                                return {
                                    //Red
                                    stroke: '#DB1A23',
                                    fillStyle: {
                                        type: 'linear',
                                        degrees: 0,
                                        stops: [
                                            {
                                                offset: 0,
                                                color: '#F09985'
                                            },
                                            {
                                                offset: 1,
                                                color: '#EB3B34'
                                            }
                                        ]
                                    }
                                };
                            }
                            else if (amount > 250) {
                                // yellow
                                return {
                                    stroke: '#BF9D37',
                                    fillStyle: {
                                        type: 'linear',
                                        degrees: 0,
                                        stops: [
                                            {
                                                offset: 0,
                                                color: '#FDDA38'
                                            },
                                            {
                                                offset: 1,
                                                color: '#E2A524'
                                            }
                                        ]
                                    }
                                };
                            }

                            // Green
                            return {
                                stroke: '#3D9D50',
                                fillStyle: {
                                    type: 'linear',
                                    degrees: 0,
                                    stops: [
                                        {
                                            offset: 0,
                                            color: '#94DA52'
                                        },
                                        {
                                            offset: 1,
                                            color: '#2FA736'
                                        }
                                    ]
                                }
                            };
                        }
                    }
                ],
                axes: [
                    {
                        type: 'category',
                        position: 'left',
                        fields: 'name',
                        label: {
                            textAlign: 'right',
                            fontSize: 16,
                            fontFamily: 'Helvetica'
                        }
                    }
                ]
            }
        ]
    }
});