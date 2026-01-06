# Latin Vocabulary Game

An interactive flashcard game for learning Latin vocabulary through guessing meanings.

## Overview

This project provides a Latin vocabulary learning game in two versions:
- **Server version**: Flask-based web application
- **Static version**: Standalone HTML file

## Features

- **Hidden meanings**: Players must guess the English meanings of Latin words
- **Smart matching**: Accepts synonyms (comma-separated values in CSV)
- **Parentheses handling**: Automatically creates partial matches by removing parenthetical content
  - Example: "with (+ abl.)" accepts both "with (+ abl.)" and "with"
- **Space normalization**: Multiple consecutive spaces are treated as single spaces
- **Progress tracking**: Shows how many meanings remain to be guessed
- **Reveal option**: Button to show all meanings without ending the game
- **Visual feedback**: Color-coded success/error/info messages

## Project Structure

```
fabulae/
├── app.py                 # Flask backend server
├── core.csv              # Latin vocabulary data ($ delimiter)
├── requirements.txt      # Python dependencies
├── templates/
│   └── index.html        # HTML template for server version
├── static/
│   ├── style.css         # Styles for server version
│   └── script.js         # Client-side logic for server version
└── static-version/
    └── index.html        # Standalone single-file version
```

## CSV Format

The vocabulary data uses `$` as the delimiter:

```
Word$Definition$Part of speech
cum$with (+ abl.); when, since, although$
```

- **Column 1**: Latin word with grammatical information
- **Column 2**: English definitions
  - Semicolon (`;`) separates different meanings
  - Comma (`,`) separates synonyms for the same meaning
- **Column 3**: Part of speech (optional, not used in game)

## Server Version

### Requirements
- Python 3.x
- Flask 3.0+

### Installation
```bash
pip install -r requirements.txt
```

### Running
```bash
python app.py
```

Visit `http://127.0.0.1:5000` in your browser.

### How It Works
1. **Backend** (`app.py`):
   - Parses CSV on startup
   - Creates synonym lists with parentheses handling
   - Provides API endpoints for random words and guess validation

2. **Frontend** (templates + static files):
   - Welcome screen with start button
   - Game screen with input field and meaning list
   - AJAX calls to backend for word selection and validation

## Static Version

### Usage
Simply open `static-version/index.html` in any web browser. No server required.

### How It Works
- All CSS, JavaScript, and CSV data embedded in a single HTML file
- JavaScript parses CSV data on page load
- Client-side validation matches the server logic exactly
- Can be hosted on any static web server or shared as a single file

## Game Logic

### Synonym Processing
1. Split definitions by semicolon (`;`) to get distinct meanings
2. For each meaning, split by comma (`,`) to get synonyms
3. Convert all synonyms to lowercase
4. Normalize spaces (multiple → single)
5. If parentheses exist, create additional synonym with parenthetical content removed

### Guess Validation
1. Normalize user input (trim, lowercase, collapse spaces)
2. Check if input matches any synonym in any meaning
3. Track revealed meanings to prevent duplicates
4. Show appropriate feedback message

## Development

### Adding Vocabulary
Add new entries to `core.csv` following the format:
```
Latin word$meaning1, synonym1; meaning2, synonym2$part of speech
```

### Customizing Styles
- **Server version**: Edit `static/style.css`
- **Static version**: Edit the `<style>` section in `static-version/index.html`

## License

Educational project for Latin vocabulary learning.
