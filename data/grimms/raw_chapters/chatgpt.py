import os
import csv
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

def get_moral_from_gpt(story_text):
    try:
        response = openai.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages = [
                {
                    "role": "system",
                    "content": """You are a wise storyteller who extracts concise moral lessons from stories. Please provide a 1-2 sentence moral lesson, in no more than 40 words. The style should be similar to these examples:
                    - Do not attempt the impossible.
                    - It is one thing to say that something should be done, but quite a different matter to do it.
                    - Poverty with security is better than plenty in the midst of fear and uncertainty.
                    - There are many who pretend to despise and belittle that which is beyond their reach.
                    - Expect no reward for serving the wicked.
                    - A kindness is never wasted.
                    - We are often of greater importance in our own eyes than in the eyes of our neighbor. The smaller the mind, the greater the conceit.
                    - Our best blessings are often the least appreciated.
                    - Flattery is not a proof of true admiration. Do not let flattery throw you off your guard against an enemy."""
                },
                {
                    "role": "user",
                    "content": "Story: {story_text}\n\nWhat is the moral of this story in 1-2 sentences?"
                }
            ],
            max_tokens=100,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error getting moral: {str(e)}")
        return "Error generating moral"

def extract_story_content(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Get story text (all p tags within the chapter div)
    chapter_div = soup.find('div', class_='chapter')
    if not chapter_div:
        return ""
    
    paragraphs = chapter_div.find_all('p')
    story_text = ' '.join(p.text.strip() for p in paragraphs)
    
    return story_text

def create_morals_csv():
    output_rows = []
    directory = 'data/grimms/raw_chapters'
    
    for filename in os.listdir(directory):
        if filename.endswith('.html'):
            print(f"Processing {filename}...")
            with open(os.path.join(directory, filename), 'r', encoding='utf-8') as file:
                content = file.read()
                story_text = extract_story_content(content)
                
                if story_text:
                    moral = get_moral_from_gpt(story_text)
                    output_filename = f"raw_{os.path.splitext(filename)[0]}.html"
                    output_rows.append([output_filename, moral])
                    print(f"Generated moral for {filename}")
    
    # Write to CSV
    with open('grimm_morals.csv', 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Filename', 'Moral'])
        writer.writerows(output_rows)
        print(f"CSV file created with {len(output_rows)} entries")

if __name__ == "__main__":
    create_morals_csv()