/*
 * @class Flickr.view.Main
 * @extends Ext.Container
 *
 * The viewport is the application's shell - the parts of the UI that don't change. In the Flickr app, we only ever
 * render a single view at a time, so we use a fullscreen card layout here. The other part of the UI is the search list
 * on the left, which we add as a docked item.
 */
Ext.define('Flickr.view.Main', {
    extend: 'Ext.Container',

    requires: [
        'Flickr.view.SearchBar',
        'Flickr.view.SearchList',
        'Flickr.view.FlickrList'
    ],

    config: {
        fullscreen: true
    }
});