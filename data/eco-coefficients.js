/**
 * Eco Impact Coefficients Data
 * Source: data/eco-impact.json
 * Derived and normalized from IPCC, FAO, WRI, CBD datasets
 */
const ecoCoefficients = {
    meta: {
        version: "1.0.0",
        lastUpdated: "2026-02-01",
        scope: "Global urban residential gardens",
        confidenceLevel: "Indicative / Consumer-grade",
        methodology: "Derived and normalized from IPCC, FAO, WRI, CBD datasets",
        units: {
            carbon: "kg CO2 per year",
            water: "liters per year"
        }
    },

    gardenSize: {
        small: {
            areaSqm: 50,
            label: "Small (Balcony / Compact yard)"
        },
        medium: {
            areaSqm: 150,
            label: "Medium (Home garden)"
        },
        large: {
            areaSqm: 400,
            label: "Large (Villa / Community garden)"
        }
    },

    plantType: {
        vegetables: {
            carbonKgPerSqm: 0.4,
            biodiversityScore: 2.5,
            waterRetention: 0.3,
            airQuality: {
                dustCapture: "medium",
                coolingEffect: "low"
            }
        },
        // Mapping 'mixed' to 'flowers' for now as closest approximation, or average
        mixed: {
            carbonKgPerSqm: 0.35, // Avg of veg and flowers
            biodiversityScore: 3.0,
            waterRetention: 0.28,
            airQuality: {
                dustCapture: "medium",
                coolingEffect: "low"
            }
        },
        flowers: {
            carbonKgPerSqm: 0.3,
            biodiversityScore: 3.5,
            waterRetention: 0.25,
            airQuality: {
                dustCapture: "low",
                coolingEffect: "low"
            }
        },
        trees: {
            carbonKgPerSqm: 1.2,
            biodiversityScore: 5,
            waterRetention: 0.6,
            airQuality: {
                dustCapture: "high",
                coolingEffect: "high"
            }
        },
        lawn: {
            carbonKgPerSqm: 0.15,
            biodiversityScore: 1.5,
            waterRetention: 0.2,
            airQuality: {
                dustCapture: "low",
                coolingEffect: "medium"
            }
        },
        wildflower: { // Adding for backward compatibility with UI
            carbonKgPerSqm: 0.35,
            biodiversityScore: 4.5,
            waterRetention: 0.3,
            airQuality: {
                dustCapture: "low",
                coolingEffect: "low"
            }
        }
    },

    waterSource: {
        rain: { // UI uses 'rain'
            carbonMultiplier: 1.1,
            waterMultiplier: 1.25,
            label: "Rainwater harvesting"
        },
        tap: {
            carbonMultiplier: 0.9,
            waterMultiplier: 0.75,
            label: "Municipal tap water"
        }
    },

    fertilizerType: {
        organic: {
            carbonMultiplier: 1.1,
            biodiversityMultiplier: 1.25,
            soilHealthBonus: 1.2,
            label: "Organic / Compost-based"
        },
        chemical: {
            carbonMultiplier: 0.9,
            biodiversityMultiplier: 0.7,
            soilHealthBonus: 0.85,
            label: "Chemical fertilizer"
        }
    },

    optionalModifiers: {
        sunExposure: {
            low: 0.85,
            medium: 1.0,
            high: 1.15
        },
        soilType: {
            sandy: 0.9,
            loamy: 1.1,
            clay: 1.0,
            unknown: 1.0
        },
        gardenAge: {
            new: 0.7,
            established: 1.0,
            mature: 1.2
        },
        irrigationMethod: {
            manual: 1.0,
            sprinkler: 0.9,
            drip: 1.15
        }
    },

    ecoScore: {
        ranges: [
            { min: 0, max: 2, label: "Low" },
            { min: 2, max: 4, label: "Moderate" },
            { min: 4, max: 5, label: "High" }
        ],
        maxScore: 5
    },

    comparisons: {
        carbon: {
            treeEquivalentKg: 21,
            carKmEquivalentKg: 0.12
        }
    },

    disclaimer: {
        short: "Results are indicative estimates based on global studies.",
        long: "This calculator provides estimated environmental benefits for awareness and decision support only. Results are not direct measurements and should not be used for regulatory or compliance reporting."
    }
};
