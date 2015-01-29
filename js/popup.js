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
        icon    : "http://cdn.marketplaceimages.windowsphone.com/v8/images/26738605-6e38-4991-9cdf-20ba1451d635?imageType=ws_icon_large",
        selector: ".part1>a.show-content"
    },
    {
        name    : "简书",
        url     : "http://www.jianshu.com/trending/now",
        icon    : "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
        selector: "h4>a"
    },
    {
        name    : "solidot",
        url     : "http://www.solidot.org/",
        icon    : "http://www.solidot.org/favicon.ico",
        selector: ".bg_htit>h2>a"
    },
    /*{
        name    : "cnbeta",
        url     : "http://m.cnbeta.com/list_hotcomments_1.htm",
        icon    : "https://lh3.ggpht.com/AfjhBAG3hCj-cRTU4b1_bW5HW6vmZ6D73I9O3EhhaZwSgGm4J_yoJl-WZ_LBPko1pWwb=w170",
        selector: ".module_list>li>div>a"
    },
    {
        name    : "cnbftchineseeta",
        url     : "http://www.ftchinese.com/channel/weekly.html",
        icon    : "http://s.ftimg.net/img/ipad_icon.png",
        selector: "#mostpopulars>span>ul>li>a"
    },*/
    {
        name    : "果壳科学人",
        url     : "http://www.guokr.com/scientific/",
        icon    : "http://allaboutwindowsphone.com/images/appicons/123742.png",
        selector: ".article-title"
    },
    /*{
        name    : "next",
        url     : "http://next.36kr.com/posts",
        icon    : "http://next.36kr.com/favicon.ico",
        selector: ".post-url"
    },
    {
        name    : "mindstore",
        url     : "http://mindstore.io/",
        icon    : "http://mindstore.io/static/images/lime/favicon.ico",
        selector: ".mind-title>a"
    },
    {
        name    : "开发者头条",
        url     : "http://toutiao.io/",
        icon    : "http://toutiao.io/favicon-96x96.png",
        selector: "h4>a"
    }*/

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
        }else{
            setGray="class='active'";
        }
        return memo + "<li " + setGray + " data-name='" + r.name + "'><img src='" + r.icon + "'></li>"
    }, "");
    document.querySelector(".tabs").innerHTML = html;
}

function getRss(current) {
    function render(data){
        var html = _.reduce(data, function (memo, d) {
            return memo + "<li><a target='_blank' href='" + d.link + "'>" + d.title + "</a></li>"
        }, "");
        $(".news-list").html(html)
    }
    var cache = JSON.parse(localStorage.getItem(current.name));
    if(cache){
        render(cache);
    }

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
                render(data);
            } else {
                $(".news-list").html("暂无内容")
            }

            localStorage.setItem(current.name,JSON.stringify(data));
        }
    }
    xhr.send();

}


