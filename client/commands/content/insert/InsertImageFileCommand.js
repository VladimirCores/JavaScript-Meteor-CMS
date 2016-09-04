// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.INSERT_IMAGE_FILE, function(file, needToShowProgress) {
      // console.log("> ContentCommands.INSERT_IMAGE_FILE", file);
      let that = this;

      Comman.execute(
         ContentCommands.INSERT_MEDIA_FILE,
         Images,
         file,
         "картинки",
         needToShowProgress
      ).then(function (imageFile) {
         // console.log("> ContentCommands.INSERT_IMAGE_FILE complete", imageFile.getExtension());
         that.resolve(imageFile);
      }, function (error) {
         // console.log("> ContentCommands.INSERT_IMAGE_FILE error", error);
         that.reject(error);
      });
   }
);
})(Comman);
