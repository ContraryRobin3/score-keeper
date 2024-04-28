////////////////////////////////////////////////////////////////
/// Constants
////////////////////////////////////////////////////////////////
/// Team Card Colors
const teamColors = ["#5661D6", "#D65657", "#D7BB57", "#56D679"];

/// SVG Paths for buttons
const subtractSVGPath =
  "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm2.5 7.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1";
const addSVGPath =
  "M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0";
const deleteSVGPath =
  "M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0";

////////////////////////////////////////////////////////////////
/// main
////////////////////////////////////////////////////////////////
if (storageAvailable("localStorage")) {
  if (!localStorage.getItem("teams")) {
    let teams = [];
    saveToStorage("teams", teams);
  }
} else {
  // Too bad, no localStorage for us
  // TODO render a page that states that the browser is not supported
}
refreshTeamCards();
var myChart = createChart();

////////////////////////////////////////////////////////////////
/// Functions
////////////////////////////////////////////////////////////////

/// Tests to ensure that Local Storage is Supported
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

/// TEAM Manipulation Functions
function addTeam(teamName) {
  const currentCount = getTeamCount();
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
  // Confirm that the user wants to delete the team
  if (confirm("Are you sure you want to delete this team?") == true) {
    let currentTeams = getFromStorage("teams");
    currentTeams.splice(index, 1);
    saveToStorage("teams", currentTeams);
    refreshTeamCards();
  }
}

/// Clears out the team-container and regenerates the team cards
function refreshTeamCards() {
  // Clear out container
  const container = document.getElementById("team-container");
  while (container.firstChild) {
    container.removeChild(container.lastChild);
  }

  // Create a team card for each team
  const teams = getFromStorage("teams");
  let index = 0;
  teams.forEach((team) => {
    const teamCard = document.createElement("div");
    teamCard.classList.add("team-card", "card");
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

    const subtractButton = createButton(subtractSVGPath, 50);
    subtractButton.onclick = subtractPoint.bind(subtractButton, index);
    scoreButtons.appendChild(subtractButton);
    const addButton = createButton(addSVGPath, 50);
    addButton.onclick = addPoint.bind(addButton, index);
    scoreButtons.appendChild(addButton);
    teamCard.appendChild(scoreButtons);

    const deleteButton = createButton(deleteSVGPath, 20);
    deleteButton.classList.add("delete-button");
    deleteButton.onclick = deleteTeam.bind(deleteButton, index);
    teamCard.appendChild(deleteButton);

    container.appendChild(teamCard);
    index++;
  });

  // If there is under 4 teams create the add team UI
  if (getTeamCount() < 4) {
    const addCard = document.createElement("div");
    addCard.classList.add("add-card", "card");

    const input = document.createElement("input");
    input.type = "text";
    input.name = "new-team-name";
    input.placeholder = "Enter new team name";
    input.id = "new-team-name-input";
    addCard.appendChild(input);

    const scoreButtons = document.createElement("div");
    scoreButtons.classList.add("score-buttons");

    const addButton = createButton(addSVGPath, 82);
    addButton.onclick = () => {
      const newName = document.querySelector("#new-team-name-input").value;
      addTeam(newName);
      document.querySelector("#new-team-name-input").value = "";
    };
    scoreButtons.appendChild(addButton);
    addCard.appendChild(scoreButtons);

    container.appendChild(addCard);
  }
  if (myChart) {
    myChart.destroy();
  }
  myChart = createChart();
}

/// Creates a new chart based on the teams scores
function createChart() {
  return new Chart("myChart", {
    type: "bar",
    data: {
      labels: getTeamNames(),
      datasets: [
        {
          backgroundColor: teamColors,
          data: getScores(),
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

/// Adds a point to a team based on the team index
function addPoint(index) {
  let teams = getFromStorage("teams");
  teams[index].score++;
  saveToStorage("teams", teams);
  refreshTeamCards();
}

/// Subtracts a point to a team based on the team index
function subtractPoint(index) {
  let teams = getFromStorage("teams");
  teams[index].score--;
  saveToStorage("teams", teams);
  refreshTeamCards();
}

/// Returns an arrary of the teams scores
function getScores() {
  let scores = [];
  const teams = getFromStorage("teams");
  teams.forEach((team) => {
    scores.push(team.score);
  });
  return scores;
}

/// Returns an arrary of the teams names
function getTeamNames() {
  let names = [];
  const teams = getFromStorage("teams");
  teams.forEach((team) => {
    names.push(team.name);
  });
  return names;
}

function getTeamCount() {
  return getFromStorage("teams").length;
}

/// Saves a json object to Local Storage
function saveToStorage(name, jsonObject) {
  localStorage.setItem(name, JSON.stringify(jsonObject));
}

/// Returns a JSON object from Local Storage
function getFromStorage(name) {
  return JSON.parse(localStorage.getItem(name));
}

/// Creates a button from given svgPath at specified size
function createButton(svgPath, size) {
  var xmlns = "http://www.w3.org/2000/svg";
  const button = document.createElementNS(xmlns, "svg");
  button.setAttributeNS(null, "viewBox", "0 0 " + 16 + " " + 16);
  button.setAttributeNS(null, "width", size);
  button.setAttributeNS(null, "height", size);
  button.setAttributeNS(null, "fill", "currentColor");
  button.innerHTML = `<path d='${svgPath}'/>`;
  return button;
}
