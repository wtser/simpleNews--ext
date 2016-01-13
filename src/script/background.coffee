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
        title: "十阅更新至 " + manifest.version + " 版本啦～",
        message: "此次更新  订阅商店访问加速",
        iconUrl: "icon/128.png"
    }
    id = new Date().getTime().toString();
    showNotification(id, opt)
    localStorage.setItem("version", manifest.version)





