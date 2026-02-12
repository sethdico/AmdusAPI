const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
    name: "Lyrics Scraper",
    usage: "/api/lyrics?q=starboy",
    handler: async (req, res) => {
        const { q } = req.query;
        if (!q) return res.status(400).json({ error: "song name required" });

        try {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(q + ' lyrics')}`;
            const { data } = await axios.get(searchUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            const $ = cheerio.load(data);
            
            // Gets google lyrics snippets
            const lyrics = $('div.hw7v9b').text() || "Lyrics snippet not found on preview.";

            res.json({
                song: q,
                data: lyrics.trim()
            });
        } catch (e) {
            res.status(500).json({ error: "failed to fetch lyrics" });
        }
    }
};
