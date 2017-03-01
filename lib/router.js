Router.configure({
	layoutTemplate: 'layout',
	waitOn: function() {
		
	}
});

Router.route('/', { name: 'start' });
