"use strict";
const HSList = document.querySelector("#HSList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

console.log(highScores);

//I take values from highscore and make map on it so it gives me template string with li-s and after it i join with empty string and return whole html/string
HSList.innerHTML = highScores
  .map((score) => {
    return `<li class="high-score">${score.name} - ${score.score}</li>`;
  })
  .join("");
