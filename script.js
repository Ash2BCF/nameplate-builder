let currentBorder = 'https://raw.githubusercontent.com/your-username/nameplate-builder/main/borders/starBorder.svg';

// Function to update the name in the preview
function updateName() {
    const name = document.getElementById('nameInput').value;
    const svgElement = document.getElementById('nameplate-svg');
    updateSVG(name, currentBorder, svgElement);
}

// Function to change the border
function changeBorder() {
    const border = document.getElementById('borderStyle').value;

    // Update the current border URL from GitHub
    if (border === 'starBorder') {
        currentBorder = 'https://raw.githubusercontent.com/Ash2BCF/nameplate-builder/refs/heads/main/borders/starBorder.svg';
    } else if (border === 'heartBorder') {
        currentBorder = 'https://raw.githubusercontent.com/Ash2BCF/nameplate-builder/refs/heads/main/borders/heartBorder.svg';
    }

    // Re-update the preview
    const name = document.getElementById('nameInput').value;
    const svgElement = document.getElementById('nameplate-svg');
    updateSVG(name, currentBorder, svgElement);
}

// Function to fetch the SVG border and update the preview
function updateSVG(name, borderFile, svgElement) {
    fetch(borderFile)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(data, 'image/svg+xml');
            const borderSVG = svgDoc.documentElement;

            // Clear the previous content
            svgElement.innerHTML = '';

            // Append the border SVG
            svgElement.appendChild(borderSVG);

            // Create and insert the name text element
            const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textElement.setAttribute("x", "50%");
            textElement.setAttribute("y", "50%");
            textElement.setAttribute("dominant-baseline", "middle");
            textElement.setAttribute("text-anchor", "middle");
            textElement.setAttribute("font-size", "24");
            textElement.setAttribute("fill", "black");
            textElement.textContent = name;

            // Append the name to the SVG
            svgElement.appendChild(textElement);
        })
        .catch(err => console.error('Error loading SVG:', err));
}

// Function to export the SVG
function exportSVG() {
    const svgElement = document.getElementById('nameplate-svg');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);

    // Embed the selected border
    fetch(currentBorder)
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(data, 'image/svg+xml');
            const borderSVG = svgDoc.documentElement;

            // Create a combined SVG element
            const fullSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            fullSVG.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            fullSVG.setAttribute("width", "300");
            fullSVG.setAttribute("height", "150");
            fullSVG.setAttribute("viewBox", "0 0 300 150");

            // Append the border and text into the full SVG
            fullSVG.appendChild(borderSVG);
            Array.from(svgElement.childNodes).forEach(child => {
                fullSVG.appendChild(child.cloneNode(true));
            });

            // Serialize and download the SVG
            const combinedSource = serializer.serializeToString(fullSVG);
            const blob = new Blob([combinedSource], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);

            // Trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = 'nameplate.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}
