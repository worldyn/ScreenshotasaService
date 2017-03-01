# ScreenshotasaService

Component in a nodejs/meteor project with mongo DB and phantomjs,
a headless WebKit scriptable with JavaScript. 
The screenshots method in server/screenshot.js works by passing a string 
with urls separated by semicolons to it and returning an array of with base64:s 
encodings as strings for each url screenshot which then can be translated 
back to png-format by some script. If an url has been queried then the base64 string will 
be returned immediately from the DB, otherwise the phantoms script will be run. 

FOR THE FUTURE:

* more error handling
* concurrency instead of iterative proccesses
* message queues, for example exchange async parts
