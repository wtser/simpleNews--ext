angular.module 'TenRead.initData', []
.value 'initData', [
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
    },
    {
        "type": "ajax",
        "name": "淘宝众筹",
        "api": "https://hstar-hi.alicdn.com/dream/ajax/getProjectList.htm?page=1&pageSize=20&projectType=&type=6&status=&sort=1",
        "url": "https://hi.taobao.com/market/hi/list.php",
        "icon": "https://img.alicdn.com/tps/TB19yVcJFXXXXaNXFXXXXXXXXXX-384-119.png",
        "paging": "",
        "selector": {
            "item": "data",
            "title": "name",
            "href": "link"
        }
    }
]