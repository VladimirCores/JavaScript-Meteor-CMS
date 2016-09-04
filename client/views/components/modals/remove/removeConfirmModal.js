Template.removeConfirmModal.viewmodel({
   getRemoveName : function () {
      return this.sid ? "запись" : "секция";
   }
,  onRendered: function () {
      console.log("\n REMOVE CONFIRM MODAL RENDERED \n")
   }
})
