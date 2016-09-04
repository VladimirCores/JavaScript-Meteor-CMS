(function(Comman){
    // handle the command
      Comman.handle(ContentCommands.POSITION_CONTENT, function(oldIndex, newIndex, sid) {
         console.log("> ContentCommands.POSITION_CONTENT old new", oldIndex, newIndex);
         let oldPos = oldIndex + 1;
         let newPos = newIndex + 1;

         let updown = oldPos > newPos;
         let incriment = updown ? 1 : -1;
         let delta = Math.abs(newPos - oldPos);
         let movedItem = Content.findOne({sid:sid, position:oldPos});

         let positionFindCriteria = updown ? {
            $gte: newPos,
            $lt: oldPos
         } : {
            $gt: oldPos,
            $lte: newPos
         };

         movedItem.position = newPos;

         Content.find({sid:sid, position:positionFindCriteria}).forEach(function (item) {
            item.position = item.position + incriment;
            // console.log("> ContentCommands.POSITION_CONTENT item", item);
            Meteor.call(MeteorMethods.REPOSTION_CONTENT, item);
            if(--delta == 0) Meteor.call(MeteorMethods.REPOSTION_CONTENT, movedItem);
         })
         // console.log("> ContentCommands.POSITION_CONTENT item", movedItem);
      }
   );
})(Comman);
