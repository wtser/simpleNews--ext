# 弹出chrome通知
showNotification = (id, opt) ->
    notification = chrome.notifications.create id, opt, (notifyId)-> notifyId

    setTimeout(()->
        chrome.notifications.clear(id, ->)
    , 8000
    )

# 软件版本更新提示
manifest = chrome.runtime.getManifest()
previousVersion = localStorage.getItem("version") ? 0
if previousVersion != manifest.version
    opt = {
        type: "basic",
        title: "更新",
        message: "十阅 更新到" + manifest.version + "版本啦～\n此次更新 重构了数据底层,支持了ajax 类型的数据源",
        iconUrl: "icon/128.png"
    }
    id = new Date().getTime().toString();
    showNotification(id, opt)
    localStorage.setItem("version", manifest.version)





