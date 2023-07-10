const imagesPath = "images/";
const images = [];

// Apply the overlay
function applyOverlay(thumbnailElement, overlayImageUrl, flip) {
	// Create a new img element for the overlay
	const overlayImage = document.createElement("img");

	overlayImage.src = overlayImageUrl;
	overlayImage.id = "MrBeast"
	overlayImage.style.position = "absolute";
	overlayImage.style.top = "0";
	overlayImage.style.left = "0";
	overlayImage.style.width = "100%";
	overlayImage.style.height = "100%";

	if (location.href.includes("twitch")) {
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
}

function getThumbnailElements() {
	const url = location.href;

	let elementQuery = null;
	if (url.includes("youtube")) {
		elementQuery =
			"ytd-thumbnail:not(.ytd-video-preview, .ytd-rich-grid-slim-media) a > yt-image > img.yt-core-image:only-child:not(.yt-core-attributed-string__image-element)";
	} else if (url.includes("twitch")) {
		//elementQuery = "article > div.tw-hover-accent-effect > div > a > div > div.tw-aspect > img:nth-child(1)";
		elementQuery = "article > div.tw-hover-accent-effect > div > a > div > div.tw-aspect > img:only-of-type";
	} else if (url.includes("pornhub")) {
		elementQuery = ".js-videoThumb:not(.js-menuSwap):only-of-type";
	}

	if (elementQuery !== null) {
		return document.querySelectorAll(elementQuery);
	} else if (document.querySelectorAll("#MrBeast").length === 0) {
		return document.querySelectorAll("img");
	}
}

// Looks for all thumbnails and applies overlay
function applyOverlayToThumbnails() {
	//Asks background for settings 
	chrome.runtime.sendMessage({ action: "getSettings" }, function (settings) {
		//Removes all MrBeasts and exits early
		if (!settings.isOnSwitch) {
			document.querySelectorAll("#MrBeast").forEach((e, i) => {
				e.remove();
			})
			return;
		}

		// Query all YouTube video thumbnails on the page that haven't been processed yet
		// (ignores shorts thumbnails)
		const thumbnailElements = getThumbnailElements();

		// Apply overlay to each thumbnail
		thumbnailElements.forEach((thumbnailElement) => {
			// Apply overlay and add to processed thumbnails
			let loops = Math.random() > 0.001 ? 1 : 20; // Easter egg

			for (let i = 0; i < loops; i++) {
				// Get overlay image URL from your directory
				const overlayImageUrl = getRandomImageFromDirectory();
				const flip = Math.random() < 0.25; // 25% chance to flip the image
				applyOverlay(thumbnailElement, overlayImageUrl, flip);
			}
		});
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