let currentSlide = 0;
const borderFiles = ["none", "borders/starBorder.svg", "borders/heartBorder.svg","borders/lightningBorder.svg"];

function slideLeft() {
    currentSlide = (currentSlide > 0) ? currentSlide - 1 : borderFiles.length - 1;
    loadBorderSVG(borderFiles[currentSlide]);
}

function slideRight() {
    currentSlide = (currentSlide < borderFiles.length - 1) ? currentSlide + 1 : 0;
    loadBorderSVG(borderFiles[currentSlide]);
}

function loadBorderSVG(borderFile) {
    const borderContainer = document.getElementById('borderSVG');
    
    if (borderFile === "none") {
        borderContainer.innerHTML = ''; // Clear the border if "No Border" is selected
    } else {
        fetch(borderFile)
            .then(response => response.text())
            .then(svgText => {
                borderContainer.innerHTML = svgText;
            })
            .catch(err => console.error(err));
    }
}

function updatePreview() {
    const nameSVG = document.getElementById('nameSVG');
    nameSVG.innerHTML = ''; // Clear previous content

    const nameText = document.getElementById('nameInput').value || "Name";
    const fontStyle = document.getElementById('fontStyle').value;
    const maxFontSize = 60;
    const minFontSize = 20;
    const maxCharactersPerLine = 12; // Set a reasonable character count for one line
    const padding = 40; // Padding between text and the border

    let lines = [];

    // Split the text into two lines if it's too long
    if (nameText.length > maxCharactersPerLine) {
        const firstLine = nameText.substring(0, maxCharactersPerLine);
        const secondLine = nameText.substring(maxCharactersPerLine);
        lines.push(firstLine, secondLine);
    } else {
        lines.push(nameText);
    }

    // Calculate the font size based on the total text length
    let fontSize = maxFontSize - (nameText.length * 2);
    if (fontSize < minFontSize) fontSize = minFontSize;

    // Generate the text for each line
    lines.forEach((line, index) => {
        const yPosition = (lines.length === 1) ? "50%" : (index === 0 ? "40%" : "60%"); // Adjust y-position for 2 lines
        const textElement = `<text x="50%" y="${yPosition}" font-size="${fontSize}" font-family="${fontStyle}" fill="#333" dominant-baseline="middle" text-anchor="middle">${line}</text>`;
        nameSVG.innerHTML += textElement;
    });
}

function exportSVG() {
    const svgElement = document.getElementById('nameSVG').cloneNode(true);
    const borderElement = document.getElementById('borderSVG').innerHTML;

    const fullSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    fullSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    fullSVG.setAttribute("width", "800");
    fullSVG.setAttribute("height", "300");
    fullSVG.setAttribute("viewBox", "0 0 800 300");

    // Add the 3-inch by 8-inch border
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "800");
    rect.setAttribute("height", "300");
    rect.setAttribute("fill", "none");
    rect.setAttribute("stroke", "#333");
    rect.setAttribute("stroke-width", "2");

    // Append the border and text elements to the final SVG
    fullSVG.appendChild(rect);
    fullSVG.innerHTML += borderElement + svgElement.innerHTML;

    const svgData = new XMLSerializer().serializeToString(fullSVG);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "nameplate.svg";
    downloadLink.click();
}

// Initial load with "No Border" as the default
loadBorderSVG(borderFiles[currentSlide]);
