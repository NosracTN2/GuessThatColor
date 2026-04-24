// 1. Function to show the home screen
function showHome() {
  document.body.className = 'home';
  document.getElementById('home-view').style.display = 'flex';
  document.getElementById('color-view').style.display = 'none';
  document.getElementById('dynamic-content').innerHTML = '';
}

// 2. Main function to show the color puzzle
async function showColor(colorName) {
  try {
    // THE CACHE BUSTER: This tells GitHub to ignore its memory and give us the freshest data right now!
    const cacheBuster = new Date().getTime();
    const gistUrl = `https://gist.githubusercontent.com/NosracTN2/19ff61b00cb92bfd3ee9d588ffe46fd6/raw/data.json?t=${cacheBuster}`;
    
    // Fetch the data using the fresh URL
    const response = await fetch(gistUrl); 
    const gameData = await response.json();

    // Time Travel Logic for the 8:00 AM reset
    const now = new Date();
    const gameDate = new Date(now);

    if (now.getHours() < gameData.newPuzzleHour) {
      gameDate.setDate(gameDate.getDate() - 1);
    }

    const month = String(gameDate.getMonth() + 1).padStart(2, '0');
    const day = String(gameDate.getDate()).padStart(2, '0');
    const todayKey = `${month}-${day}`;

    // Find today's data inside the calendar
    const todaysPuzzles = gameData.calendar[todayKey];

    // Change background color and swap screens
    document.body.className = `color-page theme-${colorName}`;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('color-view').style.display = 'block';

    const capitalizedColor = colorName.charAt(0).toUpperCase() + colorName.slice(1);

    // Safety Check: If there's no puzzle for today
    if (!todaysPuzzles) {
      document.getElementById('dynamic-content').innerHTML = `
        <h1 class="logo logo-large">
          <span class="thats">That's</span> <span class="color-name">${capitalizedColor}</span>?
        </h1>
        <div class="hint-box bubble-box animate-pop">
          <strong>Oops!</strong> The creator is taking a day off. Check back tomorrow!
        </div>
      `;
      return; // Stop here so it doesn't crash
    }

    // Proceed normally with today's specific color data
    const colorData = todaysPuzzles[colorName];
    const currentHour = now.getHours(); 
    const isRevealed = currentHour >= gameData.revealHour;
    
    let answerHTML = '';
    if (isRevealed) {
      answerHTML = `<div class="bubble-box answer animate-pop" style="animation-delay: 0.2s;">Answer: ${colorData.answer}</div>`;
    } else {
      answerHTML = `<div class="waiting animate-pop" style="animation-delay: 0.2s;">Check back after ${formatHour(gameData.revealHour)} for the answer!</div>`;
    }

    // Build the HTML
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

// 3. Helper function to format the time neatly (This might have gotten deleted earlier!)
function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}
