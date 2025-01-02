function searchDestinations(inputValue) {
    fetch('travel_recommendation_api.json')
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const results = [];
            const addedNames = new Set(); // Track names to prevent duplicates
            // check to see if search includes 'temple or temples'
            if((inputValue.toLowerCase() == 'temple') || (inputValue.toLowerCase() ==  'temples') ){
                data.temples.forEach((temple) => {
                    results.push({
                        category: "temple",
                        name: temple.name,
                        image: temple.imageUrl,
                        description: temple.description,
                    })
                    addedNames.add(temple.name); // Mark this temple as added

                })
            }
            // check to seee if search includes 'beach or beaches'
            if(inputValue.toLowerCase() == 'beach' || inputValue.toLowerCase() == 'beaches') {
                data.beaches.forEach((beach) => {
                    results.push({
                        category: "beach",
                        name: beach.name,
                        image: beach.imageUrl,
                        description: beach.description,
                    })
                    addedNames.add(beach.name); // Mark this beach as added

                })
            }
            // Search within countries -> cities
            data.countries.forEach((country) => {
                country.cities.forEach((city) => {
                    if (city.name.toLowerCase().includes(inputValue)) {
                        results.push({
                            category: "City",
                            name: city.name,
                            image: city.imageUrl,
                            description: city.description,
                        });
                        addedNames.add(city.name); // Mark this city as added

                    }
                });
            });

            // Search within temples
            data.temples.forEach((temple) => {
                if (temple.name.toLowerCase().includes(inputValue) && !addedNames.has(temple.name)) {
                    results.push({
                        category: "Temple",
                        name: temple.name,
                        image: temple.imageUrl,
                        description: temple.description,
                    });
                }
            });

            // Search within beaches
            data.beaches.forEach((beach) => {
                // no double-ups
                if (beach.name.toLowerCase().includes(inputValue) && !addedNames.has(beach.name)){
                    results.push({
                        category: "Beach",
                        name: beach.name,
                        image: beach.imageUrl,
                        description: beach.description,
                    });
                }
            });

            // Display the results

            if (results.length > 0) {
                console.log('Search Results:', results);
                displayResults(results);
            } else {
                alert('No matching destinations found.');
            }
        })
        .catch((error) => {
            console.error('Error fetching API:', error);
        });
}

function displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    const overlay = document.getElementById('overlay');
    if (!resultsContainer || !overlay) {
        console.error('Results container or overlay not found!');
        return;
    }

    // Clear previous results
    resultsContainer.innerHTML = '';

    // Show the modal and overlay
    resultsContainer.classList.remove('hidden');
    resultsContainer.classList.add('flex');
    overlay.classList.remove('hidden');

    // Close the modal when clicking outside the results container
    overlay.addEventListener('click', closeModal);

    // Populate results
    results.forEach((result) => {
        const resultCard = `
                <div class=" result-card bg-white w-[600px] h-[450px] rounded-md drop-shadow-2xl">
            <div class="w-full h-[305px]">
                <img src="${result.image}" alt="${result.name}" class="object-cover rounded-t-md w-full h-full" />
            </div>
            <div class="py-3 mx-5">
            <div class="flex justify-between">
            <h6 class="text-blue-950 text-lg font-bold py-3">${result.name}</h6>
             <span class="bg-blue-200/50 h-[26px] py-1 px-3 rounded-lg text-blue-950 font-medium text-sm">${result.category}</span>
            </div>
                
                <p>${result.description}</p>
            </div>

        </div>

        `;
        resultsContainer.insertAdjacentHTML('beforeend', resultCard);
    });
}
function closeModal() {
    const searchItem = document.getElementById('search-navbar');
    searchItem.value =''
    const resultsContainer = document.getElementById('results-container');
    const overlay = document.getElementById('overlay');

    if (!resultsContainer || !overlay) {
        console.error('Results container or overlay not found!');
        return;
    }

    // Hide the modal and overlay
    resultsContainer.classList.remove('flex');
    resultsContainer.classList.add('hidden');
    overlay.classList.add('hidden');

    // Remove the event listener to avoid multiple bindings
    overlay.removeEventListener('click', closeModal);
}

(() => {
    const includes = document.getElementsByTagName('include');
    [].forEach.call(includes, (i) => {
        const filePath = i.getAttribute('src');
        fetch(filePath)
            .then((file) => file.text())
            .then((content) => {
                i.insertAdjacentHTML('afterend', content);
                i.remove();

                // Reattach the event listener after content is loaded
                const searchButton = document.getElementById('search-button');
                if (searchButton) {
                    searchButton.addEventListener('click', () => {
                        // Get the user's input
                        const searchItem = document.getElementById('search-navbar');
                        if (searchItem) {
                            const inputValue = searchItem.value.trim().toLowerCase(); // Get and trim the input value
                            if (inputValue === '') {
                                alert('Please enter a destination to search.');
                                return;
                            }

                            // Fetch the API data and perform the search
                            searchDestinations(inputValue);
                        }
                    });
                }
            });
    });
})();

const contentDiv = document.getElementById("content");
changeContent('home');
function changeContent(link) {

    // Fetch the new content and update the main content area
    fetch(`components/${link}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not OK");
            }
            return response.text();
        })
        .then(html => {
            contentDiv.innerHTML = html; // Replace the content of the div
        })
        .catch(error => {
            console.error("Error loading content:", error);
            contentDiv.innerHTML = "Failed to load content.";
        });
}
function getDestinations() {
    fetch('travel_recommendation_api.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse the JSON data
        })
        .then(data => {
            console.log('GET Request Result:', data); // Log the JSON data
        })
        .catch(error => {
            console.error('Error:', error); // Handle any errors
        });
}

getDestinations();

