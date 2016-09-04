Template.content.viewmodel(
{
      share    : "active"
   ,  items    : function() {
         let currentSection = this.section();
         let criteria = { sid: "root" };
         if(currentSection) {
            criteria.sid = currentSection._id;
         }
         return Content.find(criteria, {sort:{position:1}});
      }
   ,  onRendered: function () {
         // console.log("\n CONTENT SECTION RENDERED \n");
         let that = this;
         var el = document.getElementById('sortable');
         SortableSettings.onEnd = function (evt) {
            if(evt.newIndex != undefined && evt.oldIndex != evt.newIndex) {
               let activeSection = that.section();
               let sectionID = activeSection ? activeSection._id : "root";
               Comman.execute(ContentCommands.POSITION_CONTENT, evt.oldIndex, evt.newIndex, sectionID);
            }
         }
         var sortable = Sortable.create(el, SortableSettings);
      }
});
