CMSSettings = {
   "public": {
      "cms": {
         "title": "Северсталь CMS 5.4",
         "description": "Небольшое описание того что здесь находится",
         "media": {
            "acceptableImageTypes"  : ".jpg, .png, .jpeg, .tif, .tiff|images/*",
            "acceptableVideoTypes"  : "video/*",
            "imageMaxWidth"         : 1080,
            "imageMaxHeight"        : 1920
         },
         "fonts": {
            "google": { "families": [ "Open+Sans:700italic:latin,cyrillic", "Montserrat:400,700:latin" ] },
            "regular": [
               {
                  "fontName" : "Cubano Regular",
                  "fontPath" : "Cubano-Regular.otf",
                  "fontWeight" : "400"
               }
            ]
         },
         "textContentDefaultBackground" : "#f1f1f1",
         "text": {
            "default_render_width"     : 1080,
            "default_render_padding"   : 0,
            "default_render_scale"     : 1,
            "default_render_lineheight": 20,
            "default_render_fontname"  : "Helvetica Neue",
            "default_render_weight"    : "300",
            "fontsize_formats"         : "14px 16px 18px 20px 24px 28px 32px 38px 46px 54px",
            "font_formats"             : "Helvetica Neue=Helvetica Neue;Helvetica Neue Light=Helvetica Neue Light;Helvetica Neue Medium=Helvetica Neue Medium;Helvetica Neue Bold=Helvetica Neue Bold;Fira Sans=fira sans;Roboto=Roboto;Arial=arial,helvetica,sans-serif;",
            "style_formats": [
               { "title": "Заголовки", "items": [
                  {
                     "title": "Основной заголовок", "selector": "p",
                     "styles": {
                        "text-align"         : "center",
                        "font-size"          : "32px",
                        "margin"             : "0px",
                        "line-height"        : "40px",
                        "font-family"        : "Helvetica Neue",
                        "text-transform"     : "uppercase"
                     }
                  }
               ]},
               { "title": "Контент", "items": [
                  {
                     "title": "Название описания", "selector": "p",
                     "styles": {
                        "font-size"          : "24px",
                        "margin"             : "0px",
                        "line-height"        : "24px",
                        "font-family"        : "Helvetica Neue Medium"
                     }
                  },
                  {
                     "title": "Основной текст", "selector": "p",
                     "styles": {
                        "font-size"          : "16px",
                        "font-family"        : "Helvetica Neue",
                        "margin"             : "10px 0",
                        "line-height"        : "18px"
                     }
                  }
               ]}
            ]
         },
         "section": {
            "default_render_width"     : 540,
            "default_render_padding"   : 0,
            "default_render_lineheight": 24,
            "default_render_fontname"  : "Helvetica Neue Light",
            "default_render_fontsize"  : 24,
            "default_render_weight"    : "400"
         },
         "shortcuts": {
            "reRenderText" : "L",
            "reRenderSection" : "K"
         }
      }
   },
   "pathToContent":"D:/uploads"


}
