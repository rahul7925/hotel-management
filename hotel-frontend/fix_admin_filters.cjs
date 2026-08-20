const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const oldFetchHotelsRegex = /const fetchHotels = async \(\) => \{\s*try \{\s*setLoading\(true\);\s*setError\(""\);\s*const params = new URLSearchParams\(\);\s*if \(search\.trim\(\)\) \{\s*params\.append\(\s*"search",\s*search\.trim\(\)\s*\);\s*\}\s*if \(minPrice !== ""\) \{\s*params\.append\(\s*"minPrice",\s*minPrice\s*\);\s*\}\s*if \(maxPrice !== ""\) \{\s*params\.append\(\s*"maxPrice",\s*maxPrice\s*\);\s*\}/;

const newFetchHotels = `const fetchHotels = async (options = {}) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      const currentSearch = options.clear ? "" : search;
      const currentMin = options.clear ? "" : minPrice;
      const currentMax = options.clear ? "" : maxPrice;

      if (currentSearch.trim()) {
        params.append(
          "search",
          currentSearch.trim()
        );
      }

      if (currentMin !== "") {
        params.append(
          "minPrice",
          currentMin
        );
      }

      if (currentMax !== "") {
        params.append(
          "maxPrice",
          currentMax
        );
      }`;

if (oldFetchHotelsRegex.test(content)) {
    content = content.replace(oldFetchHotelsRegex, newFetchHotels);
    console.log("Replaced fetchHotels successfully.");
} else {
    console.log("fetchHotels regex did not match!");
}

const oldClearFiltersRegex = /const clearFilters = \(\) => \{\s*setSearch\(""\);\s*setMinPrice\(""\);\s*setMaxPrice\(""\);\s*setTimeout\(\(\) => \{\s*fetchHotels\(\);\s*\}, 0\);\s*\};/;

const newClearFilters = `const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    fetchHotels({ clear: true });
  };`;

if (oldClearFiltersRegex.test(content)) {
    content = content.replace(oldClearFiltersRegex, newClearFilters);
    console.log("Replaced clearFilters successfully.");
} else {
    console.log("clearFilters regex did not match!");
}

fs.writeFileSync('src/pages/Admin.jsx', content);
console.log('Update complete.');
