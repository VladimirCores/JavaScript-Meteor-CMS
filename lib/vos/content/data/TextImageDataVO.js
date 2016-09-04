(function(){
   TextImageDataVO = function () {
      this.file    = null;
      this.height  = 0; // Задается после рендера html в картинку
      // Параменты необходимые для генерации картинки
      this.width   = 0;
      this.padding = 0;
      this.linehgt = 0; // Line height
      this.scale   = 0;
      this.center  = false;
      this.font    = "";
      this.weight  = 0;
   }
})()
