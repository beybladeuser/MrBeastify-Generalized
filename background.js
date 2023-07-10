chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "getSettings") {
		chrome.storage.sync.get(["isOnSwitch", "MrBeastifyOptions", "ChaosLvl", "MaxOverlayQueue"], function (result) {
			sendResponse(result);
		});
	}
	return true; // To indicate that sendResponse will be called asynchronously
});