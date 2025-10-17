# Project Architecture: The Latent Space Explorer

## 1. Core Concept

The "Latent Space Explorer" is a web application for generating and exploring AI-created games and interactive art. The application is designed around the concept of "Dimensions," where each Dimension represents a unique generative "latent space" with its own distinct style, rules, and aesthetic.

Users can switch between these Dimensions and provide simple "tags" to guide the AI in generating a unique creation within that Dimension's creative constraints.

## 2. Technology Stack

- **Backend:** Python 3
- **Web Framework:** FastAPI
- **AI Library:** Hugging Face `transformers`
- **AI Model:** Self-hosted Microsoft **Phi-3 Mini** (or a similar high-performance small language model)
- **Frontend:** HTML5, CSS3, modern JavaScript (ES6+)
- **Core Frontend Libraries:**
    - **htmx:** To handle all server communication and dynamic content swapping without page reloads.
    - **jQuery:** For general-purpose DOM manipulation and UI scripting.
    - **p5.js:** As a primary library for rendering generated games and interactive art.
- **Build Process:** A "no build step" approach. Libraries will be loaded via CDN in the main HTML file to keep the setup simple and transparent.

## 3. Application Architecture

The application is a monolithic server-side application where the Python backend serves the HTML frontend and provides an API for AI generation.

### 3.1. Backend (`main.py`)

- **Responsibilities:**
    1.  Serve the main `index.html` shell and any static assets (`.js`, `.css`).
    2.  Manage the user's session state, specifically the "current dimension" they are in.
    3.  Define and store the "Dimension Prompts."
    4.  Provide an API endpoint for generation.

- **API Endpoint (`/generate`):**
    - Accepts a POST request containing a list of user-provided `tags`.
    - Retrieves the master system prompt for the user's current Dimension.
    - Constructs a final, detailed prompt by combining the master prompt with the user's tags.
    - Interfaces with the locally-run Phi-3 model to generate a complete, self-contained HTML/CSS/JS game as a single string.
    - Returns the generated game code wrapped inside a full `<iframe>` tag in the HTTP response.

### 3.2. Frontend (`index.html`, `app.js`, `style.css`)

- **`index.html` (The Shell):**
    - Contains the basic page layout, including a persistent header/footer.
    - Includes CDN links for all libraries (htmx, jQuery, p5.js).
    - Defines the main content area where Dimensions and generated content will be displayed.
    - Contains the primary UI controls: a "Next Dimension" button and the tag input form.

- **Dimension Switching (htmx):**
    - The "Next Dimension" button will make a `POST` request to a `/switch-dimension` endpoint.
    - The backend will cycle the session's current dimension and return an HTML fragment with the name and description of the new dimension, which htmx will swap into the UI.

- **Generation Flow (htmx):**
    - The user enters comma-separated tags into an input field.
    - A "Generate" button triggers a `POST` request via htmx to the `/generate` endpoint, sending the tags.
    - The `hx-target` attribute will point to a container `div`.
    - htmx will receive the complete `<iframe>` from the backend and swap it directly into the container, making the generated game instantly playable.

## 4. "Dimension" Implementation

Each Dimension is a unique "personality" or set of creative constraints given to the AI via a master system prompt. This allows for stylistic consistency within a dimension while allowing for variety based on user tags.

- **Example Dimension 1: "The 8-Bit Arcade"**
    - **Master Prompt:** "You are an expert 8-bit arcade game generator. You will generate a complete, self-contained HTML/JS game in the style of a 1980s arcade cabinet. The game must be simple, fast-paced, and use a blocky, pixelated aesthetic with neon colors."
    - **User Tags:** `frog, crossing road, traffic`
    - **Result:** A "Frogger"-style game with an 8-bit arcade look and feel.

- **Example Dimension 2: "The Minimalist Puzzle"**
    - **Master Prompt:** "You are a creator of calm, minimalist puzzle games. You will generate a complete, self-contained HTML/JS game. The game should be slow-paced, thought-provoking, and use a muted color palette with clean lines and simple shapes."
    - **User Tags:** `water, pipes, connect, flow`
    - **Result:** A "Pipe Mania"-style game with a calm, minimalist aesthetic.
