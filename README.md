# SmartBot - Interactive Web Chatbot

## Overview
SmartBot is a feature-rich web-based chatbot that responds to natural language commands and performs various utility functions. It combines a sleek modern interface with over 100 built-in commands for calculations, text manipulation, information lookup, and fun interactions.

## Features
- **100+ Commands**: Math operations, text processing, time/date, games, and utilities
- **Natural Language Processing**: Understands commands without special prefixes
- **Math Evaluation**: Directly evaluates mathematical expressions
- **Interactive UI**: Modern gradient design with smooth animations
- **Responsive Design**: Works on both desktop and mobile devices
- **Command History**: Supports command recall with up/down arrows
- **Visual Feedback**: Color-coded messages and emoji reactions

## Installation
No installation required! Simply open `index.html` in any modern web browser.
For development:
1. Clone the repository
2. Open `index.html` in your browser
3. Start chatting with SmartBot

## Usage
### Basic Commands
- `help` - Show all available commands
- `about` - Information about the bot
- `clear` - Clear the chat window
- `time` - Show current time
- `date` - Show today's date

### Math Operations
- Directly type expressions like `2+2` or `3*(5-2)`
- Special functions: `sqrt 16`, `sin 90`, `log 10`
- Conversions: `binary 42`, `hex 255`

### Text Processing
- `reverse hello` - Reverse text
- `uppercase text` - Convert to uppercase
- `palindrome racecar` - Check for palindromes
- `count this sentence` - Count words and letters

### Fun Commands
- `joke` - Tell a random joke
- `quote` - Get a motivational quote
- `flip` - Flip a coin
- `roll` - Roll a dice
- `emoji` - Get a random emoji

### Utility Commands
- `timer 10` - Set a timer (simulated)
- `reminder 5 Drink water` - Set a reminder
- `password` - Generate a random password
- `rgb 255 0 0` - Show RGB color

## Technical Details
- **Frontend**: Pure HTML/CSS/JavaScript (no frameworks)
- **Design**: Modern gradient UI with smooth animations
- **Compatibility**: Works in all modern browsers
- **Performance**: Lightweight (under 50KB JavaScript)

## Customization
To add new commands:
1. Edit `chatbot.js`
2. Add to the `baseCommands` object
3. Define:
   - `description` - Help text
   - `aliases` - Alternative command names
   - `execute()` - Function to run when command is called

## Screenshots
![image](https://github.com/user-attachments/assets/56394668-b9cf-4a7e-99f7-90b3c86b091d)

## License
MIT License - Free for personal and commercial use
