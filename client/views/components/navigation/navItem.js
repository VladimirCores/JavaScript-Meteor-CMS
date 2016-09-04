Template.navItem.viewmodel(
{
   isLast:function () {
      return this.parent().isNavLast(this.index());
   },
   NavigateToMe:function () {
      this.parent().NavigateTo(this.id());
   }
})
