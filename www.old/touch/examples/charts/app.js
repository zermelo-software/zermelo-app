//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

Ext.application({
    name: 'Charts',

    startupImage: {
        '320x460': 'resources/startup/Default.jpg', // Non-retina iPhone, iPod touch, and all Android devices
        '640x920': 'resources/startup/640x920.png', // Retina iPhone and iPod touch
        '640x1096': 'resources/startup/640x1096.png', // iPhone 5 and iPod touch (fifth generation)
        '768x1004': 'resources/startup/768x1004.png', //  Non-retina iPad (first and second generation) in portrait orientation
        '748x1024': 'resources/startup/748x1024.png', //  Non-retina iPad (first and second generation) in landscape orientation
        '1536x2008': 'resources/startup/1536x2008.png', // : Retina iPad (third generation) in portrait orientation
        '1496x2048': 'resources/startup/1496x2048.png' // : Retina iPad (third generation) in landscape orientation
    },

    isIconPrecomposed: false,
    icon: {
        57: 'resources/icons/icon.png',
        72: 'resources/icons/icon@72.png',
        114: 'resources/icons/icon@2x.png',
        144: 'resources/icons/icon@144.png'
    },

    requires: [
        'Ext.data.Store',
        'Ext.dataview.List',
        'Ext.Toolbar'
    ],

    views: [
        'Finance',
        'BarChart',
        'GradientBarChart',
        'MultiPieSeries',
        'PieWithLabel',
        'piescroller.Panel'
    ],

    stores: [
        'Finance',
        'ChartTypes',
        'Pie',
        'PieScroller',
        'PieLabel',
        'Bar'
    ],

    launch: function () {
        Ext.Viewport.add({
            xtype: 'container',
            layout: 'hbox',
            items: [
                {
                    xtype: 'toolbar',
                    docked: 'top',
                    title: 'Sencha Touch Charting Examples'
                },
                {
                    xtype: 'list',
                    width: 250,
                    scrollable: false,
                    itemTpl: '{title}',
                    store: 'ChartTypes',
                    lastSelected: 0,
                    listeners: {
                        painted: function (element) {
                            Ext.getCmp(element.getId()).select(0);
                        },
                        select: function (list, record) {
                            var container = Ext.ComponentQuery.query('#chartCardContainer')[0];
                            container.setActiveItem(record.get('id'));
                        }
                    }

                },
                {
                    xtype: 'container',
                    itemId: 'chartCardContainer',
                    flex: 1,
                    layout: 'card',
                    items: [
                        {
                            xtype: 'barchart'
                        },
                        {
                            xtype: 'gradientbarchart'
                        },
                        {
                            xtype: 'finance'
                        },
                        {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [{
                                flex: 1
                            }, {
                                flex: 2,
                                xtype: 'multipie'
                            }, {
                                flex: 1
                            }]
                        },
                        {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [{
                                flex: 1
                            }, {
                                flex: 2,
                                xtype: 'piewithlabel'
                            }, {
                                flex: 1
                            }]
                        },
                        {
                            layout: {
                                type: 'hbox',
                                align: 'stretch'
                            },
                            items: [{
                                flex: 1
                            }, {
                                flex: 2,
                                xtype: 'piescrollerpanel'
                            }, {
                                flex: 1
                            }]
                        }
                    ]
                }
            ]
        });
    }
});
