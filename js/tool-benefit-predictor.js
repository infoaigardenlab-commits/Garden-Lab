
document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
        const adsScript = document.createElement('script');
        adsScript.async = true;
        adsScript.crossOrigin = 'anonymous';
        adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8289065661129245';
        document.head.appendChild(adsScript);
    }

    // Animate year in footer
    const yearElement = document.getElementById('dynamic-year');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    // Enforce clean initial UI state on first load and browser back/forward cache restores.
    const resultsPanel = document.getElementById('results-panel');
    const initialState = document.getElementById('initial-state');
    if (resultsPanel) resultsPanel.style.display = 'none';
    if (initialState) initialState.style.display = 'block';

    // Calculator Logic
    const calculateBtn = document.getElementById('calculateBtn');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', function () {

            // 1. Get Inputs
            const form = document.getElementById('ecoForm');
            const gardenSizeKey = form.querySelector('input[name="gardenSize"]:checked').value;
            const plantTypeKey = document.getElementById('plantType').value;
            // Map UI values to JSON keys if necessary (ui: 'rain', json: 'rainwater' - handled in coefficients map for now or logic below)
            let waterSourceKey = form.querySelector('input[name="waterSource"]:checked').value;
            let fertilizerKey = form.querySelector('input[name="fertilizer"]:checked').value;

            // 2. Lookup Coefficients
            const sizeData = ecoCoefficients.gardenSize[gardenSizeKey];

            // Handle potential key mismatch if UI hasn't been updated to match JSON perfectly
            // JSON has specific keys, we map 'mixed' and 'wildflower' in the JS object to ensure safety
            const plantData = ecoCoefficients.plantType[plantTypeKey] || ecoCoefficients.plantType.mixed;

            // Map water source keys logic (UI: rain/tap -> JSON: typically rain/tap or rainwater/tap)
            // The ecoCoefficients I wrote maps 'rain' and 'tap' keys directly
            const waterData = ecoCoefficients.waterSource[waterSourceKey];
            const fertilizerData = ecoCoefficients.fertilizerType[fertilizerKey];

            // 3. Perform Calculations

            // --- Carbon Sequestration ---
            // Formula: Area * CarbonRate * Multipliers
            let carbonSeq = sizeData.areaSqm * plantData.carbonKgPerSqm;
            carbonSeq = carbonSeq * waterData.carbonMultiplier * fertilizerData.carbonMultiplier;
            carbonSeq = Math.round(carbonSeq);

            // --- Biodiversity Index ---
            // Formula: Base Score * Multipliers
            let bioIndex = plantData.biodiversityScore * fertilizerData.biodiversityMultiplier;
            // Normalize to a 0-10 scale for display roughly, or just classification
            // JSON 'ecoScore' generally refers to overall impact, but let's use bioIndex for the bio widget

            // Classification text
            let bioText = "Moderate";
            if (bioIndex < 2.5) bioText = "Low";
            if (bioIndex > 4.0) bioText = "High";


            // --- Eco Impact Score (0-100) ---
            // We'll synthesize this from the components since the JSON defines ranges 0-5 but we want a % gauge
            // Max possible carbon/sqm ~ 1.5, Max Bio ~ 6. Let's create a weighted score.

            // Carbon Factor (0-50 points)
            // Reference: Large tree garden = 400m2 * 1.2 = 480kg. Small lawn = 50 * 0.15 = 7.5kg.
            // We normalize based on "efficiency" per sqm mostly, plus some total impact bonus
            let carbonScore = (plantData.carbonKgPerSqm / 1.5) * 40; // Max ~40 pts

            // Bio Factor (0-40 points)
            // Max bio score ~ 6 (5 * 1.2)
            let bioScore = (bioIndex / 6) * 40; // Max ~40 pts

            // Practice Factor (0-20 pts)
            let practiceScore = 10;
            if (waterSourceKey === 'rain') practiceScore += 5;
            if (fertilizerKey === 'organic') practiceScore += 5;

            let finalScore = Math.round(carbonScore + bioScore + practiceScore);
            finalScore = Math.min(100, Math.max(1, finalScore)); // Clamp


            // --- Comparisons (Context) ---
            let carKm = Math.round(carbonSeq / ecoCoefficients.comparisons.carbon.carKmEquivalentKg);
            let treeEq = (carbonSeq / ecoCoefficients.comparisons.carbon.treeEquivalentKg).toFixed(1);


            // 4. Update UI

            // Hide Initial, Show Results
            document.getElementById('initial-state').style.display = 'none';
            resultsPanel.style.display = 'block';
            resultsPanel.classList.add('fade-in');

            // Update Metrics
            animateValue("eco-score-val", 0, finalScore, 1000);
            animateValue("carbon-val", 0, carbonSeq, 1000);
            document.getElementById('bio-val').textContent = bioText;

            // Color code the circle
            const circle = document.getElementById('score-circle');
            if (finalScore < 40) circle.style.borderColor = "#f44336";
            else if (finalScore < 70) circle.style.borderColor = "#ff9800";
            else circle.style.borderColor = "#749c30";

            // Update Insights using structure

            // Air Quality
            const airQuality = plantData.airQuality;
            const airDesc = `Your garden provides <strong>${airQuality.dustCapture}</strong> dust capture and has a <strong>${airQuality.coolingEffect}</strong> cooling effect on the local microclimate.`;
            document.getElementById('air-quality-desc').innerHTML = airDesc;

            // Water Conservation & Detailed Equivalencies
            // Use the Carbon comparison here for impact context
            const waterHtml = `
        Equivalent to <strong>${carKm} km</strong> driven in a car or planting <strong>${treeEq}</strong> mature trees.<br>
        <small style="color:#777; margin-top:5px; display:block;">Water Conservation: ${waterData.label} used.</small>
      `;
            document.getElementById('water-desc').innerHTML = waterHtml;

            // Recommendation
            let recommendation = "";
            if (fertilizerKey === 'chemical') {
                recommendation = "Switching to organic fertilizers can increase your soil health bonus by " +
                    Math.round((ecoCoefficients.fertilizerType.organic.soilHealthBonus - 1) * 100) + "%.";
            } else if (waterSourceKey === 'tap') {
                recommendation = "Rainwater harvesting could increase your overall water efficiency multiplier to " +
                    ecoCoefficients.waterSource.rain.waterMultiplier + "x.";
            } else if (plantTypeKey === 'lawn') {
                recommendation = "Replace lawn areas with trees or vegetables to boost carbon sequestration from " +
                    plantData.carbonKgPerSqm + "kg to " + ecoCoefficients.plantType.trees.carbonKgPerSqm + "kg per m².";
            } else {
                recommendation = "Excellent setup! Your garden is operating at high environmental efficiency.";
            }
            document.getElementById('recommendation-text').textContent = recommendation;

        });
    }

    // Helper for number animation
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

});
