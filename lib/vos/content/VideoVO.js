(function(){
   VideoVO = function (input) {
      console.log("NEW VIDEO: ", typeof input);
      if(typeof input === "string") { // input == sid
         _.extend(this, new ContentVO(
            input,
            ContentTypes.VIDEO,
            new VideoDataVO()
         ));
      }
      else {
         _.extend(this, input);
      }
   }
})()
