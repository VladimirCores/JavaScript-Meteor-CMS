Router.configure({
   loadingTemplate: 'loading',
   notFoundTemplate: 'notfound'
});

Router.route('/',             { name: 'app', controller: "ApplicationController" });
Router.route('/login',        { name: 'login', controller: "LoginController" });
Router.route('/logout',       { name: 'logout', controller: "LogoutController" });
//
Router.onBeforeAction(function() {
   let currentRoute = Router.current().route.getName();
   console.log("onBeforeAction : currentRoute", currentRoute, Meteor.userId());
   if (!Meteor.userId()) {
      Router.go("login");
   } else {
      if(currentRoute == "login" && Meteor.userId()) Router.go("app");
      else this.next();
   }
});

LoginController = RouteController.extend({
   action: function() {
      this.render();
   },
   layoutTemplate: 'login'
});

LogoutController = RouteController.extend({
   action: function() {
      if(Meteor.userId()) {
         Meteor.logout();
         AccountsTemplates.logout();
      } else {
         Router.go("login");
      }
   }
});

ApplicationController = RouteController.extend({
   action: function() {
      console.log("ApplicationController", Meteor.userId());
      if (!Meteor.userId()) {
         Router.go("login");
      } else this.render();
   },
   layoutTemplate: 'layout',
   // a place to put your subscriptions
   // subscriptions: function() {
      // add the subscription to the waitlist
      // if(Meteor.userId()) {
      //    console.log("ApplicationController: subscriptions", Meteor.userId());
      //    this.subscribe('Content').wait();
      //    this.subscribe('Images').wait();
      //    this.subscribe('Videos').wait();
      // }
   // },
   // Subscriptions or other things we want to "wait" on. This also
   // automatically uses the loading hook. That's the only difference between
   // this option and the subscriptions option above.
   waitOn: function () {
      return Meteor.userId() ? [
         Meteor.subscribe("Sections"),
         Meteor.subscribe("Content"),
         Meteor.subscribe("Images"),
         Meteor.subscribe("Videos")
      ] : [];
   }
});
