  function displayContents(contents) {
    var element = document.getElementById('file-content');
    element.textContent = contents;
  }


    document.querySelector('#file-input').addEventListener('change', event => {
        handleImageUpload(event)
      })



      //https://flaviocopes.com/how-to-upload-files-fetch/ <- example with file upload
  const handleImageUpload = event => {
    console.log("uploading...")
    //const formData = new FormData()

    const file = event.target.files[0];
    if (!file) {
        console.log("return")
      return;
    }
    var reader = new FileReader();
    reader.onload = function(event) {
        console.log("loaded")
      var contents = event.target.result;
      var mydata = JSON.parse(contents);
      console.log(mydata)
    


    //const data = [{ name: 'Ferdinand Sauerbruch' },{ name: 'Ludwig Auflauf' }];
    const data = mydata;
    // formData.append('myFile', files[0])
    
    fetch('/books/import/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body:  JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    .catch(error => {
      console.error(error)
    })
    }
    reader.readAsText(file);
  }


const getToken = event => {
  console.log("getting token...")
  fetch('/books/getToken/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    console.error("error: " + error)
  })
 }



