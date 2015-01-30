var rss = JSON.parse(localStorage.getItem("diyContent"))||[];
rss = _.filter(rss,function(r){
    return r.isShow==true;
})
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


