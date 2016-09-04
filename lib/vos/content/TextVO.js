(function(){
   TextVO = function (input) {
      if(typeof input === "string") { // input == sid
         _.extend(this, new ContentVO(
            input,
            ContentTypes.TEXT,
            new TextDataVO()
            ));
      }
      else {
         _.extend(this, input);
      }
   }
})()
