/********************************************
*
*	PeEditor Simple HTML5 Rich Text Editor
*	Written by Min Yoo(yoo@minyoungyoo.com)
*	Version Alpha 0.0.1
*
********************************************/
class PeEditor{
	constructor(editorId){
		this.targetId = editorId;
		this.editorContainer = document.querySelector(this.targetId);
		this.editorContainer.classList.add("pe-editor");
		this.editorContainer.innerHTML = 
		this.editorContainer.innerHTML += `
			<div class="toolbar">
				<a title="Bold" href="javascript:peExecCommand('bold');"><span class="oi" data-glyph="bold"></span></a>
				<a title="Font Size" href="javascript:peSetFontSize();"><span class="oi small" data-glyph="text"></span></a>
				<a title="Align Left" href="javascript:peExecCommand('justifyLeft');"><span class="oi" data-glyph="align-left"></span></a>
				<a title="Align Center" href="javascript:peExecCommand('justifyCenter');"><span class="oi" data-glyph="align-center"></span></a>
				<a title="Align Right" href="javascript:peExecCommand('justfyRight');"><span class="oi" data-glyph="align-right"></span></a>
				<a title="HTML link" href="javascript:peSetHyperLink();"><span class="oi" data-glyph="link-intact"></span></a>
				<a title="Insert Image" href="javascript:peShowUpload();"><span class="oi" data-glyph="image"></span></a>
				<a title="Delete Style" href="javascript:peExecCommand('removeFormat');"><span class="oi" data-glyph="trash"></span></a>
			</div>
			<div class="textfield" contenteditable="true"></div>
		`;

		//Append file upload overlay
		if(document.querySelectorAll("#pe-editor-modal").length < 1){
			document.querySelector("body").insertAdjacentHTML("afterbegin",`
				<div class="pe-editor-modal" id="pe-editor-modal">
					<div class="modal-control">
						<a href="javascript:peCloseModal();">Close Window</a>
					</div>
					<input id="pe-editor-insert-file" type="file">
					<div class="button-area">
						<button class="pe-modal-btn" onclick="peEditorSetImage();">Insert image</button>
					</div>
				</div>
			`);
		}
	}

	returnEditorValue(){
		return document.querySelector(this.targetId+" .textfield").innerHTML;
	}
}

/* Other Functions for PeEditor */
function peCloseModal(){
	document.querySelector("#pe-editor-modal").classList.remove("active")
}

function peShowUpload(){
	document.querySelector(".pe-editor-modal").classList.add("active");
}

function peExecCommand(cmd, option1 = "", option2 = ""){
	document.execCommand(cmd, option1, option2);
}

function peSetFontSize(){
	var size = prompt("Set Font Size (1~7)");
	if(size != null){
		document.execCommand('fontSize', true, size);
	}
}

function peSetHyperLink(){
	var url = prompt("Input URL");
	if(url != null){
		document.execCommand('createLink', false, "<a href='"+ url +"' target='_blank'></a>");
	}
}

function peEditorSetImage(){
	var selection = window.getSelection();

	if(selection.type !== "Caret"){
		window.alert("Select location for putting image first.");
	}else{
		var fileTypeFilter = [
			"image/jpeg",
			"image/png",
			"image/gif",
		];
		var file = document.querySelector("#pe-editor-insert-file").files[0];
		var preview = document.querySelector('img');
		var reader = new FileReader();

		if(file){
			var fileResult;
			for(type of fileTypeFilter){
				if(file.type != type){
					fileResult = false;
					continue;
				}else{
					fileResult = true;
					break;
				}
			}

			if(fileResult != true){
				window.alert("Only image file is allowed.");
			}else{
				reader.readAsDataURL(file);
				peCloseModal();
			}
		}else{
			window.alert("Select file to upload first.");
			return false;
		}

		reader.addEventListener("load", function(){
			peExecCommand("insertImage", true, reader.result);
		}, false);
	}
}