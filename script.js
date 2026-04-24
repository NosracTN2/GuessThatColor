async function showColor(colorName) {
  try {
    // 1. Fetch your data
    const response = await fetch('https://gist.githubusercontent.com/NosracTN2/19ff61b00cb92bfd3ee9d588ffe46fd6/raw/data.json'); 
    const gameData = await response.json();

    // 2. Get today's date, but adjust for the new puzzle hour!
    const now = new Date();
    const gameDate = new Date(now); // Make a copy of the current time

    // If the current hour is BEFORE your new puzzle hour, tell the game it's still yesterday
    if (now.getHours() < gameData.newPuzzleHour) {
      gameDate.setDate(gameDate.getDate() - 1);
    }

    // 3. Format the date (MM-DD) based on our adjusted gameDate
    const month = String(gameDate.getMonth() + 1).padStart(2, '0');
    const day = String(gameDate.getDate()).padStart(2, '0');
    const todayKey = `${month}-${day}`;

    // 4. Find today's data inside the calendar
    const todaysPuzzles = gameData.calendar[todayKey];

    // 4. Change background color
    document.body.className = `color-page theme-${colorName}`;
    document.getElementById('home-view').style.display = 'none';
    document.getElementById('color-view').style.display = 'block';

    const capitalizedColor = colorName.charAt(0).toUpperCase() + colorName.slice(1);

    // 5. Safety Check: Did you forget to write a puzzle for today?
    if (!todaysPuzzles) {
      document.getElementById('dynamic-content').innerHTML = `
        <h1 class="logo logo-large">
          <span class="thats">That's</span> <span class="color-name">${capitalizedColor}</span>?
        </h1>
        <div class="hint-box bubble-box animate-pop">
          <strong>Oops!</strong> The creator is taking a day off. Check back tomorrow!
        </div>
      `;
      return; // Stop the script here so it doesn't crash
    }

    // 6. Proceed normally with today's specific color data
    const colorData = todaysPuzzles[colorName];
    const currentHour = today.getHours();
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
    alert("Oops! The game data couldn't load.");
    console.error("Error details:", error);
  }
}
