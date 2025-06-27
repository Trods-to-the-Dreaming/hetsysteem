function createCurrencySymbol() {
	const img = document.createElement("img");
	img.src = "/img/currency.svg";
	img.alt = "Spelvaluta";
	img.style.height = "1em";
	img.style.verticalAlign = "middle";
	img.style.marginLeft = "0.1em";
	return img;
}