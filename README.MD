# Aesop's Fable Recommender

Recommends an Aesop's Fable by moral.

Built with Node.js and OpenAI's GPT-4. Almost all code generated from Cursor. 

[Live Demo](https://aesop-fable-backend-2fff4d554cf5.herokuapp.com)

## Technical Overview

### Architecture
- **Backend**: Node.js with Express.js
- **AI Integration**: OpenAI GPT-4 API
- **Data Management**: CSV-based data store
- **Deployment**: Heroku

### Project Structure 

```
├── public/
│   ├── index.html      # Frontend interface
│   └── 1. html         # Redirects URLS to Aesop's fables
│   └── 2. html
│   └── ...
├── data/
│   ├── aesop-morals.csv # Aesop's fables database
│   └── grimms/          # Additional unused stories database
|   └── make_aesop_redirect_urls.py  # Python script for generating redirect URLs to Aesop's fables
├── server.js           # Express server and API endpoints
├── cheatsheet.md       # Build commands
├── README.md           # Documentation
├── .gitignore          
├── package.json        # Node.js project dependencies
├── package-lock.json   
└── Procfile            # Heroku deployment instructions
```

### API Endpoint in server.js

POST /api/ask

Accepts a moral/theme and returns matching fables.

Request body:
```
{
    "question": "string containing the user's intended moral or theme"
}
```
Response:
``` 
{
    "answer": "HTML formatted string containing three matching fables"
}
```