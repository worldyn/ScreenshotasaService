/*
* OLD SCRIPT, LOOK AT CREATE_SCREENSHOTS.JS
*
* Return a base64 (png) as a string from a URL screenshot (png)
* Usage: phantomjs create_screenshots.js {url}
*
* Example:
*  phantomjs create_screenshot.js http://example.com
*/

/*"use strict";
var URL;
var system = require("system");

// Make there is a Url argument
if(system.args.length > 1) {
    URL = system.args[1].toLowerCase();
} else {
  console.log('Url address is required');
  phantom.exit();
}

var page = require("webpage").create();
page.viewportSize = {
    width: 800,
    height: 600
};
page.settings.userAgent = "Screenshot Bot";

page.open(URL, function (status) {
    if ('success' !== status) {
      console.log('Unable to load the url address!');
    } else {
      console.log(page.renderBase64('PNG'));
    }
    phantom.exit();
});*/
