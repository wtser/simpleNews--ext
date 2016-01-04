angular.module 'TenRead.initData', []
.value 'initData', [
    {
        "name": "简书",
        "url": "http://www.jianshu.com/trending/now",
        "icon": "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
        "selector": {"item": ".article-list>li", "title": ".title>a", "href": ".title>a"},
        "type": "html"
    }
    {
        "icon": "http://www.solidot.org/favicon.ico",
        "url": "http://www.solidot.org/",
        "selector": {"item": ".block_m", "title": ".bg_htit>h2>a", "href": ".bg_htit>h2>a"},
        "name": "solidot",
        "type": "html",
    }
    {
        "type": "html",
        "icon": "http://www.v2ex.com/static/img/icon_rayps_64.png",
        "name": "v2ex",
        "url": "http://www.v2ex.com/?tab=hot",
        "paging": "",
        "selector": {
            "item": ".cell.item",
            "title": ".item_title>a",
            "href": ".item_title>a"
        }
    }
    {
        "name": "网易新闻",
        "url": "http://news.163.com/jnews/",
        "icon": "http://static.xgres.com/lianbo/avatar/1000463/120/1316745536",
        "selector": {"item": ".name>a", "title": ".name>a", "href": ".name>a"},
        "type": "html",
    }
    {
        "icon": "http://cdn.marketplaceimages.windowsphone.com/v8/images/26738605-6e38-4991-9cdf-20ba1451d635?imageType=ws_icon_large",
        "name": "抽屉新热榜",
        "url": "http://dig.chouti.com/all/hot/recent/1",
        "selector": {"item": ".item", "title": ".part1>a.show-content", "href": ".part1>a.show-content"},
        "type": "html",
    }
    {
        "icon": "http://static.zhihu.com/static/img/ios/zhihu(120px).png",
        "url": "http://www.zhihu.com/explore/recommendations",
        "name": "知乎编辑推荐",
        "selector": {"item": ".zm-item", "title": "h2>a", "href": "h2>a"},
        "type": "html",
    }
    {
        "icon": "http://sfault-avatar.b0.upaiyun.com/235/056/2350560982-56796cae3be72_huge256",
        "url": "http://faxian.smzdm.com/hot_2hours",
        "name": "什么值得买热门2小时",
        "selector": {"item": ".discovery_list>.list", "title": ".itemName>a", "href": ".itemName>a"},
        "type": "html"
    }
    {
        type: "ajax",
        api: "https://hstar-hi.alicdn.com/dream/ajax/getProjectList.htm?page=1&pageSize=20&projectType=&type=6&status=1&sort=4"
        "icon": "https://img.alicdn.com/tps/TB19yVcJFXXXXaNXFXXXXXXXXXX-384-119.png",
        "url": "https://hi.taobao.com/market/hi/list.php",
        "selector": {"item": "data", "title": "name", "href": "link"},
        "name": "淘宝众筹"
    }
]

