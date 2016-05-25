Ext.define('Ux.locale.override.st.LoadMask', {
    override : 'Ext.LoadMask',

    requires : [
        'Ux.locale.override.st.Component'
    ],

    setLocale : function(locale) {
        var me          = this,
            locales     = me.locales || me.getInitialConfig().locales,
            message     = locales.message,
            manager     = me.locale,
            defaultText = '';
            console.log(message);
        if (message) {
            if (Ext.isObject(message)) {
                defaultText = message.defaultText;
                message       = message.key;
            }

            message = manager.get(message, defaultText);

            if (Ext.isString(message)) {
                me.setMessage(message);
            }
        }

        this.callParent(arguments);
    }
});