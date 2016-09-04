(function(){
   PackVO = function (input) {
      console.log("NEW PACK: ", typeof input);
      if(typeof input === "string") { // input == sid
         _.extend(this, new ContentVO(
            input,
            ContentTypes.PACK,
            new PackDataVO()
         ));
      }
      else {
         _.extend(this, input);
      }
   }
})()
