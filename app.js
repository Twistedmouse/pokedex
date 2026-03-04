const searchForm = document.querySelector('form');
//finds form in html and assigns it to searchForm variable
const searchInput = document.querySelector('input[type="text"]');
//finds text input in html and assigns it to searchInput variable
const pokemonContainer = document.getElementById('pokemon-list');

console.log('HTML elements grabbed:', searchForm, searchInput, pokemonContainer);

// base URL for the PokeAPI
const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';


// FETCH POKEMON DETAILS FROM THE API
// ====================================
// lasts returns the JSON object for a single pokemon by name or id

async function fetchPokemon(pokemonName) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  console.log('Fetching Pokemon:', pokemonName);
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      // non-2xx status, treat as not found
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching Pokemon:', error);
    return null;
  }
}

// STEP 3: SHOW POKEMON ON THE PAGE
// ==================================
// We'll take the data object from the API and build some HTML

function singleCardHtml(pokemon) {
  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const id = pokemon.id;
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;
  const types = pokemon.types.map(t => t.type.name).join(', ');
  const height = (pokemon.height / 10).toFixed(1); // dm to meters
  const weight = (pokemon.weight / 10).toFixed(1); // hectograms to kg

  return `
    <div class="pokemon-card">
      <h2>${name} (#${id})</h2>
      <img src="${imageUrl}" alt="${name}">
      <p><strong>Type:</strong> ${types}</p>
      <p><strong>Height:</strong> ${height} m</p>
      <p><strong>Weight:</strong> ${weight} kg</p>
    </div>
  `;
}

function displayPokemonList(pokemons) {
  if (!pokemons || pokemons.length === 0) {
    pokemonContainer.innerHTML = '<p>No Pokémon to show.</p>';
    return;
  }

  pokemonContainer.innerHTML = pokemons.map(singleCardHtml).join('');
}

// pagination helpers
const PAGE_SIZE = 10;
let currentOffset = 0;
let totalCount = 0;
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');
const paginationDiv = document.getElementById('pagination');

function updatePagination() {
  prevBtn.disabled = currentOffset === 0;
  nextBtn.disabled = currentOffset + PAGE_SIZE >= totalCount;
  const currentPage = Math.floor(currentOffset / PAGE_SIZE) + 1;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  paginationDiv.style.display = 'flex';
}

async function loadPage(offset) {
  // request list endpoint
  const url = `${POKEAPI_URL}?limit=${PAGE_SIZE}&offset=${offset}`;
  pokemonContainer.innerHTML = '<p>Loading...</p>';
  try {
    const resp = await fetch(url);
    const data = await resp.json();
    totalCount = data.count;
    const details = await Promise.all(data.results.map(r => fetchPokemon(r.name)));
    displayPokemonList(details.filter(d => d));
    currentOffset = offset;
    updatePagination();
  } catch (err) {
    pokemonContainer.innerHTML = '<p>Error loading page.</p>';
    console.log('Page load error', err);
  }
}

// hook pagination buttons
prevBtn.addEventListener('click', () => {
  if (currentOffset >= PAGE_SIZE) {
    loadPage(currentOffset - PAGE_SIZE);
  }
});
nextBtn.addEventListener('click', () => {
  if (currentOffset + PAGE_SIZE < totalCount) {
    loadPage(currentOffset + PAGE_SIZE);
  }
});

// SEARCH HANDLER
searchForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const query = searchInput.value.trim().toLowerCase();
  if (query === '') {
    // go back to first page if input cleared
    loadPage(0);
    return;
  }
  paginationDiv.style.display = 'none';
  pokemonContainer.innerHTML = '<p>Searching...</p>';
  const result = await fetchPokemon(query);
  if (result) {
    displayPokemonList([result]);
  } else {
    pokemonContainer.innerHTML = '<p>Pokemon not found. Try again!</p>';
  }
});

// INITIAL LOAD
loadPage(0);

// END of file
