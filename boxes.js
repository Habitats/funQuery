/* adds a new "content" box */
var boxesCount = 0;
var box = ".content";
var addBoxButton = "#addContentButton";
var xBoxes = "#xBoxes";

function addBox(amount) {
	var content = $(".contentRow");
	var randWords = new Array(":p", ":O", ":D", ":(", "(:", "XD");
	var colors = new Array("#FC4B75", "#7B001D", "#FB003A", "#7B2539",
			"#C8002E");
	var dir = "left";

	for ( var i = 0; i < amount; i++) {
		var greeting = randWords[parseInt(Math.random() * randWords.length)]
		var color = colors[parseInt(Math.random() * colors.length)]
		$(content).append(
				'<div class="content" class="link" style="background-color:'
						+ color + ';float:' + dir + ';display:none">' + '<p>'
						+ greeting + '</p>' + '</div>');
		$(content).find(":hidden").fadeTo(1000, 1);
		boxesCount += 1;
	}
	;
	boxWidth();
	$(box).draggable();
};

function boxFading() {
}

function removeBox() {
	$(this).remove();
	boxesCount -= 1;
};

function boxWidth() {
	var boxes = 10;
	var divider = 10;
	var boxWidth = parseInt((contenrWrapper.width() - divider * (boxes + 1))
			/ boxes);
	$(box).width(boxWidth);
	$(box).css("margin-left", divider);
}

// change all boxes
function changeBoxContent() {
	var hoverText = "asd";
	$(box).each(function() {
		var currentBox = $(this).find("p");
		$(this).data("text", currentBox.text());
		currentBox.text(hoverText);
	});
	$(xBoxes).mouseleave(function() {
		$(box).each(function() {
			var currentBox = $(this).find("p");
			currentBox.text($(this).data("text"));
		});
	});
};

function clearBoxes() {
	$(box).each(function() {
		print("clear!");
		$(this).remove();
	});
};

function changeBoxColor() {
	print("blue!");
	$(box).each(function() {
		$(this).css("background-color", "#4EBAFF");
	});
};

$(function events() {
	$(addBoxButton).click(function() {
		addBox(1)
	});

	// change box text
	$(xBoxes).mouseenter(changeBoxContent);

	// buttons
	$("#blueBoxes").on("click", changeBoxColor);
	$("#clearBoxes").on("click", clearBoxes);
	$(mainContent).on("click", box, removeBox);

	// box fading
	$(mainContent).on("mouseenter", box, function() {
		$(this).fadeTo("fast", .5)
	});
	$(mainContent).on("mouseleave", box, function() {
		$(this).fadeTo("fast", 1)
	});
})