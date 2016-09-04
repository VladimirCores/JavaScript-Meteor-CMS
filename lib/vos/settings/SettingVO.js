(function(){
   SettingsVO = function () {
      _.extend(this, {
            _id         : new Meteor.Collection.ObjectID()
         ,  image       : null
      });
   }
})()
