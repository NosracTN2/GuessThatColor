function showHome() {
  document.body.className = 'home';
  document.getElementById('home-view').style.display = 'flex';
  document.getElementById('color-view').style.display = 'none';
  document.getElementById('dynamic-content').innerHTML = '';
}

async function showColor(colorName) {
  try {
    const response = await fetch('https://gist.githubusercontent.com/NosracTN2/19ff61b00cb92bfd3ee9d588ffe46fd6/raw/data.json');
    const gameData = await response.json();

    document.body.className = `color-page theme-${colorName}`;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('color-view').style.display = 'block';

    const colorData = gameData.colors[colorName];
    const capitalizedColor = colorName.charAt(0).toUpperCase() + colorName.slice(1);

    const currentHour = new Date().getHours();
    const isRevealed = currentHour >= gameData.revealHour;
    
    // Notice the animation-delay added here so elements pop in one by one!
    let answerHTML = '';
    if (isRevealed) {
      answerHTML = `<div class="bubble-box answer animate-pop" style="animation-delay: 0.2s;">Answer: ${colorData.answer}</div>`;
    } else {
      answerHTML = `<div class="waiting animate-pop" style="animation-delay: 0.2s;">Check back after ${formatHour(gameData.revealHour)} for the answer!</div>`;
    }

    // Build the injected HTML with our new animation classes
    document.getElementById('dynamic-content').innerHTML = `
      <h1 class="logo logo-large">
        <span class="thats">That's</span> <span class="color-name">${capitalizedColor}</span>?
      </h1>
      
      <div class="hint-box bubble-box animate-pop" style="animation-delay: 0.1s;">
        <strong>Hint:</strong> ${colorData.hint}
      </div>
      
      ${answerHTML}
    `;

  } catch (error) {
    alert("Oops! The game data couldn't load. Double-check your data.json file on GitHub.");
    console.error("Error details:", error);
  }
}

function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}
