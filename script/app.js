let app = function () {
    this.sites = require('./sites.json.js');

    //this.articleLoading = false;
    this.feed    = {};
    this.loading = false;

    this.init();

};


app.prototype.renderSiteList = function () {
    let html = this.sites.reduce(function (init, site, index) {
        return init + `<li data-index='${index}' class="reader__site-item reader__site-item--content"><span class="reader__site-title">${site.name}</span></li>`
    }, '');

    //渲染左侧站点列表
    document.querySelector('.reader__site-items').innerHTML = html;
};

app.prototype.redirect   = function (url) {
    chrome.tabs.create({
        url   : url,
        active: false
    })
}
app.prototype.renderFeed = function (site) {
    document.querySelector('.reader__loading').classList.remove('hide')
    this.parseArticle(site)
}

app.prototype.fetch = function (url, config) {
    return new Promise(function (resolve, reject) {
        let xhr    = new XMLHttpRequest();
        let method = (config && config.method ? config.method : 'get').toUpperCase()
        xhr.open(method, url, true);
        if (config && config.header) {
            Object.keys(config.header).forEach(function (k) {
                xhr.setRequestHeader(k, config.header[k])
            })
        }
        xhr.onload             = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.response)
            } else {
                reject(xhr)
            }
        }
        xhr.onreadystatechange = function () {

        }
        xhr.send();
    })
}

app.prototype.parseArticle = function (feed) {
    let _this   = this;
    feed.domain = feed.url.split('/');
    feed.domain = feed.domain[0] + '//' + feed.domain[2];

    feed.fetchUrl = feed.fetchUrl ? feed.fetchUrl : feed.api ? feed.api : feed.url;
    if (feed.fetchUrl === 'end') {
        return;
    }


    _this.fetch(feed.fetchUrl).then(function (body) {
        switch (feed.type) {
            case 'ajax':
                body = JSON.parse(body)
                break;
        }

        if (body) {
            let articleList, parsedData, next;
            switch (feed.type) {
                case 'html':
                    let dom       = document.createElement('div');
                    dom.innerHTML = body;
                    articleList   = dom.querySelectorAll(feed.selector.item || feed.selector);

                    let getText = function (node, selector) {
                        let dom = node.querySelector(selector)
                        if (dom && (dom = dom.textContent.trim())) {
                            return dom
                        } else {
                            return ''
                        }

                    }
                    let getHref = function (node, selector) {
                        let dom = node.querySelector(selector)
                        if (dom && (dom = dom.getAttribute('href'))) {
                            if (dom.indexOf('http') === -1) {
                                if (dom[0] != '/') {
                                    let linkArr = feed.url.split('/')
                                    linkArr.pop();
                                    linkArr.push(dom)
                                    dom = linkArr.join('/')
                                } else {
                                    dom = feed.domain + dom
                                }

                            }
                            return dom
                        } else {
                            return ''
                        }

                    }

                    next = getHref(dom, feed.selector.next);

                    parsedData = Array.prototype.map.call(articleList, function (articleNode) {


                        let title = getText(articleNode, feed.selector.title)
                        let href  = getHref(articleNode, feed.selector.href);

                        let desc = getText(articleNode, feed.selector.desc)

                        return {
                            title: title,
                            href : href,
                            desc : desc
                        }
                    })

                    break;
                case 'ajax':
                    let data     = body;
                    next         = data[feed.selector.next];
                    let nextPage = parseInt(feed.fetchUrl.match(/page=[\d]+/)[0].split('=')[1]) + 1
                    next         = feed.api;
                    next         = next.replace(/page=[\d]+/, 'page=' + nextPage)

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
                            href : a[feed.selector.href],
                            desc : a[feed.selector.desc]
                        };
                    });


            }

            let renderMethod = 'html'
            if (feed.domain === _this.feed.domain && feed.fetchUrl != 'end' && feed.fetchUrl != (feed.api ? feed.api : feed.url)) {
                renderMethod = 'append'
            }

            _this.renderArticles(parsedData, renderMethod)

            feed.fetchUrl = next ? next : 'end'
            _this.feed    = feed;


        }

    }, function (err) {
        console.log(err)
    })

}

app.prototype.renderArticles = function (articleData, renderMethod) {

    let html = articleData.reduce(function (init, article) {
        return init + `<li class="reader__list-item"><a target="_blank" href="${ article.href }" class="reader__list-item-link"><span class="reader__list-item-title">${article.title }</span><span class="reader__list-item-below ellipsis">${article.desc ? article.desc : article.href}</span></a></li>`;
    }, '')

    let dom       = document.createElement('div');
    dom.innerHTML = html

    if (renderMethod === 'html') {
        document.querySelector('.reader__list').innerHTML = html;
    } else {
        document.querySelector('.reader__list').append(dom);
    }
    document.querySelector('.reader__loading').classList.add('hide')

    this.loading = false;


}

