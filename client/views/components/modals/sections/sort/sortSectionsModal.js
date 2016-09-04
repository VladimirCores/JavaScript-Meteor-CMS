Template.sortSectionsModal.viewmodel(function (sections) {
return {
   ProcessConfirm:function () {

   }
   ,  onRendered: function () {
      var sortable = Sortable.create(
         this.sortContainer.get(0),
         {
            ghostClass: "sortablesectionghost",
            onEnd: function (evt) {
               let oldPos = evt.oldIndex;
               let newPos = evt.newIndex;
               let updown = oldPos > newPos;
               let incriment = updown ? 1 : -1;
               let delta = Math.abs(newPos - oldPos);

               sections[oldPos].position = newPos;
               while(delta--) {
                  oldPos -= incriment;
                  sections[oldPos].position += incriment;
               }
               sections = _.sortBy(sections, "position");
            },
         }
      );
   }
}})
