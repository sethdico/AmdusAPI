const fs = require('fs');
const path = require('path');
const config = require('../../config');

const commands = [];

const loadCommands = (app) => {
    const commandsPath = path.join(__dirname, '../commands');
    
    if (!fs.existsSync(commandsPath)) return;

    const categories = fs.readdirSync(commandsPath);

    categories.forEach(category => {
        const catPath = path.join(commandsPath, category);
        
        if (!fs.lstatSync(catPath).isDirectory()) return;

        const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));

        files.forEach(file => {
            try {
                const cmd = require(path.join(catPath, file));
                
                if (!cmd.config || !cmd.handler) return;

                const routeName = cmd.config.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const fullPath = `/api/${category}/${routeName}`;

                app.get(fullPath, async (req, res) => {
                    try {
                        const result = await cmd.handler(req, res);
                        
                        if (res.headersSent) return;

                        res.json({
                            status: true,
                            creator: config.meta.creator,
                            result: result
                        });
                    } catch (err) {
                        if (!res.headersSent) {
                            res.status(500).json({
                                status: false,
                                creator: config.meta.creator,
                                message: "Internal Server Error",
                                error: err.message
                            });
                        }
                    }
                });

                commands.push({
                    name: cmd.config.name,
                    description: cmd.config.description || "No description provided.",
                    category: category,
                    path: fullPath,
                    params: cmd.config.params || []
                });

                console.log(`[LOAD] ${cmd.config.name} -> ${fullPath}`);

            } catch (e) {
                console.error(`[FAIL] ${file}:`, e.message);
            }
        });
    });
};

module.exports = { loadCommands, commands };
