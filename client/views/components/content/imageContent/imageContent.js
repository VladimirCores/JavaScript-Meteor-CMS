Template.imageContent.viewmodel(
{
      imageHeight: 150
   ,  UpdateHeight:function (argument) {
         let thatData = this.templateInstance.data;
         let cont     = this.imageContainer;
         if(cont) {
            let idata   = thatData.data;
            let prop    = idata.height / idata.width;
            let containerHeight = cont.width() * prop;
            this.imageHeight(containerHeight);
         }
      }
   ,  image : function () {
         let imageData = this.templateInstance.data.data;
         let imageFile = imageData.file;
         let img = Images.findOne(imageFile._id);
         this.UpdateHeight();
         return img ? img.url({brokenIsFine: true}) : null;
      }
   ,  onRendered: function () {
         this.UpdateHeight();
      }
});
