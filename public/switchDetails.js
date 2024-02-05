const message = document.querySelector('.message')
const table = document.querySelector('.table')

function handleFileSelect() {
    const fileInput = document.getElementById('file');
    
    const file = fileInput.files[0];
    if (!file) {
        alert('No file selected');
        return;
    }
  
    const reader = new FileReader();
    
    reader.onload = function (e) {
        try {
            const switchData = JSON.parse(e.target.result);
            createTable(switchData)
            console.log('File content as JSON:', switchData);
        } catch (error) {
            message.innerHTML = '<br>Invalid JSON!'
            console.error('Error parsing JSON:', error);
        }
    };
  
    reader.readAsText(file);
}

function createTable(data) {
    table.innerHTML = '<br>Create Table'
}
