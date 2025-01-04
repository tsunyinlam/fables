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
        
        const systemPrompt = `You are a helpful assistant that matches user's moral lessons with Aesop's fables. You have access to this database of fables:
        ${JSON.stringify(csvData, null, 2)}
        
        When a user provides a moral lesson or message, your task is to:
        1. Find the 3 fables whose morals most closely match the user's intent
        2. Present them in this exact format:
        
        <b>[Fable Title 1]</b>
        Moral: [exact moral from database]
        Link: <a href="https://read.gov/aesop/[three digit number].html">Read the full fable</a>
        
        <b>[Fable Title 2]</b>
        Moral: [exact moral from database]
        Link: <a href="https://read.gov/aesop/[three digit number].html">Read the full fable</a>
        
        <b>[Fable Title 3]</b>
        Moral: [exact moral from database]
        Link: <a href="https://read.gov/aesop/[three digit number].html">Read the full fable</a>
        
        For the link URLs, always format the number with three digits (e.g., "001", "023", "145").
        If you cannot find matching fables, please say "I couldn't find any fables with a similar moral lesson."
        Please maintain the exact HTML formatting with <b> tags for titles and <a> tags for links.`;
        
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