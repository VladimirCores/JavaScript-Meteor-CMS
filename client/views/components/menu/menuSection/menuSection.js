Template.menuSection.viewmodel(function (sectionVO) {

   function MakePopupWithThumbPreview(popup) {
      let imageFile = sectionVO.data.icon.file;
      // console.log("MakePopupWithThumbPreview", imageFile);
      Comman.execute(
         UtilsCommands.MAKE_POPUP,
         popup,
         imageFile,
         "top left"
      ).fail(function (error) {
          // We get here with either foo's error or bar's error
          popup.remove();
      });
   }

return {
      selected : function() {
         let activeSection = this.parent().section();
         //console.log(activeSection.subof, this._id());
         return activeSection && (
            this._id().equals(activeSection._id)
         || this._id().equals(activeSection.subof));
      }
   ,  subsections: function () {
         return Sections.find({subof:sectionVO._id}, {sort:{position:1}}).fetch();
      }
   ,  hasIcon: function () {
         if(sectionVO.data.icon) {
            // console.log("this.popupHolder", this.popupHolder);
            MakePopupWithThumbPreview(this.popupHolder);
            console.log("\nADD POPUP\n");
            return true;
         } else {
            // Если у секции была картинка но мы ее удалили,
            // то удаляем и сам попап
            if(this.popupHolder.popup("exists")) {
               console.log("\nREMOVE POPUP\n");
               this.popupHolder.popup("destroy")
            }
            return false;
         }
      }
   ,  PopupImageLoaded: function () {
         console.log("POPUP IMAGE LOADED");
      }
   ,  onRendered: function (argument) {
         var parent = this.parent();
         // this.editableName.editable("dblclick", function(e){
         //    if(e.value.length > 0 && e.value !== e.old_value)
         //       parent.rename(e.value);
         //    else e.target.html(e.old_value);
         // });
      }
   }
});
