angular.module('TenRead.Controllers', ['TenRead.initData', 'as.sortable'])

.controller 'PopupCtrl', ($scope, $http, $timeout, initData) ->
    $('body').on 'click', '.news-list a', (e) -> e.preventDefault()
    $scope.popup    = {}
    popup = $scope.popup
    popup.scrollTop = localStorage.getItem('scrollTop') or 0
    $timeout (->
        $('.tabs').scrollTop popup.scrollTop
    ), 10


    popup.sites = JSON.parse(localStorage.getItem('sites')) ? []
    if popup.sites.length == 0 then popup.sites = initData ? []
    localStorage.setItem 'sites', JSON.stringify(popup.sites)
    popup.index = localStorage.getItem('index') ? 0
    # 索引值越界处理
    if popup.index >= popup.sites.length
        popup.index = popup.sites.length - 1

    popup.currentSite        = popup.sites[popup.index]
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
        site.status      = 'active'
        popup.parsedData = JSON.parse(localStorage.getItem('site' + index)) or []


        render = (site)->
# item == title == href 进入兼容模式
            if typeof site.selector is "string"
                site.type = "compatible"
            else if site.selector.item == site.selector.title || site.selector.item == site.selector.href
                site.type     = "compatible"
                site.selector = site.selector.item
            ajaxUrl = {
                compatible: site.url,
                html: site.url,
                ajax: site.api
            }
            $.ajax
                type: 'get'
                url: ajaxUrl[site.type]
                timeout: 10000
                success: (data) ->
                    callback = {
                        compatible: ->
                            parsedData = $(data).find(site.selector)
                            $scope.popup.parsedData = []
                            if parsedData.length > 0
                                i = 0
                                while i < parsedData.length
                                    item = parsedData[i]
                                    article =
                                        title: $.trim($(item).text()).replace(/^\<img[\s\S]+\>/, ""),
                                        href: $(item).attr("href")
                                    if article.href.indexOf('http') == -1
                                        baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1)
                                        if article.href[0] != '/'
                                            baseUrl += '/'
                                        article.href = baseUrl + article.href
                                    $scope.popup.parsedData.push article
                                    localStorage.setItem 'site' + index, JSON.stringify(popup.parsedData)
                                    i++
                        html: ->
                            parsedData = $(data).find(site.selector.item)
                            $scope.popup.parsedData = []
                            if parsedData.length > 0
                                i = 0
                                while i < parsedData.length
                                    item = parsedData[i]
                                    article =
                                        title: $.trim $(item).find(site.selector.title).text()
                                        href: $(item).find(site.selector.href).attr('href')
                                    if article.href.indexOf('http') == -1
                                        baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1)
                                        if article.href[0] != '/'
                                            baseUrl += '/'
                                        article.href = baseUrl + article.href
                                    $scope.popup.parsedData.push article
                                    localStorage.setItem 'site' + index, JSON.stringify(popup.parsedData)
                                    i++
                        ajax: ->
                            data                    = JSON.parse(data)
                            $scope.popup.parsedData = data[site.selector.item].map((a) ->
                                if a[site.selector.href].indexOf('http') == -1
                                    baseUrl = site.url.match(/http[s]?:\/\/+[\s\S]+?\//)[0].slice(0, -1)
                                    if a[site.selector.href][0] != '/'
                                        baseUrl += '/'
                                    if a[site.selector.href][1] == "/"
                                        baseUrl = 'http:'
                                    a[site.selector.href] = baseUrl + a[site.selector.href]
                                return {
                                title: $.trim a[site.selector.title]
                                href: a[site.selector.href]
                                }
                            )
                            localStorage.setItem 'site' + index, JSON.stringify(popup.parsedData)


                    }

                    $scope.$apply ->
                        callback[site.type]()
                        $scope.popup.loading = false
                error: (xhr, type) ->
                    $('.news-list .error').html xhr.response
                    $scope.$apply ->
                        $scope.popup.loading = false
                        $scope.popup.error   = true
        render(site)
        popup.currentSite = popup.sites[popup.index]

    popup.show popup.index

    popup.redirect = (article) ->
        chrome.tabs.create {
            url: 'https://ten-read.wtser.com/redirect?href=' + encodeURIComponent(article.href) + '&title=' + encodeURIComponent(article.title)
            active: false
        }
.controller('OptionCtrl', ($scope) ->
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
    optionList.domain = 'https://wtser.com/ten-read/data/'
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

    myList.dragControlListeners = {
        orderChanged: (event)->
            localStorage.setItem 'sites', JSON.stringify(myList.data)
    }
    myList.form                 =
        icon: ''
        url: ''
        name: ''
        selector: ''
    myList.modal                = {
        form: false
        export: false
    }
    myList.sites                = localStorage.getItem('sites')
    myList.data                 = JSON.parse(myList.sites)

    myList.export = ->
        myList.modal.export = true
    myList.add    = ->
        myList.form       =
            icon: ''
            url: ''
            name: ''
            type: 'html'
            selector: {
                item: ""
                title: ""
                href: ""
            }
        myList.modal.form = true
        myList.form.index = -1
        return

    myList.cancel = ->
        myList.modal.form   = false
        myList.modal.export = false
        return

    myList.edit = (index) ->
        myList.form = myList.data[index]
        if myList.form.selector.hasOwnProperty("length")
            myList.form.type     = "html"
            myList.form.selector = {
                item: myList.form.selector
                title: myList.form.selector
                href: myList.form.selector
            }
        myList.modal.form = true
        myList.form.index = index
        console.log JSON.stringify myList.form
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
        myList.modal.form = false
        return

    return
).controller('OptionExchangeCtrl', ($scope) ->
).controller 'OptionAboutCtrl', ($scope) ->
