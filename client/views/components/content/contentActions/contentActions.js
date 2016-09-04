Template.contentActions.viewmodel(
function (context) {

   let EditContentCommand = function(ctype){
      switch (ctype) {
         case ContentTypes.TEXT:
            return ContentCommands.EDIT_TEXT;
         case ContentTypes.IMAGE:
            return ContentCommands.EDIT_IMAGE;
         case ContentTypes.VIDEO:
            return ContentCommands.EDIT_VIDEO;
         case ContentTypes.PACK:
            return ContentCommands.EDIT_PACK;
         default:
         break;
      }
   }(context.type);

   return {
      onRendered: function(){
         this.dropdown.dropdown(
         {
               on          : 'hover'
            ,  action      : "hide"
            ,  allowTab    : false
            ,  transition  : 'fade down'
         })
      }
   ,  contentActions  : [
         new MenuActionVO("Редактировать", 'folder open',
            EditContentCommand)
      ,  new MenuActionVO("Удалить", 'trash',
            ContentCommands.REMOVE_CONTENT)
      ]
   ,  processAction: function (contentCommand) {
         console.log("> contentActions.processAction:", contentCommand);
         Comman.execute(contentCommand, this.templateInstance.data, true);
         return false;
      }
   }
})
