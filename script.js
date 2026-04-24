let gameData = null; // This will hold your JSON data

// 1. Fetch the data right when the page loads
async function initGame() {
  try {
    const response = await fetch('data.json');
    gameData = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// 2. Function to show the home screen
function showHome() {
  document.body.className = 'home';
  document.getElementById('home-view').style.display = 'flex';
  document.getElementById('color-view').style.display = 'none';
}

// 3. Function to show a specific color screen
function showColor(colorName) {
  // If data didn't load, stop here
  if (!gameData) return; 

  const colorData = gameData.colors[colorName];
  
  // Change background color via CSS themes
  document.body.className = `color-page theme-${colorName}`;
  
  // Swap the visible screens
  document.getElementById('home-view').style.display = 'none';
  document.getElementById('color-view').style.display = 'block';

  // Capitalize title
  const capitalizedColor = colorName.charAt(0).toUpperCase() + colorName.slice(1);
  document.getElementById('title-color').textContent = capitalizedColor;

  // Set the hint
  document.getElementById('hint-text').textContent = colorData.hint;

  // Check the time and show either the answer or the waiting message
  const currentHour = new Date().getHours();
  const isRevealed = currentHour >= gameData.revealHour;
  const answerBox = document.getElementById('answer-box');

  if (isRevealed) {
    answerBox.innerHTML = `<div class="bubble-box answer">Answer: ${colorData.answer}</div>`;
  } else {
    answerBox.innerHTML = `<div class="waiting">Check back after ${formatHour(gameData.revealHour)} for the answer!</div>`;
  }
}

// Format 24h to 12h time (e.g., 17 -> 5:00 PM)
function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}

// Start the setup when the script loads
initGame();
        }
      </div>
    `;
  } catch (error) {
    app.innerHTML = `<p>Oops! Couldn't load the game data.</p>`;
    console.error("Error fetching data:", error);
  }
}

// Helper function to format 24h time to 12h time (e.g., 17 -> 5:00 PM)
function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}

// Run the script when the page loads
loadGame();
