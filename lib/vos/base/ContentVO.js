(function(){
   ContentVO = function (sid, type, data) {
      if(typeof sid === "string"){
         _.extend(this, {
               _id         : new Meteor.Collection.ObjectID()
            ,  type        : type
            ,  data        : data
            ,  sid         : sid.length > 0 ? new Meteor.Collection.ObjectID(sid) : "root"
            ,  createdAt   : 0
            ,  modifiedAt  : 0
            ,  position    : 0
         });
      } else _.extend(this, sid);
   }
})()
