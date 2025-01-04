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
        
        const systemPrompt = `You are a helpful assistant that matches the user's moral lessons or themes with Aesop's fables. You have access to this database of fables: 
${JSON.stringify(csvData, null, 2)}

When a user provides a moral lesson, message, or theme, your task is to:  
1. Attempt to find exactly 3 fables that most closely align with the user's input.  
   - If the input is a general theme (e.g., "love"), interpret the theme and find fables that embody or relate to it, even if the moral isn't an exact match.  
   - If the input is specific (e.g., "honesty is the best policy"), prioritize fables with morals that closely match the input.  

2. Present the fables in this exact format:
<div class="fable">
    <b>[Fable Title 1]</b>
    <p>Moral: [exact moral from database]</p>
    <p>Link: <a href="https://read.gov/aesop/[three digit number].html">Read the full fable</a></p>
</div>

<div class="fable">
    <b>[Fable Title 2]</b>
    <p>Moral: [exact moral from database]</p>
    <p>Link: <a href="https://read.gov/aesop/[three digit number].html">Read the full fable</a></p>
</div>

<div class="fable">
    <b>[Fable Title 3]</b>
    <p>Moral: [exact moral from database]</p>
    <p>Link: <a href="https://read.gov/aesop/[three digit number].html">Read the full fable</a></p>
</div>

3. For link URLs, always format the number with three digits (e.g., "001", "023", "145").  

If you can only find one or two fables, present only those you find. If no fables match, respond with:  
<p>I couldn't find any fables that directly match your input. Try rephrasing or providing a different theme or moral.</p>  

Please maintain the exact HTML formatting with proper <div>, <p>, <b>, and <a> tags. Always aim to provide at least two fables, even if the match is thematic rather than exact.`; 
        
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo",
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