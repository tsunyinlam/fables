import os

# Create output directory if it doesn't exist
os.makedirs('html_files', exist_ok=True)

# Generate 147 HTML files
for i in range(1, 148):
    file_num = f"{i:03d}"
    
    # Create HTML content with styled redirect
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="1; url=https://read.gov/aesop/{file_num}.html">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting to Aesop's Fable #{i}</title>
    <style>
        body {{
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: #2c3e50;
        }}
        .container {{
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 1rem;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            max-width: 90%;
            width: 500px;
        }}
        h1 {{
            margin: 0 0 1rem 0;
            font-size: 1.5rem;
            color: #2c3e50;
        }}
        p {{
            margin: 1rem 0;
            color: #34495e;
        }}
        .loader {{
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            margin: 1rem auto;
            animation: spin 1s linear infinite;
        }}
        @keyframes spin {{
            0% {{ transform: rotate(0deg); }}
            100% {{ transform: rotate(360deg); }}
        }}
        a {{
            color: #3498db;
            text-decoration: none;
            transition: color 0.3s ease;
        }}
        a:hover {{
            color: #2980b9;
            text-decoration: underline;
        }}
        .fable-number {{
            font-size: 0.9rem;
            color: #7f8c8d;
            margin-top: 1rem;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>Redirecting to Aesop's Fables</h1>
        <div class="loader"></div>
        <p>You'll be redirected to:</p>
        <p><a href="https://read.gov/aesop/{file_num}.html">https://read.gov/aesop/{file_num}.html</a></p>
        <p class="fable-number">Fable #{i}</p>
    </div>
</body>
</html>"""
    
    # Write the HTML file
    with open(f'html_files/{i}.html', 'w') as f:
        f.write(html_content)

print("Created 147 gorgeous HTML redirect files 💫")