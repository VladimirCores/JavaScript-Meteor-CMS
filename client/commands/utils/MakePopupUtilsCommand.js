(function(Comman){

   function isURL(str) {
     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
     '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
     '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
     return pattern.test(str);
   }

   Comman.handle(UtilsCommands.MAKE_POPUP, function(popup, file, orientation) {
      let that = this;
      if(popup && file) {
         let popupContent = $(document.createElement("div"));
         let popupLoading = $(document.createElement("div"));
         let initialSize = { width:300, height:100 };
         popupContent.addClass("content");
         popupLoading.css(initialSize).append('<div class="ui active loader"></div>');

         let fileImage = new Image();

         fileImage.onerror = function () {
            console.log("Image loaded error!");
            fileImage.onload = null;
            fileImage.onerror = null;
            popupLoading.remove();
            popupContent.remove();
            if(popup.popup('exists'))
               popup.popup('destroy');

            that.reject();
         }

         fileImage.onload = function () {
            fileImage.onload = null;
            fileImage.onerror = null;

            let imgNaturalWidth = fileImage.naturalWidth;
            let imgNaturalHeight = fileImage.naturalHeight;

            let mediaSettings = CMSSettings.public.cms.media;

            popupContent.empty();

            if(imgNaturalWidth > mediaSettings.imageMaxWidth) {
               popup.popup('destroy');
               ErrorMessages.IMAGE_WIDTH_LIMIT(mediaSettings.imageMaxWidth);
               that.reject(new Error("Image width more then max available"));
               return;
            }

            if(imgNaturalHeight > mediaSettings.imageMaxHeight) {
               popup.popup('destroy');
               ErrorMessages.IMAGE_HEIGHT_LIMIT(mediaSettings.imageMaxHeight);
               that.reject(new Error("Image height more then max available"));
               return;
            }

            popupContent.append(fileImage);
            that.resolve();
         }

         if(!file.url) {
            if(typeof file === "object"){
               let reader  = new FileReader();
               let onLoad = function () {
                  reader.removeEventListener("load", onLoad);
                  fileImage.src = reader.result;
                  reader = null;
               }
               reader.addEventListener("load", onLoad, false);
               reader.readAsDataURL(file);
            } else {
               fileImage.src = file;
            }
         } else {
            // console.log("FILE isMounted: ", file.isMounted());
            // console.log("FILE hasStored: ", Images.name, file.hasStored(Images.name, true));
            // if(file.isMounted())
            // console.log(file.hasStored(file.isMounted().name), file.getFileRecord());
            // Utils.GetBase64Data(file, function (error, result) {
            //    if(error) {
            //       return fileImage.onerror();
            //    } else {
            //       fileImage.src = result;
            //    }
            // });
            // file.on("error", function (e) {
            //    file.off("error");
            //    console.log("ERROR HAPPEND", e);
            // })
            fileImage.src = file.url({brokenIsFine: true});
         }

         popupContent.append(popupLoading);

         // if(popup.popup('exists'))
         //    popup.popup('destroy');

         if(!popup.popup('exists')){
            popup.popup({
               position       : orientation || 'bottom center',
               target         : popup,
               html           : popupContent,
               setFluidWidth  : true,
               exclusive      : true,
            });
         } else {
            popup.popup('change content', popupContent);
         }
      } else {
         that.reject();
      }
   });
})(Comman);
