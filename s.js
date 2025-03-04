// Function to generate multiple QR codes based on quantity
function generateQRCode() {
    // Get input values
    const partyName = document.getElementById('partyName').value;
    const sku = document.getElementById('sku').value;
    const thickness = document.getElementById('thickness').value;
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    // Check if all fields are filled
    if (!partyName || !sku || !thickness || isNaN(quantity) || quantity <= 0) {
        alert("Please fill in all fields with valid data before generating the QR code.");
        return;
    }

    // Clear the existing QR codes from previous generations
    const qrContainer = document.getElementById('qrContainer');
    qrContainer.innerHTML = '';

    // Generate multiple QR codes based on the quantity
    for (let i = 0; i < quantity; i++) {
        // Create unique data for each QR code, adding an index for uniqueness (if required)
        const qrData = {
            partyName: partyName,
            sku: sku,
            thickness: thickness,
            quantity: 1, // For each QR, we specify 1 quantity
            qrIndex: i + 1 // Optional: add an index to distinguish QR codes
        };

        // Create a new div for each QR code
        const qrBox = document.createElement('div');
        qrBox.classList.add('qr-box');

        // Create the top text (Nikhil)
        const topText = document.createElement('div');
        topText.classList.add('top-text');
        topText.innerText = "AMBA LAMINATES";

        // Create the QR code
        const qrCodeDiv = document.createElement('div');
        new QRCode(qrCodeDiv, {
            text: JSON.stringify(qrData), // Store data in JSON format
            width: 180,
            height: 180
        });

        // Create the bottom text (ID, SKU, and Thickness)
        const bottomText = document.createElement('div');
        bottomText.classList.add('bottom-text');
        bottomText.innerHTML = `ID: ${qrData.qrIndex}<br>SKU: ${sku}<br>Thickness: ${thickness}`;

        // Append everything to the QR Box
        qrBox.appendChild(topText);
        qrBox.appendChild(qrCodeDiv);
        qrBox.appendChild(bottomText);

        // Append the QR code box to the container
        qrContainer.appendChild(qrBox);
    }
}

// Function to print the QR codes
function printQRs() {
    const printWindow = window.open('', '', 'height=600,width=1000');
    const qrContainer = document.getElementById('qrContainer');

    // Add content for printing
    printWindow.document.write('<html><head><title>Print QR Codes</title></head><body>');
    printWindow.document.write('<h1>QR Codes for Items</h1>');
    printWindow.document.write(qrContainer.innerHTML);
    printWindow.document.write('</body></html>');

    // Wait until the document is fully loaded before printing
    printWindow.document.close();
    printWindow.print();
}
