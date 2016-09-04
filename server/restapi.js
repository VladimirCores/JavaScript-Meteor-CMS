Router.route('/api/sections', { where: 'server' })
  .get(function () {
     let _secs = Sections.find({subof: false},{fields: {_id: 1, position: 1, active: 1, data: 1}}).fetch();
     let secs = [];

     for (let i=0; i< _secs.length; i++){
        let v = new ApiSection(_secs[i]);
        FillSections(v);
        secs.push(v);
     }

     this.response.writeHead(200, {'Content-Type': 'text/html'});
     this.response.end(JSON.stringify(secs));
  })
  .post(function () {
    // POST /webhooks/stripe
  })

  var FillSections = function(section){
     if (Sections.find({subof: section._id}).count()>0){
        let _secs = Sections.find({subof: section._id}).fetch();
        section.sections = [];
        for (let i=0; i<_secs.length; i++){
           let v = new ApiSection(_secs[i]);
           FillSections(v);
           section.sections.push(v);
        }
     }
 }

 function ApiSection(section) {
   this.name = section.data.name;
   this._id = section._id;
   this.position = section.position;

   if (section && section.data && section.data.icon && section.data.icon.file){
      this.icon = section.data.icon.file.url();
   }
   else {
      this.icon ="";
   }
   if(section && section.data && section.data.image && section.data.image.file){
      this.image = section.data.image.file.url();
   }
   else {
      this.image = "";
   }

   this.content = [];
   let _cont = Content.find({sid: section._id}).fetch();

   for (let i=0; i< _cont.length; i++){
      let c = {};
      c.type = _cont[i].type;
      c._id = _cont[i]._id;
      c.position = _cont[i].position;

      if (c.type === ContentTypes.VIDEO)
      {
         c.file = "";
         if (_cont[i] && _cont[i].data && _cont[i].data.file)
            c.file = _cont[i].data.file.url()

         c.thumb = "";
         if (_cont[i] && _cont[i].data && _cont[i].data.thumb)
            c.thumb = _cont[i].data.thumb.url()

         c.title = _cont[i].data.title
         c.text = _cont[i].data.text
      }

      if (c.type === ContentTypes.IMAGE)
      {
         c.file = "";
         if (_cont[i] && _cont[i].data && _cont[i].data.file)
            c.file = _cont[i].data.file.url()
         c.title = _cont[i].data.title
         c.text = _cont[i].data.text
      }

      if (c.type === ContentTypes.TEXT)
      {
         c.file = "";
         if (_cont[i] && _cont[i].data && _cont[i].data.image && _cont[i].data.image.file)
            c.file = _cont[i].data.image.file.url()
         c.title = _cont[i].data.title
         c.text = _cont[i].data.text
      }

      this.content.push(c);
   }
 }
