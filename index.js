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

const routes = [];

fs.readdirSync(apiPath).forEach(file => {
    if (file.endsWith('.js')) {
        const route = require(`./api/${file}`);
        const routeName = file.replace('.js', '');
        
        app.get(`/api/${routeName}`, route.handler);
        
        routes.push({
            endpoint: `/api/${routeName}`,
            description: route.description || "no description"
        });
        console.log(`loaded: /api/${routeName}`);
    }
});

app.get('/', (req, res) => {
    res.json({
        status: "online",
        message: "amdus api hub active",
        available_endpoints: routes
    });
});

app.listen(PORT, () => console.log(`api hub live on ${PORT}`));
