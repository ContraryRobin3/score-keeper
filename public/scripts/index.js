function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}
if (storageAvailable("localStorage")) {
  if (!localStorage.getItem("teams")) {
    let teams = [];
    saveToStorage("teams", teams);
  }
} else {
  // Too bad, no localStorage for us
}
//localStorage.removeItem("teams");

const teamColors = ["#5661D6", "#D65657", "#D7BB57", "#56D679"];

document.querySelector("#add-team-button");
refreshTeamCards();

function addTeam(teamName) {
  const currentCount = getTeamCount();
  console.log("currentCount" + currentCount);
  const newTeam = {
    id: currentCount,
    name: teamName,
    score: 0,
    color: teamColors[currentCount],
  };
  let currentTeams = getFromStorage("teams");
  currentTeams.push(newTeam);
  saveToStorage("teams", currentTeams);
  refreshTeamCards();
}
function deleteTeam(index) {
  if (confirm("Are you sure you want to delete this team?") == true) {
    console.log("deleting");
    console.log(index);
    let currentTeams = getFromStorage("teams");
    currentTeams.splice(index, 1);
    console.log(currentTeams);
    saveToStorage("teams", currentTeams);
    refreshTeamCards();
  }
}

function refreshTeamCards() {
  // Clear out container
  const container = document.getElementById("team-container");
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }
  const teams = getFromStorage("teams");
  console.log(teams);
  let index = 0;
  teams.forEach((team) => {
    const teamCard = document.createElement("div");
    teamCard.classList.add("team-card");
    teamCard.style.backgroundColor = teamColors[index];

    const teamName = document.createElement("h2");
    teamName.classList.add("team-name");
    teamName.innerHTML = team.name;
    teamCard.appendChild(teamName);

    const teamScore = document.createElement("p");
    teamScore.classList.add("team-score");
    teamScore.innerHTML = team.score;
    teamCard.appendChild(teamScore);

    const scoreButtons = document.createElement("div");
    scoreButtons.classList.add("score-buttons");

    const subtractButton = createSubtractButton(50);
    scoreButtons.appendChild(subtractButton);
    const addButton = createAddButton(50);
    scoreButtons.appendChild(addButton);
    teamCard.appendChild(scoreButtons);

    const deleteButton = createDeleteButton(20);
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = (index) => {
      deleteTeam(index);
    };
    teamCard.appendChild(deleteButton);

    container.appendChild(teamCard);
    index++;
  });
  if (getTeamCount() < 4) {
    const addCard = document.createElement("div");
    addCard.classList.add("add-card");

    const input = document.createElement("input");
    input.type = "text";
    input.name = "new-team-name";
    input.placeholder = "Enter new team name";
    input.id = "new-team-name-input";
    addCard.appendChild(input);

    const scoreButtons = document.createElement("div");
    scoreButtons.classList.add("score-buttons");

    const addButton = createAddButton(82);
    addButton.onclick = () => {
      const newName = document.querySelector("#new-team-name-input").value;
      addTeam(newName);
      document.querySelector("#new-team-name-input").value = "";
    };
    scoreButtons.appendChild(addButton);
    addCard.appendChild(scoreButtons);

    container.appendChild(addCard);
  }
}

const xValues = ["Italy", "France", "Spain", "USA", "Argentina"];
const yValues = [55, 49, 44, 24, 15];
const barColors = ["red", "green", "blue", "orange", "brown"];

var myChart = new Chart("myChart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [
      {
        backgroundColor: barColors,
        data: yValues,
      },
    ],
  },
  options: {},
});

function getTeamCount() {
  return getFromStorage("teams").length;
}

function saveToStorage(name, jsonObject) {
  localStorage.setItem(name, JSON.stringify(jsonObject));
}

function getFromStorage(name) {
  return JSON.parse(localStorage.getItem(name));
}

function createSubtractButton(size) {
  var xmlns = "http://www.w3.org/2000/svg";
  const subtractButton = document.createElementNS(xmlns, "svg");
  subtractButton.setAttributeNS(null, "viewBox", "0 0 " + 16 + " " + 16);
  subtractButton.setAttributeNS(null, "width", size);
  subtractButton.setAttributeNS(null, "height", size);
  subtractButton.setAttributeNS(null, "fill", "currentColor");
  subtractButton.innerHTML =
    "<path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1'/>";
  return subtractButton;
}

function createAddButton(size) {
  var xmlns = "http://www.w3.org/2000/svg";
  const addButton = document.createElementNS(xmlns, "svg");
  addButton.setAttributeNS(null, "viewBox", "0 0 " + 16 + " " + 16);
  addButton.setAttributeNS(null, "width", size);
  addButton.setAttributeNS(null, "height", size);
  addButton.setAttributeNS(null, "fill", "currentColor");
  addButton.innerHTML =
    "<path d='M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0'/>";
  return addButton;
}

function createDeleteButton(size) {
  var xmlns = "http://www.w3.org/2000/svg";
  const addButton = document.createElementNS(xmlns, "svg");
  addButton.setAttributeNS(null, "viewBox", "0 0 " + 16 + " " + 16);
  addButton.setAttributeNS(null, "width", size);
  addButton.setAttributeNS(null, "height", size);
  addButton.setAttributeNS(null, "fill", "#CCCCCC");
  addButton.innerHTML =
    "<path d='M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0'/>";
  return addButton;
}
