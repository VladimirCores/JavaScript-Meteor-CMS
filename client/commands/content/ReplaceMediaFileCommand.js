// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.REPLACE_MEDIA_FILE, function(InsertCommand, oldFile, newFile, holder, name, needToShowProgress) {
      console.log("> ContentCommands.REPLACE_MEDIA_FILE", oldFile, newFile);

      let EXECUTE = Comman.execute
      let that = this;

      let INSERT_NEW_FILE = function () {
         return EXECUTE(
            InsertCommand,
            newFile,
            needToShowProgress
         )
         .then(
            function (file) {
               holder[name] = file;
               newFile = null;
               oldFile = null;
            },
            function (error) {
               holder[name] = null;
               newFile = null;
               oldFile = null;
               ErrorMessages.FILE_NOT_SAVED();
            }
         )
         .then(function () {
            return that.resolve(holder);
         })
      }

      if(oldFile) {
         EXECUTE(ContentCommands.DELETE_FILE, oldFile)
         .then(INSERT_NEW_FILE);
      } else {
         INSERT_NEW_FILE();
      }
   }
);
})(Comman);
