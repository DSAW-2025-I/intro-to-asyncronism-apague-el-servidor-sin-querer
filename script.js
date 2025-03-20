const pokemonList = document.querySelector("#pokemon-list");
const pokemonDetail = document.querySelector("#pokemon-detail");
const closeDetail = document.querySelector("#close-detail");
const pokemonInfo = document.querySelector("#pokemon-info");
const headerButtons = document.querySelectorAll(".nav button");
const searchBar = document.querySelector("#search-bar");

const pokemonURL = "https://pokeapi.co/api/v2/pokemon/";
const abilityURL = "https://pokeapi.co/api/v2/ability/";
const typeURL = "https://pokeapi.co/api/v2/type/";

let allPokemon = [];

async function loadPokemon() {
    for (let i = 1; i <= 1025; i++) {
        try {
            const response = await fetch(pokemonURL + i);
            const data = await response.json();
            allPokemon.push(data);
            displayPokemon(data);
        } catch (error) {
            console.error(`Error cargando Pokémon #${i}:`, error);
        }
    }
}

function displayPokemon(poke) {
    let types = poke.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join('');
    let pokeId = poke.id.toString().padStart(3, '0');

    const div = document.createElement("div");
    div.classList.add("pokemon-card", poke.types[0].type.name);
    div.innerHTML = `
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        <p class="pokemon-id">#${pokeId}</p>
        <p class="pokemon-name">${poke.name}</p>
        <div class="types">${types}</div>
    `;
    div.addEventListener("click", () => showPokemonDetail(poke));
    pokemonList.append(div);
}

function showPokemonDetail(poke) {
    pokemonInfo.innerHTML = `
        <h2>${poke.name}</h2>
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        <p><strong>ID:</strong> #${poke.id}</p>
        <p><strong>Peso:</strong> ${poke.weight / 10} kg</p>
        <p><strong>Altura:</strong> ${poke.height / 10} m</p>
        <p><strong>Tipos:</strong> ${poke.types.map(type => type.type.name).join(', ')}</p>
        <h3>Habilidades:</h3>
        <ul>
            ${poke.abilities.map(ability => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
    `;
    pokemonDetail.classList.add("active");
}

closeDetail.addEventListener("click", () => {
    pokemonDetail.classList.remove("active");
});

headerButtons.forEach(button => button.addEventListener("click", (event) => {
    const buttonId = event.currentTarget.id;

    if (buttonId === "quitar-filtro" || buttonId === "ver-todos") {
        pokemonList.innerHTML = "";
        allPokemon.forEach(poke => displayPokemon(poke));
    } else {
        pokemonList.innerHTML = "";
        allPokemon.forEach(poke => {
            const types = poke.types.map(type => type.type.name);
            if (types.includes(buttonId)) {
                displayPokemon(poke);
            }
        });
    }
}));

searchBar.addEventListener("input", (e) => {
    const filter = e.target.value.toLowerCase().trim(); 
    pokemonList.innerHTML = ""; // Limpiar la lista

    const filteredPokemon = allPokemon.filter(poke => 
        poke.name.toLowerCase().includes(filter) || poke.id.toString().includes(filter)
    );

    filteredPokemon.forEach(poke => displayPokemon(poke));
});

document.addEventListener("DOMContentLoaded", loadPokemon);



