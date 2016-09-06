Ext.define('Kitchensink.view.tablet.Main', {
    extend: 'Ext.Container',
    xtype: 'mainview',

    requires: [
        'Ext.dataview.NestedList',
        'Kitchensink.view.tablet.NavigationBar',
        'Kitchensink.view.tablet.NestedList'
    ],

    config: {
        fullscreen: true,

        layout: {
            type: 'card',
            animation: {
                type: 'slide',
                direction: 'left',
                duration: 250
            }
        },

        items: [
            {
                id: 'launchscreen',
                cls : 'card',
                scrollable: true,
                html: '<div>' +
                    '<h2>Welcome to Sencha Touch <span class="version">' + Ext.version +'</span></h2>' +
                    '<div class="feature main">' +
                    '<img src="resources/images/circle-touch.png" width="52" height="52"><p>' +
                    'Kitchen Sink is a collection of examples and features (UI Widgets and Components) offered by <a href="http://www.sencha.com/products/touch/">Sencha Touch</a>. Each example in this collection, accessible via the menu on left, contains a “View Source”, which shows how the example was created. The themes for various platforms such as iOS, Android, Windows Phone, BlackBerry, etc. can be accessed through the themes menu.' +
                    '</p></div><div class="feature"><img src="resources/images/circle-architecture.png" width="52" height="52">' +
                    '<p><a href="http://www.sencha.com/products/touch/">Sencha Touch</a> supports iOS, Android, Windows, BlackBerry, and Tizen platforms. For a complete list of supported versions for these platforms, please visit the <a href="http://www.sencha.com/products/touch/features/">Sencha Touch Features</a> page on our website.</p></div>' +
                    '<div class="feature"><img src="resources/images/circle-native.png" width="52" height="52">' +
                    '<p><a href="http://www.sencha.com/products/sencha-cmd/download">Sencha Cmd</a> is the cornerstone to build your Sencha Touch applications. From scaffolding new projects, to minifying and deploying your application to production, <a href="http://www.sencha.com/products/sencha-cmd/download">Sencha Cmd</a> provides a full set of lifecycle management features to compliment your Sencha projects. With a rich command line syntax and Ant integration, <a href="http://www.sencha.com/products/sencha-cmd/download">Sencha Cmd</a> is perfect to integrate into your build environment or use standalone for your application.</p></div>' +
                    '</div>' +
                    '<footer>Learn more at <a href="http://www.sencha.com/products/touch" target="blank">sencha.com/products/touch</a></footer>'
            },
            {
                id: 'mainNestedList',
                xtype : 'tabletnestedlist',
                useTitleAsBackText: Ext.theme.name === "Cupertino" ? true : false,
                updateTitleText: Ext.theme.name === "Cupertino" ? false : true,
                docked: 'left',
                width: 200,
                store: 'Demos'
            },
            {
                id: 'mainNavigationBar',
                xtype: 'tabletnavigationbar',
                title: 'Kitchen Sink',
                docked: 'top',
                items: Ext.theme.name === "Tizen" ?
                    [
                        {
                            xtype : 'button',
                            hidden: false,
                            align : 'right',
                            ui    : 'action',
                            action: 'toggleTheme',
                            text  : 'Toggle Theme'
                        },
                        {
                            xtype : 'button',
                            id: 'viewSourceButton',
                            hidden: true,
                            align : 'right',
                            ui    : 'action',
                            action: 'viewSource',
                            text  : 'Source'
                        }
                    ] :
                    {
                        xtype : 'button',
                        id: 'viewSourceButton',
                        hidden: true,
                        align : 'right',
                        ui    : 'action',
                        action: 'viewSource',
                        text  : 'Source'
                    }
            }
        ]
    }
});
