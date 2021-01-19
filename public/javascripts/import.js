document.querySelector('#file-input').addEventListener('change', event => {
  console.log("clicked")
  handleBookUpload(event)
})

function displayContents(contents) {
    var element = document.getElementById('file-content');
    element.textContent = contents;
  }

  Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});



    document.querySelector('#authors').addEventListener('input', (e) => {
      try{
        Object.assign(e.target.dataset, document.querySelector('#' + e.target.getAttribute('list') + ' option[value="' + e.target.value + '"]').dataset);
      
      console.log('dataset of input changed: ', e.target.dataset)
      let authorid = e.target.dataset.id
      document.querySelector('#authorId').value = authorid}
      catch(e){
        console.log(e.message)
      }
    });



      //https://flaviocopes.com/how-to-upload-files-fetch/ <- example with file upload
  /*const handleBookUpload = event => {
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
  }*/

function handleBookUpload (event) {
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



