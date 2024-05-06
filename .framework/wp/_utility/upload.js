
"define webpack";

function uploadFile(url, file, callback, onError) {
    // Create a FormData object
    const formData = new FormData();
    
    // Append the file to the FormData object
    formData.append('file', file);

    // Send the request using fetch
    fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            // 'Content-Type': 'multipart/form-data'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.json(); // Parse the JSON response
        } else {
            console.error('Failed to upload file:', response.status, response.statusText);
            throw new Error('File upload failed');
        }
    })
    .then(data => {
        // Call the callback function and pass the data
        if(typeof callback == "function"){
            callback(data);
        }
    })
    .catch(error => {
        console.error('Error occurred during the request:', error);
        // Call the callback function with the error
        if(typeof onError == "function"){
            onError(error);
        }
    });
}


function initFileSelector(el, afterSelect, accept, isMulti){
    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";
    input.setAttribute("accept", accept);
    input.setAttribute("multiple", isMulti != false);

    input.addEventListener("change", x => {
        var selectedFile = [];

        var files = input.files;
        for (var i = 0; i < files.length; i++) {
            selectedFile.push(files[i]);
        }
        if (typeof  afterSelect == 'function') {
            afterSelect(selectedFile);
        }
        input.value = "";
    });

    document.body.append(input);
    el.addEventListener("click", function(e){
        e.stopPropagation();
        e.preventDefault();
        input.click();
    });


}

exports["default"] = uploadFile;
exports["FileSelector"] = initFileSelector;



