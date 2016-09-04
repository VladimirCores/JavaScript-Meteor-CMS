(function(Comman){
   // handle the command
   Comman.handle(ContentCommands.RENDER_HTML, function(textImageData, html, doInsertImage, needToShowProgress) {
      // console.log("> ContentCommands.RENDER_HTML params", textImageData, html);

      let sthat = this;
      let EXECUTE = Comman.execute;

      if(!html) sthat.reject(new Error("Render unavailable: NO HTML!"));

      let scaleIsInPixels = isNaN(textImageData.scale);

      let scale      = !scaleIsInPixels ? textImageData.scale : 1;

      let width      = textImageData.width * scale;
      let padding    = (textImageData.padding * scale) + "px";
      let lineHeight = (textImageData.linehgt * scale) + "px";

      let font       = textImageData.font;
      let center     = textImageData.center;
      let weight     = textImageData.weight;

      let style = {
         "padding"      : padding,
         "width"        : width > 0 ? (width + "px") : "",

         "font-family"  : font,
         "font-size"    : scaleIsInPixels ? textImageData.scale : "1em",
         "font-weight"  : weight,
         "line-height"  : lineHeight,
         "text-align"   : center ? "center" : "left",
         "position"     : "static",
         "float"        : "left"
      };

      // console.log("> ContentCommands.RENDER_HTML style",
      // style, scale);

      let htmlContainer = $('<div>');

      htmlContainer
      .css(style)
      .html(html)
      .appendTo(document.body);

      if(scale > 1) {
         let ScaleItems = function () {
            let item = $(this);
            if(item.css("font-size").length != 0) {
               let fs = parseFloat(item.css("font-size"));
               fs = fs * scale + "px";
               item.css("font-size", fs);
            }

            item.css("width", "100%");

            if(item.css("line-height").length != 0) {
               item.css("line-height", lineHeight);
            }

            if(item.children().length) {
               item.children().each(ScaleItems);
            }
         }

         htmlContainer.children()
         .each(ScaleItems);
      }
      // console.log(htmlContainer.width());
      try{
         html2canvas(htmlContainer, {
            onrendered: function(canvas) {
               htmlContainer.remove();
               let imageData = canvas.toDataURL("image/png", 1);
               // После рендера текста в картинку, cохраняем высоту картинки
               textImageData.height = canvas.height;
               textImageData.width = canvas.width;

               // console.log("> ContentCommands.RENDER_HTML complete -> doInsertImage", doInsertImage);

               if(doInsertImage) {
                  EXECUTE(
                     ContentCommands.INSERT_IMAGE_FILE,
                     imageData
                  ).then(function (imageFile) {
                     sthat.resolve(imageFile);
                  }, function (error) {
                     sthat.reject(error)
                  })
               } else {
                  sthat.resolve(imageData);
               }
            }
         });
      } catch(e) {
         sthat.reject(e);
      }
   }
);
})(Comman);
