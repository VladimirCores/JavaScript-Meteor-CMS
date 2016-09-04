Template.navigation.viewmodel(
{
   navigation: function () {
      if(Meteor.user()) {
         let currentUserProfile = Meteor.user().profile;
         let navigation = currentUserProfile.navigation;
         return (navigation && Array.isArray(navigation) && navigation.length > 0) ? navigation : null;
      } else {
         return null;
      }
   }
,  isNavLast:function (index) {
      let nav = this.navigation();
      return nav ? nav.length == index : false;
   }
,  NavigateTo:function (id) {
      console.log("Navigate To,", id);
      Comman.execute(MenuCommands.SELECT_SECTION, id, true);
   }
})
