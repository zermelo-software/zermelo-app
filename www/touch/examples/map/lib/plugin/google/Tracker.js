Ext.ns('Ext.plugin.google');

Ext.define('Ext.plugin.google.Tracker', {
    extend: 'Ext.util.GeoLocation',
    alias : 'plugin.gmaptracker',

    config: {
        marker: null,

        host: null,

        trackSuspended: null
    },

    /**
     * Initialize the plugin, binding to the host Ext.Map instance
     * @param {Ext.Map} host
     */
    init : function(host) {
        if (host && host.isMap === true) {
            this.setHost(host);
            if(!this.getTrackSuspended()) {
                host.setGeo(this);
            }
        }
    },

    applyTrackSuspended: function(config) {
        var value = Boolean(config),
            host = this.getHost();

        if(!value && host && host.getGeo() !== this){
            host.setGeo(this);
        }
        return value;
    },

    updateTrackSuspended: function(trackSuspended) {
        if (trackSuspended) {
            this.un('locationupdate', this.updateTrack, this);
            this.setAutoUpdate(null);
        }
        else {
            this.on('locationupdate', this.updateTrack, this);
            this.setAutoUpdate(true);
        }
    },

    // @private
    updateTrack: function() {
        if (this.getTrackSuspended()) {
            return;
        }

        var gm = (window.google || {}).maps,
            marker = this.getMarker();

        if (gm && marker) {
            marker.setMap(this.getHost().getMap());
            marker.setPosition(new gm.LatLng(this.getLatitude(), this.getLongitude()));
        }
    },

    suspendUpdates: function() {
        this.setTrackSuspended(true);
    },

    resumeUpdates: function() {
        this.setTrackSuspended(false);
    }
});
