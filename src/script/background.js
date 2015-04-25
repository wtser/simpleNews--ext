chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        $.post('http://tenread.wtser.com/api/sync', request, function (d) {
            //console.log(JSON.parse(d).visited)
        })

    });