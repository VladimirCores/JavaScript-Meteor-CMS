Utils = function () {


   jQuery.fn.extend({
      marginOffsetToCenter: function() {
         let windowHeightHalf = window.innerHeight * 0.5;
         let hght = this.height();
         let topOffset = -hght* 0.5;
         if(Math.abs(topOffset) > windowHeightHalf) {
            topOffset = -windowHeightHalf * 0.9;
         }
         this.css("margin-top", topOffset);
      }
   });

   return {
      CenterImageInContainer : function(image, container) {
         let iw = image.width;
         let ih = image.height;
         let pw = container.width();
         let ph = container.height();

         if(iw > pw) {
            image.width = pw;
            image.height = pw * ih / iw;
         } else {
            $(image).css("left", (pw - iw)*0.5);
         }
         container.height(image.height);
         container.append(image);
      },
      GetBase64Data : Meteor.wrapAsync(function(file, callback) {
         // callback has the form function (err, res) {}
         // console.log(file);
         // Meteor._sleepForMs(1);
         var buffer = [];
         file.once('readable', function() {
              buffer = Buffer.concat([buffer, readStream.read()]);
          });
          file.once('error', function(err) {
              callback(err, null);
          });
          file.once('end', function() {
              // done
              callback(null, buffer.toString('base64'));
          })
      })
   }
}()
