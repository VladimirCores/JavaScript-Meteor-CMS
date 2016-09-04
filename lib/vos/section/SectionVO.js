(function(){
   SectionVO = function (input) {
      if(input == null || (input && typeof input === "string")){
         _.extend(this, {
               _id         : new Meteor.Collection.ObjectID()
            ,  createdAt   : 0
            ,  modifiedAt  : 0
            ,  contains    : 0
            ,  position    : 0
            ,  sections    : 0
            ,  active      : true
            ,  subof       : null
            ,  root        : null
            ,  title       : ""
            ,  data        : new SectionDataVO()
         });
      } else _.extend(this, input);
   }
})()
