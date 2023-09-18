// Quiz questions in an array

const quizQuestions = [
  {
    question: 'Inside which HTML element do we put the JavaScript?',
    answers: [
      { text: '<scripting>', correct: false },
      { text: '<script>', correct: true },
      { text: '<js>', correct: false },
      { text: '<javascript>', correct: false },
    ],
    correctAnswer: '<script>'
  },
  {
    question: 'What is used to reuse code?',
    answers: [
      { text: 'Array', correct: false },
      { text: 'Object', correct: false },
      { text: 'Function', correct: true },
      { text: 'HTML', correct: false },
    ],
    correctAnswer: 'Function'
  },
  {
    question: 'What is an if/else statement called?',
    answers: [
      { text: 'Boolean', correct: true },
      { text: 'Function', correct: false },
      { text: 'Array', correct: false },
      { text: 'DOM', correct: false },
    ],
    correctAnswer: 'Boolean'
  },
  {
    question: 'How do you view something in the console?',
    answers: [
      { text: 'function()', correct: false },
      { text: 'var = myVariable', correct: false },
      { text: 'document.QuerySelector', correct: false },
      { text: 'console.log()', correct: true },
    ],
    correctAnswer: 'console.log()'
  },
  {
    question: 'Arrays can be used to store:',
    answers: [
      { text: 'numbers and strings', correct: false },
      { text: 'other arrays', correct: false },
      { text: 'Booleans', correct: false },
      { text: 'All of the above', correct: true },
    ],
    correctAnswer: 'All of the above'
  },
];

// variables selected from HTML
const startButton = document.querySelector('#start-btn')
const questionContainerElement = document.getElementById('question-container');
const answerButtons = document.querySelectorAll('.btn');
const questionElement = document.querySelector('#question');
const timerElement = document.querySelector('.timer');
const highscorePage = document.querySelector('.highscore-page');
const intitalsInput = document.querySelector('#initials');
const submitButton = document.querySelector('#submit');
const buttonsContainer = document.querySelector('#buttons-answer');
const form = document.querySelector('.hide-2');
const resetButton = document.querySelector('.reset-button');
const intro = document.querySelector('.intro');
const playAgain = document.querySelector('.play-again-button');


// variables used in functions
let currentQuestion;
let currentQuestionIndex = 0;
let answer;
let timer;
let timerCount;
let highscore;
let isWin = false;



// event listener to start the game on the button click
startButton.addEventListener('click', startGame);

// function that starts the game when the start button is clicked
function startGame() {
  startTimer();
  startButton.classList.add('hide');
  highscorePage.classList.add('hide');
  questionContainerElement.classList.remove('hide');
  intro.classList.add('hide');
  form.classList.add('hide-2');
  resetButton.classList.add('hide');
  playAgain.classList.add('hide');
  
  isWin = false,
  timerCount = 30;
  currentQuestionIndex = 0;
  setNextQuestion();
  
}



// setting the values from the quizQuestions object into each question
function setNextQuestion() {
  if (currentQuestionIndex < quizQuestions.length) {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;

    // creating new button elements to store the answers
    buttonsContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const button = document.createElement('button');
      button.classList.add('btn');
      const answer = currentQuestion.answers[i];
      button.textContent = answer.text;
      button.value = answer.text;
      button.addEventListener('click', selectAnswer);
      buttonsContainer.append(button);

    }
  } else {
    clearInterval(timer);
    setHighScore();
  }
}
//function that determines whether the answer is correct or incorrect
function selectAnswer(e) {
  const selectedAnswer = e.target.value;
  console.log(selectedAnswer);
  if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
    e.target.classList.add('correct');
  } else { // decreases the time for an incorrect answer
    e.target.classList.add('incorrect');
    timerCount -= 5;
    if (timerCount < 0) {
      timerCount = 0;
    }

  }
  timerElement.textContent = timerCount;
  setTimeout(() => {
  currentQuestionIndex++;
  setNextQuestion();
}, 500);
}


//game timer 
function startTimer() {
  timer = setInterval(function() {
    timerCount--;
    timerElement.textContent = timerCount;
    
    if (timerCount === 0) {
      clearInterval(timer);
      alert('Game Over');
      
    }



  },1000);
}

// retrieving the highscore from the local storage
const highscores = JSON.parse(localStorage.getItem('highscores')) || [];

// function to set the highscore
function setHighScore() {
  questionContainerElement.classList.add('hide');
  startButton.classList.add('hide');
  highscorePage.classList.remove('hide');
  form.classList.remove('hide-2');
  resetButton.classList.remove('hide');
  playAgain.classList.remove('hide');
  intro.classList.add('hide');

  highscorePage.textContent = 'Your final score: ' + timerCount;
  
  // submit button event listener to store the users initials and score
  submitButton.addEventListener('click', function(event){
  event.preventDefault();
  const initials = intitalsInput.value;
  const score = timerCount;
  // setting the score by counting the timer and saving it in local storage
  highscores.push({initials, score})
  localStorage.setItem('highscores', JSON.stringify(highscores));

  intitalsInput.value = '';
  // calls this function to store the highscore on the highscores pages
  renderHighScore();
    
  });
  
  
}
// function that adds the highscore to the page
function renderHighScores() {
  const userScoreList = document.querySelector('#user-score');
  userScoreList.innerHTML = ''; // Clear previous highscore entries

  highscores.forEach(entry => {
    const listItem = document.createElement('li');
    listItem.textContent = `${entry.initials} - ${entry.score}`;
    userScoreList.appendChild(listItem);
  });
}
// click event to select the view highscores page 
document.querySelector('.highscores').addEventListener('click', function() {
  questionContainerElement.classList.add('hide');
  startButton.classList.add('hide');
  highscorePage.classList.remove('hide');
  form.classList.remove('hide-2');
  resetButton.classList.remove('hide');
  playAgain.classList.remove('hide');
  intro.classList.add('hide');

  // Call the function to render high scores when viewing high scores
  renderHighScores();
});

submitButton.addEventListener('click', function(event) {
  event.preventDefault(); // Prevent the form from submitting

  const initials = intitalsInput.value;
  const score = timerCount;

  highscores.push({ initials, score });
  localStorage.setItem('highscores', JSON.stringify(highscores));

  // Clear the input field after submission
  intitalsInput.value = '';

  // Call the function to render high scores when submitting a new high score
  renderHighScores();
});

function resetScore() {
  localStorage.removeItem('highscores'); // Remove highscores from local storage
  document.getElementById('user-score').textContent = ''; // Update the displayed score
 
}








