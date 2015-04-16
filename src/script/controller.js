angular.module('TenRead.Controllers', [])

    .controller('PopupCtrl', function ($scope, $http) {
        $scope.popup = {};
        var popup = $scope.popup;

        popup.sites = [
            {
                "name"    : "startup news",
                "url"     : "http://news.dbanotes.net/",
                "icon"    : "http://news.dbanotes.net/logo.png",
                "selector": ".title>a",
                "isShow"  : true
            },
            {
                "name"    : "segmentfault",
                "url"     : "http://segmentfault.com/blogs",
                "icon"    : "http://static.segmentfault.com/global/img/touch-icon.c78b1075.png",
                "selector": ".title>a",
                "isShow"  : true
            },
            {
                "name"    : "简书",
                "url"     : "http://www.jianshu.com/trending/now",
                "icon"    : "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
                "selector": "h4>a",
                "isShow"  : true
            },
            {
                "isShow"  : true,
                "icon"    : "http://www.solidot.org/favicon.ico",
                "title"   : "solidot",
                "url"     : "http://www.solidot.org/",
                "selector": ".bg_htit>h2>a",
                "name"    : "solidot"
            },
            {
                "isShow"  : true,
                "icon"    : "http://img3.douban.com/dae/ps/logo_56-3ef03413a90e85f954c144ced276b089.png",
                "title"   : "",
                "url"     : "http://thehours.jd-app.com/",
                "selector": ".grid>a",
                "name"    : "一刻热门"
            },
            {
                "isShow"  : true,
                "icon"    : "https://news.ycombinator.com/favicon.ico",
                "name"    : "hacker news",
                "url"     : "https://news.ycombinator.com/",
                "selector": ".title>a"
            },
            {
                "isShow"  : true,
                "icon"    : "http://www.v2ex.com/static/img/icon_rayps_64.png",
                "name"    : "v2ex",
                "url"     : "http://www.v2ex.com/?tab=hot",
                "selector": "span.item_title > a"
            }
        ]

        popup.sites[0].status = "active";

        popup.show = function (index) {
            popup.loading = true;

            var site = popup.sites[index];

            angular.forEach(popup.sites, function (site) {
                site.status = "";
            });
            site.status = "active";
            $http.get(site.url).success(function (data) {
                var parsedData = $(data).find(site.selector);
                popup.parsedData = [];
                for (var i = 0, max = 10; i < max; i++) {
                    var article = {
                        title: $(parsedData[i]).text(),
                        href : $(parsedData[i]).attr("href")
                    };
                    if (article.href.indexOf("http") == -1) {
                        var baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1);
                        if (article.href[0] != "/") {
                            baseUrl += "/"
                        }
                        article.href = baseUrl + article.href;
                    }
                    popup.parsedData.push(article)
                    popup.loading = false;
                }
            })
        };

        popup.show(0);


    });