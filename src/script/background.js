chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
    	console.log(request)
    	//localStorage.setItem('aaa',JSON.stringify(request))
        /*sendResponse({
            data: ret
        });*/
    });