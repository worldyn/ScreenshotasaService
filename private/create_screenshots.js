/*
* Render Multiple URLs to an array with base64 as string with phantomjs
* Usage: phantomjs create_screenshots.js {url1} {url2} {url3} ...
* Examples:
*  phantomjs create_screenshots.js http://google.com
*  phantomjs create_screenshots.js http://google.com http://github.com
*/

"use strict";
var arrayOfUrls;
// use system to get arguments
var system = require("system");

var base64Array = [];

if(system.args.length > 1) {
    //arrayOfUrls = Array.prototype.slice.call(system.args, 1);
    arrayOfUrls = Array.prototype.slice.call(system.args, 1);
} else {
  console.log('Url addresses is required');
  phantom.exit();
}

// Params: array with urls, a callback that checks status for each url, callback that ends script
var RenderUrlsToFile = function(urls, callbackPerUrl, callbackFinal) {
    var getFilename, next, page, retrieve, urlIndex, webpage;
    urlIndex = 0;
    webpage = require("webpage");
    page = null;

    getFilename = function(url) {
        return url
            .replace(/^(http|https):\/\//, '')
            .replace(/\/$/, '') + ".png";
    };

    // Use next and retrieve recursively to add base64 string to array that will be returned
    next = function(status, url, file) {
        page.close();
        callbackPerUrl(status, url, file);
        return retrieve();
    };

    retrieve = function() {
        var url;
        if(urls.length > 0) {
            url = urls.shift();
            urlIndex++;
            page = webpage.create();

            page.viewportSize = {
                width: 800,
                height: 600
            };
            page.settings.userAgent = "Screenshot Bot";
            return page.open(url, function(status) {
                var file;
                file = getFilename(url);
                if(status === "success") {
                    return window.setTimeout((function() {
                        var base64 = page.renderBase64('PNG');
                        //console.log(base64);
                        base64Array.push(base64);
                        return next(status, url, file);
                    }), 200);
                } else {
                    return next(status, url, file);
                }
            });
        } else {
            return callbackFinal();
        }
    };
    return retrieve();
};

// Call render function
RenderUrlsToFile(arrayOfUrls, (function(status, url, file) {
  if(status !== "success") {
    return console.log("Unable to render '" + url + "'");
  }
}), function() {
  console.log(JSON.stringify(base64Array));
  return phantom.exit();
});
