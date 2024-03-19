

$(document).ready(function () {
	$('input[name="pdf"]').change(function () {
		var files = $(this)[0].files;
		for (var i = 0; i < files.length; i++) {
			var url = URL.createObjectURL(files[i]);
			addPdfToList(files[i].name, url);

		}
	});
});


function addPdfToList(name, url) {
	var pdfHead = $('.pdfhead');
	if (pdfHead.children('h1').length === 0) {
		var h1 = $('<h1/>', {
			text: 'Selected PDFs'
		});
		pdfHead.append(h1);
	}

	var li = document.createElement("li");
	li.className = "list-group-item d-flex justify-content-between align-items-center";
	var a = document.createElement("a");
	a.innerText = name;
	a.href = url;
	a.target = "_blank";
	var button = document.createElement("button");
	button.innerText = "Delete";
	button.className = "btn btn-danger"
	button.onclick = function () {
		li.remove();
		var input = $('input[name="pdf"]');
		var files = input[0].files;
		var newFiles = [];
		for (var i = 0; i < files.length; i++) {
			if (files[i].name !== name) {
				newFiles.push(files[i]);
			}
		}
		input[0].files = newFiles;
	};
	li.appendChild(a);
	li.appendChild(button);
	a.style.marginRight = "10px";
	a.style.textDecoration = "none";
	button.style.marginLeft = "10px";
	document.getElementById("pdf-list").appendChild(li);
}
