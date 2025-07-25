const diceElements = document.querySelectorAll('.dice');
const colorButtons = document.querySelectorAll('.color-button');
const rollAgainImg = document.querySelector('.roll-button-img');
const diceContainer = document.querySelector('.dice-container');
const topImage = document.querySelector('.top-image');
const videoWrapper = document.getElementById('video-wrapper');
const video = document.getElementById('roll-video');
const rollSound = document.getElementById('roll-sound');
const adImage = document.getElementById('ad-image');
const adBetween = document.getElementById('ad-between');

const allColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
const keyToColor = { r: 'red', o: 'orange', y: 'yellow', g: 'green', b: 'blue', p: 'purple' };

let rollCount = 0;

// ➤ Allow keypress to trigger roll but exclude a specific color
window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const excludedColor = keyToColor[key];
  
  if (excludedColor) {
    playVideoThenRoll(excludedColor);
  }
});

// ➤ Shuffle function
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// ➤ Main rolling logic with probability and color exclusion
function rollDiceWithProbabilities(excludedColor = null) {
  let availableColors = [...allColors];

  // Remove excluded color if provided
  if (excludedColor) {
    availableColors = availableColors.filter(c => c !== excludedColor);
  }

  let selectedColors = [];
  const chance = Math.random();

  if (chance <= 0.5 && availableColors.length >= 3) {
    const duplicateColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    selectedColors.push(duplicateColor, duplicateColor);
    const restColors = shuffle(availableColors.filter(c => c !== duplicateColor)).slice(0, 2);
    selectedColors = selectedColors.concat(restColors);
  } else if (chance <= 0.6 && availableColors.length >= 2) {
    const duplicateColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    selectedColors.push(duplicateColor, duplicateColor, duplicateColor);
    const restColors = shuffle(availableColors.filter(c => c !== duplicateColor)).slice(0, 1);
    selectedColors = selectedColors.concat(restColors);
  } else {
    selectedColors = shuffle(availableColors).slice(0, 4);
  }

  selectedColors = shuffle(selectedColors);
  diceElements.forEach((dice, index) => {
    dice.className = 'dice ' + selectedColors[index];
  });
}

// ➤ Update ads every 2 rolls
function updateAds() {
  const imageIndex = Math.floor(rollCount / 2) % 2;
  adImage.src = imageIndex === 0 ? 'images/ad1.png' : 'images/ad2.png';
  adBetween.style.display = rollCount % 2 === 0 ? 'block' : 'none';
}

// ➤ Play video then roll dice (accepts optional excluded color)
function playVideoThenRoll(excludedColor = null) {
  diceContainer.style.display = 'none';
  topImage.style.display = 'none';
  rollSound.currentTime = 0;
  rollSound.play();

  const videoFiles = ['images/1.mp4', 'images/2.mp4', 'images/3.mp4'];
  const selectedVideo = videoFiles[Math.floor(Math.random() * videoFiles.length)];

  video.innerHTML = `<source src="${selectedVideo}" type="video/mp4">`;
  video.load();
  videoWrapper.style.display = 'flex';
  video.currentTime = 0;
  video.play();

  video.onended = () => {
    videoWrapper.style.display = 'none';
    diceContainer.style.display = 'block';
    topImage.style.display = 'block';
    rollDiceWithProbabilities(excludedColor);

    rollCount++;
    updateAds();
  };
}

// ➤ Events for color buttons
colorButtons.forEach(button => {
  button.addEventListener('click', () => {
    playVideoThenRoll();
  });
});

// ➤ Event for Roll Again image
rollAgainImg.addEventListener('click', () => {
  playVideoThenRoll();
});

// ➤ Initial roll on page load
window.onload = () => {
  playVideoThenRoll();
};
