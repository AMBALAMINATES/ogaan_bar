// Function to generate QR codes based on input
let scannedIds = new Set();
let scannedCounts = {}; // Stores scanned quantity per SKU & Party Name

// Function to generate multiple QR codes based on quantity
function generateQRCode() {
    const partyName = document.getElementById('partyName').value;
    const sku = document.getElementById('sku').value;
    const thickness = document.getElementById('thickness').value;
    const requiredQuantity = parseInt(document.getElementById('requiredQuantity').value, 10); 
    const quantity = parseInt(document.getElementById('quantity').value, 10);

    if (!partyName || !sku || !thickness || isNaN(requiredQuantity) || requiredQuantity <= 0 || isNaN(quantity) || quantity <= 0) {
        alert("Please fill in all fields with valid data before generating the QR code.");
        return;
    }

    const qrContainer = document.getElementById('qrContainer');
    qrContainer.innerHTML = '';  // Clear previous QR codes

    scannedCounts[sku] = 0; // Initialize scanned count

    for (let i = 0; i < quantity; i++) {
        const uniqueId = `${sku}-${Math.floor(100000 + Math.random() * 900000)}`;
        const qrData = { partyName, sku, uniqueId, requiredQuantity, scannedQuantity: 0, thickness };

        const qrCodeDiv = document.createElement('div');
        qrCodeDiv.classList.add('qr-box');

       
        const nikhilText = document.createElement('div');
        nikhilText.innerText = "AMBA LAMINATES";
        nikhilText.style.textAlign = "center";
        nikhilText.style.fontWeight = "bold";
        qrCodeDiv.appendChild(nikhilText);

        // Generate QR code
        new QRCode(qrCodeDiv, { text: JSON.stringify(qrData), width: 180, height: 180 });

        // Create and display SKU and Thickness below the QR code
        const skuText = document.createElement('div');
        skuText.innerText = `SKU: ${sku}`;
        skuText.style.textAlign = "center";
        qrCodeDiv.appendChild(skuText);

        const thicknessText = document.createElement('div');
        thicknessText.innerText = `Thickness: ${thickness}`;
        thicknessText.style.textAlign = "center";
        qrCodeDiv.appendChild(thicknessText);

        // Create and display Unique ID below SKU and Thickness
        const qrIdText = document.createElement('div');
        qrIdText.innerText = `ID: ${uniqueId}`;
        qrIdText.style.textAlign = "center";
        qrIdText.style.fontWeight = "bold";
        qrCodeDiv.appendChild(qrIdText);

        // Add click event listener to each QR code to simulate scanning
        qrCodeDiv.addEventListener('click', function () {
            scanQRCode(qrData);
        });

        // Append the QR code div to the container
        qrContainer.appendChild(qrCodeDiv);
    }
}

// Function to handle QR scanning
function scanQRCode(scannedData) {
    if (scannedIds.has(scannedData.uniqueId)) {
        alert("This QR code has already been scanned.");
        return;
    }

    scannedIds.add(scannedData.uniqueId);
    scannedCounts[scannedData.sku] = (scannedCounts[scannedData.sku] || 0) + 1;
    scannedData.scannedQuantity = scannedCounts[scannedData.sku];

    updateScannedQuantity(scannedData);
}

// Function to update scanned quantity in the table
function updateScannedQuantity(scannedData) {
    const table = document.getElementById('qrDataTable').getElementsByTagName('tbody')[0];
    let rowToUpdate = null;

    for (let row of table.rows) {
        if (row.cells[1].innerText === scannedData.sku) {
            rowToUpdate = row;
            break;
        }
    }

    if (rowToUpdate) {
        rowToUpdate.cells[4].innerText = scannedData.scannedQuantity;
        if (scannedData.scannedQuantity === scannedData.requiredQuantity) {
            alert("All required QR codes have been scanned!");
        }
    } else {
        addToTable(scannedData);
    }
}

// Function to add scanned data to the table
function addToTable(scannedData) {
    const table = document.getElementById('qrDataTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `
        <td>${new Date().toLocaleDateString()}</td>
        <td>${scannedData.sku}</td>
        <td>${scannedData.partyName}</td>
        <td>${scannedData.requiredQuantity}</td>
        <td>${scannedData.scannedQuantity}</td>
    `;
}

// Function to print only the QR codes
function printQRCode() {
    const printContent = document.getElementById('qrContainer');
    const printWindow = window.open('', '', 'height=600,width=800');
    
    // Define the print-specific styles to ensure the QR code and text are well formatted
    printWindow.document.write('<html><head><title>Print QR Codes</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('@media print {');
    printWindow.document.write('body { font-family: Arial, sans-serif; }');
    printWindow.document.write('.qr-box { display: inline-block; margin: 10px; text-align: center; }');
    printWindow.document.write('.qr-box div { margin-bottom: 5px; }');
    printWindow.document.write('}');  // end of @media print
    printWindow.document.write('</style></head><body>');
    
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    printWindow.document.close();
    printWindow.print();
}

