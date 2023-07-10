const imagesPath = "images/";
const images = [];

let oldSettings = {};

let overlayImagesQueue = []

// Apply the overlay
function applyOverlay(thumbnailElement, overlayImageUrl, flip, settings) {
	// Create a new img element for the overlay
	const overlayImage = document.createElement("img");

	overlayImage.src = overlayImageUrl;
	overlayImage.id = "MrBeast"
	overlayImage.style.position = "absolute";
	overlayImage.style.top = "0";
	overlayImage.style.left = "0";
	overlayImage.style.width = "100%";
	overlayImage.style.height = "100%";

	if (location.href.includes("twitch") && thumbnailElement.previousElementSibling !== null) {
		thumbnailElement.previousElementSibling.style.position = "absolute";
	}

	overlayImage.style.zIndex = "0"; // Ensure overlay is on top

	if (flip) {
		overlayImage.style.transform = "scaleX(-1)"; // Flip the image horizontally
	}

	// Style the thumbnailElement to handle absolute positioning
	thumbnailElement.style.position = "relative";
	// Append the overlay to the parent of the thumbnail
	thumbnailElement.parentElement.appendChild(overlayImage);

	return overlayImage;
}

function getElementQuery(settings) {
	const url = location.href;
	let elementQuery = null;
	if (url.includes("youtube")) {
		elementQuery =
			"ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element)";
	} else if (url.includes("twitch")) {
		elementQuery = settings.ChaosLvl !== "0" ? "article > div.tw-hover-accent-effect > div > a > div > div.tw-aspect > img:nth-child(2)" : "article > div.tw-hover-accent-effect > div > a > div > div.tw-aspect > img:only-of-type";
	} else if (url.includes("pornhub")) {
		elementQuery = settings.ChaosLvl !== "0" ? ".js-videoThumb:not(.js-menuSwap)" : ".js-videoThumb:not(.js-menuSwap):only-of-type";
	}
	return elementQuery;
}

function getThumbnailElements(settings) {
	const url = location.href;

	elementQuery = getElementQuery(settings)

	if (elementQuery !== null && settings.MrBeastifyOptions !== "1") {
		return document.querySelectorAll(elementQuery);
	} else if (settings.MrBeastifyOptions === "1" && settings.ChaosLvl === "0") {
		return Array.from(document.querySelectorAll("img")).filter((e) => {return e.parentElement.querySelectorAll("#MrBeast").length === 0});
	} else if (settings.MrBeastifyOptions === "1" && settings.ChaosLvl === "1") {
		return document.querySelectorAll("img:not(#MrBeast)");
	} else if (settings.MrBeastifyOptions === "1" && settings.ChaosLvl === "2") {
		return document.querySelectorAll("img");
	}
}

function removeMrBeasts() {
	document.querySelectorAll("#MrBeast")?.forEach((e, i) => {
		e.remove();
	})
	overlayImagesQueue = []
}

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
	//Asks background for settings 
	chrome.runtime.sendMessage({ action: "getSettings" }, function (newSettings) {
		//Removes all MrBeasts and exits early
		if (!newSettings.isOnSwitch) {
			removeMrBeasts()
			return;
		}
		if (oldSettings.MrBeastifyOptions !== newSettings.MrBeastifyOptions) {
			removeMrBeasts()
		}
		oldSettings = newSettings

		// Query all YouTube video thumbnails on the page that haven't been processed yet
		// (ignores shorts thumbnails)
		const thumbnailElements = getThumbnailElements(newSettings);

		const newOverlayImages = []
		// Apply overlay to each thumbnail
		thumbnailElements?.forEach((thumbnailElement) => {
			// Apply overlay and add to processed thumbnails
			let loops = Math.random() > 0.001 ? 1 : 20; // Easter egg

			for (let i = 0; i < loops; i++) {
				// Get overlay image URL from your directory
				const overlayImageUrl = getRandomImageFromDirectory();
				const flip = Math.random() < 0.25; // 25% chance to flip the image
				newOverlayImages.push(applyOverlay(thumbnailElement, overlayImageUrl, flip, newSettings));
			}
		});
		if (newSettings.ChaosLvl === "1") {
			overlayImagesQueue.push(newOverlayImages);
			for (let i = newSettings.MaxOverlayQueue; i <= overlayImagesQueue.length; i++) {
				overlayImagesToDelete = overlayImagesQueue.shift()
				overlayImagesToDelete.forEach((e, i) => {
					e.remove()
				})
			}
		}
	});


}

// Get a random image URL from a directory
function getRandomImageFromDirectory() {
	const randomIndex = Math.floor(Math.random() * images.length);
	return images[randomIndex];
}

// Checks for all images in the images folder instead of using a preset array, making the extension infinitely scalable
function checkImageExistence(index = 1) {
	const testedURL = chrome.runtime.getURL(`${imagesPath}${index}.png`);
	fetch(testedURL)
		.then((response) => {
			// Image exists, add it to the images array
			images.push(testedURL);
			// Check the next image in the directory
			checkImageExistence(index + 1);
		})
		.catch((error) => { // The function encountered a missing image. Start applying overlays
			setInterval(applyOverlayToThumbnails, 100);
			console.log(
				"MrBeastify Loaded Successfully, " + (index - 1) + " images detected."
			);
		});
}

checkImageExistence();