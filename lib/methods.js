var methods = {};

methods[MeteorMethods.ADD_SECTION] = function(section) {
   let timeCreated = new Date().getTime();
   section.createdAt = timeCreated;
   section.modifiedAt = timeCreated;
   section.position = Sections.find({subof:section.subof}).count();
   Sections.insert(section, function (error, _id) {
      if(!error) {
         if(section.subof) {
            Sections.update({_id:section.subof}, {$inc: {sections: 1}});
         }
      }
   });
}

methods[MeteorMethods.SELECT_SECTION] = function(sectionID) {
   if(sectionID) Sections.update(sectionID, { $set:{ active:true } });
}

methods[MeteorMethods.DESELECT_SECTION] = function(sectionID) {
   // Sections.update(sectionID, { $set:{ active:false } });
   Sections.update({ active:true }, { $set:{ active:false } });
}

methods[MeteorMethods.EDIT_SECTION] = function(section) {
   let timeModified = new Date().getTime();
   section.modifiedAt = timeModified;
   Sections.update(section._id, {$set:{ data:section.data, modifiedAt:timeModified }},
      function (error, result) {
      // console.log("> MeteorMethods.EDIT_SECTION result", result);
   });
}

methods[MeteorMethods.REMOVE_SECTION] = function(section) {
   var position = 0;
   Sections.remove(section._id);
   Sections.find({subof:section.subof}, {sort:{position:1}}).forEach(function (item) {
      if(section.subof) {
         Sections.update({_id:section.subof}, {$inc: {sections: -1}});
      }
      Sections.update(item._id, {$set: {position: position++}});
   });
}

methods[MeteorMethods.RENAME_SECTION] = function(section) {
   Sections.update(section._id, {$set:{name:section.name}}, function (error, result) {
      // console.log("> MeteorMethods.RENAME_SECTION", error, result);
   });
}

methods[MeteorMethods.ADD_CONTENT] = function(content) {
   let timeCreated = new Date().getTime();
   let sid = content.sid;
   content.createdAt = timeCreated;
   content.modifiedAt = timeCreated;
   Content.insert(content, function (error, result) {
      // console.log("> MeteorMethods.ADD_CONTENT result", !error, result);
      if(result) Sections.update({ _id:sid }, {$inc: {contains: 1}},
         function (fail, success) {
         // console.log("> MeteorMethods.ADD_CONTENT increase", success);
      });
   });
}

methods[MeteorMethods.EDIT_CONTENT] = function(content) {
   let modtime = new Date().getTime();
   let cid     = content._id;
   let data    = content.data;
   content.modifiedAt = modtime;
   // console.log("> MeteorMethods.EDIT_CONTENT", content);
   Content.update(cid, {$set:{ data:data, modifiedAt:modtime }},
      function (error, result) {
      // console.log("> MeteorMethods.EDIT_CONTENT complete", result);
   });
}

methods[MeteorMethods.REPOSTION_CONTENT] = function (content) {
   Content.update(content._id, { $set: { position: content.position }});
}

methods[MeteorMethods.STORE_USER_SETTING] = function (settings) {
   // console.log("> MeteorMethods.STORE_USER_SETTING", settings);
   Meteor.users.update(Meteor.userId(), {$set:{"profile.settings":settings}});
}

methods[MeteorMethods.STORE_USER_NAV] = function (navigation) {
   Meteor.users.update(Meteor.userId(), {$set:{"profile.navigation":navigation}});
}

methods[MeteorMethods.REMOVE_CONTENT] = function(content) {
   let sid = content.sid;
   let position = content.position;
   Content.remove(content._id, function (error, result) {
      // console.log("> MeteorMethods.REMOVE_CONTENT decrease", sid, result);
      if(result) {
         var index = position;
         Sections.update({_id:sid}, {$inc: { contains: -1 }});
         Content.find({sid:sid, position: { $gt: position }}).forEach(function (item) {
            Content.update({_id:item._id}, { $set: { position: index++ }});
         });
      }
   });
}

methods[MeteorMethods.REMOVE_VIDEO] = function(id) {
   Videos.remove(id);
}

methods[MeteorMethods.REMOVE_IMAGE] = function(id) {
   Images.remove(id);
}

methods[MeteorMethods.SORT_SECTIONS] = function(sectionsArray) {
   _.forEach(sectionsArray, function (item) {
      Sections.update({_id:item._id}, {$set:{
         position:item.position
      }});
   });
}

Meteor.methods(methods);
