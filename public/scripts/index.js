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
  console.log(getFromStorage("teams"));
} else {
  // Too bad, no localStorage for us
}

const teamColors = ["#5661D6", "#D65657", "#D7BB57", "#56D679"];

function addTeam(teamName) {
  let newTeam = {
    id: getTeamCount(),
    name: teamName,
    score: 0,
    color: teamColors(getTeamCount()),
  };
  saveToStorage(teams, getFromStorage(teams).push());
  console.log("add team: " + getFromStorage("teams"));
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
  getFromStorage("teams").length;
}

function saveToStorage(name, jsonObject) {
  localStorage.setItem(name, JSON.stringify(jsonObject));
}

function getFromStorage(name) {
  return JSON.parse(localStorage.getItem(name));
}
