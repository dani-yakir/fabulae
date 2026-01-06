const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const latinWord = document.getElementById('latin-word');
const meaningsList = document.getElementById('meanings-list');
const meaningCount = document.getElementById('meaning-count');
const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-guess');
const revealBtn = document.getElementById('reveal-btn');
const messageDiv = document.getElementById('message');

let currentWord = null;
let revealedMeanings = new Set();

startBtn.addEventListener('click', () => {
    welcomeScreen.classList.remove('active');
    gameScreen.classList.add('active');
    loadNewWord();
});

nextBtn.addEventListener('click', () => {
    loadNewWord();
});

submitBtn.addEventListener('click', () => {
    submitGuess();
});

guessInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitGuess();
    }
});

revealBtn.addEventListener('click', () => {
    revealAllMeanings();
});

async function loadNewWord() {
    try {
        const response = await fetch('/api/random-word');
        const data = await response.json();
        
        if (data.error) {
            console.error('Error loading word:', data.error);
            return;
        }
        
        currentWord = data;
        revealedMeanings = new Set();
        
        latinWord.textContent = data.latin;
        meaningCount.textContent = `This card has ${data.meanings.length} meaning${data.meanings.length > 1 ? 's' : ''}`;
        
        meaningsList.innerHTML = '';
        data.meanings.forEach((meaning, index) => {
            const li = document.createElement('li');
            li.textContent = meaning.display;
            li.classList.add('hidden');
            li.dataset.index = index;
            meaningsList.appendChild(li);
        });
        
        guessInput.value = '';
        guessInput.focus();
        messageDiv.textContent = '';
        messageDiv.className = 'message';
        
    } catch (error) {
        console.error('Error fetching word:', error);
    }
}

async function submitGuess() {
    const guess = guessInput.value.trim().replace(/\s+/g, ' ');
    
    if (!guess) {
        return;
    }
    
    if (!currentWord) {
        return;
    }
    
    try {
        const response = await fetch('/api/check-guess', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                guess: guess,
                meanings: currentWord.meanings
            })
        });
        
        const result = await response.json();
        
        if (result.correct) {
            if (revealedMeanings.has(result.meaningIndex)) {
                showMessage('You already guessed this meaning!', 'info');
            } else {
                revealedMeanings.add(result.meaningIndex);
                revealMeaning(result.meaningIndex);
                
                const remaining = currentWord.meanings.length - revealedMeanings.size;
                if (remaining > 0) {
                    showMessage(`Correct! ${remaining} meaning${remaining > 1 ? 's' : ''} remaining.`, 'success');
                } else {
                    showMessage('Perfect! You found all meanings!', 'success');
                }
            }
            guessInput.value = '';
        } else {
            showMessage('Incorrect. Try again!', 'error');
        }
        
        guessInput.focus();
        
    } catch (error) {
        console.error('Error checking guess:', error);
    }
}

function revealMeaning(index) {
    const meaningItem = meaningsList.querySelector(`li[data-index="${index}"]`);
    if (meaningItem) {
        meaningItem.classList.remove('hidden');
        meaningItem.classList.add('revealed');
    }
}

function revealAllMeanings() {
    currentWord.meanings.forEach((meaning, index) => {
        if (!revealedMeanings.has(index)) {
            revealedMeanings.add(index);
            revealMeaning(index);
        }
    });
    showMessage('All meanings revealed!', 'info');
}

function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}
