Template.menu.viewmodel({
   share          : "active"
,  select         : function(id, navback) {
      let activeSection = this.section();
      if(!activeSection || !activeSection._id.equals(id)) {
         Comman.execute(MenuCommands.SELECT_SECTION, id, navback);
      }
   }
,  allSubSections:function () {
      let activeSection = this.section();
      return activeSection ? Sections.find({subof:activeSection.subof}, {sort:{position:1}}).fetch() : null;
   }
,  subsectionActiveSection:function () {
      let activeSection = this.section();
      return Sections.find({subof:activeSection ? activeSection._id : false}, {sort:{position:1}}).fetch();
   }
,  rename: function (value) {
      Comman.execute(SectionCommands.RENAME_SECTION, value, this.section());
   }
,  NavigateBack:function () {
      let activeSection = this.section();
      let id = activeSection && activeSection.subof ? activeSection.subof : null;
      this.select(id, true);
   }
,  onDestroyed    : function () {
      $('.main.menu').remove();
   }
,  onCreated:function () {
   let that = this;
   let cursor = Sections.find({active:true});
   let handle = cursor.observeChanges({
      added : function (id, doc) {
         let currentSection = that.section();
         doc = Sections.findOne(id);
         if(!currentSection || (currentSection && !currentSection._id.equals(id))) {
            that.section(doc);
         }
      },
      removed: function (id) {
         let section = Sections.findOne({_id:id});
         if(section && !section.root) {
            that.section(null);
         }
      }
   });
   }
,  onRendered     : function() {
      let that = this;

      let cmsSettings =  CMSSettings.public.cms.shortcuts;

      let reRenderText = cmsSettings.reRenderText.charCodeAt(0)-64;
      let reRenderSection = cmsSettings.reRenderSection.charCodeAt(0)-64;

      $(document).keypress(function(e) {
         // console.log("reRenderText", reRenderText, e.charCode, e.shiftKey);
         if(e.ctrlKey && e.shiftKey){
            let keyPressed = e.keyCode;
            // console.log("keyPressed", keyPressed, keyPressed === reRenderText, keyPressed === reRenderSection);
            if(keyPressed === reRenderText)
               Comman.execute(ContentCommands.RE_RENDER_ALL_TEXT, that.section(), false);
            else if(keyPressed === reRenderSection)
               Comman.execute(ContentCommands.RE_RENDER_ALL_TEXT, that.section(), true);
         }
      });
   }
});
