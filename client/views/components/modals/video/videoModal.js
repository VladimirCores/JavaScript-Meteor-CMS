Template.videoModal.viewmodel(function (videoVO)
{
   let Output_VideoDataVO = new VideoDataVO();
   let Input_VideoDataVO = videoVO.data;

   Output_VideoDataVO.title  = Input_VideoDataVO.title;
   Output_VideoDataVO.text   = Input_VideoDataVO.text;

   let PreviewFile = function (file, $container, callback){
      var filePath = URL.createObjectURL(file);
      AppendVideoToContainer(filePath, $container, callback);
   }

   if(   Input_VideoDataVO.thumb
      && Input_VideoDataVO.thumb.url
      && typeof Input_VideoDataVO.thumb.url === "function"){
         Output_VideoDataVO.thumb = Input_VideoDataVO.thumb;
      }

   if(   Input_VideoDataVO.file
      && Input_VideoDataVO.file.url
      && typeof Input_VideoDataVO.file.url === "function") {
         Output_VideoDataVO.file = Input_VideoDataVO.file;
      }

   function CheckEditModeAndPreviewVideoInside(container) {
      let isVideoFileAlreadyExist = Output_VideoDataVO.file != null;
      if(isVideoFileAlreadyExist) {
         AppendVideoToContainer(Input_VideoDataVO.file.url(), container);
      }
      return isVideoFileAlreadyExist;
   }

   function ShowMediaInfo(infoblock, width, height) {
      let info = ["Размер: <b>","1", "</b>x<b>", "3", "</b>px"];
      info[1] = width;
      info[3] = height;
      infoblock.html(info.join(""));
   }

   function MakePopupWithThumbPreview(fromData, thumb) {
      return Comman.execute(
         UtilsCommands.MAKE_POPUP,
         thumb,
         fromData,
         "top left"
      ).then(function () {
         thumb.css("background-color", "whitesmoke");
      }, function () {
         thumb.css("background-color", "grey");
      });
   }

   // TODO: Вынести в команду
   function MakeSnapShoot(video, width, height) {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(video, 0, 0, width, height);
      var dataURI = canvas.toDataURL('image/jpeg');
      return dataURI;
   }

   function AppendVideoToContainer(videoData, $container, callback) {
      let video = document.createElement('video');
      let $video = $(video);

      video.controls = true;

      video.onerror = function(e) {
         video.onerror = null;
         $container.empty();
         $container.css("background-color", "#FD7474;");
         $container.append("<div style='text-align:center; margin-top:"+($container.height()*0.5)+"px;'>НЕЛЬЗЯ ВОСПРОИЗВЕСТИ ВИДЕО</div>")

         Output_VideoDataVO.width = Math.floor($container.width());
         Output_VideoDataVO.height = Math.ceil(Output_VideoDataVO.width * 0.618);

         if(callback) callback(true);
      };

      video.onloadedmetadata = function(e) {
         video.onloadedmetadata = null;

         let prop = video.videoHeight / video.videoWidth;

         $container.empty();
         $container.append(video);
         $container.css({
            height : $container.width() * prop
         ,  "background-image":"none"
         ,  "background-color":"white"
         });

         Output_VideoDataVO.width = video.videoWidth;
         Output_VideoDataVO.height = video.videoHeight;

         console.log("onloadedmetadata", Output_VideoDataVO);

         if(callback) callback();
      };

      video.src = videoData;
      video.load();
   }

   let mediaSettings = CMSSettings.public.cms.media;

   return {
      title    : Output_VideoDataVO.title
   ,  text     : Output_VideoDataVO.text

   ,  acceptableVideoTypes: mediaSettings.acceptableVideoTypes
   ,  acceptableImageTypes: mediaSettings.acceptableImageTypes

   ,  isVideoFileAvailable: Output_VideoDataVO.file != null

   ,  thumbChooserColor: function () {
         let style = { background: Output_VideoDataVO.thumb ? "whitesmoke" : "grey" } ;
         return style;
      }

   ,  confirmEnabled: true
   ,  ProcessConfirm:function (e) {
         Output_VideoDataVO.title  = this.title();
         Output_VideoDataVO.text   = this.text();
         $(".modal").data("output", [Output_VideoDataVO]);
      }
   ,  SnapShoot:function () {
         let video = this.videoContainer.find("video").get(0);
         let thumb = this.thumbChooserPopup;

         if(video) {
            let that = this;
            let Run = function () {
               let dataURI = MakeSnapShoot(
                  video,
                  Output_VideoDataVO.width,
                  Output_VideoDataVO.height
               );
               MakePopupWithThumbPreview(dataURI, thumb)
               .then(function () {
                  Output_VideoDataVO.thumb = dataURI;
               });
            }
            if(video.readyState == video.HAVE_ENOUGH_DATA) Run();
            else video.oncanplay = Run;
         }
      }
   ,  ChooseVideo:function () {
         console.log("Choose Video!");
         let chooser = this.videoChooser.get(0);
         this.videoChooser.trigger('click');
      }
   ,  ChooseImage:function (e) {
         console.log("ChooseImage");
         let that = this;
         let chooser = this.imageChooser.get(0);
         document.body.onfocus = function () {
            document.body.onfocus = null;
            if(chooser.files.length == 0) {

            }
         }
         that.thumbChooserPopup.popup('hide');
         this.imageChooser.trigger('click');
      }
   ,  ImageChanged:function () {
         let chooser = this.imageChooser.get(0);
         let file    = chooser.files[0];
         let that    = this;
         if(file) {
            MakePopupWithThumbPreview(file, this.thumbChooserPopup).then(function () {
               Output_VideoDataVO.thumb = file;
            });
            // this.confirmEnabled(true);
         }
      }
   ,  TextChanged:function () {

      }
   ,  TitleChanged: function () {

      }
   ,  VideoChanged:function () {
         console.log("Video Changed");
         let chooser = this.videoChooser.get(0);
         let file    = chooser.files[0];
         let that    = this;
         if(file) {
            console.log("VideoChanged", file);
            let nameSplitted = file.name.split(".");
            nameSplitted = nameSplitted.slice(0,-1);
            that.title(nameSplitted.join("."));

            that.videoContainer
            .css("background-color", "")
            .append('<div class="ui active loader">')

            Output_VideoDataVO.file = file;
            PreviewFile(
               file,
               that.videoContainer,
               function (error) {
                  if(!error) {
                     ShowMediaInfo(
                        that.videoInfo,
                        Output_VideoDataVO.width,
                        Output_VideoDataVO.height
                     );
                  }
                  that.SnapShoot();
                  that.isVideoFileAvailable(true);
                  // that.confirmEnabled(true);
               });
         }
         // else that.confirmEnabled(false);
      }
   ,  onRendered: function () {
         let that = this;
         if(CheckEditModeAndPreviewVideoInside(this.videoContainer)){
            ShowMediaInfo(this.videoInfo, Input_VideoDataVO.width, Input_VideoDataVO.height);
            MakePopupWithThumbPreview(Output_VideoDataVO.thumb, this.thumbChooserPopup);
            // this.confirmEnabled(true);
         } else {
            this.videoInfo.html("");
         }

         console.log("\n VIDEO CONTENT MODAL RENDERED \n")
      }
   }
});
