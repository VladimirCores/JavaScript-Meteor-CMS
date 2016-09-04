var users = [{
   name        : "admin",
   email       : "admin@email.com",
   pass        : "123",
   roles       : ["admin"]
}, {
   name        : "editor",
   email       : "editor@email.com",
   pass        : "321",
   roles       : ["editor"]
}];

_.each(users, function (user) {
   let isStored = Meteor.users.findOne({username: user.name});
   if (!isStored) {
      let adminID = Accounts.createUser({
         username   : user.name,
         email      : user.email,
         password   : user.pass,
         profile    : {
            settings    : new SettingsVO()
         }
      });
      Roles.addUsersToRoles(adminID, user.roles, Roles.GLOBAL_GROUP);
   }
})