app.prototype.eventBind = function () {
    let _this  = this;
    let $sites = document.querySelectorAll('.reader__site-item--content');
    for (let $site of $sites.entries()) {
        let index = $site[0], dom = $site[1];
        dom.addEventListener('click', function (e) {
            let $active = document.querySelector('.reader__site-item--active')
            $active ? $active.classList.remove('reader__site-item--active') : '';
            let $target = e.target
            while (!$target.classList.contains('reader__site-item')) {
                $target = $target.parentElement
            }
            $target.classList.add("reader__site-item--active");

            let site = _this.sites[index];
            delete site.fetchUrl;
            document.querySelector('.reader__main').scrollTop = 0;

            _this.renderFeed(site);
        })
    }

    document.querySelector('.reader__main').addEventListener('scroll', function (e) {
        if (_this.feed.selector.next) {

            let $ele    = e.target
            let percent = $ele.clientHeight / ($ele.scrollHeight - $ele.scrollTop )
            if (percent > 0.7 && _this.loading == false) {
                _this.loading = true;
                _this.renderFeed(_this.feed)
            }
        }
    })


    let $list = document.querySelector('.reader__list');
    $list.addEventListener('click', function (e) {
        e.preventDefault();
        let $ele = e.target;
        while (!$ele.classList.contains('reader__list-item-link')) {
            $ele = $ele.parentNode
            if (e.nodeName == "BODY") {
                return;
            }
        }

        let href = $ele.href;
        _this.redirect(href)


    })
}

app.prototype.landing = function () {
    let that = this;
    document.querySelector('.reader__list').innerHTML = `
    <div class="video"></div>
        <div class="house"></div>
        <table width="97%" border="0" align="center" cellspacing="0">
										<tbody><tr>
											<td width="42%" height="22" align="center">
												<strong>项目名称</strong>
											</td>
											<td width="14%" align="center">
												<strong>套数</strong>
											</td>
											<td width="19%" align="center">
												<strong>金额(万)</strong>
											</td>
											<td width="" align="center">
												<strong>面积</strong>
											</td>
										</tr>
									</tbody></table>

        <div class="house2"></div>

    `
    let url                                           = 'http://www.tmsf.com/newhouse/property_searchall.htm?keytype=1&searchkeyword=%E5%90%AF%E5%9F%8E%28%E9%87%8E%E9%A3%8E%C2%B7%E5%90%AF%E5%9F%8E%29&keyword=%25u542F%25u57CE%2528%25u91CE%25u98CE%25B7%25u542F%25u57CE%2529'
    this.fetch(url).then(function (html) {
        let dom                                    = document.createElement('div');
        dom.innerHTML                              = html;
        let sell                                   = dom.querySelector('.ash1.famwei.ft14 a').innerText.match(/\d+/)[0];
        document.querySelector('.house').innerHTML = ('野风启城可售 ' + sell)
    })

    let url2 = 'http://www.tmsf.com/yhweb/'
    this.fetch(url2).then(function (html) {
        let dom                                     = document.createElement('div');
        dom.innerHTML                               = html;
        let sell                                    = dom.querySelector('#myCont5 marquee')
        document.querySelector('.house2').innerHTML = sell.innerHTML
    })

    let url3       = 'https://leancloud.cn:443/1.1/classes/video?limit=6',
        url3Header = {
            'X-Avoscloud-Application-Id' : '6Wtm61DtS6PB8YPWukRfGnv2-gzGzoHsz',
            'X-Avoscloud-Application-Key': '4yPPSDwdRCWzWdCimOSBvwVx'
        }
    this.fetch(url3, {header: url3Header}).then(function (html) {
        let data   = JSON.parse(html).results;
        let $video = data.reduce(function (init, d) {
            return init + `<li class="reader__list-item reader__list-item--video" data-id="${d.objectId}">
                <a target="_blank" href="${ d.url }" class="reader__list-item-link"><span class="reader__list-item-title">${d.title }</span></a></li>`
        }, '');

        document.querySelector('.video').innerHTML = $video
        document.querySelector('.video').addEventListener('click', function (e) {
            let dom = e.target;
            while (!dom.classList.contains('reader__list-item--video')) {
                dom = dom.parentElement

            }
            if (dom.classList.contains('reader__list-item--video')) {
                let id = dom.dataset.id

                that.fetch('https://leancloud.cn:443/1.1/classes/video/' + id, {
                    method: "delete",
                    header: url3Header
                }).then(function(){
                    console.log('delete '+ id)
                    dom.style.textDecoration = 'line-through'

                })
            }
        })
    })

}

app.prototype.init = function () {
    this.renderSiteList();
    this.eventBind();
    this.landing()

}

new app();



