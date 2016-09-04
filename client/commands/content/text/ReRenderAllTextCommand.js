(function(Comman){
   // handle the command
   var renderIsInProcess = false;

   Comman.handle(ContentCommands.RE_RENDER_ALL_TEXT, function(section, sectionText) {
      console.log("> ContentCommands.RE_RENDER_ALL_TEXT", section, sectionText, renderIsInProcess);

      if(renderIsInProcess) this.reject(new Error("Render in process, please wait ..."));

      let that = this;
      let EXECUTE = Comman.execute;

      let criteria;
      let collection;

      if(sectionText) {
         criteria = {}
         collection = Sections;
         if(section) {
            criteria.subof = section._id;
         }
      } else {
         collection = Content;
         criteria = { type:ContentTypes.TEXT };
         if(section) {
            criteria.sid = section._id;
         }
      }

      console.log("> ContentCommands.RE_RENDER_ALL_TEXT", collection.name, criteria);

      let promises = [];
      let promise = Q();
      let counter = 1;
      let step = 0;

      let cursor = collection.find(criteria);

      if(cursor.count() == 0) {
         alert("Нет элементов для данной операции");
         this.reject();
         return;
      }
      NProgress.start();

      Q.longStackSupport = true;

      renderIsInProcess = true;

      cursor.forEach(function (item) {
               let vo = item;
               let dataVO = vo.data;
               let imageFile = dataVO.image;
               console.log("RE-RENDER: Registered ", counter++);

               promises.push(function () {
                  return Q.fcall(EXECUTE,
                     UtilsCommands.RE_RENDER_TEXT_AND_INSERT_IMAGE,
                     imageFile ? imageFile.file : null,
                     dataVO.html ? dataVO.html : dataVO.name,
                     dataVO
                  ).then(function (newDataVO) {
                     console.log("newDataVO", newDataVO);
                     if(newDataVO) {
                        vo.data = newDataVO;
                        Meteor.call(sectionText ? MeteorMethods.EDIT_SECTION : MeteorMethods.EDIT_CONTENT, vo);
                     }
                  })
                  // .delay(100)
                  .then(function () {
                     counter--;
                     NProgress.inc(step);
                     console.log("RE-RENDER Complete ", counter);

                     if(counter === 1) {
                        renderIsInProcess = false;
                        NProgress.set(1);
                        SuccessMessages.SAVE_COMPLETE("RE-RENDER TEXT");
                        that.resolve();
                     }
                  });
            });
      });

      console.log("RE-RENDER START",  promises.length, criteria);

      step = 1 / promises.length;

      promises.reduce(Q.when, Q());

   }
);
})(Comman);
