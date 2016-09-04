Template.packModal.viewmodel(function (packVO)
{
   let Output_PackDataVO = new PackDataVO();
   let Input_PackDataVO = packVO.data;

   let files = Input_PackDataVO.files;

   let isNewPack = files.length == 0;

   let mediaSettings = CMSSettings.public.cms.media;

   return {
      packTitle : Input_PackDataVO.title
   ,  packImages: files
   ,  confirmEnabled: true
   ,  saveAsSeparateImages: false
   ,  showSeparateImagesCheckbox : true
   ,  acceptableImageTypes: mediaSettings.acceptableImageTypes

   ,  ProcessConfirm:function (e) {
         //TODO: PIPE DATA ENOTHER WAY
         Output_PackDataVO.title = this.packTitle();
         $(".modal").data("output", [ Output_PackDataVO, this.saveAsSeparateImages() ]);
      }
   ,  GetImageURL:function (image) {
         if(image.data) {
            return image.data.file.url({brokenIsFine: true})
         } else {
            return image.file;
         }
      }
   ,  ImageChanged:function () {
         console.log("Image Changed");
         let that    = this;
         let chooser = this.imageChooser.get(0);
         let files = chooser.files;
         let count = files.length;
         let step = 1 / count;
         let promises = [];
         that.confirmEnabled(false);
         NProgress.start();
         _.forEach(chooser.files, function (file) {
            let nameSplitted = file.name.split(".");
            let fileTitle = nameSplitted.slice(0,-1).join(".");
            promises.push(
               Comman.execute(
                  UtilsCommands.PREVIEW_IMAGE_INSIDE_CONTAINER,
                  file
            ).then(function (imgFile) {
               let deffred = Q.defer();
               let img = new Image();
               let onImageLoad = function () {
                  let imageDataVO = new ImageDataVO();
                  imageDataVO.file = imgFile;
                  imageDataVO.width = img.naturalWidth;
                  imageDataVO.height = img.naturalHeight;
                  imageDataVO.title = fileTitle;

                  Output_PackDataVO.files.push(imageDataVO);
                  that.packImages().push(imageDataVO);

                  NProgress.inc(step);
                  deffred.resolve();
               }
               img.onload = onImageLoad;
               img.src = imgFile;
               return deffred.promise;
            }));
         });

         Q.allSettled(promises)
         .then(function (imageDataVO) {

            $(".modal").marginOffsetToCenter();
            that.confirmEnabled(true);
            NProgress.set(1);
         })
      }
   ,  ChooseImage:function () {
         console.log("Choose Image!");
         let that = this;
         let chooser = this.imageChooser.get(0);
         document.body.onfocus = function () {
            document.body.onfocus = null;
            if(chooser.files.length == 0) {
               that.confirmEnabled(true);
            }
         }
         this.confirmEnabled(false);
         this.imageChooser.trigger('click');
      }
   ,  onRendered: function () {
         this.confirmEnabled(true);
         console.log("\n PACK CONTENT MODAL RENDERED \n")
      }
   }
});
