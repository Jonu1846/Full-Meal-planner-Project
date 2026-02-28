const fetch = require("node-fetch");

const CUISINE_SOURCES = [
    { fetch: "Japanese", tab: "Japanese" },
    { fetch: "Chinese", tab: "Chinese" },
    { fetch: "Korean", tab: "Chinese" },
    { fetch: "American", tab: "American" },
    { fetch: "Canadian", tab: "American" },
    { fetch: "British", tab: "American" },
    { fetch: "Irish", tab: "American" },
    { fetch: "Indian", tab: "Indian" },
    { fetch: "Malaysian", tab: "Indian" },
    { fetch: "Turkish", tab: "Indian" },
];

const fetchMealsByCuisines = async () => {
    try {
        const results = await Promise.all(
            CUISINE_SOURCES.map(({ fetch: area, tab }) =>
                fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
                    .then((r) => r.json())
                    .then((data) =>
                        (data.meals || []).map((meal) => ({
                            id: meal.idMeal,
                            name: meal.strMeal,
                            area: tab,           // show under this tab
                            realArea: area,      // actual origin for display
                        }))
                    )
                    .catch((e) => {
                        console.error(area, "failed", e);
                        return [];
                    })
            )
        );

        const flat = results.flat();
        console.log("Total meals:", flat.length);
        console.log("Indian meals count:", flat.filter(m => m.area === "Indian").length);
        console.log("Indian meals:", flat.filter(m => m.area === "Indian").map(m => m.area + " - " + m.name).slice(0, 5));

    } catch (err) {
        console.error("fetchMealsByCuisines error:", err);
    }
};

fetchMealsByCuisines();
