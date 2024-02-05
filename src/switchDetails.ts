function handleFileSelect() {
    const message = document.querySelector('#message') as HTMLInputElement
    const fileInput = document.querySelector('#file') as HTMLInputElement
    
    let file: File | null; // Declare file outside the if block
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        file = fileInput.files[0]
    } else {
        alert('No file selected')
        return;
    }
  
    const reader = new FileReader()
    
    reader.onload = function (e) {
        try {
            const switchData = JSON.parse((e.target as FileReader).result as string)
            message.innerHTML = '<br>'
            createTable(switchData)
            console.log('File content as JSON:', switchData)
        } catch (error) {
            message.innerHTML = '<br>Error parsing JSON!'
            console.error('Error parsing JSON:', error)
        }
    };  
    reader.readAsText(file)
}

interface switchDetail {
    error: string;
    port: number;
    media_type: string;
    vendor_name: string;
    part_number: string;
    serial_number: string;
    wavelength: string;
    temp: {
      value: number;
      status: string;
    };
    'voltage_aux-1': {
      value: number;
      status: string;
    };
    tx_power: {
      value: number;
      status: string;
    };
    rx_power: {
      value: number;
      status: string;
    };
    tx_bias_current: {
      value: number;
      status: string;
    };
}

function createTable(data: switchDetail[]) {
    const table = document.querySelector('#table') as HTMLInputElement
    const headerRow = document.createElement('tr')

    // Create and append header cells
    const header1 = document.createElement('th')
    header1.textContent = 'port';
    const header2 = document.createElement('th')
    header2.textContent = 'media type';
    const header3 = document.createElement('th')
    header3.textContent = 'vendor name';
    const header4 = document.createElement('th')
    header4.textContent = 'temp';
    const header5 = document.createElement('th')
    header5.textContent = 'tx power';
    const header6 = document.createElement('th')
    header6.textContent = 'rx power';
    const header7 = document.createElement('th')
    header7.textContent = 'error';

    // Append header cells to the row
    headerRow.appendChild(header1)
    headerRow.appendChild(header2)
    headerRow.appendChild(header3)
    headerRow.appendChild(header4)
    headerRow.appendChild(header5)
    headerRow.appendChild(header6)
    headerRow.appendChild(header7)

    // Append the new row to the table head (thead)
    const tableHead = table.querySelector('thead')
    if (tableHead) {
        tableHead.innerHTML = ''
        tableHead.appendChild(headerRow)
    } else {
        // If the table doesn't have a thead, create one and append it to the table
        const newHead = document.createElement('thead')
        newHead.appendChild(headerRow)
        table.appendChild(newHead)
    }

    var tableBody = table.querySelector('tbody')
    if (!tableBody) {
        tableBody = document.createElement('tbody')
    }
    tableBody.innerHTML = ''

    let bodyRow: HTMLElement, port: HTMLElement, mediaType: HTMLElement,
        vendorName: HTMLElement, temp: HTMLElement, txPower: HTMLElement,
        rxPower: HTMLElement, error: HTMLElement

    for (let i=0; i<data.length; i++) {
        bodyRow = document.createElement('tr')

        port = document.createElement('td')
        port.textContent = data[i].port.toString()
        mediaType = document.createElement('td')
        mediaType.textContent = data[i].media_type
        vendorName = document.createElement('td')
        vendorName.textContent = data[i].vendor_name
        temp = document.createElement('td')
        if ('temp' in data[i]) {
            temp.textContent = data[i].temp.value.toString()
        }
        txPower = document.createElement('td')
        if ('tx_power' in data[i]) {
            txPower.textContent = data[i].tx_power.value.toString()
            if (data[i].tx_power.value < -4.0) bodyRow.style.backgroundColor = 'rgba(240, 128, 128, 0.3)'
        }
        rxPower = document.createElement('td')
        if ('rx_power' in data[i]) {
            rxPower.textContent = data[i].rx_power.value.toString()
            if (data[i].rx_power.value < -4.0) bodyRow.style.backgroundColor = 'rgba(240, 128, 128, 0.3)'
        }
        error = document.createElement('td')
        error.textContent = data[i].error
     
        // Append body cells to the row
        bodyRow.appendChild(port)
        bodyRow.appendChild(mediaType)
        bodyRow.appendChild(vendorName)
        bodyRow.appendChild(temp)
        bodyRow.appendChild(txPower)
        bodyRow.appendChild(rxPower)
        bodyRow.appendChild(error)
    
        // Append the new row to the table body (tbody)
        // tableBody.appendChild(bodyRow)
        table.appendChild(bodyRow)
    }
}
