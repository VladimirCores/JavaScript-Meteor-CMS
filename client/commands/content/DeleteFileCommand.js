// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.DELETE_FILE, function(file, needToShowProgress) {
      // console.log("> ContentCommands.DELETE_FILE", file);

      let that = this;

      if(file) {
         if(needToShowProgress) {
            NProgress.start();
            WarningMessages.DELETING_FILE_FROM_SERVER();
         }

         if(typeof file.remove === "function") {
            // Эта проверка нужна на тот случай если созранился не FS.FILE
            file.remove(function (error, result) {
               if(needToShowProgress) NProgress.set(1);
               if(error) {
                  // Если произошла ошибка удаления файла,
                  // то мы все равно продолжаем (файл может не существовать)
                  ErrorMessages.FILE_DELETE_ERROR();
                  that.resolve();
               } else {
                  if(needToShowProgress){
                     SuccessMessages.DELETE_OLD_COMPLETE();
                  }
                  that.resolve();
               }
            });
         } else {
            if(needToShowProgress){
               NProgress.set(1);
            }
            that.resolve();
         }
      } else {
         // Если нету файла то мы продолжаем без файла
         that.resolve();
      }
   })
})(Comman);
