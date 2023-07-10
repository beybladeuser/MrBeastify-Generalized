document.addEventListener("DOMContentLoaded", function() {
	var optionsButton = document.getElementById("optionsButton");
	// Redirect to Options Page
	optionsButton.addEventListener("click", () => {
		chrome.runtime.openOptionsPage();
	});

	var isOnSwitch = document.getElementById("isOnSwitch");
	var MrBeastifyOptions = document.getElementById("MrBeastifyOptions");
	var ChaosLvl = document.getElementById("ChaosLvl");

	// Load the saved settings when the popup is opened
	chrome.storage.sync.get(["isOnSwitch", "MrBeastifyOptions", "ChaosLvl"], (settings) => {
		isOnSwitch.checked = settings.isOnSwitch !== undefined ? settings.isOnSwitch : true;
		MrBeastifyOptions.value = settings.MrBeastifyOptions !== undefined ? settings.MrBeastifyOptions : 0;
		ChaosLvl.value = settings.ChaosLvl !== undefined ? settings.ChaosLvl : 0;
	});

	//Turn on and off MrBeast
	isOnSwitch.addEventListener("click", () => {
		chrome.storage.sync.set({isOnSwitch: isOnSwitch.checked});
	})
	//Select what to MrBeastify
	MrBeastifyOptions.addEventListener("change", () => {
		chrome.storage.sync.set({MrBeastifyOptions: MrBeastifyOptions.value});
	})
	//Select level of chaos
	ChaosLvl.addEventListener("change", () => {
		chrome.storage.sync.set({ChaosLvl: ChaosLvl.value});
	})
});