const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const apiPath = path.join(__dirname, 'api');
if (!fs.existsSync(apiPath)) fs.mkdirSync(apiPath);

const endpoints = [];

fs.readdirSync(apiPath).forEach(file => {
    if (file.endsWith('.js')) {
        const route = require(`./api/${file}`);
        const routeName = file.replace('.js', '');
        
        app.get(`/api/${routeName}`, route.handler);
        
        endpoints.push({
            name: route.name || routeName,
            path: `/api/${routeName}`,
            usage: route.usage || "n/a"
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        status: "active",
        engine: "amdus_core_v1",
        routes: endpoints
    });
});

app.listen(PORT, () => console.log(`server active on ${PORT}`));
