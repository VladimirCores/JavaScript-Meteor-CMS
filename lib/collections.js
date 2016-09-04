_ = lodash;

Content = new Mongo.Collection("Content", {
   transform: function (doc) { return new ContentVO(doc); }
});

Sections = new Mongo.Collection("Sections", {
   transform: function (doc) { return new SectionVO(doc); }
});

let pathToContent = CMSSettings.pathToContent;

Images = new FS.Collection("SeverstalImages", {
  stores: [new FS.Store.FileSystem("SeverstalImageStore", {path: pathToContent+"/images"})]
});


Videos = new FS.Collection("SeverstalVideos", {
  stores: [new FS.Store.FileSystem("SeverstalVideoStore", {path: pathToContent+"/videos"})]
});
