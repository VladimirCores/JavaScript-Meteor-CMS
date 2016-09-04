// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.INSERT_MEDIA_FILE, function(collection, file, title, needToShowProgress) {
      // console.log("> ContentCommands.INSERT_MEDIA_FILE", title, file);

      if(needToShowProgress) NProgress.start();
      let that = this;

      if(!collection) {
         that.reject(new Error("No collection choosen"));
         return;
      }

      if(file)
      {
         if(needToShowProgress) WarningMessages.LOADING_IN_PROGRESS_MANUAL(title);
         collection.insert(file, function (error, fileDoc) {
            // console.log("ContentCommands.INSERT_MEDIA_FILE inserted:", !error, collection);
            if(fileDoc) {
               let cursor = collection.find(fileDoc._id);
               let progressStep = 1 / fileDoc.chunkSum;
               let liveQuery = cursor.observe({
                  changed: function(newFileDoc, oldFileDoc) {
                     // console.log("ContentCommands.INSERT_MEDIA_FILE upload:", NProgress.status);
                     if(needToShowProgress) NProgress.inc(progressStep);
                     if (newFileDoc.isUploaded()) {
                        if(needToShowProgress) {
                           SuccessMessages.SAVE_COMPLETE(title);
                           NProgress.set(1);
                        }
                        liveQuery.stop();
                        liveQuery = null;
                        cursor = null;
                        // console.log("ContentCommands.INSERT_MEDIA_FILE complete");
                        that.resolve(newFileDoc);
                     }
                  }
               });
            } else {
               if(needToShowProgress){
                  ErrorMessages.SAVE_FAILED(title);
                  NProgress.set(1);
               }
               that.reject(new Error("Problem when insert file"));
            }
         });
      } else {
         if(needToShowProgress) {
            NProgress.set(1);
         }
         that.reject(new Error("No file"));
      }
   }
);
})(Comman);
