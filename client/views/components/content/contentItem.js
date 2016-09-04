Template.contentItem.viewmodel(
{
      whenModified : function () {
         return new Date( this.modifiedAt() ).toLocaleString();
      }
   ,  whenCreated : function () {
         return new Date( this.createdAt() ).toLocaleString();
   }
   ,  isText: function () {
      return this.type() === ContentTypes.TEXT;
   }
   ,  isImage: function () {
      return this.type() === ContentTypes.IMAGE;
   }
   ,  isVideo: function () {
         return this.type() === ContentTypes.VIDEO;
   }
   ,  isPack: function () {
      return this.type() === ContentTypes.PACK;
   }
});
