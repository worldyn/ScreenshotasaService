var page = require('webpage').create();

page.open('http://google.com', function() {
    console.log('Page Loaded');
    page.render('google.png');
    phantom.exit();
});
