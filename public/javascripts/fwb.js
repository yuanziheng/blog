pageInit()
    function pageInit() {
      $.extend(XHEDITOR.settings, {shortcuts:{'ctrl+enter': submitForm}})
      $('#con').xheditor({
        html5Upload: false,
        upMultiple: '1',
		width:'100%',
        upLinkUrl: 'upload.html',
        upLinkExt: 'zip, rar, txt',

        upImgUrl: '/users/uploadImg',
        upImgExt: 'jpg,jpeg,gif,png',

        upFlashUrl: 'upload.html',
        upFlashExt: 'swf',

        upMediaUrl: 'upload.html',
        upMediaExt: 'wmv,avi,wma,mp3,mid'
      })
    }
//  富文本自动调用
	function insertUpload(arrmsg){
		var i ,msg;
		for (i=0;i<arrmsg.length;i++) {
			msg=arrmsg[i];
			$('#uploadList').append('<option value="'+msg.id+'">'+msg.localname+'</option>')
		}
	}
    function submitForm() {
      $('#frmDemo').submit()
    }