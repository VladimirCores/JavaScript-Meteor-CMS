(function(Comman){
    // handle the command
   Comman.handle(UtilsCommands.PREVIEW_IMAGE_INSIDE_CONTAINER,
   function(file, $container, clearIt) {
      var reader = new FileReader();
      let that = this;
      var onLoad = function () {
         reader.removeEventListener("load", onLoad);
         if($container) {
            if(clearIt) $container.empty();
            Comman.execute(
               UtilsCommands.APPEND_IMAGEDATA_TO_CONTAINER,
               reader.result,
               $container
            ).then(function (image) {
               that.resolve(image);
            }, function (error) {
               that.reject(error);
            });
         } else {
            that.resolve(reader.result);
         }
      }
      reader.addEventListener("load", onLoad, false);
      reader.readAsDataURL(file);
   });
})(Comman);
