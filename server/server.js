
Content.allow({
   insert: function(userId, doc){
      return true;
   },
   update: function(userId, doc, fieldNames, modifier){
      return true;
   },
   remove: function(){
      return true;
   }
});

Sections.allow({
   insert: function(userId, doc){
      return _.without(_.keys(doc), 'name').length > 0;
   },
   update: function(userId, doc, fieldNames, modifier){
      return true;
   },
   remove: function(doc){
      return true;
   }
});

var originalFs = Npm.require('fs');

Images.allow({
   download: function(userId, fileObj) {
      let mounted = fileObj.isMounted();
      let primiryStore = mounted.primaryStore;

      let storeName = primiryStore.name;

      let isFileStored = fileObj.hasStored(storeName);

      let fileRecord = fileObj.getFileRecord();
      let filePath = primiryStore.path;
      let fileName = fileRecord.copies[storeName].key;

      // console.log(originalFs);
      // console.log("Is Image: ", fileObj.isImage());
      // console.log("isFileStored: ", isFileStored);
      // console.log("FileName: ", fileName);

      filePath += "/" + fileName;

      // console.log("FilePath: ", filePath);

      let stat = originalFs.existsSync(filePath);
      // console.log("FileExist:", stat);

      return isFileStored && stat;
   },
   insert: function(){
      return true;
   },
   update: function(){
      return true;
   },
   remove: function(){
      return true;
   }
});

Videos.allow({
   download: function(userId, fileObj) {
      return true;
   },
   insert: function(){
      return true;
   },
   update: function(){
      return true;
   },
   remove: function(){
      return true;
   }
});

Meteor.users.allow({
   insert: function(){
      return true;
   },
   update: function(){
      return true;
   },
   remove: function(){
      return true;
   }
});

// Disabling Client-side Accounts Creation
AccountsTemplates.configure({
   forbidClientAccountCreation: true
});

//TODO: CREATE DB user
// https://docs.mongodb.org/manual/reference/method/db.createUser/
/*
db.createUser(
{
user: "admin",
pwd: "qwerty123456",
roles: [ "readWrite", "dbAdmin" ]
}
)
*/

Meteor.startup(function () {
   //process.env.MONGO_URL = 'mongodb://localhost:27001/meteor-local';
   // console.log(Meteor.settings);
   // process.env.METEOR_SETTINGS = {

      // public: {
      //    cms: {
      //       title: "Северсталь CMS 5.4",
      //       description: "Небольшое описание того что здесь находится",
      //       media: {
      //          acceptableImageTypes  : ".jpg, .png, .jpeg, .tif, .tiff|images/*",
      //          acceptableVideoTypes  : "video/*",
      //          imageMaxWidth         : 1080,
      //          imageMaxHeight        : 1920
      //       },
      //       fonts: {
      //          google: { families: [ "Open+Sans:700italic:latin,cyrillic", "Montserrat:400,700:latin" ] },
      //          regular: [
      //             {
      //                fontName : "Cubano Regular",
      //                fontPath : "Cubano-Regular.otf",
      //                fontWeight : "400"
      //             }
      //          ]
      //       },
      //       textContentDefaultBackground : "#f1f1f1",
      //       text: {
      //          default_render_width     : 1080,
      //          default_render_padding   : 0,
      //          default_render_scale     : 1,
      //          default_render_lineheight: 20,
      //          default_render_fontname  : "Helvetica Neue",
      //          default_render_weight    : "300",
      //          fontsize_formats         : "14px 16px 18px 20px 24px 28px 32px 38px 46px 54px",
      //          font_formats             : "Helvetica Neue=Helvetica Neue;Helvetica Neue Light=Helvetica Neue Light;Helvetica Neue Medium=Helvetica Neue Medium;Helvetica Neue Bold=Helvetica Neue Bold;Fira Sans=fira sans;Roboto=Roboto;Arial=arial,helvetica,sans-serif;",
      //          style_formats: [
      //             { title: "Заголовки", items: [
      //                {
      //                   title: "Основной заголовок", selector: "p",
      //                   styles: {
      //                      // text-align         : "center",
      //                      // font-size          : "32px",
      //                      // margin             : "0px",
      //                      // line-height        : "40px",
      //                      // font-family        : "Helvetica Neue",
      //                      // text-transform     : "uppercase"
      //                   }
      //                }
      //             ]},
      //             { title: "Контент", items: [
      //                {
      //                   title: "Название описания", selector: "p",
      //                   styles: {
      //                      // "font-size"          : "24px",
      //                      // margin             : "0px",
      //                      // "line-height"        : "24px",
      //                      // "font-family"        : "Helvetica Neue Medium"
      //                   }
      //                },
      //                {
      //                   title: "Основной текст", selector: "p",
      //                   styles: {
      //                      // "font-size"          : "16px",
      //                      // "font-family"        : "Helvetica Neue",
      //                      // margin             : "10px 0",
      //                      // "line-height"        : "18px"
      //                   }
      //                }
      //             ]}
      //          ]
      //       },
      //       section: {
      //          default_render_width     : 540,
      //          default_render_padding   : 0,
      //          default_render_lineheight: 24,
      //          default_render_fontname  : "Helvetica Neue Light",
      //          default_render_fontsize  : 24,
      //          default_render_weight    : "400"
      //       },
      //       shortcuts: {
      //          reRenderText : "L",
      //          reRenderSection : "K"
      //       }
      //    }
      // },
   //    pathToContent:"D:/uploads"
   // }
});

// Prevent non-authorized users from creating new users
Accounts.validateNewUser(function (user) {
   var loggedInUser = Meteor.user();
   if (Roles.userIsInRole(loggedInUser, ['admin'])) {
      // NOTE: This example assumes the user is not using groups.
      return true;
   }
   throw new Meteor.Error(403, "You are not authorized to create new users");
});

Accounts.onCreateUser(function(options, user) {
   console.log("Accounts.onCreateUser:", options, user);
   if (options.profile) {
      user.profile = options.profile;
   }
   user.profile.settings = new SettingsVO();
   return user;
});
