var initState=!localStorage.getItem("initState")||false,
    rss;
if(initState){
    rss=[
        {
            "name": "startup news",
            "url": "http://news.dbanotes.net/",
            "icon": "http://news.dbanotes.net/logo.png",
            "selector": ".title>a",
            "isShow": true
        },
        {
            "name": "segmentfault",
            "url": "http://segmentfault.com/blogs",
            "icon": "http://static.segmentfault.com/global/img/touch-icon.c78b1075.png",
            "selector": ".title>a",
            "isShow": true
        },
        {
            "name": "简书",
            "url": "http://www.jianshu.com/trending/now",
            "icon": "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
            "selector": "h4>a",
            "isShow": true
        },
        {
            "isShow": true,
            "icon": "http://www.solidot.org/favicon.ico",
            "title": "solidot",
            "url": "http://www.solidot.org/",
            "selector": ".bg_htit>h2>a",
            "name": "solidot"
        },
        {
            "isShow": true,
            "icon": "http://img3.douban.com/dae/ps/logo_56-3ef03413a90e85f954c144ced276b089.png",
            "title": "",
            "url": "http://thehours.jd-app.com/",
            "selector": ".grid>a",
            "name": "一刻热门"
        },
        {
            "isShow": true,
            "icon": "https://news.ycombinator.com/favicon.ico",
            "name": "hacker news",
            "url": "https://news.ycombinator.com/",
            "selector": ".title>a"
        },
        {
            "isShow": true,
            "icon": "http://www.v2ex.com/static/img/icon_rayps_64.png",
            "name": "v2ex",
            "url": "http://www.v2ex.com/?tab=hot",
            "selector": "span.item_title > a"
        }
    ];
    localStorage.setItem("initState","true");
    localStorage.setItem("diyContent",JSON.stringify(rss));
}else{
    rss = JSON.parse(localStorage.getItem("diyContent"))||[];
    rss = _.filter(rss,function(r){
        return r.isShow==true;
    })
}

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

});

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
        $(".news-list").html(html);
        $(".tabs").height($(window).height())
    }
    var cache = JSON.parse(localStorage.getItem(current.name));
    if(cache){
        render(cache);
    }

    var xhr = new XMLHttpRequest();
    xhr.open("GET", current.url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 &&current==window.current) {

            var result = xhr.responseText;
            var search = $(result).find(current.selector);


            var data = [];

            for (var i = 0, j = 10; i < j; i++) {
                if(i==search.length){
                    continue;
                }
                var article = {
                    title: $(search[i]).text(),
                    link : $(search[i]).attr("href")
                };
                if (article.link.indexOf("http") == -1) {
                    var baseUrl = current.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1)+"/";
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


