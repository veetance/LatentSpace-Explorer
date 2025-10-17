import uvicorn
from fastapi import FastAPI, Form
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles

# --- App Configuration ---
app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

# --- State Management ---
SESSION = {
    "current_dimension_index": 0
}

# --- Dimension Definitions ---
DIMENSIONS = [
    {
        "name": "The 8-Bit Arcade",
        "prompt": "You are an expert 8-bit arcade game generator..."
    },
    {
        "name": "The Minimalist Puzzle",
        "prompt": "You are a creator of calm, minimalist puzzle games..."
    },
    {
        "name": "The Generative Art",
        "prompt": "You are a generative artist who creates interactive art with p5.js..."
    }
]

# --- AI Generation (Placeholder) ---
def get_ai_generation(dimension_prompt: str, user_tags: list[str]) -> str:
    """
    This is a placeholder function for AI generation.
    """
    print(f"--- AI PROMPT ---")
    print(f"MASTER PROMPT: {dimension_prompt}")
    print(f"USER TAGS: {user_tags}")
    print(f"-----------------")

    dimension_name = DIMENSIONS[SESSION['current_dimension_index']]['name']
    tags_str = ', '.join(user_tags)

    # The f-string is now fixed with doubled curly braces {{ }} for CSS.
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: monospace;
                background-color: #111;
                color: #0f0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                border: 2px solid #0f0;
                box-sizing: border-box;
            }}
            .content {{
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="content">
            <h1>AI Generation Placeholder</h1>
            <p>Dimension: {dimension_name}</p>
            <p>Tags: {tags_str}</p>
        </div>
    </body>
    </html>
    """

# --- API Endpoints ---

@app.post("/switch-dimension", response_class=HTMLResponse)
async def switch_dimension():
    current_index = SESSION["current_dimension_index"]
    next_index = (current_index + 1) % len(DIMENSIONS)
    SESSION["current_dimension_index"] = next_index
    dimension = DIMENSIONS[next_index]
    return f"""
    <div id="dimension-display" hx-swap-oob=\"true\" class="dimension-display">
        <h2>Current Dimension: <span class="dimension-name">{dimension['name']}</span></h2>
        <p class="dimension-prompt">\"{dimension['prompt']}\"</p>
    </div>
    """

@app.post("/generate", response_class=HTMLResponse)
async def generate_game(tags: str = Form(...)):
    user_tags = [tag.strip() for tag in tags.split(',')]
    dimension = DIMENSIONS[SESSION["current_dimension_index"]]
    game_html = get_ai_generation(dimension['prompt'], user_tags)
    # Using f-string with triple single quotes to avoid escaping issues with srcdoc
    return f'''<iframe class="w-full h-full" srcdoc='{game_html}'></iframe>'''

@app.get("/", response_class=HTMLResponse)
async def read_root():
    return FileResponse("index.html")

# --- Main Execution ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
