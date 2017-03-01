import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './start.html';

Template.start.events({
  "submit .url-form": function(event, template) {
      event.preventDefault();
      const target = event.target;
      const urls = target.url_field.value.replace(/\s+/g, '');

      Meteor.call('screenshots', urls, function(error, results) {
        if(error) {
          console.log(error);
        } else {
          alert(JSON.stringify(results, null, 2));
        }
      });

    }
});
