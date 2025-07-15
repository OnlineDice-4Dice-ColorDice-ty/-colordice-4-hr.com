  const diceElements = document.querySelectorAll('.dice');
  const colorButtons = document.querySelectorAll('.color-button');
  const rollAgainImg = document.querySelector('.roll-button-img');
  const diceContainer = document.querySelector('.dice-container');
  const topImage = document.querySelector('.top-image');
  const videoWrapper = document.getElementById('video-wrapper');
  const video = document.getElementById('roll-video');
  const rollSound = document.getElementById('roll-sound');

  const allColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  function rollDiceExclude(excludeColor = null) {
    const availableColors = allColors.filter(color => color !== excludeColor);
    let selectedColors = [];

    const chance = Math.random();

    if (chance <= 0.45) {
      const duplicateColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      selectedColors.push(duplicateColor, duplicateColor);
      const restColors = shuffle(availableColors.filter(c => c !== duplicateColor)).slice(0, 2);
      selectedColors = selectedColors.concat(restColors);
    } else if (chance <= 0.65) {
      const duplicateColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      const sameCount = Math.random() < 0.5 ? 3 : 4;
      for (let i = 0; i < sameCount; i++) {
        selectedColors.push(duplicateColor);
      }
      const restColors = shuffle(availableColors.filter(c => c !== duplicateColor)).slice(0, 4 - sameCount);
      selectedColors = selectedColors.concat(restColors);
    } else {
      selectedColors = shuffle(availableColors).slice(0, 4);
    }

    selectedColors = shuffle(selectedColors);

    diceElements.forEach((dice, index) => {
      dice.className = 'dice ' + selectedColors[index];
    });
  }

  function rollDiceAllUnique() {
    const shuffled = shuffle([...allColors]).slice(0, 4);
    diceElements.forEach((dice, index) => {
      dice.className = 'dice ' + shuffled[index];
    });
  }

  function rollDiceWithProbabilities() {
    const availableColors = [...allColors];
    let selectedColors = [];
    const chance = Math.random();

    if (chance <= 0.5) {
      // 50% chance: 2 same colors
      const duplicateColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      selectedColors.push(duplicateColor, duplicateColor);
      const restColors = shuffle(availableColors.filter(c => c !== duplicateColor)).slice(0, 2);
      selectedColors = selectedColors.concat(restColors);

    } else if (chance <= 0.6) {
      // 10% chance: 3 same colors
      const duplicateColor = availableColors[Math.floor(Math.random() * availableColors.length)];
      selectedColors.push(duplicateColor, duplicateColor, duplicateColor);
      const restColors = shuffle(availableColors.filter(c => c !== duplicateColor)).slice(0, 1);
      selectedColors = selectedColors.concat(restColors);

    } else {
      // 40% chance: all different
      selectedColors = shuffle(availableColors).slice(0, 4);
    }

    selectedColors = shuffle(selectedColors);

    diceElements.forEach((dice, index) => {
      dice.className = 'dice ' + selectedColors[index];
    });
  }

  function playVideoThenRoll(excludeColor = null, forceUnique = false, showAfter = true, useProbabilities = false) {
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
      if (showAfter) {
        diceContainer.style.display = 'block';
        topImage.style.display = 'block';
      }

      if (useProbabilities) {
        rollDiceWithProbabilities();
      } else if (forceUnique) {
        rollDiceAllUnique();
      } else {
        rollDiceExclude(excludeColor);
      }
    };
  }

  // Possible color buttons - NO CHANGES
  colorButtons.forEach(button => {
    button.addEventListener('click', () => {
      const excludedColor = button.getAttribute('data-color');
      playVideoThenRoll(excludedColor, false);
    });
  });

  // Roll again - CHANGED: now uses new probabilities
  rollAgainImg.addEventListener('click', () => {
    playVideoThenRoll(null, false, true, true);
  });

  // Page lay video and sound like roll again
  window.onload = () => {
    playVideoThenRoll(null, false, true, true);
  };