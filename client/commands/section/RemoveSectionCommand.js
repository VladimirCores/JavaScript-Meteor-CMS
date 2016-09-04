(function(Comman){
    // handle the command
   Comman.handle(SectionCommands.REMOVE_SECTION, function(section, noconfirm) {

      // console.log("SectionCommands.REMOVE_SECTION noconfirm:", noconfirm);

      let sid = section._id;
      let sectionData = section.data;
      let sectionSubof = section.subof;
      let sectionRoot = section.root;
      let isRootSection = sectionRoot === false;

      let thatDeffered = this;
      let EXECUTE = Comman.execute;

      let RemoveSection = function () {
         NProgress.start();
         Content.find({sid:sid}).forEach(function (item) {
            Comman.execute(ContentCommands.REMOVE_CONTENT, item, true);
         });

         // Сначала пробуем удалить картинку раздела
         EXECUTE(
            ContentCommands.DELETE_FILE,
            sectionData.icon ? sectionData.icon.file : null
         )
         .then(function () {
            // Затем удаляем картинку текста
            return EXECUTE(
               ContentCommands.DELETE_FILE,
               sectionData.image ? sectionData.image.file : null
            );
         })
         .then(function () {
            // Если у нас основная секция
            // console.log("SectionCommands.REMOVE_SECTION as main: ", section.sections);
            if(section.sections > 0) {
               // Ищем все секции которые у которых есть root (_id данной секции)
               let subSections = Sections.find({subof:section._id}).fetch();
               return Q.allSettled(subSections.map(function (item) {
                  return EXECUTE(SectionCommands.REMOVE_SECTION, item, true);
               }))
            }
         })
         .then(function () {
            // Затем удаляем секцию
            Meteor.call(MeteorMethods.REMOVE_SECTION, section, function () {
               NProgress.set(1);
               toastr.clear();
               // console.log("MeteorMethods.REMOVE_SECTION complete");

               section = Sections.findOne({subof:sectionSubof});
               if(!section) section = Sections.findOne({_id:sectionSubof});

               // Если у нас null то секции сбросятся
               EXECUTE(MenuCommands.SELECT_SECTION, section ? section._id : null, true);

               thatDeffered.resolve();
            });
         })
      }

      if(noconfirm) {
         RemoveSection();
      } else {
         EXECUTE(
            ModalCommands.SHOW_MODAL,
            "removeConfirmModal",
            section,
            RemoveSection
         );
      }
   });
})(Comman);
