// a module to represent a methods, which responds to a command
(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.INSERT_VIDEO_FILE, function(file, needToShowProgress) {
      console.log("> ContentCommands.INSERT_VIDEO_FILE", file);
      let that = this;

      Comman.execute(
         ContentCommands.INSERT_MEDIA_FILE,
         Videos,
         file,
         "видео",
         needToShowProgress
      ).then(function (videoDoc) {
         that.resolve(videoDoc);
      }, function (error) {
         videoDoc.reject(error);
      });
   }
);
})(Comman);
