const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: "Pinterest Scraper",
    usage: "/api/pinterest?q=nature",
    handler: async (req, res) => {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "query required" });

        try {
            const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`;
            const { data } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const $ = cheerio.load(data);
            const images = [];

            $('img').each((i, el) => {
                const src = $(el).attr('src');
                if (src && src.includes('736x')) images.push(src);
            });

            res.json({
                query: q,
                count: images.length,
                results: images.slice(0, 10)
            });
        } catch (e) {
            res.status(500).json({ error: "scraping failed" });
        }
    }
};
