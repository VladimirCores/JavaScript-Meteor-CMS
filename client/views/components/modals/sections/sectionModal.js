Template.sectionModal.viewmodel(function (sectionVO) {

   let Output_SectionDataVO = new SectionDataVO();

   let Output_SectionIconVO = new SectionIconVO();
   let Output_TextImageDataVO = new TextImageDataVO();

   let Input_SectionDataVO = sectionVO.data;

   let sectionSettings = CMSSettings.public.cms.section;

   let imageWidth    = sectionSettings.default_render_width;
   let imagePadding  = sectionSettings.default_render_padding;
   let lineHeight    = sectionSettings.default_render_lineheight;
   let fontSize      = sectionSettings.default_render_fontsize;

   function CheckEditModeAndPreviewImageInside(container) {
      if(   Input_SectionDataVO.icon
         && Input_SectionDataVO.icon.file
         && Input_SectionDataVO.icon.file.url
         && typeof Input_SectionDataVO.icon.file.url === "function") {
         Output_SectionIconVO.file = Input_SectionDataVO.icon.file;
         Comman.execute(
            UtilsCommands.APPEND_IMAGEDATA_TO_CONTAINER,
            Input_SectionDataVO.icon.file.url(),
            container
         );
      }
   }

   return {
      generateChecked: true
   ,  isSubsection   : true
   ,  centerize      : false
   ,  imageWidth     : imageWidth
   ,  lineHeight     : lineHeight
   ,  fontSize       : fontSize
   ,  title          : sectionVO.title
   ,  name           : Input_SectionDataVO.name
   ,  canDeleteIcon  : Input_SectionDataVO.icon != null
   ,  showSubSectionCheckbox   : sectionVO.subof == null
   ,  ProcessConfirm : function () {
         let needToGenerateImage = this.generateChecked();
         let needToSaveIcon = Output_SectionIconVO.file != null;
         let sectionTitle = this.title();

         Output_SectionDataVO.name = this.name();

         if(needToGenerateImage) {
            Output_SectionDataVO.image = this.CollectSetting();
         }

         if(needToSaveIcon) {
            Output_SectionDataVO.icon = Output_SectionIconVO;
         }

         // Задаем будет ли секция подсекцией
         sectionVO.subof = this.isSubsection();

         $(".modal").data("output", [ Output_SectionDataVO, sectionTitle ]);
      }
   ,  RemoveIcon : function (e) {
         e.stopImmediatePropagation();
         if(Output_SectionIconVO.file) {
            this.imageContainer.find("img").remove();
            this.imageContainer.removeAttr("style");
            Output_SectionIconVO.file = null;
            this.canDeleteIcon(false);
         }
      }
   ,  CollectSetting : function () {
         Output_TextImageDataVO.padding = 0;
         Output_TextImageDataVO.width   = this.imageWidth();
         Output_TextImageDataVO.linehgt = this.lineHeight(); // Line height
         Output_TextImageDataVO.center  = this.centerize();
         Output_TextImageDataVO.scale   = this.fontSize() + "px";

         Output_TextImageDataVO.font    = sectionSettings.default_render_fontname;
         Output_TextImageDataVO.weight  = sectionSettings.default_render_weight;

         return Output_TextImageDataVO;
      }
   ,  ImageChanged:function () {
         let chooser = this.imageChooser.get(0);
         let file    = chooser.files[0];
         let that    = this;
         if(file) {
            Comman.execute(
               UtilsCommands.PREVIEW_IMAGE_INSIDE_CONTAINER,
               file,
               that.imageContainer
            ).then(function (img) {
               Output_SectionIconVO.file = file;
               Output_SectionIconVO.width = img.width;
               Output_SectionIconVO.height = img.height;
               that.canDeleteIcon(true);
               that.imageContainer.height(img.height);
            });
         }
      }
   ,  FontSizeChanged:function (value) {
         this.lineHeight(value);
      }
   ,  ChooseImage:function () {
         let that = this;
         let chooser = this.imageChooser.get(0);
         this.imageChooser.trigger('click');
      }
   ,  onRendered: function () {
         let that = this;

         if(this.generateCheckbox)
            this.generateCheckbox.checkbox();

         this.tabMenu.find(".item").tab({
            cache: false, alwaysRefresh: false,
            onLoad: function (tabPath) {
               if(tabPath == "preview") {
                  let activeTab = $(this);
                  let inputValue = that.name();
                  let generatePossible = that.generateChecked()
                           && inputValue.length > 0;

                  if(generatePossible) {
                     let settings = that.CollectSetting();
                     let preview = activeTab.find(".preview");
                     activeTab.addClass("loading");
                     Comman.execute(
                        ContentCommands.PREVIEW_RENDER_HTML,
                        inputValue,
                        settings,
                        preview
                     ).then(function () {
                        activeTab.removeClass("loading");
                     });
                  }
               }
            }
         });

         CheckEditModeAndPreviewImageInside(this.imageContainer);

      }
   }
})
