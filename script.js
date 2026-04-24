async function loadGame() {
  // Check the URL for a color parameter
  const params = new URLSearchParams(window.location.search);
  const colorName = params.get('color');
  const app = document.getElementById('app');

  // If no color is selected, show a welcome message
  if (!colorName || !['red', 'blue', 'yellow', 'green'].includes(colorName)) {
    app.innerHTML = `
      <div class="container">
        <h2>Welcome to Guess That Color!</h2>
        <p>Pick a color from the top to get your first hint.</p>
      </div>`;
    return;
  }

  try {
    // Fetch the data from your GitHub JSON file
    const response = await fetch('data.json');
    const data = await response.json();
    const colorData = data.colors[colorName];

    // Check the time
    const currentHour = new Date().getHours();
    const isRevealed = currentHour >= data.revealHour;

    // Build the page content
    app.innerHTML = `
      <div class="container">
        <h1>That's ${colorName}?</h1>
        <div class="hint-box">
          <strong>Hint:</strong> ${colorData.hint}
        </div>
        ${isRevealed
          ? `<div class="answer">Answer: ${colorData.answer}</div>`
          : `<div class="waiting">Check back after ${formatHour(data.revealHour)} for the answer!</div>`
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
