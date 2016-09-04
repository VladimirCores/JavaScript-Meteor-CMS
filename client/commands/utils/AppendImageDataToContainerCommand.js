(function(Comman){
    // handle the command
   Comman.handle(UtilsCommands.APPEND_IMAGEDATA_TO_CONTAINER, function(imageData, $container) {
      console.log("> UtilsCommands.APPEND_IMAGE_TO_CONTAINER");
      if(imageData) {
         var img = new Image();
         var that = this;
         img.onload = function() {
            if($container.css("height") === "auto") {
               let prop = img.height / img.width;
               $container.css("height", $container.width() * prop);
            }

            let imgNaturalWidth = img.naturalWidth;
            let imgNaturalHeight = img.naturalHeight;

            let mediaSettings = CMSSettings.public.cms.media;

            if(imgNaturalWidth > mediaSettings.imageMaxWidth) {
               ErrorMessages.IMAGE_WIDTH_LIMIT(mediaSettings.imageMaxWidth);
               that.reject(new Error("Image width more then max available"));
               return;
            }

            if(imgNaturalHeight > mediaSettings.imageMaxHeight) {
               ErrorMessages.IMAGE_HEIGHT_LIMIT(mediaSettings.imageMaxHeight);
               that.reject(new Error("Image height more then max available"));
               return;
            }

            $container.append(img);
            that.resolve(img);
         }
         img.src = imageData;
         $container.find("img").remove();
      } else {
         this.reject(new Error("Can't append null image data"));
      }
   });
})(Comman);
