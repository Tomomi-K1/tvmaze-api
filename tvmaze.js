"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $episodeBtn = $("button.Show-getEpisodes");
const $episodesList = $("#episodes-list")


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  //get response Json data by using axios.get method, including parameter in the url so that we can use users searched word.
  const res = await axios.get(`http://api.tvmaze.com/search/shows?q=${searchTerm}`);
  let resData = res.data;
  console.log(resData);
  //create object by using the returned data by mapping through array.
  try{
  return resData.map((obj) =>{
      return {
        id: obj.show.id,
        name: obj.show.name,
        summary: obj.show.summary,
        image: obj.show.image.medium
      }
  });
      } catch(e){
        return resData.map((obj) =>{
          return {
            id: obj.show.id,
            name: obj.show.name,
            summary: obj.show.summary,
            image: "https://tinyurl.com/tv-missing" 
          }
      });

      }

  }
  

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
  //          normal lives, modestly setting aside the part they played in 
  //          producing crucial intelligence, which helped the Allies to victory 
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She 
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]



/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  //remove already existing display if a user is conducting a search for the second time
  $showsList.empty();
  //using try and catch method to avoid ode breaking when we run into shows that does not have an image.
  // try{
  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  
  // } catch(e){
  //   console.log(e);
  //   for (let show of shows) {
  //     const $show = $(
  //         `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
  //          <div class="media">
  //            <img 
  //               src="https://tinyurl.com/tv-missing" 
  //               alt="image missing" 
  //               class="w-25 mr-3">
  //            <div class="media-body">
  //              <h5 class="text-primary">${show.name}</h5>
  //              <div><small>${show.summary}</small></div>
  //              <button class="btn btn-outline-light btn-sm Show-getEpisodes">
  //                Episodes
  //              </button>
  //            </div>
  //          </div>  
  //        </div>
  //       `);
  
      // $showsList.append($show);  }

  
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});




/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return episodes;

}
/** Write a clear docstring for this function... */

function populateEpisodes(episodes) { 
  $episodesList.empty();
  for (let episode of episodes){
    let $episode =$(
      `<li class ="${show.id}"><bold>${episode.name}</bold> (Season : ${episode.season}, Episode Number: ${episode.number})</li> 
    `);

  $episodesList.append($episode);  }

  $episodesArea.show();
}


$('#shows-list').on("click", ".Show-getEpisodes", async function showEpisodes(e){
  e.preventDefault();
  console.log(e)
  
  let $showId = $(e.target).closest('.Show').data('show-id')
  console.log($showId);
  const episodes = await getEpisodesOfShow($showId);
  populateEpisodes(episodes);

});

// You’ll need to make sure this eventlistener works even though the shows won’t be present in the initial DOM
// You’ll need to get the show ID of the show for the button you clicked. To do this, you can read about getting data attributes with jQuery and also how to use jQuery to find something a few levels up in the DOM
// Then, this should use your getEpisodes and populateEpisodes functions.
// Make sure you put thought into good variable names and code style for these, and write comments!
