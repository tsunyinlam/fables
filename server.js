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
        console.log('Received question:', question);
        
        // Set up SSE headers
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        console.log('Headers set up');

        console.log('Starting OpenAI stream...');
        const stream = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: question }
            ],
            stream: true
        });
        console.log('Stream created');

        let fullResponse = '';
        console.log('Starting stream processing...');
        
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
                console.log('Received chunk:', content);
                fullResponse += content;
                res.write(`data: ${JSON.stringify({ content })}\n\n`);
            }
        }

        console.log('Stream completed');
        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error) {
        console.error('Server Error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Something went wrong' })}\n\n`);
        res.end();
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});