(function(){
   ImageVO = function (input) {
      console.log("NEW IMAGE: ", typeof input);
      if(typeof input === "string") { // input == sid
         _.extend(this, new ContentVO(
            input,
            ContentTypes.IMAGE,
            new ImageDataVO()
         ));
      }
      else {
         _.extend(this, input);
      }
   }
})()
