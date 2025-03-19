const listaPokemon = document.querySelector("#pokemon-list");
const pokemonDetail = document.querySelector("#pokemon-detail");
const closeDetail = document.querySelector("#close-detail");
const pokemonInfo = document.querySelector("#pokemon-info");
const botonesHeader = document.querySelectorAll(".nav button");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const habilidadURL = "https://pokeapi.co/api/v2/ability/";
const tipoURL = "https://pokeapi.co/api/v2/type/";
let todosPokemones = [];

async function cargarPokemon() {
    for (let i = 1; i <= 1025; i++) {
        try {
            const response = await fetch(URL + i);
            const data = await response.json();
            todosPokemones.push(data);
            mostrarPokemon(data);
        } catch (error) {
            console.error(`Error cargando Pokémon #${i}:`, error);
        }
    }
}

function mostrarPokemon(poke) {
    let tipos = poke.types.map(type => `<span class="type ${type.type.name}">${type.type.name}</span>`).join('');
    let pokeId = poke.id.toString().padStart(3, '0');

    const div = document.createElement("div");
    div.classList.add("pokemon-card", poke.types[0].type.name);
    div.innerHTML = `
        <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        <p class="pokemon-id">#${pokeId}</p>
        <p class="pokemon-name">${poke.name}</p>
        <div class="types">${tipos}</div>
    `;
    div.addEventListener("click", () => mostrarDetalle(poke));
    listaPokemon.append(div);
}

function mostrarDetalle(poke) {
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

botonesHeader.forEach(boton => boton.addEventListener("click", (event) => {
    const botonId = event.currentTarget.id;

    if (botonId === "quitar-filtro" || botonId === "ver-todos") {
        listaPokemon.innerHTML = "";
        todosPokemones.forEach(poke => mostrarPokemon(poke));
    } else {
        listaPokemon.innerHTML = "";
        todosPokemones.forEach(poke => {
            const tipos = poke.types.map(type => type.type.name);
            if (tipos.includes(botonId)) {
                mostrarPokemon(poke);
            }
        });
    }
}));

document.addEventListener("DOMContentLoaded", cargarPokemon);
