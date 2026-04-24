// 1. Handle the browser "Back" button
window.onpopstate = function(event) {
  const params = new URLSearchParams(window.location.search);
  const color = params.get('color');
  if (color) {
    showColor(color, false); // false means "don't add to history again"
  } else {
    showHome(false);
  }
};

// 2. Function to show the home screen
function showHome(updateHistory = true) {
  if (updateHistory) {
    window.history.pushState({}, '', window.location.pathname);
  }
  document.body.className = 'home';
  document.getElementById('home-view').style.display = 'flex';
  document.getElementById('color-view').style.display = 'none';
  document.getElementById('dynamic-content').innerHTML = '';
}

// 3. Main function to show the color puzzle
async function showColor(colorName, updateHistory = true) {
  try {
    // Update the URL so it's linkable
    if (updateHistory) {
      window.history.pushState({color: colorName}, '', `?color=${colorName}`);
    }

    const cacheBuster = new Date().getTime();
    const gistUrl = `https://gist.githubusercontent.com/NosracTN2/19ff61b00cb92bfd3ee9d588ffe46fd6/raw/data.json?t=${cacheBuster}`;
    
    const response = await fetch(gistUrl); 
    const gameData = await response.json();

    const now = new Date();
    const gameDate = new Date(now);

    if (now.getHours() < gameData.newPuzzleHour) {
      gameDate.setDate(gameDate.getDate() - 1);
    }

    const month = String(gameDate.getMonth() + 1).padStart(2, '0');
    const day = String(gameDate.getDate()).padStart(2, '0');
    const todayKey = `${month}-${day}`;

    const todaysPuzzles = gameData.calendar[todayKey];

    document.body.className = `color-page theme-${colorName}`;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('color-view').style.display = 'block';

    const capitalizedColor = colorName.charAt(0).toUpperCase() + colorName.slice(1);

    if (!todaysPuzzles) {
      document.getElementById('dynamic-content').innerHTML = `
        <h1 class="logo logo-large">
          <span class="thats">That's</span> <span class="color-name">${capitalizedColor}</span>?
        </h1>
        <div class="hint-box bubble-box animate-pop">
          <strong>Oops!</strong> The creator is taking a day off. Check back tomorrow!
        </div>
      `;
      return;
    }

    const colorData = todaysPuzzles[colorName];
    const currentHour = now.getHours(); 
    
    let isRevealed = false;
    if (currentHour < gameData.newPuzzleHour) {
      isRevealed = true; 
    } else {
      isRevealed = currentHour >= gameData.revealHour; 
    }
    
    let answerHTML = '';
    if (isRevealed) {
      answerHTML = `<div class="bubble-box answer animate-pop" style="animation-delay: 0.2s;">Answer: ${colorData.answer}</div>`;
    } else {
      answerHTML = `<div class="waiting animate-pop" style="animation-delay: 0.2s;">Check back after ${formatHour(gameData.revealHour)} for the answer!</div>`;
    }

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
    alert("Oops! The game data couldn't load.");
    console.error("Error details:", error);
  }
}

function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}

// 4. ON LOAD: Check if the user arrived via a specific color link
window.onload = function() {
  const params = new URLSearchParams(window.location.search);
  const color = params.get('color');
  if (color && ['red', 'blue', 'yellow', 'green'].includes(color)) {
    showColor(color, false);
  }
};
