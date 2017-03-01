import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Use futures to wait for the async parts
Future = Npm.require('fibers/future');


/**
* Mongo Collection. Documents look like this:
* {
* url: "http://example.com",
* base64: "somebase64tostring"
* }
*/
export const Queries = new Mongo.Collection('queries');

if (Meteor.isServer) {
  Meteor.methods({
    /**
    * Get an array with base64 as strings for each url
    * Returns a result immediately from DB if the query already has been used
    * @param urls: a string with urls separated by semicolon, e.g 'http://google.com;http://github.com'
    * @return array
    */
    screenshots: function(urls) {

      // Wait for async code to run
      var fut = new Future();

      // Validate argument
      check(urls, String);

      // Split urls to an array
      var urlArray = urls.split(";");

      // holds all urls that is not in the db
      var notInQueryArray = [];

      // base64 values for all images that will be returned
      var base64Array = [];

      // Check which queries that already have been used
      for(var i = 0; i < urlArray.length; i++) {
        var queryInDB = Queries.findOne({ url: urlArray[i] });

        if(queryInDB == undefined || queryInDB == null) {
          console.log("not in DB");
          notInQueryArray.push(urlArray[i]);
        } else {
          console.log("IN db");
          base64Array.push(queryInDB.base64);
        }
      }

      // Check if we have to render any images
      var len = notInQueryArray.length;

      if(len > 0) {
        var infoObject = {
          pathFromBase: '/server/assets/app/',
          urlArr: notInQueryArray
        }

        Meteor.call('renderBase64', infoObject, function(error, results) {
          if(error) {
            console.log(error);
          } else {
            // Insert each to DB and return array

            var returnedArr = JSON.parse(results.toString());

            for(var i = 0; i < returnedArr.length; i++) {
              base64Array.push(returnedArr[i]);
              //length of notInQueryArray and returnedArray will be the same
              Queries.insert({
                url: notInQueryArray[i],
                base64: returnedArr[i]
              });
            }

            fut.return(base64Array);
          }
        });
      } else {
        fut.return(base64Array);
      }


      return fut.wait();
    },

    /**
    * A helper function for the screenshots function. Does the actual
    * rendering with node js childprocess that calls phantomjs script
    * @param pInfoObject: an object with info about where to call script
    * and what urls to send to it,  { pathFromBase: '/somedirectory/dir/', urlArray: [{url1}, {url2}] }
    */
    renderBase64: function(pInfoObject) {
      // Wait for async code to run
      var fut = new Future();

      // Validate arguments
      check(pInfoObject, {
        pathFromBase: String,
        urlArr: Array
      });

      // Path to local top level directory
      var path = require('path'),
      base = _.initial(path.resolve('.').split('/')).join('/');

      // Uses phantomjs with node js child process to render screenshot base64 to be used as buffer
      var phantomjs = Meteor.npmRequire('phantomjs-prebuilt'),
      childProcess = Meteor.npmRequire('child_process');

      // Path to the phantomjs bin
      var binPath = phantomjs.path;

      // Arguments passed to script
      childArgs = [
        base + pInfoObject.pathFromBase + 'create_screenshots.js'
      ];

      for(var i = 0; i < pInfoObject.urlArr.length; i++) {
        childArgs.push(pInfoObject.urlArr[i]);
        console.log(pInfoObject.urlArr[i]);
      }

      // Run script and return base64 as string
      childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if (err) {
          throw err;
        }
        console.log("child process done");
        fut.return(stdout);
      });

      return fut.wait();
    }
  });
}
