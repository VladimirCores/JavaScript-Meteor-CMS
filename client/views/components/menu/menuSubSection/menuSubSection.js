Template.menuSubSection.viewmodel(
{
   isActive: function () {
      return this.active();
   },
   NavigateOnSubsection:function () {
      Comman.execute(MenuCommands.SELECT_SECTION, this._id(), true);
   }
})
