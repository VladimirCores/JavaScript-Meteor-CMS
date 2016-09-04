(function(Comman){
    // handle the command
   Comman.handle(ContentCommands.PREVIEW_RENDER_HTML, function(html, params, container) {
      console.log("> ContentCommands.PREVIEW_RENDER_HTML");

      var defered = this;

      container.empty();

      Comman.execute(
         ContentCommands.RENDER_HTML,
         params,
         html
      ).then(function (imageData) {
         if(imageData) {
            let previewImage = new Image();
            previewImage.onload = function () {
               Utils.CenterImageInContainer(previewImage, container);
               previewImage.onload = null;
               defered.resolve(previewImage);
            }
            previewImage.src = imageData;
         }
      });
   });
})(Comman);
