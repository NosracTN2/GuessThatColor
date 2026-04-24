// Function to show the home screen
function showHome() {
  document.body.className = 'home';
  document.getElementById('home-view').style.display = 'flex';
  document.getElementById('color-view').style.display = 'none';
  
  // Clear out the color page content when returning home
  document.getElementById('dynamic-content').innerHTML = '';
}

// Function to fetch data and show the specific color screen
async function showColor(colorName) {
  try {
    // 1. Fetch the freshest data from your GitHub/Netlify JSON file
    const response = await fetch('data.json');
    const gameData = await response.json();

    // 2. Change background color via CSS themes instantly
    document.body.className = `color-page theme-${colorName}`;
    
    // 3. Swap the visible screens
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('color-view').style.display = 'block';

    // 4. Get the specific data for the color tapped
    const colorData = gameData.colors[colorName];
    const capitalizedColor = colorName.charAt(0).toUpperCase() + colorName.slice(1);

    // 5. Check the time and prepare the answer/waiting message
    const currentHour = new Date().getHours();
    const isRevealed = currentHour >= gameData.revealHour;
    
    let answerHTML = '';
    if (isRevealed) {
      answerHTML = `<div class="bubble-box answer">Answer: ${colorData.answer}</div>`;
    } else {
      answerHTML = `<div class="waiting">Check back after ${formatHour(gameData.revealHour)} for the answer!</div>`;
    }

    // 6. Build the beautiful bubbles and inject them into the page
    document.getElementById('dynamic-content').innerHTML = `
      <h1 class="logo logo-large">
        <span class="thats">That's</span> <span class="color-name">${capitalizedColor}</span>?
      </h1>
      
      <div class="hint-box bubble-box">
        <strong>Hint:</strong> ${colorData.hint}
      </div>
      
      ${answerHTML}
    `;

  } catch (error) {
    // If the buttons do nothing, this popup will tell you exactly why!
    alert("Oops! The game data couldn't load. Double-check your data.json file on GitHub for any missing commas or typos.");
    console.error("Error details:", error);
  }
}

// Format 24h to 12h time (e.g., 17 -> 5:00 PM)
function formatHour(hour) {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:00 ${ampm}`;
}
