Template.imageAdvancedModal.viewmodel(function (imageVO)
{
   let Output_ImageDataVO = new ImageDataVO();
   let Input_ImageDataVO = imageVO.data;

   Output_ImageDataVO.title   = Input_ImageDataVO.title;
   Output_ImageDataVO.text    = Input_ImageDataVO.text;
   Output_ImageDataVO.width   = Input_ImageDataVO.width;
   Output_ImageDataVO.height  = Input_ImageDataVO.height;

   function CheckEditModeAndPreviewImageInside(container) {
      if(   Input_ImageDataVO.file
         && Input_ImageDataVO.file.url
         && typeof Input_ImageDataVO.file.url === "function") {
         Output_ImageDataVO.file = Input_ImageDataVO.file;
         return Comman.execute(
            UtilsCommands.APPEND_IMAGEDATA_TO_CONTAINER,
            Input_ImageDataVO.file.url(),
            container
         ).then(function (image) {
            container.css("height", image.height);
         });
      }
      return false;
   }

   function ShowImageInfo(infoblock, width, height) {
      infoblock.css("top", infoblock.parent().height());
      let info = ["Размер: <b>","1", "</b>x<b>", "3", "</b>px"];
      info[1] = width;
      info[3] = height;
      infoblock.html(info.join(""));
   }

   let mediaSettings = CMSSettings.public.cms.media;

   return {
      title    : Output_ImageDataVO.title
   ,  text     : Output_ImageDataVO.text

   ,  acceptableImageTypes: mediaSettings.acceptableImageTypes

   ,  confirmEnabled: false
   ,  isImageLoading: false
   ,  ProcessConfirm:function (e) {

         Output_ImageDataVO.title = this.title();
         Output_ImageDataVO.text = this.text();

         $(".modal").data("output", [ Output_ImageDataVO ]);
      }
   ,  TitleChanged: function () {
         if(   (!Input_ImageDataVO.file && Input_ImageDataVO.title.length == 0)
            || (Input_ImageDataVO.file && (this.title() !== Input_ImageDataVO.title || this.text() !== Input_ImageDataVO.text))
         ) {
            this.confirmEnabled(true);
         } else {
            this.confirmEnabled(false);
         }
      }
   ,  TextChanged:function () {
         // Случай когда мы только создаем контент || когда редактируем
         if(   (!Input_ImageDataVO.file && Input_ImageDataVO.text.length == 0)
            || (Input_ImageDataVO.file && (this.title() !== Input_ImageDataVO.title || this.text() !== Input_ImageDataVO.text))
         ) {
            this.confirmEnabled(true);
         } else {
            this.confirmEnabled(false);
         }
      }
   ,  ImageChanged:function () {
         let chooser = this.imageChooser.get(0);
         let file    = chooser.files[0];
         let that    = this;
         if(file) {
            let loader = $('<div class="ui active loader">')

            that.imageContainer
               .remove("img")
               .append(loader)
               .css("height", "");

            that.isImageLoading(true);
            Comman.execute(
               UtilsCommands.PREVIEW_IMAGE_INSIDE_CONTAINER,
               file, that.imageContainer
            ).then(function (img) {
               let nameSplitted = file.name.split(".");
               let imgNaturalWidth = img.naturalWidth;
               let imgNaturalHeight = img.naturalHeight;

               loader.remove();

               that.confirmEnabled(true);

               nameSplitted = nameSplitted.slice(0,-1);

               that.isImageLoading(false);
               that.title(nameSplitted.join("."));
               that.imageContainer.css("height", img.height);

               Output_ImageDataVO.file = file;
               Output_ImageDataVO.width = imgNaturalWidth;
               Output_ImageDataVO.height = imgNaturalHeight;
               ShowImageInfo(
                  that.imageInfo,
                  imgNaturalWidth,
                  imgNaturalHeight
               );
            }, function () {
               loader.remove();
            });
         } else this.confirmEnabled(false);
      }
   ,  ChooseImage:function () {
         console.log("Choose Image!");
         let that = this;
         let chooser = this.imageChooser.get(0);
         document.body.onfocus = function () {
            document.body.onfocus = null;
            if(   chooser.files.length == 0
               && Output_ImageDataVO.file == null
            ) {
               that.imageInfo.html("");
               that.imageContainer.css("height", "");
               return;
            }
            that.confirmEnabled(true);
         }
         this.confirmEnabled(false);
         this.imageChooser.trigger('click');
      }
   ,  onRendered: function () {
         let thatImageInfo = this.imageInfo;
         let checkimage = CheckEditModeAndPreviewImageInside(this.imageContainer);
         if(checkimage){
            checkimage.then(function () {
               ShowImageInfo(thatImageInfo, Input_ImageDataVO.width, Input_ImageDataVO.height);
            })
         } else {
            thatImageInfo.html("");
         }
         console.log("\n IMAGE CONTENT MODAL RENDERED \n")
      }
   }
});
