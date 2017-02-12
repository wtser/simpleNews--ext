
let app = function () {
    this.sites = require('./sites.json.js');

    this.articleLoading = false;
    this.feed           = {};

    this.init();

};


app.prototype.renderSiteList = function () {
    console.log(this)
    let html = this.sites.reduce(function (init, site, index) {
        return init + `<li data-index='${index}' class="reader__site-item reader__site-item--content"><span class="reader__site-title">${site.name}</span></li>`
    }, '');

    //渲染左侧站点列表
    document.querySelector('.reader__site-items').innerHTML = html;
};

app.prototype.renderFeed = function (site) {
    this.articleLoading = true;
    this.feed           = site;

    this.parseArticle(this.feed)
}


app.prototype.parseArticle = function (feed) {
    let _this   = this;
    feed.domain = feed.url.split('/');
    feed.domain = feed.domain[0] + '//' + feed.domain[2];

    let url = feed.nextUrl ? feed.nextUrl : feed.api ? feed.api : feed.url;

    fetch(url,{headers: {'Content-Type': 'text/html; charset=utf-8'}})
        .then(function (rsp) {

            switch (feed.type) {
                case 'html':
                    return rsp.text()
                    break;
                case 'ajax':
                    return rsp.json()
                    break;
                default:
                    return rsp.json()

            }
        })
        .then(function (body) {


            if (body) {
                let articleList, parsedData;
                switch (feed.type) {
                    case 'html':
                        let dom       = document.createElement('div');
                        dom.innerHTML = body;
                        articleList   = dom.querySelectorAll(feed.selector.item || feed.selector);
                        parsedData    = Array.prototype.map.call(articleList, function (articleNode) {

                            let title = articleNode.querySelector(feed.selector.title).textContent.trim()
                            let href  = articleNode.querySelector(feed.selector.href).attributes.href.nodeValue
                            if (href.indexOf('http') === -1) {
                                // if (article.href[0] !== '/') {
                                //     article.href += '/';
                                // }
                                href = feed.domain + href;
                            }
                            return {
                                title: title,
                                href : href
                            }
                        })

                        _this.renderArticles(parsedData)
                        break;
                    case 'ajax':
                        let data   = body;
                        parsedData = data[feed.selector.item].map(function (a) {
                            var baseUrl;
                            if (a[feed.selector.href].indexOf('http') === -1) {
                                baseUrl = feed.domain
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
                                href : a[feed.selector.href]
                            };
                        });

                        _this.renderArticles(parsedData)

                }


            }
        })

}

app.prototype.renderArticles = function (articleData) {

    let html = articleData.reduce(function (init, article) {
        return init + `<li class="reader__list-item"><a target="_blank" href="${ article.href }" class="reader__list-item-link"><span class="reader__list-item-title ellipsis">${article.title }</span><span class="reader__list-item-below ellipsis">${article.href}</span></a></li>`;
    }, '')

    let dom       = document.createElement('div');
    dom.innerHTML = html

    document.querySelector('.reader__list').append(dom);
    document.querySelector('.loading').remove()


}

app.prototype.eventBind = function () {
    let _this  = this;
    let $sites = document.querySelectorAll('.reader__site-item--content');
    for (let $site of $sites.entries()) {
        let index = $site[0], dom = $site[1];
        dom.addEventListener('click', function (e) {
            document.querySelector('.reader__site-item--active').classList.remove('reader__site-item--active');
            e.target.classList.add("reader__site-item--active");
            document.querySelector('.reader__list').innerHTML = `<p class="loading">Loading</p>`;

            let site = _this.sites[index];
            _this.renderFeed(site);
        })
    }
}

app.prototype.init = function () {
    this.renderSiteList();
    this.eventBind();

}

new app();


// $(window).scroll(function() {
//     var scrollHeight = document.body.scrollHeight;
//     var height = $(window).scrollTop();
//     if (scrollHeight - height - 1000 < document.body.clientHeight / 2 && !articleLoading && feed.hasOwnProperty('nextUrl')) {
//         renderArticles()
//     }
// });
