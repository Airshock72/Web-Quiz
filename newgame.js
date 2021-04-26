"use strict";
//Constants
const CORRECT_ANSWER_SCORE = 10;
const MAX_QUESTIONS = 10;

//Selectors UI
const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice"));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const fullProgressBar = document.querySelector("#fullProgressBar");
const home = document.querySelector(".home");
const loader = document.querySelector("#loader");

//current question which is displayed
let currentQuestion = {};
let score = 0;
//variable for accepting answers.we create like a second delay before we let them answer again. its false at start because we are not allowing user to start answer question , until question are loaded.
let acceptingAnswers = false;
//what question are you on
let questionCounter = 0;
//this is copy all question set.
let availableQuestion = [];

let questions = [];
//fetch data from json object.fetch returns promise. then I get response and return res.json()then i await our function to start. also i use catch to handle with errors

// ""
fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => res.json())
  .then((loadedQuestions) => {
    console.log(loadedQuestions);
    //every time we map through the original question i format that question into format i need and return that and then i will have array of questions in the right format that i need
    questions = loadedQuestions.results.map((loadedQuestion) => {
      //create formattedquestion. its object with question property
      const formattedQuestion = {
        question: loadedQuestion.question,
      };
      //get answer choices. this is gonna give me an array, which i will copy that array of what the three answer choices which are incorrect ones. i need 4 answer choices and answer in a random position 1,2,3,4
      const answerChoices = [...loadedQuestion.incorrect_answers];
      //get random number between 0-3(1-4). its give random index.
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      //go ahead and decide which choice is my answer and then i am just gonna put that answer into my answer choices array in the right spot. at this point answer choices should have all of 4 answer choices in them with the correct answer in a random position
      answerChoices.splice(
        //out answer choices are not 0 based indexes
        formattedQuestion.answer - 1,
        //i am not going to remove any elements
        0,
        loadedQuestion.correct_answer
      );
      //iterate through answer choices
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => console.error(err));

//start of game function

const startGame = () => {
  //reset question counter and score, because its start of game
  questionCounter = 0;
  score = 0;
  //copy questions from questions array
  availableQuestion = [...questions];
  getNewQuestion();

  //display UI. remove loader and load game
  loader.classList.add("hidden");
  home.classList.remove("hidden");
};
//generate new question function
const getNewQuestion = () => {
  //check if any question is left to answer
  if (availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS) {
    //save score to localstorage
    localStorage.setItem("recentScore", score);
    //go to finish page
    return window.location.assign("finish.html");
  }
  //increment question counter
  questionCounter++;
  //update UI
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  //update progress bar
  fullProgressBar.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
  //generate random question from available question array
  const qIndex = Math.floor(Math.random() * availableQuestion.length);
  //pick random question
  currentQuestion = availableQuestion[qIndex];
  //change display on UI
  //for question
  question.innerText = currentQuestion.question;
  //for choices
  choices.forEach((choice) => {
    //get dataset from html attribute data-choice-*
    const number = choice.dataset["choice"];
    //change UI depend to each dataset in choice
    choice.innerText = currentQuestion["choice" + number];
  });
  //remove answered question from available question array.
  availableQuestion.splice(qIndex, 1);

  //after we load question allow user to answer it
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    //if user is not ready for answer
    if (!acceptingAnswers) return;
    //we want allow user to answer
    acceptingAnswers = false;

    //type of selectedAnswer is string
    const selectedAnswer = e.target.dataset["choice"];

    //if selected answer data number is equal to current question answer number we apply class correct , that means answer is correct , another way we apply class incorrect that means its class is incorrect
    const classToApply =
      Number(selectedAnswer) === currentQuestion.answer
        ? "correct"
        : "incorrect";
    //if answer is correct we add 10 score to our main score
    if (classToApply === "correct") {
      incrementScore(CORRECT_ANSWER_SCORE);
    }
    //display UI class on parent element
    e.target.parentElement.classList.add(classToApply);

    //we set time out function with callback function for 1.5 sec
    setTimeout(() => {
      //after 1.5 sec we are removing class from parent element and getting new question after answering the current one
      e.target.parentElement.classList.remove(classToApply);

      getNewQuestion();
    }, 1500);
  });
});

const incrementScore = (num) => {
  score += num;
  //updateUI
  scoreText.innerText = score;
};
