Template.textModal.viewmodel(function (textVO) {

   let Output_TextDataVO = new TextDataVO();
   let Output_TextImageDataVO = new TextImageDataVO();

   let Input_TextDataVO = textVO.data;

   let cmsSettings   = CMSSettings.public.cms;
   let textSettings  = cmsSettings.text;

   // Эти параметры можно вынести в настройки всего приложения
   let imageWidth    = textSettings.default_render_width;
   let imagePadding  = textSettings.default_render_padding;
   let textScale     = textSettings.default_render_scale;
   let lineHeight    = textSettings.default_render_lineheight;

   let textImage = Input_TextDataVO.image;
   let generateImageFromText = textImage != null;

   Output_TextDataVO.title = Input_TextDataVO.title;

   let isPreviewInProcess = false;
   let isApplyWithToContainer = false;

   if(generateImageFromText) {
      imageWidth     = textImage.width;
      imagePadding   = textImage.padding;
      lineHeight     = textImage.linehgt;
      textScale      = textImage.scale;
      Output_TextImageDataVO = textImage;
   }

   return {
         // PUBLIC VARIABLES
         generateChecked: generateImageFromText
      ,  imageWidth     : imageWidth
      ,  imagePadding   : imagePadding
      ,  lineHeight     : lineHeight
      ,  textScale      : textScale
      ,  saveAsStandart : false

      ,  title          : Output_TextDataVO.title


      ,  CollectSetting : function () {

            Output_TextImageDataVO.width   = this.imageWidth();
            Output_TextImageDataVO.padding = this.imagePadding();
            Output_TextImageDataVO.linehgt = this.lineHeight(); // Line height
            Output_TextImageDataVO.scale   = this.textScale();

            Output_TextImageDataVO.font    = textSettings.default_render_fontname;
            Output_TextImageDataVO.weight  = textSettings.default_render_weight;
            return Output_TextImageDataVO;
      }
      ,  LineHeightChanged: function () {
            let lh = this.lineHeight();
            if(lh && lh > 0) {
               let dom = tinyMCE.activeEditor.dom;
               dom.setStyle(
                  dom.select('p'),
                  "line-height",
                  (this.lineHeight() + "px")
               );
            }
      }
      ,  WidthToContainer: function (value) {
            let activeEditor = tinymce.activeEditor;
            if(activeEditor) {
               let body = $(activeEditor.getBody());
               let bwidth = "";
               if(value) {
                  bwidth = this.imageWidth();
               }
               body.css("width", bwidth);
            }
            isApplyWithToContainer = value;
      }
      ,  WidthChanged:function () {
            let wd = this.imageWidth();
            if(isApplyWithToContainer && wd && wd > 0) {
               let body = tinymce.activeEditor.getBody();
               $(body).css("width", wd);
            }
         }
      ,  PaddingChanged:function () {
            let pd = this.imagePadding();
            let body = tinymce.activeEditor.getBody();
            $(body).css("padding", pd + "px");
         }
      ,  ProcessConfirm:function (e) {
         let editor        = this.textEditor;

         Output_TextDataVO.html      = editor.html();
         Output_TextDataVO.text      = editor.text();
         Output_TextDataVO.title     = this.title();

         if(this.generateChecked()) {
            Output_TextDataVO.image = this.CollectSetting();
         } else {
            // При таком раскладе картинка с рендерингом текста удалиться
            // а новая не будет создана. Проверяется в команде ContentCommands.EDIT_TEXT
            Output_TextDataVO.image = null;
         }

         $(".modal").data("output", [ Output_TextDataVO, this.saveAsStandart() ]);
      }
      ,  onRendered: function () {
            let that      = this;
            let editor    = this.textEditor;
            let PreviewText = function (tabPath) {
               if(tabPath == "preview") {
                  let activeTab = $(this);
                  let generatePossible = that.generateChecked()
                     && editor.text().length > 0;

                  activeTab.css("background", cmsSettings.textContentDefaultBackground);

                  if(generatePossible && isPreviewInProcess === false) {
                     activeTab.addClass("loading");
                     isPreviewInProcess = true;
                     Comman.execute(
                        ContentCommands.PREVIEW_RENDER_HTML,
                        editor.html(),
                        that.CollectSetting(),
                        activeTab.find(".preview")
                     ).then(function() {
                        isPreviewInProcess = false;
                        activeTab.removeClass("loading");
                     });
                  }
               } else if(tabPath == "edit") {
                  $(".modal").marginOffsetToCenter();
               }
            }

            var TinyMCESettings = {
               height      : 200,
               menubar     : false,  // removes the menubar
               statusbar   : true,
               plugins     : ['textcolor colorpicker advlist lists code'],
               toolbar1     : 'newdocument removeformat | insertfile undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright alignjustify | code',
               toolbar2    : 'styleselect formatselect fontselect fontsizeselect | bullist numlist outdent indent',
               fontsize_formats: textSettings.fontsize_formats,
               font_formats: textSettings.font_formats,
               style_formats: textSettings.style_formats,
               content_css : ['merged-stylesheets.css', "styles/tinymce.editor.css"]
            }

            TinyMCESettings.init_instance_callback = function (editor) {
               that.LineHeightChanged();
               that.PaddingChanged();
               $(editor.getBody()).css({
                  "font-family": textSettings.default_render_fontname
               ,  "font-weight": textSettings.default_render_weight
               ,  "background": cmsSettings.textContentDefaultBackground
               ,  "margin" : 0
               });

               let fonts = CMSSettings.public.cms.fonts;
               let head = $(editor.getBody());
               _.forEach(fonts.regular, function (font) {
                  head.append("<style type=\"text/css\">" +
                  "@font-face {\n" +
                  "font-family: \""+ font.fontName +"\";\n" +
                  "src: local('☺'), url('/fonts/"+ font.fontPath +"');\n" +
                  "font-weight: \"" + font.fontWeight + "\";\n" +
                  "}</style>");
               });
            }

            editor.tinymce(TinyMCESettings);
            if(this.generateCheckbox)
               this.generateCheckbox.checkbox();

            this.tabMenu.find(".item").tab({
               cache: false,
               alwaysRefresh: false,
               onLoad: PreviewText
            });

            /* Задаем данные */
            tinymce.activeEditor.setContent(textVO.data.html || "");

            console.log("\n TEXT MODAL RENDERED \n")

            $(".modal").marginOffsetToCenter();

         }
      }
   });
