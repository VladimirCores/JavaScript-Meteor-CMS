Template.imageModal.viewmodel(function (imageVO)
{
   let Output_ImageDataVO = new ImageDataVO();
   let Input_ImageDataVO = imageVO.data;

   function CheckEditModeAndPreviewImageInside(container) {
      if(   Input_ImageDataVO.file
         && Input_ImageDataVO.file.url
         && typeof Input_ImageDataVO.file.url === "function") {
         AppendImageToContainer(Input_ImageDataVO.file.url(), container);
      }
   }

   function AppendImageToContainer(imageData, $container, callback) {
      var img = new Image();
      img.onload = function() {
         let prop = img.height / img.width;
         $container.css("height", $container.width() * prop);

         Output_ImageDataVO.width = img.width;
         Output_ImageDataVO.height = img.height;

         if(callback) callback();
      }
      img.src = imageData;
      $container.empty().append(img);
   }

   return {
      ProcessConfirm:function (e) {
         //TODO: PIPE DATA ENOTHER WAY
         if(Output_ImageDataVO.file)
         {
            $(".modal").data("output", Output_ImageDataVO);
         }
      }
   ,  EnableConfirm:function () {
         this.confirmBtn.attr("disabled", false);
      }
   ,  DisableConfirm:function () {
         this.confirmBtn.attr("disabled", true);
      }
   ,  ImageChanged:function () {
         console.log("Image Changed");
         let chooser = this.imageChooser.get(0);
         let file    = chooser.files[0];
         let that    = this;
         if(file) {
            Comman.execute(UtilsCommands.PREVIEW_IMAGE_INSIDE_CONTAINER,
               file,
               that.imageContainer
            ).then(function (img) {
               Output_ImageDataVO.file = file;
               Output_ImageDataVO.width = img.width;
               Output_ImageDataVO.height = img.height;
               that.EnableConfirm()
            });
         } else this.DisableConfirm();
      }
   ,  ChooseImage:function () {
         console.log("Choose Image!");
         let that = this;
         let chooser = this.imageChooser.get(0);
         document.body.onfocus = function () {
            document.body.onfocus = null;
            if(chooser.files.length == 0) {
               that.EnableConfirm();
            }
         }
         this.DisableConfirm();
         this.imageChooser.trigger('click');
      }
   ,  onRendered: function () {
         CheckEditModeAndPreviewImageInside(this.imageContainer);
         console.log("\n IMAGE CONTENT MODAL RENDERED \n")
      }
   }
});
