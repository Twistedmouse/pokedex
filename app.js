const searchForm = document.querySelector('form');
//finds form in html and assigns it to searchForm variable
const searchInput = document.querySelector('input[type="text"]');
//finds text input in html and assigns it to searchInput variable
const pokemonContainer = document.getElementById('pokemon-list');

console.log('HTML elements grabbed:', searchForm, searchInput, pokemonContainer);


// STEP 2: CREATE A FUNCTION TO FETCH POKEMON FROM THE API
// ========================================================
// This function will GET data from pokeapi.co

async function searchPokemon(pokemonName) {
  // async = this function might take time (waiting for the internet)
  
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  // URL to the API - notice we're putting pokemonName at the end
  // Example: https://pokeapi.co/api/v2/pokemon/pikachu
  
  console.log('Searching for:', pokemonName);
  
  try {
    // try = "Try to do this code"
    const response = await fetch(apiUrl);
    // fetch() = get data from the internet
    // await = wait for the internet to respond (pause here until data arrives)
    // response = what the API sends back (could be success or error)
    
    console.log('Response from API:', response);
    
    const data = await response.json();
    // response.json() = convert the response into readable data
    // await = wait for the conversion to finish
    // data = now we have the Pokemon info as an object
    
    console.log('Pokemon data:', data);
    return data;
    // return = give this data back to whoever called this function
    
  } catch (error) {
    // catch = "If something went wrong, catch the error"
    console.log('Error fetching Pokemon:', error);
    return null;
    // return null = no Pokemon found
  }
}

// Test it: try searching for a Pokemon
// Uncomment the line below to test
// searchPokemon('pikachu');
