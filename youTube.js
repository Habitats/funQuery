var g;

function youTubeSearch(conf) {
    g = gapi.client;
    g.load('youtube', 'v3', function onYouTubeApiLoad() {
        print("youTubeSearch", 1);
        g.setApiKey('AIzaSyCEW7Dxde1j1Nfxl1Xg7YvJAt4xvVY0l5c');
        search(conf);
    });
}

function search(conf) {
    print("searching: " + conf.query);
    var request = g.youtube.search.list({
        part : 'snippet,id',
        q : conf.query,
        order : conf.order,
        type : "video",
        videoDefinition : conf.definition,
        maxResults : conf.maxResult,
        pageToken : conf.nextPageToken,
    });

    request.execute(function onSearchResponse(response) {
        parseResponse(response, conf);
    });
}

var jsonParsed;
function parseResponse(response, conf) {
    var jsonString = JSON.stringify(response, '', 2);
    jsonParsed = JSON.parse(jsonString);
    print(jsonString);
    conf.jsonParsed = jsonParsed;
    // should be like this
    addVideo(conf);

    //swapVideos(conf);
}

function getSearchQuery() {
    var searchQuery;
    searchQuery = $("#utubSearch input:first").val();
    return searchQuery;
}

var utubVidBox = ".utubVidBox";
var thumbnailBox = ".thumbnail";
var jsonBox = $(".jsonData");
var utubMoreButton = $("#utubMoreButton");

function addVideo(conf) {
    print("addVideo done", 1);
    $(utubMoreButton).fadeTo("fast",0);
    jsonBox.append('<div class="resultBatch"></div>');
    var resultBatch = $(".resultBatch").last();
    var videos = conf.jsonParsed.items;
    for (var i = 0; i < conf.jsonParsed.items.length; i++) {
        var video = conf.jsonParsed.items[i];
        var title = video.snippet.title;
        var url = "http://youtu.be/" + video.id.videoId;
        var thumbnail = video.snippet.thumbnails.high.url;

        resultBatch.append('<div class="' + utubVidBox.substring(1) + '"><div class="title"></div><div class="' + thumbnailBox.substring(1) + '"><a><img/></a></div></div></div>');
        resultBatch.find(".title:last").html(title);
        resultBatch.find("img:last").attr("src", thumbnail)
        resultBatch.find(".thumbnail a:last").attr("href", url);
    }
    conf.nextPageToken = jsonParsed.nextPageToken;
    print("addVideo done", 1);

    // fix thumbnail sizes
    $("div.thumbnail img").imagesLoaded(function() {
        resizeVids(conf);
        $(resultBatch).last().fadeIn("slow",function(){
        $(utubMoreButton).fadeTo("fast",1);
        });
    });
}

function clearVideosAndAddFreshSearch(conf) {
    utubMoreButton.fadeTo("fast",0);
    $(jsonBox).fadeTo("slow",0, function() {
        $(jsonBox).fadeTo("slow",1);
        jsonBox.empty();
        youTubeSearch(conf);
    });
}

function swapVideos(conf) {
    print("swapVideos", 1);
    var videos = conf.jsonParsed.items;
    utubMoreButton.fadeTo("fast",0,function(){
    jsonBox.fadeTo("fast",0, function() {
        jsonBox.empty();
        addVideo(conf);
        print("swapVideos done", 1);
        jsonBox.fadeTo("fast",1);
    });
    });
}

function fixRightMargin(conf) {
    var child = 1;
    $(utubVidBox).each(function() {
        if (child % conf.colums == false)
            $(this).css("margin-right", "0");
        child++;
    });
}

function resizeVids(conf) {
    // this caused bug with resizing thumbnails
    print("resizeVids", 1);
    if (conf == null) {
        var conf = utubConfig();
    }
    fixRightMargin(conf);
    var divider = 10;
    var videoWidth = parseInt($("#contentWrapper").width() - divider * (conf.colums - 1)) / conf.colums;
    var fixedVideoHeight = videoWidth * 9 / 16;
    $(utubVidBox).width(videoWidth);
    $(utubVidBox).height(fixedVideoHeight + $(".title").height());
    $.each($(jsonBox).find("img"), function() {
        var origHeight = this.height;
        var origWidth = this.width;
        var proportion = origWidth / origHeight;
        var actualHeight = videoWidth / proportion;
        var thumbnailMargin = (actualHeight - fixedVideoHeight) / 2;
        $(this).css("bottom", -thumbnailMargin);

    });
    $(thumbnailBox + " img").width("100%");

    $(thumbnailBox).height(fixedVideoHeight);
    $(utubVidBox).css("margin", "0 " + divider + divider + " 0");
    print("resizeVids done", 1);
}

function utubConfig() {
    // default values
    var conf = {
        maxResult : $("#maxResults").val(),
        colums : $('#resultColums').val(),
        hd : false,
        order : $("#order").val(),
        query : "hobo",
        definition : $("#videoDefinition").val(),
        jsonParsed : jsonParsed,
        nextPageToken : "",
    };

    return conf;
}

$(function init() {
});

$(function() {
    var conf;
    $("#utubSearch").submit(function() {
        conf = utubConfig();
        conf.query = getSearchQuery();
        clearVideosAndAddFreshSearch(conf);
        return false;
    });
    $(utubMoreButton).click(function() {
        // this is covered elsewhere, but added for a more responsive behavior
        utubMoreButton.fadeTo("fast",0);
        
        youTubeSearch(conf);
        print("-------------------");

    })
    $("#resultColums").change(function() {
        conf = utubConfig();
        swapVideos(conf);
    });
});
