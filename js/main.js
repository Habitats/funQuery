/* fading boxes on hover */
var contenrWrapper = $("#contentWrapper");

var mainContent = "#mainContent";
var menu = "#menu";
var subMenu = ".submenu";

// menu & content swapping thingy
function swap(oldContent, newContent) {
	print("swapping!");
	oldContent.slideUp("fast", function() {
		newContent.slideDown("fast");
		print("new: " + newContent.attr("id"));
	});
};

var content = new Array("#boxes", "#random", "#home", "#youtube");

$(menu).on("click", "li", function swappingContent() {
	print("clicking: " + $(this).text());
	var oldContent = null;
	var newContent = $("#" + $(this).text());

	if (newContent.is(":visible") != true)
		for ( var i = 0; i < content.length; i++)
			if ($(content[i]).is(":visible"))
				oldContent = $(content[i]);

	if (oldContent != null)
		swap(oldContent, newContent);
});

function menuElementWidth(menuEntries) {
	var divider = 30;
	var entryWidth = parseInt((contenrWrapper.width() - divider
			* (menuEntries.length + 1))
			/ menuEntries.length);
	$("#menu li").css("margin-left", divider + "px");
	$("#menu li").width(entryWidth);
};

function resize() {
	wrapperWidth = $("#contentWrapper")
			.width($("#widthSlider").slider("value"));
	$("#main").width($(contentWrapper).width() + 30);
	menuElementWidth(content);
	boxWidth();
	resizeVids();
}

function sliderConfig() {
	$("#widthSlider").slider({
		value : 800,
		min : 450,
		max : 1600,
		step : 10,
		slide : function() {
			resize();
		}
	});
};

function console() {
	$("#configToggle").click(function() {
		$("#info").fadeToggle();
	});
};

// initial code
$(function init() {
	sliderConfig();
	console();
	$("#main").fadeIn("slow");
	$("#home").slideDown();
	addBox(50);
	resize();
});

// logger
function print(info, num) {
	// return;
	var type = "";
	switch (num) {
	case 1:
		type = "Call: ";
		break;
	case 2:
		type = "Status: ";
		break;
	}

	var infoBox = $("#info");
	infoBox.append('<pre>' + type + info + '</pre>');
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
