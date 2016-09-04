Meteor.publish("Sections", function(){
   console.log("> SERVER: this.userId", this.userId);
   console.log(this.userId && Roles.userIsInRole(this.userId, ['editor','admin']));
   if (this.userId && Roles.userIsInRole(this.userId, ['editor','admin'])) {
      return Sections.find({},{sort:{createdAt:1}});
   } else {
      // user not authorized. do not publish
      this.stop();
      return null;
   }
});

Meteor.publish("Content", function(){
     return Content.find({}, {sort:{position:-1}});
});
Meteor.publish("Images", function(){
     return Images.find();
});
Meteor.publish("Videos", function(){
     return Videos.find();
});
