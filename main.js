const startingMinutes = 20;
let time = startingMinutes * 60;

const countdownEl = document.getElementById('timer_count');

function updateCountdown(){
    const minutes = Math.floor(time / 60);
    let seconds = time % 60;
    
    seconds = seconds < 10 ? '0' + seconds : seconds;
    
    countdownEl.innerHTML = `${minutes}:${seconds}`;
    time--;
    time = time < 0 ? 0 : time;
    if (time == 0) {
        time = startingMinutes * 60; // reset counter
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

window.onload = function() {
    updateCountdown();
  };


  function startColorChangeAnimation() {
    const plantElement = document.querySelector('.plant_wilt .plant');
    plantElement.style.animation = 'none'; // Reset animation
    void plantElement.offsetWidth; // Trigger reflow
    plantElement.style.animation = 'color-change-animation 120s linear forwards'; // Duration: 120s (2 minutes)
  }
  
  // Call the function to start the animation when the page loads
  window.onload = function() {
    startColorChangeAnimation();
  
    // Listen for the animationend event to restart the animation
    const plantElement = document.querySelector('.plant_wilt .plant');
    plantElement.addEventListener('animationend', startColorChangeAnimation);
  
    // Set interval to restart the animation every 2 minutes
    setInterval(startColorChangeAnimation, 120000); // 120000 milliseconds = 2 minutes
  };


// Working on GBIF API functionality 

function fetchSpeciesDetails(speciesKey) {
    fetch('https://api.gbif.org/v1/species/' + speciesKey)
        .then(response => response.json())
        .then(data => {
            const nubKey = data.nubKey; // Extract nubKey from the response
            console.log('NUB Key:', nubKey); // Add console log
            fetchIUCNRedListCategory(nubKey, data); // Fetch IUCN Red List category using NUB key and pass data along
        })
        .catch(error => console.error('Error fetching species details:', error));
}

function fetchIUCNRedListCategory(nubKey, speciesData) {
    fetch(`https://api.gbif.org/v1/species/${nubKey}/iucnRedListCategory`)
        .then(response => response.json())
        .then(data => {
            const iucnRedListCategory = data.category;
            console.log('IUCN Red List category:', iucnRedListCategory); // Log the category
            updateTableWithCategory(speciesData, iucnRedListCategory); // Update table with the fetched category
        })
        .catch(error => console.error('Error fetching IUCN Red List category:', error));
}

function updateTableWithCategory(speciesData, category) {
    const scientificName = speciesData.canonicalName;
    const newRow = '<tr><td>' + scientificName + '</td><td>' + category + '</td></tr>';
    resultTable.querySelector('tbody').innerHTML = newRow;
    resultTable.style.display = 'table'; // Display the table
}

document.addEventListener('DOMContentLoaded', function () {
    const speciesInput = document.getElementById('speciesInput');
    const speciesDropdown = document.getElementById('speciesDropdown');
    const resultTable = document.getElementById('resultTable');

    speciesInput.addEventListener('input', function () {
        const inputText = speciesInput.value;
        console.log('Input text:', inputText); // Add console log
        if (inputText.length >= 3) {
            fetchSpeciesSuggestions(inputText);
        } else {
            // Clear dropdown and hide table if input is less than 3 characters
            speciesDropdown.innerHTML = '';
            resultTable.style.display = 'none';
            console.log('Input length less than 3 characters');
        }
    });

    speciesDropdown.addEventListener('change', function () {
        const speciesKey = speciesDropdown.value;
        console.log('Species dropdown value:', speciesKey); // Add console log
        fetchSpeciesDetails(speciesKey);
    });

    function fetchSpeciesSuggestions(inputText) {
        fetch('https://api.gbif.org/v1/species/suggest?q=' + inputText)
            .then(response => response.json())
            .then(data => {
                speciesDropdown.innerHTML = '';
                data.forEach(species => {
                    const option = document.createElement('option');
                    option.value = species.key;
                    option.textContent = species.canonicalName;
                    speciesDropdown.appendChild(option);
                });
                console.log('Species suggestions fetched:', data); // Add console log
            })
            .catch(error => console.error('Error fetching species suggestions:', error));
    }
});







