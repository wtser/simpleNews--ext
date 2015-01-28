var rss = [
    {
        name    : "v2ex",
        url     : "http://www.v2ex.com/?tab=hot",
        icon    : "http://www.v2ex.com/static/img/icon_rayps_64.png",
        selector: "span.item_title > a"
    },
    {
        name    : "startup news",
        url     : "http://news.dbanotes.net/",
        icon    : "http://news.dbanotes.net/logo.png",
        selector: ".title>a"
    },
    {
        name    : "hacker news",
        url     : "https://news.ycombinator.com/",
        icon    : "https://news.ycombinator.com/favicon.ico",
        selector: ".title>a"
    },
    {
        name    : "segmentfault",
        url     : "http://segmentfault.com/blogs",
        icon    : "http://static.segmentfault.com/global/img/touch-icon.c78b1075.png",
        selector: ".title>a"
    },
    {
        name    : "抽屉新热榜",
        url     : "http://dig.chouti.com/all/hot/recent/1",
        icon    : "http://dig.chouti.com/images/chouti_48_48.png",
        selector: ".part1>a.show-content"
    }

];
var currentName = localStorage.getItem("currentName") || rss[0].name;
var current = _.find(rss, function (r) {
    return r.name == currentName
});
current = current || rss[0];
getRss(current);
renderTabs(current.name);

$(".tabs").on("click", "li", function () {
    var name = $(this).attr("data-name");
    currentName = name;
    localStorage.setItem("currentName", currentName);

    current = _.find(rss, function (r) {
        return r.name == name
    });
    getRss(current);
    renderTabs(current.name);

})

function renderTabs(name) {
    var html = _.reduce(rss, function (memo, r) {
        var setGray = "";
        if (r.name != currentName) {
            setGray = "class='gray'";
        }
        return memo + "<li " + setGray + " data-name='" + r.name + "'><img src='" + r.icon + "'></li>"
    }, "");
    document.querySelector(".tabs").innerHTML = html;
}

function getRss(current) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", current.url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var result = xhr.responseText;
            var search = $(result).find(current.selector);


            var data = [];

            for (var i = 0, j = 10; i < j; i++) {
                var article = {
                    title: $(search[i]).text(),
                    link : $(search[i]).attr("href")
                };
                if (article.link.indexOf("http") == -1) {
                    var baseUrl = current.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1);
                    article.link = baseUrl + article.link;
                }
                data.push(article);
            }

            if (data.length > 0) {
                var html = _.reduce(data, function (memo, d) {
                    return memo + "<li><a target='_blank' href='" + d.link + "'>" + d.title + "</a></li>"
                }, "");
                $(".news-list").html(html)
                $(".tabs").css("height", $("#main").height())
            } else {
                $(".news-list").html("暂无内容")
            }
        }
    }
    xhr.send();

}


