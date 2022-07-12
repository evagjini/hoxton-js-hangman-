import './style.css'

type State = {
  word: string
  characters: string[]
  maxMistakes: number
  streak: number
}

const WORDS = [
  'abruptly',
  'absurd',
  'abyss',
  'affix',
  'askew',
  'avenue',
  'awkward',
  'axiom',
  'azure',
  'bagpipes',
  'bandwagon',
  'banjo',
  'bayou',
  'beekeeper',
  'bikini',
  'blitz',
  'blizzard',
  'boggle',
  'bookworm',
  'boxcar',
  'boxful',
  'buckaroo',
  'buffalo',
  'buffoon',
  'buxom',
  'buzzard',
  'buzzing',
  'buzzwords',
  'caliph',
  'cobweb',
  'cockiness',
  'croquet',
  'crypt',
  'curacao',
  'cycle',
]


function getRandomWord () {
  let randomIndex = Math.floor(Math.random() * WORDS.length)
  return WORDS[randomIndex]
}



let state: State = {
  word: getRandomWord(),
  characters: [],
  maxMistakes: 3,
  streak: 0
}

function restartGame () {
  state.word = getRandomWord()
  state.characters = []
  render()
}




function getMistakes () {
  return state.characters.filter(char => !state.word.includes(char))
}

function getMistakeCount () {
  let mistakes = getMistakes()
  return mistakes.length
}


// Q: How many correct guesses has the user made so far?
// Count the letters in state.characters that ARE in state.word
function getCorrectGuesses () {
  return state.characters.filter(char => state.word.includes(char))
}

// Q: Has the user won? ✅
function checkIfUserWon () {
  // are all the letters in the word in the guesses?
  for (let char of state.word) {
    // if a single character is not in the guesses, stop and return false
    if (!state.characters.includes(char)) return false
  }
  // we know that every single word characters is in the guesses
  return true
  // approach 2: using array.every
  // state.word.split('').every(char => state.characters.includes(char))
}

// Q: Has the user lost? ✅
function checkIfUserLost () {
  // is the count of mistakes >= than maxMistakes?
  return getMistakeCount() >= state.maxMistakes
}

function renderWord () {
  let wordEl = document.createElement('div')
  wordEl.className = 'word'

  let correctGuesses = getCorrectGuesses()

  for (let char of state.word) {
    let charEl = document.createElement('span')
    charEl.className = 'char'

    if (correctGuesses.includes(char)) {
      // no need to hide the char, we guessed it!
      charEl.textContent = char
    } else {
      // hide it, show a _ instead
      charEl.textContent = '_'
    }

    wordEl.append(charEl)
  }

  return wordEl
}


function renderMistakes () {
  let mistakesSpan = document.createElement('div')
  mistakesSpan.className = 'mistakes'
  mistakesSpan.textContent = `Mistakes: ${getMistakes()} (${getMistakeCount()})`

  if (getMistakeCount() === state.maxMistakes - 1)
    mistakesSpan.classList.add('almost-lost')

  return mistakesSpan
}

function renderWinningMessage () {
  let winMessageDiv = document.createElement('div')

  let winMessageP = document.createElement('p')
  winMessageP.textContent = 'You win! 🎉'

  let restartButton = document.createElement('button')
  restartButton.textContent = 'RESTART'
  restartButton.className = 'restart-button'
  restartButton.addEventListener('click', function () {
    state.streak++
    restartGame()
  })

  winMessageDiv.append(winMessageP, restartButton)

  return winMessageDiv
}


function renderLosingMessage () {
  let lostMessageDiv = document.createElement('div')

  let lostMessageP = document.createElement('p')
  lostMessageP.textContent = `You lose! 🤕 The word was: ${state.word}`

  let restartButton = document.createElement('button')
  restartButton.textContent = 'RESTART'
  restartButton.className = 'restart-button'
  restartButton.addEventListener('click', function () {
    state.streak = 0
    restartGame()
  })

  lostMessageDiv.append(lostMessageP, restartButton)

  return lostMessageDiv
}
function renderStreak () {
  let streakDiv = document.createElement('div')
  streakDiv.className = 'streak'
  streakDiv.textContent = `Streak: ${state.streak}`
  return streakDiv
}

function render () {
  let appEl = document.querySelector('#app')
  if (appEl === null) return
  appEl.textContent = ''

  let wordEl = renderWord()
  let mistakesSpan = renderMistakes()
  let streakEl = renderStreak()

  appEl.append(wordEl, mistakesSpan, streakEl)

  if (checkIfUserWon()) {
    let winningMessageDiv = renderWinningMessage()
    appEl.append(winningMessageDiv)
  }

  if (checkIfUserLost()) {
    let losingMessageDiv = renderLosingMessage()
    appEl.append(losingMessageDiv)
  }
}

function listenToUserKeypresses () {
  document.addEventListener('keyup', function (event) {
    let guess = event.key.toLowerCase()

    let letters = 'abcdefghijklmnopqrstuvwxyz'

    // GUARD STATEMENTS:

    // Don't allow the user to guess if:

    // 1) They typed a non-letter character
    if (!letters.includes(guess)) return
    // 2) They typed a repeated character
    if (state.characters.includes(guess)) return
    // 3) They lost
    if (checkIfUserLost()) return
    // 4) They won
    if (checkIfUserWon()) return

    // This only happens if all the guard statements are FALSE
    state.characters.push(guess)
    render()
  })
}

listenToUserKeypresses()
render()