"use strict";
const username = document.querySelector("#username");
const saveScoreBtn = document.querySelector("#saveScoreBtn");
const recentScore = localStorage.getItem("recentScore");
const finalScore = document.querySelector("#finalScore");
//we get key value pairs from storage so json parse is transforming it. left side of || returns null.
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

//update UI
finalScore.innerText = recentScore;

//if something is in input we disable button(default), but if there is something in input we enable this button
username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
  saveScoreBtn.style.cursor = "pointer";
});

const saveHighScore = (e) => {
  e.preventDefault();
  //saving username with his/her score in object
  const score = {
    score: recentScore,
    name: username.value,
  };

  //add this object to array
  highScores.push(score);
  //sort from high to low
  highScores.sort((a, b) => b.score - a.score);
  //get only 5 high score
  highScores.splice(MAX_HIGH_SCORES);

  //update local storage
  //I use stringify , because i save as a string high scores
  localStorage.setItem("highScores", JSON.stringify(highScores));
  //when user click save button score is saved and automatically directed to homepage
  window.location.assign("index.html");
};
