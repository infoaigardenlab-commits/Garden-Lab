
document.addEventListener('DOMContentLoaded', function () {

    // Animate year
    const yearElement = document.getElementById('dynamic-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Enforce clean initial UI state for first paint and history restores.
    const introState = document.getElementById('intro-state');
    const loadingState = document.getElementById('loading-state');
    const resultsGrid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');
    if (introState) introState.style.display = 'block';
    if (loadingState) loadingState.style.display = 'none';
    if (resultsGrid) resultsGrid.style.display = 'none';
    if (noResults) noResults.style.display = 'none';

    const findPlantsBtn = document.getElementById('findPlantsBtn');

    function runRecommendations(shouldScroll) {

        // 1. Get Inputs
        const climateZone = document.getElementById('climateZone').value;
        const season = document.getElementById('season').value;
        const gardenType = document.querySelector('input[name="gardenType"]:checked').value;
        const sunlight = document.querySelector('input[name="sunlight"]:checked').value;

        // 2. Show Loading State
        introState.style.display = 'none';
        resultsGrid.style.display = 'none';
        noResults.style.display = 'none';
        loadingState.style.display = 'block';

        // 3. Process (Simulate AI delay)
        setTimeout(() => {
            loadingState.style.display = 'none';

            // Filter & Score Logic
            const results = plantsData.plants.map(plant => {
                let score = 85; // Base score for meeting strict criteria

                // 1. Strict Filters (Must match to be included)
                const zoneMatch = plant.climate_zones.includes(climateZone) || plant.climate_zones.includes('all');

                let seasonMatch = true;
                if (season !== 'all') {
                    seasonMatch = plant.seasons.includes(season) || plant.seasons.includes('all');
                }

                const sunMatch = plant.sunlight.includes(sunlight);
                const typeMatch = plant.garden_types.includes(gardenType);

                const isMatch = zoneMatch && seasonMatch && sunMatch && typeMatch;

                if (!isMatch) return null;

                // 2. Bonus Scoring (for ranking)

                // Season Bonus: Exact season match gets more points than broad 'all' support
                if (season !== 'all' && plant.seasons.includes(season)) {
                    score += 5;
                }

                // Sunlight Preference: If it's their #1 favorite light condition
                if (plant.sunlight[0] === sunlight) {
                    score += 5;
                }

                // Random organic variance (0-4%)
                score += Math.floor(Math.random() * 5);

                // Cap at 100
                if (score > 100) score = 100;

                plant.score = score;
                return plant;
            }).filter(p => p !== null)
                .sort((a, b) => b.score - a.score); // Sort highest score first

            // Render Results
            if (results.length > 0) {
                renderPlants(results);
                resultsGrid.style.display = 'block';
                document.getElementById('match-count').textContent = results.length;

                // Scroll to results only for manual click.
                if (shouldScroll) {
                    $('html, body').animate({
                        scrollTop: $("#results-grid").offset().top - 120
                    }, 500);
                }

            } else {
                noResults.style.display = 'block';
            }

        }, 1000); // 1s delay
    }

    if (findPlantsBtn) {
        findPlantsBtn.addEventListener('click', function () {
            runRecommendations(true);
        });
        // Show initial recommendations using default-selected parameters.
        runRecommendations(false);
    }

    function renderPlants(plants) {
        const container = document.getElementById('plants-container');
        container.innerHTML = '';

        plants.forEach(plant => {
            // Create Card HTML
            const col = document.createElement('div');
            col.className = 'col-xs-12 col-sm-6 col-md-4';

            // Dynamic color for score
            let badgeColor = "#749c30"; // Green
            if (plant.score < 90) badgeColor = "#ff9800"; // Orange
            if (plant.score < 80) badgeColor = "#f44336"; // Red (unlikely given base)

            const cardHtml = `
          <div class="plant-card fade-in">
             <div class="plant-details">
                <span class="match-badge" style="position:static; display:inline-block; margin-bottom:10px; background-color: ${badgeColor};">${plant.score}% Match</span>
                <div class="plant-category">${plant.category}</div>
                <h4 class="plant-name">${plant.name}</h4>
                <span class="scientific-name">${plant.scientific_name}</span>
                
                <div class="plant-tags">
                  <span class="plant-tag"><i class="fa fa-tint"></i> ${plant.water_need} water</span>
                  <span class="plant-tag"><i class="fa fa-wrench"></i> ${plant.maintenance} maint.</span>
                </div>
  
                <div class="plant-care">
                   <div class="care-item">
                     <i class="fa fa-sun-o"></i> ${plant.care.light}
                   </div>
                   <div class="care-item">
                     <i class="fa fa-tint"></i> ${plant.care.watering}
                   </div>
                   <div class="care-item" style="font-style: italic; margin-top: 5px; color: #777;">
                     "${plant.care.notes}"
                   </div>
                </div>
             </div>
          </div>
        `;

            col.innerHTML = cardHtml;
            container.appendChild(col);
        });
    }
});
