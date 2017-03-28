/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/script/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var app = function app() {
	    this.sites = __webpack_require__(2);

	    //this.articleLoading = false;
	    this.feed = {};
	    this.loading = false;

	    this.init();
	};

	app.prototype.renderSiteList = function () {
	    var html = this.sites.reduce(function (init, site, index) {
	        return init + ('<li data-index=\'' + index + '\' class="reader__site-item reader__site-item--content"><span class="reader__site-title">' + site.name + '</span></li>');
	    }, '');

	    //渲染左侧站点列表
	    document.querySelector('.reader__site-items').innerHTML = html;
	};

	app.prototype.redirect = function (url) {
	    chrome.tabs.create({
	        url: url,
	        active: false
	    });
	};
	app.prototype.renderFeed = function (site) {
	    document.querySelector('.reader__loading').classList.remove('hide');
	    this.parseArticle(site);
	};

	app.prototype.fetch = function (url, config) {
	    return new Promise(function (resolve, reject) {
	        var xhr = new XMLHttpRequest();
	        var method = (config && config.method ? config.method : 'get').toUpperCase();
	        xhr.open(method, url, true);
	        if (config && config.header) {
	            Object.keys(config.header).forEach(function (k) {
	                xhr.setRequestHeader(k, config.header[k]);
	            });
	        }
	        xhr.onload = function () {
	            if (xhr.readyState === 4 && xhr.status === 200) {
	                resolve(xhr.response);
	            } else {
	                reject(xhr);
	            }
	        };
	        xhr.onreadystatechange = function () {};
	        xhr.send(config ? config.body : null);
	    });
	};

	app.prototype.parseArticle = function (feed) {
	    var _this = this;
	    feed.domain = feed.url.split('/');
	    feed.domain = feed.domain[0] + '//' + feed.domain[2];

	    feed.fetchUrl = feed.fetchUrl ? feed.fetchUrl : feed.api ? feed.api : feed.url;
	    if (feed.fetchUrl === 'end') {
	        return;
	    }

	    _this.fetch(feed.fetchUrl).then(function (body) {
	        switch (feed.type) {
	            case 'ajax':
	                body = JSON.parse(body);
	                break;
	        }

	        if (body) {
	            var articleList = void 0,
	                parsedData = void 0,
	                next = void 0;

	            (function () {
	                switch (feed.type) {
	                    case 'html':
	                        var dom = document.createElement('div');
	                        dom.innerHTML = body;
	                        articleList = dom.querySelectorAll(feed.selector.item || feed.selector);

	                        var getText = function getText(node, selector) {
	                            var dom = node.querySelector(selector);
	                            if (dom && (dom = dom.textContent.trim())) {
	                                return dom;
	                            } else {
	                                return '';
	                            }
	                        };
	                        var getHref = function getHref(node, selector) {
	                            var dom = node.querySelector(selector);
	                            if (dom && (dom = dom.getAttribute('href'))) {
	                                if (dom.indexOf('http') === -1) {
	                                    if (dom[0] != '/') {
	                                        var linkArr = feed.url.split('/');
	                                        linkArr.pop();
	                                        linkArr.push(dom);
	                                        dom = linkArr.join('/');
	                                    } else {
	                                        dom = feed.domain + dom;
	                                    }
	                                }
	                                return dom;
	                            } else {
	                                return '';
	                            }
	                        };

	                        next = getHref(dom, feed.selector.next);

	                        parsedData = Array.prototype.map.call(articleList, function (articleNode) {

	                            var title = getText(articleNode, feed.selector.title);
	                            var href = getHref(articleNode, feed.selector.href);

	                            var desc = getText(articleNode, feed.selector.desc);

	                            return {
	                                title: title,
	                                href: href,
	                                desc: desc
	                            };
	                        });

	                        break;
	                    case 'ajax':
	                        var data = body;
	                        next = data[feed.selector.next];
	                        var nextPage = parseInt(feed.fetchUrl.match(/page=[\d]+/)[0].split('=')[1]) + 1;
	                        next = feed.api;
	                        next = next.replace(/page=[\d]+/, 'page=' + nextPage);

	                        parsedData = data[feed.selector.item].map(function (a) {
	                            var baseUrl;
	                            if (a[feed.selector.href].indexOf('http') === -1) {
	                                baseUrl = feed.domain;
	                                if (a[feed.selector.href][0] !== '/') {
	                                    baseUrl += '/';
	                                }
	                                if (a[feed.selector.href][1] === "/") {
	                                    baseUrl = 'http:';
	                                }
	                                a[feed.selector.href] = baseUrl + a[feed.selector.href];
	                            }
	                            return {
	                                title: a[feed.selector.title].trim(),
	                                href: a[feed.selector.href],
	                                desc: a[feed.selector.desc]
	                            };
	                        });

	                }
	            })();

	            var renderMethod = 'html';
	            if (feed.domain === _this.feed.domain && feed.fetchUrl != 'end' && feed.fetchUrl != (feed.api ? feed.api : feed.url)) {
	                renderMethod = 'append';
	            }

	            _this.renderArticles(parsedData, renderMethod);

	            feed.fetchUrl = next ? next : 'end';
	            _this.feed = feed;
	        }
	    }, function (err) {
	        console.log(err);
	    });
	};

	app.prototype.renderArticles = function (articleData, renderMethod) {

	    var html = articleData.reduce(function (init, article) {
	        return init + ('<li class="reader__list-item"><a target="_blank" href="' + article.href + '" class="reader__list-item-link"><span class="reader__list-item-title">' + article.title + '</span><span class="reader__list-item-below ellipsis">' + (article.desc ? article.desc : article.href) + '</span></a></li>');
	    }, '');

	    var dom = document.createElement('div');
	    dom.innerHTML = html;

	    if (renderMethod === 'html') {
	        document.querySelector('.reader__list').innerHTML = html;
	    } else {
	        document.querySelector('.reader__list').append(dom);
	    }
	    document.querySelector('.reader__loading').classList.add('hide');

	    this.loading = false;
	};

	app.prototype.eventBind = function () {
	    var _this = this;
	    var $sites = document.querySelectorAll('.reader__site-item--content');
	    var _iteratorNormalCompletion = true;
	    var _didIteratorError = false;
	    var _iteratorError = undefined;

	    try {
	        var _loop = function _loop() {
	            var $site = _step.value;

	            var index = $site[0],
	                dom = $site[1];
	            dom.addEventListener('click', function (e) {
	                var $active = document.querySelector('.reader__site-item--active');
	                $active ? $active.classList.remove('reader__site-item--active') : '';
	                var $target = e.target;
	                while (!$target.classList.contains('reader__site-item')) {
	                    $target = $target.parentElement;
	                }
	                $target.classList.add("reader__site-item--active");

	                var site = _this.sites[index];
	                delete site.fetchUrl;
	                document.querySelector('.reader__main').scrollTop = 0;

	                _this.renderFeed(site);
	            });
	        };

	        for (var _iterator = $sites.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            _loop();
	        }
	    } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	    } finally {
	        try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	                _iterator.return();
	            }
	        } finally {
	            if (_didIteratorError) {
	                throw _iteratorError;
	            }
	        }
	    }

	    document.querySelector('.reader__main').addEventListener('scroll', function (e) {
	        if (_this.feed.selector.next) {

	            var $ele = e.target;
	            var percent = $ele.clientHeight / ($ele.scrollHeight - $ele.scrollTop);
	            if (percent > 0.7 && _this.loading == false) {
	                _this.loading = true;
	                _this.renderFeed(_this.feed);
	            }
	        }
	    });

	    var $list = document.querySelector('.reader__list');
	    $list.addEventListener('click', function (e) {
	        e.preventDefault();
	        var $ele = e.target;
	        while (!$ele.classList.contains('reader__list-item-link')) {
	            $ele = $ele.parentNode;
	            if (e.nodeName == "BODY") {
	                return;
	            }
	        }

	        var href = $ele.href;
	        _this.redirect(href);
	    });
	};

	app.prototype.landing = function () {
	    var that = this;
	    document.querySelector('.reader__list').innerHTML = '\n    <div class="video"></div>\n        <div class="house"></div>\n        <table width="97%" border="0" align="center" cellspacing="0">\n\t\t\t\t\t\t\t\t\t\t<tbody><tr>\n\t\t\t\t\t\t\t\t\t\t\t<td width="42%" height="22" align="center">\n\t\t\t\t\t\t\t\t\t\t\t\t<strong>\u9879\u76EE\u540D\u79F0</strong>\n\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t<td width="14%" align="center">\n\t\t\t\t\t\t\t\t\t\t\t\t<strong>\u5957\u6570</strong>\n\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t<td width="19%" align="center">\n\t\t\t\t\t\t\t\t\t\t\t\t<strong>\u91D1\u989D(\u4E07)</strong>\n\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t\t<td width="" align="center">\n\t\t\t\t\t\t\t\t\t\t\t\t<strong>\u9762\u79EF</strong>\n\t\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t\t\t</tbody></table>\n\n        <div class="house2"></div>\n\n    ';
	    var url = 'http://www.tmsf.com/newhouse/property_searchall.htm?keytype=1&searchkeyword=%E5%90%AF%E5%9F%8E%28%E9%87%8E%E9%A3%8E%C2%B7%E5%90%AF%E5%9F%8E%29&keyword=%25u542F%25u57CE%2528%25u91CE%25u98CE%25B7%25u542F%25u57CE%2529';
	    this.fetch(url).then(function (html) {
	        var dom = document.createElement('div');
	        dom.innerHTML = html;
	        var sell = dom.querySelector('.ash1.famwei.ft14 a').innerText.match(/\d+/)[0];
	        document.querySelector('.house').innerHTML = '野风启城可售 ' + sell;
	    });

	    var url2 = 'http://www.tmsf.com/yhweb/';
	    this.fetch(url2).then(function (html) {
	        var dom = document.createElement('div');
	        dom.innerHTML = html;
	        var sell = dom.querySelector('#myCont5 marquee');
	        document.querySelector('.house2').innerHTML = sell.innerHTML;
	    });

	    var url3 = 'https://leancloud.cn:443/1.1/classes/video?limit=6&where=' + JSON.stringify({ status: { $ne: 'deleted' } }),
	        url3Header = {
	        'Content-Type': 'application/json',
	        'X-Avoscloud-Application-Id': '6Wtm61DtS6PB8YPWukRfGnv2-gzGzoHsz',
	        'X-Avoscloud-Application-Key': '4yPPSDwdRCWzWdCimOSBvwVx'
	    };
	    this.fetch(url3, { header: url3Header }).then(function (html) {
	        var data = JSON.parse(html).results;
	        var $video = data.reduce(function (init, d) {
	            return init + ('<li class="reader__list-item reader__list-item--video" data-id="' + d.objectId + '">\n                <a target="_blank" href="' + d.url + '" class="reader__list-item-link"><span class="reader__list-item-title">' + d.title + '</span></a></li>');
	        }, '');

	        document.querySelector('.video').innerHTML = $video;
	        document.querySelector('.video').addEventListener('click', function (e) {
	            var dom = e.target;
	            while (!dom.classList.contains('reader__list-item--video')) {
	                dom = dom.parentElement;
	            }
	            if (dom.classList.contains('reader__list-item--video')) {
	                (function () {
	                    var id = dom.dataset.id;

	                    that.fetch('https://leancloud.cn:443/1.1/classes/video/' + id, {
	                        method: "put",
	                        header: url3Header,
	                        body: JSON.stringify({
	                            status: 'deleted'
	                        })
	                    }).then(function () {
	                        console.log('delete ' + id);
	                        dom.style.textDecoration = 'line-through';
	                    });
	                })();
	            }
	        });
	    });
	};

	app.prototype.init = function () {
	    this.renderSiteList();
	    this.eventBind();
	    this.landing();
	};

	new app();

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	var sites = [{
	    "icon": "http://www.solidot.org/favicon.ico",
	    "url": "http://www.solidot.org/",
	    "selector": { "item": ".block_m", "title": "h2>a", "href": "h2>a" },
	    "name": "solidot",
	    "type": "html",
	    "desc": "奇客的资讯，重要的东西"
	}, {
	    "url": "https://stackshare.io/trending/tools",
	    "selector": { "item": ".trending-load-more>div", "title": "#service-name-trending", "href": ".btn", desc: '.trending-description' },
	    "name": "stackshare",
	    "type": "html"
	}, {
	    name: 'slashdot',
	    url: 'https://slashdot.org/popular',
	    type: 'html',
	    selector: {
	        "item": ".fhitem",
	        "title": ".story-title>a",
	        "href": ".story-title>a"
	    }
	}, {
	    name: 'medium',
	    url: 'https://medium.com/browse/top',
	    type: 'html',
	    selector: {
	        "item": ".streamItem",
	        "title": ".graf--title",
	        "href": ".postArticle-content>a",
	        "desc": ".graf--trailing"

	    }
	}, {
	    name: 'lifehacker',
	    url: 'http://lifehacker.com/',
	    type: 'html',
	    selector: {
	        "item": ".post-wrapper",
	        "title": ".entry-title>a",
	        "href": ".entry-title>a",
	        "desc": ".entry-summary"

	    }
	}, {
	    name: 'github trending',
	    url: 'https://github.com/trending',
	    type: 'html',
	    selector: { "item": ".repo-list>li", "title": "h3 a ", "href": "h3 a", 'desc': '.py-1 .d-inline-block' }
	}, {
	    "icon": "https://news.ycombinator.com/favicon.ico",
	    "name": "hacker news",
	    "url": "https://news.ycombinator.com/",
	    "selector": { "item": ".athing", "title": ".title>a", "href": ".title>a", 'next': '.morelink' },
	    "type": "html",
	    "desc": "HN"
	}, {
	    "name": "saraba1st",
	    "url": "http://bbs.saraba1st.com/2b/forum-75-1.html",
	    "selector": { "item": "#threadlisttableid tbody", "title": ".s.xst", "href": ".s.xst", "next": ".nxt" },
	    "type": "html"
	}, {
	    "icon": "https://toutiao.io/apple-icon-180x180.png",
	    "url": "https://toutiao.io",
	    "name": "开发者头条",
	    "type": "html",
	    "selector": { "item": ".post", "title": ".title>a", "href": ".title>a" },
	    "desc": "技术极客的头条新闻"
	}, {
	    "icon": "https://www.v2ex.com/static/img/icon_rayps_64.png",
	    "name": "v2ex",
	    "url": "https://www.v2ex.com/?tab=hot",
	    "selector": { "item": ".item tr", "title": ".item_title a", "href": ".item_title a", desc: '.small.fade' },
	    "type": "html",
	    "desc": "创意工作者们的社区"
	}, {
	    "name": "简书",
	    "url": "http://www.jianshu.com/trending/weekly?page=1",
	    "icon": "http://static.jianshu.io/assets/icon114-fcef1133c955e46bf55e2a60368f687b.png",
	    "selector": { "item": ".content", "title": ".title", "href": ".title", 'desc': '.abstract' },
	    "desc": "一个基于内容分享的社区",
	    "type": "html",
	    'page': 'page'
	}, {
	    "icon": "https://static.zhihu.com/static/revved/img/ios/touch-icon-152.87c020b9.png",
	    "url": "http://www.zhihu.com/explore/recommendations",
	    "name": "知乎编辑推荐",
	    "selector": {
	        "item": ".zm-item",
	        "title": "h2>a",
	        "href": "h2>a",
	        "desc": '.zh-summary'
	    },
	    "type": "html",
	    "desc": "与世界分享你的知识、经验和见解"
	}, {
	    "icon": "http://cdn.marketplaceimages.windowsphone.com/v8/images/26738605-6e38-4991-9cdf-20ba1451d635?imageType=ws_icon_large",
	    "name": "抽屉新热榜",
	    "url": "http://dig.chouti.com/all/hot/recent/1",
	    "selector": {
	        "item": ".content-list>.item",
	        "title": ".part1>a.show-content",
	        "href": ".part1>a.show-content",
	        'desc': '.summary',
	        "next": "#dig_lcpage>ul>li:last-child>a"
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
	    "selector": { "item": ".product-item ", "title": ".post-url", "href": ".post-url", desc: '.post-tagline' },
	    "type": "html",
	    "desc": "不错过任何一个新产品"
	}, {
	    "icon": "http://wanqu.co/static/images/wanqu/favicons/apple-touch-icon-180x180.png",
	    "url": "http://wanqu.co/hot/",
	    "name": "湾区日报",
	    "type": "html",
	    "desc": "关注互联网、创业、技术",
	    "selector": { "item": ".list-group>.list-group-item .list-title", "title": "a", "href": "a" }
	}, {
	    "icon": "http://sfault-avatar.b0.upaiyun.com/235/056/2350560982-56796cae3be72_huge256",
	    "url": "http://faxian.smzdm.com/h2s0t0f0c1p1/#filter-block",
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
	    "icon": "http://www.kiees.com/favicon.ico",
	    "url": "http://www.kiees.com/",
	    "name": "发现值得买",
	    "selector": { "item": ".postbox", "title": "h2 a", "href": "h2 a", "next": ".wp-pagenavi>a:last-child" },
	    "type": "html",
	    "desc": "高性价比网购推荐"
	}, {
	    "icon": "http://sfault-image.b0.upaiyun.com/204/600/2046007660-5689ff9be1751_articlex",
	    "url": "http://www.meidebi.com/index_q/",
	    "name": "没的比最受关注",
	    "selector": { "item": ".item .tit:not(.clearfix)", "title": "a", "href": "a", "next": ".next" },
	    "type": "html",
	    "desc": "没得比最受关注商品推荐"
	}, {
	    "type": "ajax",
	    "api": "https://hstar-hi.alicdn.com/dream/ajax/getProjectList.htm?page=1&pageSize=30&projectType=&type=6&status=1&sort=1",
	    "icon": "https://img.alicdn.com/tps/TB19yVcJFXXXXaNXFXXXXXXXXXX-384-119.png",
	    "url": "https://hi.taobao.com/market/hi/list.php",
	    "selector": { "item": "data", "title": "name", "href": "link", "next": "page" },
	    "name": "淘宝众筹",
	    "desc": "认真对待每一个梦想"
	}, {
	    "icon": "http://static.360buyimg.com/finance/base/1.2.0/images/logo-slogan.png",
	    "url": "http://z.jd.com/bigger/search.html?status=2&sort=zhtj&categoryId=&parentCategoryId=&sceneEnd=&productEnd=&keyword=&page=1&pageSize=30",
	    "name": "京东众筹",
	    "type": "html",
	    "selector": { "item": ".info.type_now", "title": ".i-tits", "href": "a" },
	    "desc": "京东金融综合互联网理财服务"
	}, {
	    "name": "草榴技术区",
	    "url": "http://t66y.com/thread0806.php?fid=7",
	    "icon": "http://static.xgres.com/lianbo/avatar/1000463/120/1316745536",
	    "selector": {
	        "item": "#ajaxtable .t_one",
	        "title": "h3>a",
	        "href": "h3>a",
	        "next": ".pages>a:nth-last-child(2)"
	    },
	    "type": "html",
	    "desc": "1024"
	}];

	module.exports = sites;

/***/ }
/******/ ]);