cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.statusbar/www/statusbar.js",
        "id": "org.apache.cordova.statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.hidden-statusbar-overlay/www/hidden-statusbar-overlay.js",
        "id": "de.appplant.cordova.plugin.hidden-statusbar-overlay.HiddenStatusbarOverlay",
        "clobbers": [
            "plugin.statusbarOverlay"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.1-dev",
    "org.apache.cordova.statusbar": "0.1.10",
    "de.appplant.cordova.plugin.hidden-statusbar-overlay": "1.2.0"
}
// BOTTOM OF METADATA
});