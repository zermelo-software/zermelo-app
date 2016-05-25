/**
* The FlickrList component is a simple dataview which is used to display the
* images returned by the Flickr search. It also has a toolbar docked at the
* top which is used in phones to display a back button.
*/
Ext.define('Flickr.view.FlickrList', {
    extend: 'Ext.dataview.List',
    xtype: 'flickrlist',
    requires: [
        'Ext.plugin.PullRefresh',
        'Ext.plugin.ListPaging'
    ],

    config: {
        ui           : 'timeline',
        allowDeselect: false,
        useSimpleItems: true,
        variableHeights: true,
        infinite: true,
        emptyText: 'No images found.',

        itemTpl: [
            '<div class="flickr">',
                '<img src="{thumbnail_url}" width="48px" height="48px" />',
                '<div class="content">',
                    '<div class="title">{title}</div>',
                    '<div class="description">{description}</div>',
                '</div>',
            '</div>'
        ],

        plugins: [
            'pullrefresh',
            {
                type: 'listpaging',
                autoPaging: true
            }
        ],

        items: [
            {
                docked: 'top',
                xtype : 'toolbar',
                hidden: true,
                ui    : 'searchbar',
                items: [
                    {
                        xtype: 'button',
                        ui   : 'back',
                        text : 'Searches'
                    }
                ]
            }
        ]
    }
});
