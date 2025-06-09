/*function createCurrencySymbol() {
	const span = document.createElement("span");
	span.style.textDecoration = "line-through";
	span.textContent = "S";
	return span;
}*/
function createCurrencySymbol() {
	const img = document.createElement("img");
	img.src = "/img/currency.svg";
	img.alt = "Spelvaluta";
	img.style.height = "1em";
	img.style.verticalAlign = "middle";
	img.style.marginLeft = "0.1em"; // optioneel voor wat lucht
	return img;
}