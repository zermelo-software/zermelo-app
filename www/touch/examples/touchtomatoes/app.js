//<debug>
Ext.Loader.setPath({
    'Ext': '../../src'
});
//</debug>

Ext.application({
    name: 'TouchTomatoes',

    requires: ['Ext.device.Storage','Ext.Menu', 'TouchTomatoes.components.MenuButton'],
    controllers: ['TouchTomatoes.controller.Main'],
    views: ['TouchTomatoes.view.Main', 'TouchTomatoes.view.WelcomeOverlay'],

    launch: function() {
        Ext.getBody().removeCls('loading');
        Ext.create('TouchTomatoes.view.Main');

        if (Ext.device.Storage.getItem('isFirstTime') !== "false") {
            Ext.device.Storage.setItem('isFirstTime', false);

            var overlay = Ext.create('TouchTomatoes.view.WelcomeOverlay');
            Ext.Viewport.add(overlay);
            overlay.show();
        }

        var menu = Ext.create("Ext.Menu", {
            defaults: {
                xtype: "menubutton"
            },
            width: '80%',
            scrollable: 'vertical',
            items: [
                {
                    text: 'Opening',
                    iconCls: 'time',
                    menu:"opening"
                },
                {
                    text: 'Theatres',
                    iconCls: 'locate',
                    menu: "theatres"
                },
                {
                    text: 'Upcoming',
                    iconCls: 'team',
                    menu:"upcoming"
                },
                {
                    text: 'Top',
                    iconCls: 'bank',
                    menu:'top'
                },
                {
                    text: 'Search',
                    iconCls: 'search',
                    menu:"search"
                }
            ]
        });

        Ext.Viewport.setMenu(menu, {
            side: 'left',
            reveal: true
        });
    }
});

