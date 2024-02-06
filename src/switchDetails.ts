function handleFileSelect() {
    const message = document.querySelector('#message') as HTMLDivElement
    const fileInput = document.querySelector('#file') as HTMLInputElement
    
    let file: File | null
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
            const createNew = new createTable()
            createNew.createTable(switchData)
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

class createTable {

    constructor() {
    }
 
    createTable(data: switchDetail[]) {
        const table = document.querySelector('#table') as HTMLTableElement
        const headerRow = document.createElement('tr')

        // Create and append header cells
        const headers = ['port', 'media type', 'vendor name', 'temp', 'tx power', 'rx power', 'error']
        headers.forEach(headerText => {
            const header = document.createElement('th')
            header.textContent = headerText
            // Append header cell to the row
            headerRow.appendChild(header)
        })

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
        // If the table doesn't have a tbody, create one and append it to the table
        if (!tableBody) {
            tableBody = document.createElement('tbody')
        }
        tableBody.innerHTML = ''

        // Create and append body cells
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
            tableBody.appendChild(bodyRow)
        }

        // Enable sorting table on header
        document.addEventListener('click', function (e: MouseEvent) {
            try {
                function findElementRecursive(element: Element, tag: string): Element {
                    return element.nodeName === tag ? element : 
                        findElementRecursive(element.parentNode as Element, tag)
                }
                var descending_th_class = ' dir-d '
                var ascending_th_class = ' dir-u '
                var ascending_table_sort_class = 'asc'
                var regex_dir = / dir-(u|d) /
                var regex_table = /\bsortable\b/
                var alt_sort = e.shiftKey || e.altKey
                var element = findElementRecursive(e.target as HTMLElement, 'TH')
                var tr = findElementRecursive(element, 'TR') as HTMLTableRowElement
                var table = findElementRecursive(tr, 'TABLE') as HTMLTableElement
                function reClassify(element: Element, dir: string) {
                    element.className = element.className.replace(regex_dir, '') + dir
                }
                function getValue(element: HTMLElement): string {
                    return (
                    (alt_sort && element.getAttribute('data-sort-alt')) || 
                    element.getAttribute('data-sort') || element.innerText
                    )
                }
                if (regex_table.test(table.className)) {
                    let column_index: number
                    const nodes = tr.cells
                    for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i] === element) {
                        column_index = Number(element.getAttribute('data-sort-col')) || i
                    } else {
                        reClassify(nodes[i], '')
                    }
                    }
                    var dir = descending_th_class
                    if (
                    element.className.indexOf(descending_th_class) !== -1 ||
                    (table.className.indexOf(ascending_table_sort_class) !== -1 &&
                        element.className.indexOf(ascending_th_class) == -1)
                    ) {
                    dir = ascending_th_class
                    }
                    reClassify(element, dir)

                    const org_tbody = table.tBodies[0]
                    const rows = [].slice.call(org_tbody.rows)
                    const reverse = dir === ascending_th_class

                    rows.sort(function (a: HTMLTableRowElement, b: HTMLTableRowElement) {
                        var x = getValue((reverse ? a : b).cells[column_index])
                        var y = getValue((reverse ? b : a).cells[column_index])
                        return isNaN(Number(x) - Number(y)) ? x.localeCompare(y) : Number(x) - Number(y)
                    })

                    const clone_tbody = org_tbody.cloneNode() as HTMLElement
                    while (rows.length) {
                        clone_tbody.appendChild(rows.splice(0, 1)[0])
                    }
                    table.replaceChild(clone_tbody, org_tbody)
                }
            } catch (error) {
                console.log('Error sorting table')
            }
        })
    }
}
