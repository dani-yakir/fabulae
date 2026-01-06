const welcomeScreen = document.getElementById('welcome-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const latinWord = document.getElementById('latin-word');
const meaningsList = document.getElementById('meanings-list');

startBtn.addEventListener('click', () => {
    welcomeScreen.classList.remove('active');
    gameScreen.classList.add('active');
    loadNewWord();
});

nextBtn.addEventListener('click', () => {
    loadNewWord();
});

async function loadNewWord() {
    try {
        const response = await fetch('/api/random-word');
        const data = await response.json();
        
        if (data.error) {
            console.error('Error loading word:', data.error);
            return;
        }
        
        latinWord.textContent = data.latin;
        
        meaningsList.innerHTML = '';
        data.meanings.forEach(meaning => {
            const li = document.createElement('li');
            li.textContent = meaning;
            meaningsList.appendChild(li);
        });
        
    } catch (error) {
        console.error('Error fetching word:', error);
    }
}
