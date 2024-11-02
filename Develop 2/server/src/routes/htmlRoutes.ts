import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Define route to serve index.html
router.get('/', (req, res) => {
    const requestMethod = req.method; // Example usage
    console.log(`Request method: ${requestMethod}`); // Log the method (optional)
    res.sendFile(path.join(__dirname, 'index.html')); // Adjust this path
});

export default router;
