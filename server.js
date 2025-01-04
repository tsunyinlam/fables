const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const fs = require('fs');
const Papa = require('papaparse');
require('dotenv').config();

// ... existing middleware setup ...

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

// ... OpenAI setup ...

app.post('/api/ask', async (req, res) => {
    try {
        const { question } = req.body;
        
        // Create a prompt that includes the CSV data context
        const systemPrompt = `You are a helpful assistant with access to these fables:
${JSON.stringify(csvData, null, 2)}

The user's question is going to be a moral about a fable. Please recommend a fable that best fits the user's question. Reply with a list of 3 fables and mention their number.`;

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

// ... rest of your server code ...