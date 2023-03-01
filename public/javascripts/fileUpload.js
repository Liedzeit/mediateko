const rootStyles = window.getComputedStyle(document.documentElement)
if (rootStyles.getPropertyValue('--book-cover-width-large') != null && rootStyles.getPropertyValue('--book-cover-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
  
}


//document.getElementById('getImage').addEventListener('click', fetchImageFromGoogle)

function ready() {
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })
  
  FilePond.parse(document.body)
  console.log(FilePond.Status)



}








function getImage(){
  const isbn = document.getElementById('isbn').value
  const url = `http://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`
  console.log(isbn)
  fetchImage(url);

}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'Get', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors' // no-cors, *cors, same-origin
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

/*function getImage(){
  const isbn = document.getElementById('isbn').value
  console.log(isbn)
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`

postData(url, { answer: 42 })
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
}*/


function logResult(result) {
  console.log("Result: " + result);
}

function logError(error) {
  console.log('Looks like there was a problem: \n', error);
}

function validateResponse(response) {
  console.log(JSON.stringify(response))
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function readResponseAsJSON(response) {
  console.log("readResponseAsJSON")
  return response.json();
}


function fetchJSON(pathToResource) {
  fetch(pathToResource,{mode: 'cors'}) // 1
  .then(validateResponse) // 2
  .then(readResponseAsJSON) // 3
  .then(logResult) // 4
  .catch(logError);
}

function readResponseAsBlob(response) {
  console.log(JSON.stringify(response))
  return response.blob();
}

function showImage(responseAsBlob) {
  // Assuming the DOM has a div with id 'container'
  console.log("show image")
  var container = document.getElementById('myImg');
  var imgElem = document.createElement('img');
  container.appendChild(imgElem);
  var imgUrl = URL.createObjectURL(responseAsBlob);
  imgElem.src = imgUrl;
}

function fetchImage(pathToResource) {
  console.log("fetch image")
  fetch(pathToResource,{mode: 'no-cors'})
  .then(validateResponse)
  .then(readResponseAsBlob)
  .then(showImage)
  .catch(logError);
}

function fetchImageFromGoogle(){
  var headers = new Headers();
  headers.append("Content-Type", "application/json; charset=utf-8");
 console.log("fetching")
  const isbn = document.getElementById('isbn').value
  console.log(isbn)
  const pathToResource = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn
  fetch(pathToResource, {headers:headers, method:"GET"})
  .then(response => response.json())
   .then(json => displayImage(json))
   .catch(err => console.error(err))
}

/*var headers = new Headers();
   headers.append("Content-Type", "application/json; charset=utf-8");
   fetch(config.serviceUrl + "?apiKey=" + key + "&format=json", 
     {headers:headers, method:"GET"}
   ).then(response => response.json())
   .then(json => )
   .catch(err => console.error(err));*/

function displayImage(jsonobj){
  console.log(jsonobj.items[0].volumeInfo.title)
  console.log(jsonobj.items[0].volumeInfo.imageLinks.thumbnail)

  var container = document.getElementById('myImg');
  var imgElem = document.createElement('img');
  container.appendChild(imgElem);
  imgElem.src = jsonobj.items[0].volumeInfo.imageLinks.thumbnail;

}

function getImageFromGoogle(){
 
  const isbn = document.getElementById('isbn').value
  console.log(isbn)
   

  $.ajax({
    dataType: 'json',
    url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn,
    success: handleResponse,
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      console.log("Status: " + textStatus); 
  }  
  });

  function handleResponse( response ) {
    console.log(JSON.stringify(response))
    $.each( response.items, function( i, item ) {
      console.log("response")
      var title    = item.volumeInfo.title,
          author   = item.volumeInfo.authors[0],        
          thumb    = item.volumeInfo.imageLinks.thumbnail;
      console.log(title)
      console.log(thumb)
      $('.thumbnail').attr('src', thumb);
    });
  }
}


