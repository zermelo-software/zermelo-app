Ext.define('Ux.locale.override.st.Msgbox', {
    override : 'Ext.MessageBox',

    requires : [
        'Ux.locale.override.st.Component'
    ],

    setLocale : function(locale) {
        var me          = this,
            locales     = me.locales || me.getInitialConfig().locales,
            title       = locales.title,
            message     = locales.message,
            manager     = me.locale,
            defaultText = '';
        if (title) {
			console.log(title);
            if (Ext.isObject(title)) {
                defaultText = title.defaultText;
                title       = title.key;
            }

            title = manager.get(title, defaultText);

            if (Ext.isString(title)) {
                me.setTitle(title);
            }
        }
        if(message){
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