
// tool-benefit-predictor.js
// Loaded with defer — DOM is ready and eco-coefficients.js has already executed
// when this script runs, so no DOMContentLoaded wrapper needed.

(function () {
    // Animate year in footer
    var yearElement = document.getElementById('dynamic-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Enforce clean initial UI state on first load and browser back/forward cache restores.
    var resultsPanel = document.getElementById('results-panel');
    var initialState = document.getElementById('initial-state');
    if (resultsPanel) resultsPanel.style.display = 'none';
    if (initialState) initialState.style.display = 'block';

    // Bail early if data isn't available (shouldn't happen with defer ordering)
    if (typeof ecoCoefficients === 'undefined') {
        console.warn('eco-coefficients.js not loaded yet.');
        return;
    }

    var calculateBtn = document.getElementById('calculateBtn');

    function runCalculation() {
        // 1. Get Inputs
        var form = document.getElementById('ecoForm');
        var gardenSizeKey = form.querySelector('input[name="gardenSize"]:checked').value;
        var plantTypeKey = document.getElementById('plantType').value;
        var waterSourceKey = form.querySelector('input[name="waterSource"]:checked').value;
        var fertilizerKey = form.querySelector('input[name="fertilizer"]:checked').value;

        // 2. Lookup Coefficients
        var sizeData = ecoCoefficients.gardenSize[gardenSizeKey];
        var plantData = ecoCoefficients.plantType[plantTypeKey] || ecoCoefficients.plantType.mixed;
        var waterData = ecoCoefficients.waterSource[waterSourceKey];
        var fertilizerData = ecoCoefficients.fertilizerType[fertilizerKey];

        // 3. Perform Calculations

        // --- Carbon Sequestration ---
        var carbonSeq = sizeData.areaSqm * plantData.carbonKgPerSqm;
        carbonSeq = carbonSeq * waterData.carbonMultiplier * fertilizerData.carbonMultiplier;
        carbonSeq = Math.round(carbonSeq);

        // --- Biodiversity Index ---
        var bioIndex = plantData.biodiversityScore * fertilizerData.biodiversityMultiplier;

        var bioText = 'Moderate';
        if (bioIndex < 2.5) bioText = 'Low';
        if (bioIndex > 4.0) bioText = 'High';

        // --- Eco Impact Score (0-100) ---
        var carbonScore = (plantData.carbonKgPerSqm / 1.5) * 40;
        var bioScore = (bioIndex / 6) * 40;
        var practiceScore = 10;
        if (waterSourceKey === 'rain') practiceScore += 5;
        if (fertilizerKey === 'organic') practiceScore += 5;

        var finalScore = Math.round(carbonScore + bioScore + practiceScore);
        finalScore = Math.min(100, Math.max(1, finalScore));

        // --- Comparisons ---
        var carKm = Math.round(carbonSeq / ecoCoefficients.comparisons.carbon.carKmEquivalentKg);
        var treeEq = (carbonSeq / ecoCoefficients.comparisons.carbon.treeEquivalentKg).toFixed(1);

        // 4. Update UI
        document.getElementById('initial-state').style.display = 'none';
        resultsPanel.style.display = 'block';
        resultsPanel.classList.add('fade-in');

        animateValue('eco-score-val', 0, finalScore, 1000);
        animateValue('carbon-val', 0, carbonSeq, 1000);
        document.getElementById('bio-val').textContent = bioText;

        var circle = document.getElementById('score-circle');
        if (finalScore < 40) circle.style.borderColor = '#f44336';
        else if (finalScore < 70) circle.style.borderColor = '#ff9800';
        else circle.style.borderColor = '#749c30';

        var airQuality = plantData.airQuality;
        var airDesc = 'Your garden provides <strong>' + airQuality.dustCapture + '</strong> dust capture and has a <strong>' + airQuality.coolingEffect + '</strong> cooling effect on the local microclimate.';
        document.getElementById('air-quality-desc').innerHTML = airDesc;

        var waterHtml = 'Equivalent to <strong>' + carKm + ' km</strong> driven in a car or planting <strong>' + treeEq + '</strong> mature trees.<br><small style="color:#777; margin-top:5px; display:block;">Water Conservation: ' + waterData.label + ' used.</small>';
        document.getElementById('water-desc').innerHTML = waterHtml;

        var recommendation = '';
        if (fertilizerKey === 'chemical') {
            recommendation = 'Switching to organic fertilizers can increase your soil health bonus by ' +
                Math.round((ecoCoefficients.fertilizerType.organic.soilHealthBonus - 1) * 100) + '%.';
        } else if (waterSourceKey === 'tap') {
            recommendation = 'Rainwater harvesting could increase your overall water efficiency multiplier to ' +
                ecoCoefficients.waterSource.rain.waterMultiplier + 'x.';
        } else if (plantTypeKey === 'lawn') {
            recommendation = 'Replace lawn areas with trees or vegetables to boost carbon sequestration from ' +
                plantData.carbonKgPerSqm + 'kg to ' + ecoCoefficients.plantType.trees.carbonKgPerSqm + 'kg per m².';
        } else {
            recommendation = 'Excellent setup! Your garden is operating at high environmental efficiency.';
        }
        document.getElementById('recommendation-text').textContent = recommendation;
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', runCalculation);
        // Run immediately on load with default values
        runCalculation();
    }

    function animateValue(id, start, end, duration) {
        var obj = document.getElementById(id);
        var startTimestamp = null;
        var step = function (timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            var progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

}());
