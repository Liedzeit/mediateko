window.onscroll = function() {myFunction()};

var header = document.getElementById("header");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}


function toggleFilmSearch(){
    var searchdiv = document.getElementById("searchFilms");
    if (searchdiv.classList.contains("hidden")){
    searchdiv.classList.remove("hidden");
    }
    else
    {
        searchdiv.classList.add("hidden");
    }
}

function toggleFilmSort(){
  var searchdiv = document.getElementById("sortFilms");
  if (searchdiv.classList.contains("hidden")){
  searchdiv.classList.remove("hidden");
  }
  else
  {
      searchdiv.classList.add("hidden");
  }
}