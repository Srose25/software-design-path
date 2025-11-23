import recipes from './recipes.mjs' //import the recipes.

function rng(max) { //random number generator
    return Math.floor(Math.random() * max);
}

function randomRecipe(list) { //return a random recipe
    return list[rng(list.length)];
}

function writeRecipe(recipe) {
    return `
    <img src="${recipe.image}" alt="${recipe.name}">
    <div class="recipe-text">
        ${writeTags(recipe.tags)}
        
        <h3><a href="${recipe.url}">${recipe.name}</a></h3>

        ${writeRating(recipe.rating)}
        
        <p>${recipe.description}</p>
    </div>
    `;
}


function writeTags(tags) { //Display the tags (tags are a parameter here)
    let html = `<ul class="recipe-text">`;
    tags.forEach(tag => {
        html += `<li>${tag}</li>`;
    });
    html+= `</ul>`
    return html;
}

 //Display the stars
function writeRating(rating) {
    let html = `<span class="rating" role="img" aria-label="Rating: ${rating} out of 5 stars">`;

    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    // full stars
    for (let i = 0; i < fullStars; i++) {
        html += `<span aria-hidden="true" class="icon-star">⭐</span>`;
    }

    // empty stars
    for (let i = 0; i < emptyStars; i++) {
        html += `<span aria-hidden="true" class="icon-star-empty">☆</span>`;
    }

    html += `</span>`;
    return html;
}


function renderRecipe(recipeList) {
    // 1. Get container
    const output = document.querySelector(".recipe-container");

    // 2. Transform each recipe into HTML
    const html = recipeList.map(writeRecipe).join("");

    // 3. Write it to the screen
    output.innerHTML = html;
}


function init() {
    //get a random recipe
    const recipe = randomRecipe(recipes)
    //render the recipe.
    renderRecipe([recipe]);
}

init();