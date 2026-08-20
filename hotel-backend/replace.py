import re
with open("controllers/hotelController.js", "r") as f:
    content = f.read()

old_pattern = r"const getAllHotels = async \(req, res\) => \{[\s\S]*?const countResult = await pool\.query\([\s\S]*?\n        \);"

new_code = """const getAllHotels = async (req, res) => {
    try {
        let { page = 1, limit = 10, minPrice, maxPrice, search } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;
        if (limit > 100) limit = 100;

        const offset = (page - 1) * limit;
        const conditions = [];
        const values = [];

        if (search !== undefined && search.strip() !== "") {
            values.push(`%${search.strip()}%`);
            conditions.push(`(title ILIKE $${values.length} OR description ILIKE $${values.length})`);
        }

        if (minPrice !== undefined && minPrice !== "") {
            values.push(Number(minPrice));
            conditions.push(`price >= $${values.length}`);
        }

        if (maxPrice !== undefined && maxPrice !== "") {
            values.push(Number(maxPrice));
            conditions.push(`price <= $${values.length}`);
        }

        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

        const countResult = await pool.query(`SELECT COUNT(*) FROM hotels ${whereClause}`, values);"""

content = re.sub(old_pattern, new_code.replace(".strip()", ".trim()"), content)

with open("controllers/hotelController.js", "w") as f:
    f.write(content)
print("Replaced!")
