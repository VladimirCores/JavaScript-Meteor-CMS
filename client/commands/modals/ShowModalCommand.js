(function(Comman){
   var TemplateAttach = function(template, next, data) {
      var instance = null;
      if (typeof template === "string") template = Template[template];
      if (template)
      {
         if (data) instance = Blaze.renderWithData(template, data, document.body);
         else instance = Blaze.render(template, document.body);
      }
      return next && next.call(this, instance);
   };

   Comman.handle(ModalCommands.SHOW_MODAL, function(name, data, next) {
      let that = this;
      console.log("> ModalCommands.SHOW_MODAL", that.promise.inspect());
      TemplateAttach(name, function (instance) {
         if(instance) {
            $(".modal").modal({
               debug       : false,
               verbose     : false,
               detachable  : false,
               observeChanges: true,
               onHidden : function () {
                  $('.ui.dimmer.page').remove();
                  $(".modal").remove();
               },
               onApprove : function(e) {
                  if(next){
                     // TODO: CHANGE THE WAY OF PIPING DATA
                     let data = $(".modal").data("output");
                     return data ? next.apply(that, data) : next.call(that);
                  }
               }
            }).modal('show');
         } else {
            that.reject();
            ErrorMessages.NO_TEMPLATE();
         }
      }, data);
   });
})(Comman);
