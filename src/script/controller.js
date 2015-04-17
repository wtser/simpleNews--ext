angular.module('TenRead.Controllers', [])


    .controller('PopupCtrl', function ($scope, $http, $timeout) {
        $scope.popup = {};
        var popup = $scope.popup;

        popup.scrollTop = localStorage.getItem("scrollTop") || 0;

        $timeout(function () {
            $(".tabs").scrollTop(popup.scrollTop);
        }, 10);

        popup.initSites = [
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
        ];

        popup.sites = JSON.parse(localStorage.getItem("sites")) || [];
        if (popup.sites.length == 0) {
            popup.sites = popup.initSites;
            localStorage.setItem("sites", JSON.stringify(popup.sites));
        }

        popup.index = localStorage.getItem("index") || 0;
        popup.sites[popup.index].status = "active";

        popup.show = function (index) {
            if (index != localStorage.getItem("index")) {
                popup.scrollTop = $(".tabs").scrollTop();
                localStorage.setItem("scrollTop", popup.scrollTop);
            }
            popup.error = false;
            localStorage.setItem("index", index);
            popup.index = index;
            popup.loading = true;

            var site = popup.sites[index];

            angular.forEach(popup.sites, function (site) {
                site.status = "";
            });
            site.status = "active";

            popup.parsedData = JSON.parse(localStorage.getItem("site" + index)) || [];
            $http.get(site.url, {
                timeout: 6000
            }).success(function (data, status) {
                if (status != 200) {
                    $(".news-list").html(data);
                    return;
                }
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
                    popup.parsedData.push(article);
                    localStorage.setItem("site" + index, JSON.stringify(popup.parsedData));
                    popup.loading = false;
                }
            }).error(function (err) {
                popup.loading = false;
                popup.error = true;
            });
        };

        popup.show(popup.index);


    })
    .controller('OptionListCtrl', function ($scope, $http) {
        $scope.optionList = {};
        var optionList = $scope.optionList;

        optionList.sites = JSON.parse(localStorage.getItem("sites")) || [];

        optionList.show = function (slug) {
            optionList.slug = slug;
            $http.get('/data/' + slug + '.json').success(function (d) {
                optionList.currentSites = d;
            });
        };

        optionList.subscribe = function (site) {
            var hasSubscribe = optionList.sites.filter(function (s) {
                return s.name == site.name;
            });
            if (hasSubscribe.length > 0) {
                alert("该项已订阅")
            } else {
                optionList.sites.push(site);
                localStorage.setItem("sites", JSON.stringify(optionList.sites));
                alert("订阅成功")
            }
        };

        $http.get('/data/catalog.json').success(function (d) {
            optionList.catalogs = d;
            optionList.slug = d[0].slug;
            optionList.show(optionList.slug)
        });


    })
    .controller('OptionMyListCtrl', function ($scope) {
        $scope.myList = {};
        var myList = $scope.myList;
        myList.form = {
            icon    : '',
            url     : '',
            name    : '',
            selector: ''

        };
        myList.form.show = false;

        myList.data = JSON.parse(localStorage.getItem('sites'));
        myList.add = function () {
            myList.form = {
                icon    : '',
                url     : '',
                name    : '',
                selector: ''

            };
            myList.form.show = true;
            myList.form.index = -1;
        };
        myList.cancel = function () {
            myList.form.show = false;
        };
        myList.edit = function (index) {
            myList.form = myList.data[index];
            myList.form.show = true;
            myList.form.index = index;
        };
        myList.del = function (index) {
            if (confirm("确认删除？")) {
                myList.data.splice(index, 1);
                localStorage.setItem("sites", JSON.stringify(myList.data));
            }
        };
        myList.submit = function () {
            if (myList.form.index == -1) {
                myList.data.push(myList.form);

            } else {

                myList.data[myList.form.index] = myList.form;

            }
            localStorage.setItem("sites", JSON.stringify(myList.data));
            myList.form.show = false;
        }
    })
    .controller('OptionExchangeCtrl', function ($scope) {

    });