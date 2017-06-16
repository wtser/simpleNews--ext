module.exports = [
    {
        "url": "http://shuiku.net/forum.php?mod=forumdisplay&fid=2",
        "selector": {"item": "[id^=normalthread_]", "title": ".s.xst", "href": ".s.xst", "next": ".nxt"},
        "name": "水库论坛",
        "type": "html"
    },
    {
        "icon": "http://www.solidot.org/favicon.ico",
        "url": "http://www.solidot.org/",
        "selector": {"item": ".block_m", "title": "h2>a", "href": "h2>a"},
        "name": "solidot",
        "type": "html",
        "desc": "奇客的资讯，重要的东西"
    }, {
        "url": "https://stackshare.io/trending/tools",
        "selector": {
            "item": ".trending-load-more>div",
            "title": "#service-name-trending",
            "href": ".btn",
            "desc": ".trending-description"
        },
        "name": "stackshare",
        "type": "html"
    }, {
        "name": "slashdot",
        "url": "https://slashdot.org/popular",
        "type": "html",
        "selector": {"item": ".fhitem", "title": ".story-title>a", "href": ".story-title>a"}
    }, {
        "name": "medium",
        "url": "https://medium.com/browse/top",
        "type": "html",
        "selector": {
            "item": ".streamItem",
            "title": ".graf--title",
            "href": ".postArticle-content>a",
            "desc": ".graf--trailing"
        }
    }, {
        "name": "lifehacker",
        "url": "http://lifehacker.com/",
        "type": "html",
        "selector": {
            "item": ".post-wrapper",
            "title": ".entry-title>a",
            "href": ".entry-title>a",
            "desc": ".entry-summary"
        }
    }, {
        "name": "github trending",
        "url": "https://github.com/trending",
        "type": "html",
        "selector": {"item": ".repo-list>li", "title": "h3 a ", "href": "h3 a", "desc": ".py-1 .d-inline-block"}
    }, {
        "icon": "https://news.ycombinator.com/favicon.ico",
        "name": "hacker news",
        "url": "https://news.ycombinator.com/",
        "selector": {"item": ".athing", "title": ".title>a", "href": ".title>a", "next": ".morelink"},
        "type": "html",
        "desc": "HN"
    }, {
        "name": "saraba1st",
        "url": "http://bbs.saraba1st.com/2b/forum-75-1.html",
        "selector": {"item": "#threadlisttableid tbody", "title": ".s.xst", "href": ".s.xst", "next": ".nxt"},
        "type": "html"
    }, {
        "icon": "https://toutiao.io/apple-icon-180x180.png",
        "url": "https://toutiao.io",
        "name": "开发者头条",
        "type": "html",
        "selector": {"item": ".post", "title": ".title>a", "href": ".title>a"},
        "desc": "技术极客的头条新闻"
    }, {
        "icon": "https://www.v2ex.com/static/img/icon_rayps_64.png",
        "name": "v2ex",
        "url": "https://www.v2ex.com/?tab=hot",
        "selector": {"item": ".item tr", "title": ".item_title a", "href": ".item_title a", "desc": ".small.fade"},
        "type": "html",
        "desc": "创意工作者们的社区"
    }, {
        "name": "简书",
        "url": "http://www.jianshu.com/trending/weekly?page=1",
        "icon": "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
        "selector": {"item": ".content", "title": ".title", "href": ".title", "desc": ".abstract"},
        "desc": "一个基于内容分享的社区",
        "type": "html",
        "page": "page"
    }, {
        "icon": "https://static.zhihu.com/static/revved/img/ios/touch-icon-152.87c020b9.png",
        "url": "http://www.zhihu.com/explore/recommendations",
        "name": "知乎编辑推荐",
        "selector": {"item": ".zm-item", "title": "h2>a", "href": "h2>a", "desc": ".zh-summary"},
        "type": "html",
        "desc": "与世界分享你的知识、经验和见解"
    }, {
        "name": "抽屉新热榜",
        "url": "http://dig.chouti.com/all/hot/recent/1",
        "selector": {
            "item": ".content-list>.item",
            "title": ".part1>a.show-content",
            "href": ".part1>a.show-content",
            "desc": ".summary",
            "next": "#dig_lcpage li:last-child a"
        },
        "type": "html",
        "desc": "聚合每日热门、搞笑、有趣资讯"
    }, {
        "icon": "http://www.redditstatic.com/favicon.ico",
        "name": "reddit",
        "url": "http://www.reddit.com/r/all/",
        "selector": {
            "item": ".linklisting .thing",
            "title": ".entry .may-blank",
            "href": ".entry .may-blank",
            "next": ".nextprev a"
        },
        "type": "html",
        "desc": "the front page of the internet"
    }, {
        "icon": "http://s.jandan.com/static/img/appicon.png",
        "name": "煎蛋",
        "url": "http://jandan.net/",
        "selector": {
            "item": ".post:not(#adsense)",
            "title": "h2>a",
            "href": "h2>a",
            "next": ".wp-pagenavi a:last-child"
        },
        "type": "html",
        "desc": "地球上没有新鲜事"
    }, {
        "icon": "http://rs-assets.b0.upaiyun.com/assets/apple-touch-icon-180x180-precomposed-763d5ea2ad5193d98490fa9b7c362cfc.png",
        "name": "NEXT",
        "url": "http://next.36kr.com/posts",
        "selector": {"item": ".product-item ", "title": ".post-url", "href": ".post-url", "desc": ".post-tagline"},
        "type": "html",
        "desc": "不错过任何一个新产品"
    }, {
        "icon": "http://wanqu.co/static/images/wanqu/favicons/apple-touch-icon-180x180.png",
        "url": "http://wanqu.co/hot/",
        "name": "湾区日报",
        "type": "html",
        "desc": "关注互联网、创业、技术",
        "selector": {"item": ".list-group>.list-group-item .list-title", "title": "a", "href": "a"}
    }, {
        "icon": "http://sfault-avatar.b0.upaiyun.com/235/056/2350560982-56796cae3be72_huge256",
        "url": "http://faxian.smzdm.com/h2s0t0f0c1p1/",
        "name": "什么值得买热门2小时",
        "selector": {
            "item": ".feed-list-col li",
            "title": ".feed-ver-title>a",
            "href": ".feed-ver-title>a",
            "next": ".pagenation-list li:last-child a"
        },
        "type": "html",
        "desc": "汇集2小时里最热门的网友优惠商品爆料"
    }, {
        "url": "http://yangmaojie.com/",
        "name": "羊毛头条",
        "selector": {
            "item": ".list .item",
            "title": ".title a:last-child",
            "href": ".title a:last-child",
            "next": ".page-btn.pull-right "
        },
        "type": "html",
        "desc": "交流活动信息，没事薅个羊腿"
    }, {
        "icon": "http://www.kiees.com/favicon.ico",
        "url": "http://www.kiees.com/",
        "name": "发现值得买",
        "selector": {"item": ".postbox", "title": "h2 a", "href": "h2 a", "next": ".wp-pagenavi>a:last-child"},
        "type": "html",
        "desc": "高性价比网购推荐"
    }, {
        "icon": "http://sfault-image.b0.upaiyun.com/204/600/2046007660-5689ff9be1751_articlex",
        "url": "http://www.meidebi.com/index_q/",
        "name": "没的比最受关注",
        "selector": {"item": ".item .tit:not(.clearfix)", "title": "a", "href": "a", "next": ".next"},
        "type": "html",
        "desc": "没得比最受关注商品推荐"
    }, {
        "type": "ajax",
        "api": "https://hstar-hi.alicdn.com/dream/ajax/getProjectList.htm?page=1&pageSize=30&projectType=&type=6&status=1&sort=1",
        "icon": "https://img.alicdn.com/tps/TB19yVcJFXXXXaNXFXXXXXXXXXX-384-119.png",
        "url": "https://hi.taobao.com/market/hi/list.php",
        "selector": {"item": "data", "title": "name", "href": "link", "next": "page"},
        "name": "淘宝众筹",
        "desc": "认真对待每一个梦想"
    }, {
        "icon": "http://static.360buyimg.com/finance/base/1.2.0/images/logo-slogan.png",
        "url": "http://z.jd.com/bigger/search.html?status=2&sort=zhtj&categoryId=&parentCategoryId=&sceneEnd=&productEnd=&keyword=&page=1&pageSize=30",
        "name": "京东众筹",
        "type": "html",
        "selector": {"item": ".info.type_now", "title": ".i-tits", "href": "a"},
        "desc": "京东金融综合互联网理财服务"
    }, {
        "name": "草榴技术区",
        "url": "http://t66y.com/thread0806.php?fid=7",
        "selector": {
            "item": "#ajaxtable .t_one",
            "title": "h3>a",
            "href": "h3>a",
            "next": ".pages>a:nth-last-child(2)"
        },
        "type": "html",
        "desc": "1024"
    }];

