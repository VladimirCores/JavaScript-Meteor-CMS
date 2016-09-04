Template.videoContent.viewmodel(
{
      videoHeight: 150
   ,  UpdateHeight:function () {
         let thatData = this.templateInstance.data;
         let cont     = this.videoContainer;
         if(cont) {
            let vdata   = thatData.data;
            let prop    = vdata.height / vdata.width;
            let containerHeight = cont.width() * prop;
            this.videoHeight(containerHeight);
         }
      }
   ,  video : function () {
         let videoData = this.templateInstance.data.data;
         if(videoData) {
            let videoFile = videoData.file;
            let vid = Videos.findOne(videoFile._id);
            this.UpdateHeight();
            return vid ? vid.url({brokenIsFine: true}) : null;
         } else {
            return null;
         }
      }
   ,  onRendered: function () {
         this.UpdateHeight();
      }
});
