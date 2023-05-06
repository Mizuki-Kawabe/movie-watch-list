
  const apiKey = '7d289168'
  let moviesArray = []
  let imdbIDArray = []
  let movieTitle = ""
  const searchBtn = document.getElementById("search-btn")
  const movieTitleInput = document.getElementById("movie-title-input")
  const movieResultSection = document.getElementById("movie-result-section")
  const movieAddedSection = document.getElementById("movie-added-section")
  let AddedMoviesIdArray = []
  let storedAddedMoviesIdArray = []

document.addEventListener("DOMContentLoaded", storeMovies)

 function storeMovies() {
    storedAddedMoviesIdArray = JSON.parse(localStorage.getItem("AddedMoviesIdArray"))
    if (storedAddedMoviesIdArray) {
      AddedMoviesIdArray = storedAddedMoviesIdArray
    }
  }

if(searchBtn){
  searchBtn.addEventListener("click", (event)=>{
    event.preventDefault()
    movieTitle = movieTitleInput.value
    const apiUrl = `https://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}`

    fetch(apiUrl)
      .then(res => res.json())
      .then(data=> {
        moviesArray = data.Search
        render()
      })
  })

}



  function render(){
    movieResultSection.innerHTML =""
    moviesArray.forEach(movie => {

      fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`)
      .then(res => res.json())
      .then(detailedMovie=>{

        if(AddedMoviesIdArray.includes(detailedMovie.imdbID)){
          movieResultSection.innerHTML +=`
          
          <div class="movie-ctn">
            <img id="poster" src=${detailedMovie.Poster}>
            <div id="title-rating-ctn">
              <p id="title">${detailedMovie.Title}</p> <i class="fa-solid fa-star"></i><p id="rating-number">${detailedMovie.imdbRating}</p>
            </div>
            <p id="run-time">${detailedMovie.Runtime} min</p>
            <p id="genre">${detailedMovie.Genre}</p>

  
            <div>Added</div>

            <p id="plot">${detailedMovie.Plot}</p>
          </div>
          
          `
        }else{
          movieResultSection.innerHTML += `
          <div class="movie-ctn">
            <img id="poster" src=${detailedMovie.Poster}>
            <div id="title-rating-ctn">
              <p id="title">${detailedMovie.Title}</p> <i class="fa-solid fa-star"></i><p id="rating-number">${detailedMovie.imdbRating}</p>
            </div>
            <p id="run-time">${detailedMovie.Runtime} min</p>
            <p id="genre">${detailedMovie.Genre}</p>

  
            <button class="watchlist-ctn" id="watchlist-button" data-name=${detailedMovie.imdbID}>
               <i class="fa-regular fa-square-plus""></i>
               <p class="watchlist">Watchlist</p>
            </button>

            <p id="plot">${detailedMovie.Plot}</p>
          </div>
          `
          handleAddMovie()
        }
        
      })
    })
  }

  function handleAddMovie(){
   
      const addBtns = document.querySelectorAll('#watchlist-button')
    

    addBtns.forEach((addbtn)=>{
      addbtn.addEventListener('click', function(){
        addbtn.innerHTML = `
        <div>Added</div>
        `
        AddedMoviesIdArray.push(addbtn.dataset.name)

        console.log(AddedMoviesIdArray)

      localStorage.setItem("AddedMoviesIdArray", JSON.stringify(AddedMoviesIdArray))
    })
    })
    }
    

  async function renderAddedmovies(){
    movieAddedSection.innerHTML =""
   
    storedAddedMoviesIdArray = localStorage.getItem("AddedMoviesIdArray")
    if (storedAddedMoviesIdArray !== null) {
      AddedMoviesIdArray = JSON.parse(storedAddedMoviesIdArray)
    }
    
    const moviePromises = AddedMoviesIdArray.map((movie) =>
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie}`)
    .then((res) =>res.json())
  )

  const movies = await Promise.all(moviePromises)
  movies.forEach((movie) => {
    movieAddedSection.innerHTML += `
      <div class="movie-ctn">
        <img id="poster" src=${movie.Poster}>
        <div id="title-rating-ctn">
          <p id="title">${movie.Title}</p> <i class="fa-solid fa-star"></i><p id="rating-number">${movie.imdbRating}</p>
        </div>
        <p id="run-time">${movie.Runtime} min</p>
        <p id="genre">${movie.Genre}</p>

        <button class="watchlist-ctn" id="remove-button" data-name=${movie.imdbID}>
          <i class="fa-regular fa-square-minus"></i>
          <p class="watchlist">Remove</p>
        </button>

        <p id="plot">${movie.Plot}</p>
      </div>
    `
    handleRemoveMovie()
  })
  
  }
  

  function handleRemoveMovie(){
    const removeBtns = document.querySelectorAll('#remove-button')

    removeBtns.forEach((removeBtn)=>{
      removeBtn.addEventListener('click', function(){
        removeBtn.innerHTML = `
        <div>Removed</div>
        `
        const imdbID = removeBtn.dataset.name
        AddedMoviesIdArray = AddedMoviesIdArray.filter(id => id !== imdbID)

        localStorage.setItem("AddedMoviesIdArray", JSON.stringify(AddedMoviesIdArray))

        removeBtn.closest('.movie-ctn').remove()

       })
    })
  }
  
      
   