// TODO
import FetchWrapper from "./fetch-wrapper.js";
import {capitalize, calculateCalories} from "./helpers.js";
import snackbar from "snackbar";

snackbar.show("Food added successfully.");

const API = new FetchWrapper(
  "https://firestore.googleapis.com/v1/projects/jsdemo-3f387/databases/(default)/documents/RK7"
);

const list = document.querySelector("#food-list");
const form = document.querySelector("#create-form");
const name = document.querySelector("#create-name");
const carbs = document.querySelector("#create-carbs");
const protein = document.querySelector("#create-protein");
const fat = document.querySelector("#create-fat");
const displayEntry = (name, carbs, protein, fat) => {
  list.insertAdjacentHTML(
    "beforeend",
    `<li class="card">
        <div>
          <h3 class="name">${capitalize(name)}</h3>
          <div class="calories">${calculateCalories(
            carbs,
            protein,
            fat
          )} calories</div>
          <ul class="macros">
            <li class="carbs"><div>Carbs</div><div class="value">${carbs}g</div></li>
            <li class="protein"><div>Protein</div><div class="value">${protein}g</div></li>
            <li class="fat"><div>Fat</div><div class="value">${fat}g</div></li>
          </ul>
        </div>
      </li>`
  );
};


form.addEventListener("submit", (event) => {
  event.preventDefault();

  API.post("/", {
    fields: {
      name: { stringValue: name.value },
      carbs: { integerValue: carbs.value },
      protein: { integerValue: protein.value },
      fat: { integerValue: fat.value },
    },
  }).then((data) => {
    console.log(data);
    if (data.error) {
        // there was an error
      snackbar.show("Some data is missing.");
      return;
    }
    snackbar.show("Food added successfully.");
    

    name.value = "";
    carbs.value = "";
    protein.value = "";
    fat.value = "";
  });
});

const init = () => {
  // the ?pageSize=100 is optional
  API.get("/?pageSize=100").then((data) => {
    console.log(data)
    data.documents?.forEach((doc) => {
      const fields = doc.fields;

      displayEntry(
        fields.name.stringValue,
        fields.carbs.integerValue,
        fields.protein.integerValue,
        fields.fat.integerValue
      );
    });
  });
}

init();