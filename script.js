//Nedokazal jsem prijit na to, abych mel konstantu s polem osob z fetche, aby byla v globalnim scopu, ale nemela u vsech jejich volani await.
//Podobne bych chtel div s id "field" v globalnim scopu, ale neni to 100% (nekdy se nacte stranka pozdeji, nez JS dojde k jaho zapsani do konstanty)
//CSS me moc nebavi, tak jsem pouzil framework

/**
 * Gets persons data from server
 * @returns {Array} If fetch result is ok then peoples otherwise [false, error message].
 */
async function getData() {
  const messageLater = "\nPlease try it later!";
  return await fetch("https://jsonplaceholder.typicode.com/users")
    .then((response) => {
      if (!response.ok) {
        console.log("Response NOk");
        return [false, "Response not Ok." + messageLater];
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
      return [false, error + messageLater];
    });
}

const dataArray = getData();

/**
 * Inserts person info to HTML bussines card
 * @param {object} person persons with details
 * @returns {string} HTML code for page
 */
function getBusinessCardBody(person) {
  return `<div class="card"> 
    <div class="card-image">
    <figure class="image is-4by3">
    <img id="pic${person.id}"src="https://robohash.org/
    ${person.name}.png" alt="Robot Picture"
    onerror="defaultImg(${person.id})">
    </figure>
    </div>
    <div class="card-content">
    <div class="media-content">
    <p class="title is-4 has-text-black">${person.name}</p>
    <p class="subtitle is-6 has-text-black">${person.email}</br>${person.phone}</br>
    <a href="${person.website}">${person.website}</a>
    </p>
    <p class="subtitle is-6 has-text-black">
    ${person.company.bs}</br>
    ${person.company.name}</p>
    </div>
    </div>
    </div>`;
}

/**
 * Changes picture from internet to local if it is not avaiable
 * @param {string} id number as string to get correct element from document
 */
function defaultImg(id) {
  const img = document.getElementById("pic" + id);
  img.src = "default.png";
  img.setAttribute("onerror", null);
}

/**
 * Adds input element with atributes to the page
 */
function addSearchInput() {
  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "input is-primary");
  input.setAttribute("placeholder", "Filter robots");
  input.oninput = function () {
    drawPeople(this.value);
  };
  document.getElementById("search").appendChild(input);
}

/**
 * Remove previous HTML and adds HTML bussines cards with person details to the page according to array.
 * @param {string} filterString Person to be filtered
 */
async function drawPeople(filterString) {
  const layoutField = document.getElementById("field");
  layoutField.innerHTML = "";
  (await filterPeople(filterString)).forEach((person) => {
    layoutField.innerHTML += getBusinessCardBody(person);
  });
}

/**
 * Filtres by name (lover case) array according to the string
 * @param {string} filterString Filtered string
 * @returns {array} With people match the searched string
 */
async function filterPeople(filterString) {
  if (filterString) {
    return (await dataArray).filter((person) =>
      person.name.toLowerCase().includes(filterString)
    );
  }
  return await dataArray;
}

/**
 * Displays error message on page if error occures
 * @param {string} message Error message
 */
function showError(message) {
  const field = document.getElementById("field");
  field.style.display = "block";
  field.innerHTML = getErrorBody(message);
}

/**
 * @param {string} message Error message
 * @returns {string} part of HTML with inserted error message
 */
function getErrorBody(message) {
  return `<div class="column"></div>
<div class="column">
<div class="notification is-danger">${message}</div>
</div>
<div class="column"></div>`;
}

window.onload = async function () {
  const data = await dataArray;
  if (data[0] === false) {
    showError(data[1]);
  } else {
    addSearchInput();
    drawPeople("");
  }
};
