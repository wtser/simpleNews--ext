angular.module('TenRead.Controllers', []).controller('PopupCtrl', ($scope, $http, $timeout) ->
    $('body').on 'click', '.news-list a', (e) ->
        e.preventDefault()
        return
    $scope.popup    = {}
    popup = $scope.popup
    popup.scrollTop = localStorage.getItem('scrollTop') or 0
    $timeout (->
        $('.tabs').scrollTop popup.scrollTop
        return
    ), 10
    popup.initSites = [
        {
            'type': 'html'
            'icon': 'http://www.v2ex.com/static/img/icon_rayps_64.png'
            'name': 'v2ex'
            'url': 'http://www.v2ex.com/?tab=hot'
            'paging': ''
            'selector':
                'item': '.cell.item'
                'title': '.item_title>a'
                'href': '.item_title>a'
        }
        {
            'type': 'ajax'
            'name': '淘宝众筹'
            'api': 'https://hstar-hi.alicdn.com/dream/ajax/getProjectList.htm?page=1&pageSize=20&projectType=&type=6&status=&sort=1'
            'url': 'http://izhongchou.taobao.com/'
            'icon': 'http://static.segmentfault.com/global/img/touch-icon.c78b1075.png'
            'paging': ''
            'selector':
                'item': 'data'
                'title': 'name'
                'href': 'link'
        }
    ]
    popup.sites     = JSON.parse(localStorage.getItem('sites')) or []
    if popup.sites.length == 0
        popup.sites = popup.initSites
        localStorage.setItem 'sites', JSON.stringify(popup.sites)
    popup.index              = localStorage.getItem('index') or 0
    popup.currentSite        = popup.sites[popup.index] or popup.sites[popup.sites.length - 1]
    popup.currentSite.status = 'active'

    popup.show = (index) ->
        if index != localStorage.getItem('index')
            popup.scrollTop = $('.tabs').scrollTop()
            localStorage.setItem 'scrollTop', popup.scrollTop
        popup.error = false
        localStorage.setItem 'index', index
        popup.index   = index
        popup.loading = true
        site = popup.sites[index]
        angular.forEach popup.sites, (site) ->
            site.status = ''
            return
        site.status      = 'active'
        popup.parsedData = JSON.parse(localStorage.getItem('site' + index)) or []
        $.ajax
            type: 'get'
            url: if site.type == 'html' then site.url else site.api
            timeout: 10000
            success: (data) ->
                $scope.$apply ->
                    if site.type == 'html'
                        parsedData = $(data).find(site.selector.item)
                        $scope.popup.parsedData = []
                        if parsedData.length > 0
                            i = 0
                            while i < parsedData.length
                                item = parsedData[i]
                                article =
                                    title: $(item).find(site.selector.title).text()
                                    href: $(item).find(site.selector.href).attr('href')
                                if article.href.indexOf('http') == -1
                                    baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1)
                                    if article.href[0] != '/'
                                        baseUrl += '/'
                                    article.href = baseUrl + article.href
                                $scope.popup.parsedData.push article
                                localStorage.setItem 'site' + index, JSON.stringify(popup.parsedData)
                                i++
                    else
                        data                    = JSON.parse(data)
                        $scope.popup.parsedData = data[site.selector.item].map((a) ->
                            {
                            title: a[site.selector.title]
                            href: a[site.selector.href]
                            }
                        )
                        localStorage.setItem 'site' + index, JSON.stringify(popup.parsedData)
                    $scope.popup.loading = false
                    return
                return
            error: (xhr, type) ->
                $('.news-list .error').html xhr.response
                $scope.$apply ->
                    $scope.popup.loading = false
                    $scope.popup.error   = true
                    return
                return
        popup.currentSite = popup.sites[popup.index]
        return

    popup.show popup.index

    popup.sync = (article) ->
        chrome.tabs.create {
            url: article.href
            active: false
        }, ->
            $.post 'http://tenread.wtser.com/api/sync', article, (d) ->
                console.log JSON.parse(d).visited
                return
            return
        return

    return
).controller('OptionCtrl', ($scope) ->
    option = $scope.option = {}
    option.nav = [
        {
            name: '订阅商店'
            value: 'store'
        }
        {
            name: '我的订阅'
            value: 'subscription'
        }
    ]

    option.navSelection = (n) ->
        if option.state == n.value
            return 'selected'
        return

    $scope.$on '$stateChangeSuccess', (evt, toState) ->
        option.state = toState.url.replace('/', '')
        return
    return
).controller('OptionStoreCtrl', ($scope, $http) ->
    $scope.optionList = {}
    optionList = $scope.optionList
    optionList.domain = 'http://wtser.github.io/ten-read/data/'
    optionList.sites  = JSON.parse(localStorage.getItem('sites')) or []

    optionList.show = (slug) ->
        optionList.slug = slug
        $http.get(optionList.domain + slug + '.json?t=' + Date.now()).success (d) ->
            optionList.currentSites = d
            return
        return

    optionList.subscribe = (site) ->
        hasSubscribe = optionList.sites.filter((s) ->
            s.name == site.name
        )
        if hasSubscribe.length > 0
            alert '该项已订阅'
        else
            optionList.sites.push site
            localStorage.setItem 'sites', JSON.stringify(optionList.sites)
            alert '订阅成功'
        return

    $http.get(optionList.domain + 'catalog.json').success (d) ->
        optionList.catalogs = d
        optionList.slug     = d[0].slug
        optionList.show optionList.slug
        return
    return
).controller('OptionSubscriptionCtrl', ($scope, $rootScope) ->
    $scope.myList     = {}
    myList = $scope.myList
    $rootScope.myList = myList
    myList.form       =
        icon: ''
        url: ''
        name: ''
        selector: ''
    myList.form.show  = false
    myList.data       = JSON.parse(localStorage.getItem('sites'))

    myList.add = ->
        myList.form       =
            icon: ''
            url: ''
            name: ''
            selector: ''
        myList.form.show  = true
        myList.form.index = -1
        return

    myList.cancel = ->
        myList.form.show = false
        return

    myList.edit = (index) ->
        myList.form       = myList.data[index]
        myList.form.show  = true
        myList.form.index = index
        return

    myList.del = (index) ->
        if confirm('确认删除？')
            myList.data.splice index, 1
            localStorage.setItem 'sites', JSON.stringify(myList.data)
        return

    myList.submit = ->
        if myList.form.index == -1
            myList.data.push myList.form
        else
            myList.data[myList.form.index] = myList.form
        localStorage.setItem 'sites', JSON.stringify(myList.data)
        myList.form.show = false
        return

    return
).controller('OptionExchangeCtrl', ($scope) ->
).controller 'OptionAboutCtrl', ($scope) ->
