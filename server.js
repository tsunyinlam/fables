const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const fs = require('fs');
const Papa = require('papaparse');
require('dotenv').config();

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Load CSV data
let csvData;
try {
    const fileContent = fs.readFileSync('data/my-data.csv', 'utf-8');
    csvData = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true
    }).data;
    console.log(`Loaded ${csvData.length} rows from CSV`);
} catch (error) {
    console.error('Error loading CSV:', error);
    process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        const systemPrompt = `You are a helpful assistant with access to this data:
${JSON.stringify(csvData, null, 2)}

Please use this data to answer questions. If the answer cannot be found in the data, say so.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question }
            ],
        });

        res.json({ answer: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});