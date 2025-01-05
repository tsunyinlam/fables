from bs4 import BeautifulSoup
import os

def split_chapters(input_file, output_dir):
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Read and parse the HTML file
    with open(input_file, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Get the header content (everything before the first chapter)
        header = """<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chapter</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.8;
            color: #24292e;
            background-color: #ffffff;
        }
        .container {
            max-width: 42rem;
            margin: 0 auto;
            padding: 2rem 1.25rem;
        }
        h1, h2, h3 {
            line-height: 1.3;
            color: #1a1a1a;
            margin-top: 2.5rem;
            margin-bottom: 1.5rem;
        }
        h1 { font-size: 2rem; }
        h2 { font-size: 1.75rem; }
        h3 { font-size: 1.5rem; }
        p {
            margin-bottom: 1.5rem;
        }
        body {
            max-width: 800px;
        }
        @media (max-width: 768px) {
            body { font-size: 16px; }
            .container { padding: 1.5rem 1rem; }
            h1 { font-size: 1.75rem; }
            h2 { font-size: 1.5rem; }
            h3 { font-size: 1.25rem; }
        }
    </style>
</head>"""

    body_start = """<body>
    <div class="container">
            <header class="site-header">
            <div class="site-title">From Grimm's Fairy Tales</div>
        </header>"""

    # Find all chapter divs
    chapters = soup.find_all('div', class_='chapter')
    
    # Process each chapter
    for i, chapter in enumerate(chapters, start=147):
        # Create a new HTML document for each chapter
        chapter_html = f"""<!DOCTYPE html>
<html lang="en">
{header}
{body_start}
{str(chapter)}
</body>
</html>"""
        
        # Write the styled version
        output_file = os.path.join(output_dir, f'{i:03d}.html')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(chapter_html)
        
        # Write the raw version
        raw_output_file = os.path.join(output_dir, f'raw_{i:03d}.html')
        with open(raw_output_file, 'w', encoding='utf-8') as f:
            f.write(str(chapter))
        
        print(f"Created {output_file} and {raw_output_file}")

if __name__ == "__main__":
    input_file = "data/grimms/gutenberg.html"
    output_dir = "data/grimms/chapters"
    split_chapters(input_file, output_dir)