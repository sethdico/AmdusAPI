const axios = require('axios');

module.exports = {
    config: {
        name: "Lyrics Search",
        description: "Scrape song lyrics",
        category: "Media",
        params: [
            { name: "q", type: "string", required: true }
        ]
    },

    handler: async (req, res) => {
        const { q } = req.query;
        
        if (!q) throw new Error("Missing parameter 'q'");
        
        return {
            title: q,
            artist: "Unknown",
            lyrics: "Lyrics data would appear here...",
            source: "Mock Data"
        };
    }
};
