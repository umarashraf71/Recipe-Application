

var myVar;

function myFunction() {
  myVar = setTimeout(showPage, 1000);
  
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

function showPage1() {
    document.getElementById("loader").style.display = "block";
    document.getElementById("myDiv").style.display = "none";
  }


document.getElementById("search-term")
.addEventListener("keyup", function(e) {
if (e.code === 'Enter') {
    document.getElementById("search").click();
}
});


        




//container to show all recipies
const meals = document.getElementById('meals');
//container to show favourite meals
const favContainer = document.getElementById('fav-meals');
//container to show meal info
const mealPopup = document.getElementById('meal-popup');
//nutton to close meal info popup
const popupClosedBtn = document.getElementById('close-popup');
//getting meal info container 
const mealInfoEl = document.getElementById('meal-info');


//getting search input field by id 
const searchTerm = document.getElementById('search-term');
//getting search button
const searchBtn = document.getElementById('search');


//getting the random meal
getRandomMeal();
//getting all the meals marked as favourites
fetchFavMeals();







//fethcing random meal from the api and then adding it local storage
async function getRandomMeal()
{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    
    const responseData = await response.json();

    const randomMeal = responseData.meals[0];
    
    addMeal(randomMeal, true);
}




//fetching meal by id from the api
async function getMealById(id)
{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

    const responseData = await response.json();

    const meal = responseData.meals[0];

    return meal;
}




//fetching meal by search name from the api
async function getMealBySearch(term)
{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const responseData = await response.json();

    const meal = responseData.meals;

    return meal;
}






//adding to html and local-storage and showing random meal with favourite button and its functionality
//adding to html and local-storage showing all the search meals with favourite button and its functionality
function addMeal(mealData, random = false){

    
    // console.log(mealData);

    favContainer.innerHTML = ""

    const meal = document.createElement('div');
    meal.classList.add('meal');

    meal.innerHTML = 
    
    `
        <div class="meal-header" >

        ${random ? `<span class="random">Random Recipe</span>` : ``}

            <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn" ><i class="fas fa-heart"></i></button> 
        </div>

    `;



    //adding event listner to the favourite button
    const btn = meal.querySelector(".meal-body .fav-btn");

    btn.addEventListener('click', (e)=>{

        // showPage1();
        // myFunction();

        //if favourite button is already active and pressed to remove from favourite then we will remove active class and will remove data from local storage
        if(btn.classList.contains("active"))
        {
            removeMealLS(mealData.idMeal);
            btn.classList.remove("active");
        }
        else
        {
            addMealLS(mealData.idMeal);
            btn.classList.add("active");
        }
        
        e.target.classList.toggle("active");


        fetchFavMeals();


    });


     
    meal.addEventListener('click', ()=>{

        showMealInfo(mealData);

    });


    //append the meal data to the meals id in html
    meals.appendChild(meal);

}





//function to add meals to the local storage
function addMealLS(mealId){

    //will get all the meals stored in LS
    const mealIds = getMealLS();

    //adding the meal id to the mealIds array 
    localStorage.setItem( 'mealIds', JSON.stringify([...mealIds,mealId]) )
    
}




//function to remove meals from the local storage
function removeMealLS(mealId){

    //will get all the meals stored in LS
    const mealIds = getMealLS();

    //flitering all the rest of meal ids which are not pressed by remove button
    localStorage.setItem( 'mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)) );
    
}



//function to get stored results array of local storage
function getMealLS(){

    const mealIds = JSON.parse(localStorage.getItem('mealIds'));

    return mealIds === null ? [] : mealIds;
}




//fetch fav meal so that we can show them in fav meals section
async function fetchFavMeals()
{

    //clean the container
    favContainer.innerHTML = "";

    const mealIds = getMealLS();     
    const meals = [];


    //fetching the fav meals from local storage and then getting them fom the api and then storing them in an array through each iteration of loop   
    for(let i = 0; i < mealIds.length; i++)
    {
        //will get meal id from local storage array
        const mealId = mealIds[i]; 

        //will get meal through id from the api
        meal = await getMealById(mealId);

        addMealFav(meal);

    }

}





//add fav meals from the local storage to the html
function addMealFav(mealData){

    // console.log(mealData);

    const favMeal = document.createElement('li');

    //var firstWord = mealData.strMeal.replace(/ .*/,'');

    var firstWord = mealData.strMeal;

    favMeal.innerHTML = 
    
    `
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
        <span>${firstWord}</span>

        <button class="clear"><i class="fas fa-window-close"></i></button>

    ` ;


    //clearing from fav meals
    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', ()=>{
        
        // showPage1();
        // myFunction();

        removeMealLS(mealData.idMeal);

        fetchFavMeals();

    });


    favMeal.addEventListener('click', ()=>{

        showMealInfo(mealData);

    });


    //append the meal data to the meals id in html
    favContainer.appendChild(favMeal);

}





//for searching the recipies by names
searchBtn.addEventListener('click', async()=>{

    showPage1();
    myFunction();

    //clearing the container
    meals.innerHTML = "";

    const search = searchTerm.value;

    const mealsData = await getMealBySearch(search);

    if(mealsData)
    {
                
        mealsData.forEach((meal) => {

            addMeal(meal, false);
        });
    }
    else
    {
        favContainer.innerHTML = "<h2>No Result Found !</h2>";
    
    }

});






function showMealInfo(mealData)
{

    console.log(mealData);

    //Clean Previous Meal
    mealInfoEl.innerHTML = "";


    const ingredients = [];
    //get ingeadients and measures
    for(let i=1; i <= 20; i++)
    {
        //if ingredient exists then push it in array with its measure
        if(mealData['strIngredient'+i])
        {
            ingredients.push(`${mealData['strIngredient'+i]} - ${mealData['strMeasure'+i]}`);
        }
        else
        {
            break;
        }
    }

//    console.log(mealData['strIngredient1']);
    
    // const mealEl = document.createElement('div');

    mealInfoEl.innerHTML = 

    `
    
    <div class="meal-img">
        <h1 style="font-size:37px; color:#e73c7e; text-transform:initial; word-spacing:4px;" >${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">
    </div>


    <div class="meal-description">

    <h2>METHOD</h2>

        <p>
            ${mealData.strInstructions};
        </p>

        <h2>INGREDIENTS</h2>

        <ul>

            ${ingredients
                .map(

                    (ing) => 

                    `<li>${ing}</li>`

                ).join("")
            
            }

        </ul>

    </div>

        
    `;

    // mealInfoEl.appendChild(mealEl);

    //show the popup
    document.getElementById('meal-popup').classList.remove('hidden');
    //hide the rest of searched meals
    document.getElementById("myDiv").style.display = "none";


    popupClosedBtn.addEventListener('click', ()=>{

    //hide the popup
    document.getElementById('meal-popup').classList.add('hidden');
    //hide the rest of searched meals
    document.getElementById("myDiv").style.display = "block";


    });




}




        








