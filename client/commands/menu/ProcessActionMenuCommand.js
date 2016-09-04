(function(Comman){
    // handle the command
   Comman.handle(MenuCommands.PROCESS_ACTION, function(command, section) {
      console.log("> MenuCommands.PROCESS_ACTION", command, section);
      let that = this;
      let NotAllowAction = (command == SectionCommands.DELETE_SECTION)
                        || (command == SectionCommands.EDIT_SECTION)
      if(!section && NotAllowAction) {
         toastr.error("Эта операция не может быть выполнена!", "Нету секций.");
         that.reject();
      } else {
         Comman.execute(command, section).then(function () {
            that.resolve();
         });
      }
});
})(Comman);
