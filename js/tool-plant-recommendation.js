
// tool-plant-recommendation.js
// Loaded with defer — DOM is ready and plants-data.js has already executed
// when this script runs, so no DOMContentLoaded wrapper needed.
// The artificial 1-second setTimeout delay has also been removed.

(function () {
    // Animate year in footer
    var yearElement = document.getElementById('dynamic-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Enforce clean initial UI state for first paint and history restores.
    var introState = document.getElementById('intro-state');
    var loadingState = document.getElementById('loading-state');
    var resultsGrid = document.getElementById('results-grid');
    var noResults = document.getElementById('no-results');
    if (introState) introState.style.display = 'block';
    if (loadingState) loadingState.style.display = 'none';
    if (resultsGrid) resultsGrid.style.display = 'none';
    if (noResults) noResults.style.display = 'none';

    // Bail early if data isn't available (shouldn't happen with defer ordering)
    if (typeof plantsData === 'undefined') {
        console.warn('plants-data.js not loaded yet.');
        return;
    }

    var findPlantsBtn = document.getElementById('findPlantsBtn');

    function runRecommendations(shouldScroll) {
        // 1. Get Inputs
        var climateZone = document.getElementById('climateZone').value;
        var season = document.getElementById('season').value;
        var gardenType = document.querySelector('input[name="gardenType"]:checked').value;
        var sunlight = document.querySelector('input[name="sunlight"]:checked').value;

        // 2. Show Loading State briefly (UI feedback without artificial delay)
        introState.style.display = 'none';
        resultsGrid.style.display = 'none';
        noResults.style.display = 'none';
        loadingState.style.display = 'block';

        // 3. Filter & Score (runs synchronously — no artificial delay)
        var results = plantsData.plants.map(function (plant) {
            var score = 85;

            var zoneMatch = plant.climate_zones.includes(climateZone) || plant.climate_zones.includes('all');

            var seasonMatch = true;
            if (season !== 'all') {
                seasonMatch = plant.seasons.includes(season) || plant.seasons.includes('all');
            }

            var sunMatch = plant.sunlight.includes(sunlight);
            var typeMatch = plant.garden_types.includes(gardenType);

            if (!(zoneMatch && seasonMatch && sunMatch && typeMatch)) return null;

            // Bonus scoring
            if (season !== 'all' && plant.seasons.includes(season)) score += 5;
            if (plant.sunlight[0] === sunlight) score += 5;
            score += Math.floor(Math.random() * 5);
            if (score > 100) score = 100;

            plant.score = score;
            return plant;
        }).filter(function (p) { return p !== null; })
          .sort(function (a, b) { return b.score - a.score; });

        // 4. Render Results
        loadingState.style.display = 'none';

        if (results.length > 0) {
            renderPlants(results);
            resultsGrid.style.display = 'block';
            document.getElementById('match-count').textContent = results.length;

            if (shouldScroll && typeof $ !== 'undefined') {
                $('html, body').animate({
                    scrollTop: $('#results-grid').offset().top - 120
                }, 500);
            }
        } else {
            noResults.style.display = 'block';
        }
    }

    if (findPlantsBtn) {
        findPlantsBtn.addEventListener('click', function () {
            runRecommendations(true);
        });
        // Run immediately on load with default values
        runRecommendations(false);
    }

    function renderPlants(plants) {
        var container = document.getElementById('plants-container');
        container.innerHTML = '';

        plants.forEach(function (plant) {
            var col = document.createElement('div');
            col.className = 'col-xs-12 col-sm-6 col-md-4';

            var badgeColor = '#749c30';
            if (plant.score < 90) badgeColor = '#ff9800';
            if (plant.score < 80) badgeColor = '#f44336';

            col.innerHTML = '<div class="plant-card fade-in">' +
                '<div class="plant-details">' +
                '<span class="match-badge" style="position:static; display:inline-block; margin-bottom:10px; background-color:' + badgeColor + ';">' + plant.score + '% Match</span>' +
                '<div class="plant-category">' + plant.category + '</div>' +
                '<h4 class="plant-name">' + plant.name + '</h4>' +
                '<span class="scientific-name">' + plant.scientific_name + '</span>' +
                '<div class="plant-tags">' +
                '<span class="plant-tag"><i class="fa fa-tint"></i> ' + plant.water_need + ' water</span>' +
                '<span class="plant-tag"><i class="fa fa-wrench"></i> ' + plant.maintenance + ' maint.</span>' +
                '</div>' +
                '<div class="plant-care">' +
                '<div class="care-item"><i class="fa fa-sun-o"></i> ' + plant.care.light + '</div>' +
                '<div class="care-item"><i class="fa fa-tint"></i> ' + plant.care.watering + '</div>' +
                '<div class="care-item" style="font-style:italic; margin-top:5px; color:#777;">"' + plant.care.notes + '"</div>' +
                '</div>' +
                '</div>' +
                '</div>';

            container.appendChild(col);
        });
    }

}());
