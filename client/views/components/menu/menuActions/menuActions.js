Template.menuActions.viewmodel(function (context) {
   return {
      share    : 'active'
   ,  contentActions  : [
         new MenuActionVO("Картинка", 'photo',
            ContentCommands.CREATE_IMAGE),
         new MenuActionVO("Видео", 'film',
            ContentCommands.CREATE_VIDEO),
         new MenuActionVO("Текст", 'newspaper',
            ContentCommands.CREATE_TEXT),
         new MenuActionVO("Набор", 'grid layout',
            ContentCommands.CREATE_PACK)
      ]
   ,  sectionActions  : [
         new MenuActionVO("Создать", 'add circle',
            SectionCommands.CREATE_SECTION),
         new MenuActionVO("Изменить", 'code',
            SectionCommands.EDIT_SECTION),
         new MenuActionVO("Перенести", 'sort content ascending',
            SectionCommands.SORT_SECTIONS),
         new MenuActionVO("Удалить", 'bomb',
            SectionCommands.REMOVE_SECTION)
      ]
   ,  onRendered: function(){
         this.dropdown.dropdown(
         {
            on          : 'hover'
         ,  action      : "hide"
         ,  allowTab    : false
         ,  transition  : 'fade down'
         });
      }
   ,  processAction: function(menuCommand) {
         let activeSection = this.section();
         Comman.execute(
            MenuCommands.PROCESS_ACTION,
            menuCommand,
            activeSection
         );
      }
}
});
