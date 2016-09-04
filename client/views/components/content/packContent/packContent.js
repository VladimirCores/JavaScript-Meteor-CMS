Template.packContent.viewmodel(function (packVO) {
   // body...
return {
   imageURL:function (id) {
      let img = Images.findOne(id);
      return img ? img.url({brokenIsFine: true}) : null;
   }
,  onRendered: function () {

   }
}
});
