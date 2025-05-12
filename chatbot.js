// chatbot.js

const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');

// Utility to append messages to chat
function appendMessage(content, sender = 'user') {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    msgDiv.innerHTML = `<p>${content}</p>`;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

// Helper: Safe math evaluation
function safeEval(expr) {
    try {
        // Only allow numbers, operators, parentheses, decimal points, and spaces
        if (/^[\d+\-*/().\s%]+$/.test(expr)) {
            // eslint-disable-next-line no-eval
            let result = eval(expr);
            if (typeof result === 'number' && isFinite(result)) {
                return result;
            }
        }
    } catch {}
    return null;
}

// Main sendMessage handler
function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    userInput.value = '';
    setTimeout(() => handleBotResponse(text), 300);
}

userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
});

// Core commands (without '/')
const baseCommands = {
    'help': {
        description: 'Show available commands',
        aliases: ['commands', 'h', '?'],
        execute: () => {
            const cmdList = Object.entries(commands)
                .map(([cmd, data]) => `${cmd} - ${data.description}`)
                .slice(0, 50) // Show only first 50 for brevity
                .join('<br>');
            return `🛠️ <strong>Available Commands (showing 50 of ${Object.keys(commands).length}):</strong><br>${cmdList}`;
        }
    },
    'about': {
        description: 'Information about the bot',
        aliases: ['info', 'bot'],
        execute: () => '🤖 I am <strong>SmartBot</strong>, a modular chatbot built with HTML, CSS, and JavaScript. I support many commands and am always learning more!'
    },
    'clear': {
        description: 'Clear the chat window',
        aliases: ['cls', 'delete', 'reset'],
        execute: () => {
            chatBody.innerHTML = '';
            return null;
        }
    },
    'time': {
        description: 'Show the current time',
        aliases: ['clock', 'now'],
        execute: () => `🕒 Current time is: <strong>${new Date().toLocaleTimeString()}</strong>`
    },
    'date': {
        description: 'Show today\'s date',
        aliases: ['today'],
        execute: () => `📅 Today's date is: <strong>${new Date().toLocaleDateString()}</strong>`
    },
    'joke': {
        description: 'Tell a random joke',
        aliases: ['funny', 'laugh'],
        execute: () => {
            const jokes = [
                "Why did the programmer quit his job? Because he didn't get arrays.",
                "Why do Java developers wear glasses? Because they don't C#.",
                "What is a computer’s favorite beat? An algo-rhythm.",
                "Why was the robot angry? Because someone kept pushing its buttons.",
                "Why did the function return early? Because it had a date with destiny.",
                "Why did the computer show up at work late? It had a hard drive.",
                "Why did the developer go broke? Because he used up all his cache.",
                "Why was the JavaScript developer sad? Because he didn't 'null' his feelings.",
                "Why do programmers prefer dark mode? Because light attracts bugs.",
                "Why did the array go to therapy? To get its elements in order."
            ];
            return `😂 ${jokes[Math.floor(Math.random() * jokes.length)]}`;
        }
    },
    'greet': {
        description: 'Get a personalized greeting',
        aliases: ['good morning', 'good afternoon', 'good evening'],
        execute: () => {
            const hour = new Date().getHours();
            if (hour < 12) return "☀️ Good Morning!";
            else if (hour < 18) return "🌤️ Good Afternoon!";
            else return "🌙 Good Evening!";
        }
    },
    'quote': {
        description: 'Receive a motivational quote',
        aliases: ['motivate', 'motivation', 'inspire'],
        execute: () => {
            const quotes = [
                "Believe in yourself and all that you are.",
                "Your limitation—it’s only your imagination.",
                "Push yourself, because no one else is going to do it for you.",
                "Success doesn’t just find you. You have to go out and get it.",
                "Dream it. Wish it. Do it.",
                "Great things never come from comfort zones.",
                "Don’t stop when you’re tired. Stop when you’re done."
            ];
            return `💬 "${quotes[Math.floor(Math.random() * quotes.length)]}"`;
        }
    },
    'weather': {
        description: 'Check weather (stub)',
        aliases: [],
        execute: () => "☁️ I'm not connected to live weather APIs yet, but it's always sunny in JavaScript-land!"
    },
    'echo': {
        description: 'Repeat what you say. Usage: echo your message',
        aliases: ['repeat', 'say'],
        execute: (args) => args ? `🔁 ${args}` : "❗ Usage: echo your message"
    },
    'how are you': {
        description: 'Ask the bot how it is',
        aliases: ['how r u', 'how are u', 'how do you do'],
        execute: () => "😊 I'm just code, but I'm running perfectly! How are you?"
    },
    'update': {
        description: 'Check for updates',
        aliases: ['upgrade', 'refresh'],
        execute: () => "🔄 I'm always up-to-date with the latest code!"
    },
    'hi': {
        description: 'Greet the bot',
        aliases: ['hello', 'hey', 'yo', 'hola'],
        execute: () => "👋 Hello Abhiuday Pratap Singh! How can I help you today?"
    },
    'bye': {
        description: 'Say goodbye',
        aliases: ['goodbye', 'see you', 'later'],
        execute: () => "👋 Goodbye! Have a great day, Abhiuday Pratap Singh!"
    },
    'thanks': {
        description: 'Say thanks',
        aliases: ['thank you', 'thx', 'ty'],
        execute: () => "🙏 You're welcome!"
    },
    'random': {
        description: 'Get a random number',
        aliases: ['rand', 'random number'],
        execute: () => `🎲 Your random number: <strong>${Math.floor(Math.random() * 1000)}</strong>`
    },
    'flip': {
        description: 'Flip a coin',
        aliases: ['coin', 'toss'],
        execute: () => `🪙 ${Math.random() > 0.5 ? 'Heads' : 'Tails'}`
    },
    'roll': {
        description: 'Roll a dice',
        aliases: ['dice', 'die'],
        execute: () => `🎲 You rolled a ${Math.floor(Math.random() * 6) + 1}`
    },
    'fact': {
        description: 'Get a random fact',
        aliases: ['did you know', 'trivia'],
        execute: () => {
            const facts = [
                "Honey never spoils.",
                "Bananas are berries, but strawberries aren't.",
                "A group of flamingos is called a 'flamboyance'.",
                "Octopuses have three hearts.",
                "The Eiffel Tower can be 15 cm taller during hot days."
            ];
            return `🤓 ${facts[Math.floor(Math.random() * facts.length)]}`;
        }
    },
    'palindrome': {
        description: 'Check if a word is a palindrome. Usage: palindrome racecar',
        aliases: [],
        execute: (args) => {
            if (!args) return "❗ Usage: palindrome yourword";
            const clean = args.replace(/[^a-z0-9]/gi, '').toLowerCase();
            const isPal = clean === clean.split('').reverse().join('');
            return isPal ? `✅ "${args}" is a palindrome!` : `❌ "${args}" is not a palindrome.`;
        }
    },
    'reverse': {
        description: 'Reverse your text. Usage: reverse your text',
        aliases: [],
        execute: (args) => args ? `🔄 ${args.split('').reverse().join('')}` : "❗ Usage: reverse your text"
    },
    'binary': {
        description: 'Convert number to binary. Usage: binary 42',
        aliases: [],
        execute: (args) => {
            const n = parseInt(args);
            if (isNaN(n)) return "❗ Usage: binary 42";
            return `💻 ${n} in binary is ${n.toString(2)}`;
        }
    },
    'hex': {
        description: 'Convert number to hexadecimal. Usage: hex 255',
        aliases: [],
        execute: (args) => {
            const n = parseInt(args);
            if (isNaN(n)) return "❗ Usage: hex 255";
            return `💻 ${n} in hexadecimal is ${n.toString(16).toUpperCase()}`;
        }
    },
    'prime': {
        description: 'Check if a number is prime. Usage: prime 7',
        aliases: [],
        execute: (args) => {
            const n = parseInt(args);
            if (isNaN(n) || n < 2) return "❗ Usage: prime 7";
            for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return `❌ ${n} is not prime.`;
            return `✅ ${n} is a prime number!`;
        }
    },
    'length': {
        description: 'Get length of your text. Usage: length your text',
        aliases: [],
        execute: (args) => args ? `🔢 Length: ${args.length}` : "❗ Usage: length your text"
    },
    'uppercase': {
        description: 'Convert text to uppercase. Usage: uppercase your text',
        aliases: ['upper'],
        execute: (args) => args ? args.toUpperCase() : "❗ Usage: uppercase your text"
    },
    'lowercase': {
        description: 'Convert text to lowercase. Usage: lowercase your text',
        aliases: ['lower'],
        execute: (args) => args ? args.toLowerCase() : "❗ Usage: lowercase your text"
    },
    'repeat': {
        description: 'Repeat your text. Usage: repeat your text',
        aliases: [],
        execute: (args) => args ? `${args} ${args}` : "❗ Usage: repeat your text"
    },
    'sum': {
        description: 'Sum numbers. Usage: sum 1 2 3',
        aliases: [],
        execute: (args) => {
            const nums = args.split(' ').map(Number).filter(n => !isNaN(n));
            if (!nums.length) return "❗ Usage: sum 1 2 3";
            return `➕ Sum: ${nums.reduce((a, b) => a + b, 0)}`;
        }
    },
    'multiply': {
        description: 'Multiply numbers. Usage: multiply 2 3 4',
        aliases: [],
        execute: (args) => {
            const nums = args.split(' ').map(Number).filter(n => !isNaN(n));
            if (!nums.length) return "❗ Usage: multiply 2 3 4";
            return `✖️ Product: ${nums.reduce((a, b) => a * b, 1)}`;
        }
    },
    'divide': {
        description: 'Divide two numbers. Usage: divide 10 2',
        aliases: [],
        execute: (args) => {
            const nums = args.split(' ').map(Number).filter(n => !isNaN(n));
            if (nums.length !== 2) return "❗ Usage: divide 10 2";
            if (nums[1] === 0) return "❌ Cannot divide by zero.";
            return `➗ Result: ${nums[0] / nums[1]}`;
        }
    },
    'subtract': {
        description: 'Subtract two numbers. Usage: subtract 10 2',
        aliases: [],
        execute: (args) => {
            const nums = args.split(' ').map(Number).filter(n => !isNaN(n));
            if (nums.length !== 2) return "❗ Usage: subtract 10 2";
            return `➖ Result: ${nums[0] - nums[1]}`;
        }
    },
    'square': {
        description: 'Square a number. Usage: square 5',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: square 5";
            return `⬛ Square: ${n * n}`;
        }
    },
    'cube': {
        description: 'Cube a number. Usage: cube 3',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: cube 3";
            return `🧊 Cube: ${n * n * n}`;
        }
    },
    'sqrt': {
        description: 'Square root. Usage: sqrt 16',
        aliases: ['root'],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: sqrt 16";
            return `√${n} = ${Math.sqrt(n)}`;
        }
    },
    'abs': {
        description: 'Absolute value. Usage: abs -5',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: abs -5";
            return `|${n}| = ${Math.abs(n)}`;
        }
    },
    'percent': {
        description: 'Percentage. Usage: percent 50 200',
        aliases: [],
        execute: (args) => {
            const nums = args.split(' ').map(Number).filter(n => !isNaN(n));
            if (nums.length !== 2) return "❗ Usage: percent 50 200";
            return `${nums[0]} is ${(nums[0] / nums[1] * 100).toFixed(2)}% of ${nums[1]}`;
        }
    },
    'reminder': {
        description: 'Set a reminder (simulated). Usage: reminder 5 Drink water',
        aliases: [],
        execute: (args) => {
            const [min, ...msg] = args.split(' ');
            const mins = parseInt(min);
            if (isNaN(mins) || !msg.length) return "❗ Usage: reminder 5 Drink water";
            setTimeout(() => appendMessage(`⏰ Reminder: ${msg.join(' ')}`, 'bot'), mins * 1000); // seconds for demo
            return `⏳ Reminder set for ${mins} seconds (demo)!`;
        }
    },
    'timer': {
        description: 'Set a timer (simulated). Usage: timer 10',
        aliases: [],
        execute: (args) => {
            const secs = parseInt(args);
            if (isNaN(secs)) return "❗ Usage: timer 10";
            setTimeout(() => appendMessage(`⏰ Timer done!`, 'bot'), secs * 1000);
            return `⏳ Timer set for ${secs} seconds!`;
        }
    },
    'sleep': {
        description: 'Simulate sleep (wait). Usage: sleep 3',
        aliases: [],
        execute: (args) => {
            const secs = parseInt(args);
            if (isNaN(secs)) return "❗ Usage: sleep 3";
            return new Promise(resolve => setTimeout(() => resolve("😴 Done sleeping!"), secs * 1000));
        }
    },
    'rgb': {
        description: 'Show RGB color. Usage: rgb 255 0 0',
        aliases: [],
        execute: (args) => {
            const nums = args.split(' ').map(Number);
            if (nums.length !== 3 || nums.some(n => isNaN(n) || n < 0 || n > 255)) return "❗ Usage: rgb 255 0 0";
            return `<span style="color:rgb(${nums.join(',')})">🎨 This is your color!</span>`;
        }
    },
    'age': {
        description: 'Calculate age. Usage: age 2000',
        aliases: [],
        execute: (args) => {
            const year = parseInt(args);
            if (isNaN(year) || year > new Date().getFullYear()) return "❗ Usage: age 2000";
            return `🎂 You are ${new Date().getFullYear() - year} years old!`;
        }
    },
    'month': {
        description: 'Get current month',
        aliases: [],
        execute: () => `🗓️ Current month: ${new Date().toLocaleString('default', { month: 'long' })}`
    },
    'day': {
        description: 'Get current day',
        aliases: [],
        execute: () => `📅 Today is: ${new Date().toLocaleString('default', { weekday: 'long' })}`
    },
    'emoji': {
        description: 'Get a random emoji',
        aliases: [],
        execute: () => {
            const emojis = ['😀','😂','😎','😍','🤖','🎉','🔥','🌟','🍕','🚀','🐱','🐶','🍀','⚡','🎲','🎵','🏆','💡','📚','🧠'];
            return emojis[Math.floor(Math.random() * emojis.length)];
        }
    },
    'password': {
        description: 'Generate a random password',
        aliases: [],
        execute: () => {
            const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
            let pass = '';
            for (let i = 0; i < 12; i++) pass += chars[Math.floor(Math.random() * chars.length)];
            return `🔐 Your password: <code>${pass}</code>`;
        }
    },
    'url': {
        description: 'Validate a URL. Usage: url https://example.com',
        aliases: [],
        execute: (args) => {
            try {
                new URL(args);
                return `✅ Valid URL!`;
            } catch {
                return `❌ Invalid URL.`;
            }
        }
    },
    'email': {
        description: 'Validate an email. Usage: email test@example.com',
        aliases: [],
        execute: (args) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(args) ? '✅ Valid email!' : '❌ Invalid email.'
    },
    'count': {
        description: 'Count words/letters. Usage: count your text',
        aliases: [],
        execute: (args) => args ? `Words: ${args.trim().split(/\s+/).length}, Letters: ${args.replace(/\s/g, '').length}` : "❗ Usage: count your text"
    },
    'capitalize': {
        description: 'Capitalize each word. Usage: capitalize your text',
        aliases: [],
        execute: (args) => args ? args.replace(/\b\w/g, c => c.toUpperCase()) : "❗ Usage: capitalize your text"
    },
    'shout': {
        description: 'Shout your text. Usage: shout your text',
        aliases: [],
        execute: (args) => args ? args.toUpperCase() + '!!!' : "❗ Usage: shout your text"
    },
    'whisper': {
        description: 'Whisper your text. Usage: whisper your text',
        aliases: [],
        execute: (args) => args ? args.toLowerCase() + '...' : "❗ Usage: whisper your text"
    },
    'ascii': {
        description: 'Show ASCII codes. Usage: ascii text',
        aliases: [],
        execute: (args) => args ? args.split('').map(c => c.charCodeAt(0)).join(' ') : "❗ Usage: ascii text"
    },
    'pi': {
        description: 'Show value of Pi',
        aliases: [],
        execute: () => `π = ${Math.PI}`
    },
    'e': {
        description: 'Show value of Euler\'s number',
        aliases: [],
        execute: () => `e = ${Math.E}`
    },
    'log': {
        description: 'Natural log. Usage: log 10',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n) || n <= 0) return "❗ Usage: log 10";
            return `ln(${n}) = ${Math.log(n)}`;
        }
    },
    'exp': {
        description: 'Exponential. Usage: exp 2',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: exp 2";
            return `e^${n} = ${Math.exp(n)}`;
        }
    },
    'sin': {
        description: 'Sine. Usage: sin 90',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: sin 90";
            return `sin(${n}) = ${Math.sin(n * Math.PI / 180)}`;
        }
    },
    'cos': {
        description: 'Cosine. Usage: cos 60',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: cos 60";
            return `cos(${n}) = ${Math.cos(n * Math.PI / 180)}`;
        }
    },
    'tan': {
        description: 'Tangent. Usage: tan 45',
        aliases: [],
        execute: (args) => {
            const n = parseFloat(args);
            if (isNaN(n)) return "❗ Usage: tan 45";
            return `tan(${n}) = ${Math.tan(n * Math.PI / 180)}`;
        }
    },
    // ... add more unique commands as needed
};

// Generate 100+ dummy commands for demo
const extraCommands = {};
for (let i = 1; i <= 100; i++) {
    extraCommands[`command${i}`] = {
        description: `This is demo command number ${i}`,
        aliases: [`cmd${i}`, `c${i}`],
        execute: () => `✅ You triggered command${i}!`
    };
}

// Merge all commands
const commands = { ...baseCommands, ...extraCommands };

// Command processor
async function handleBotResponse(text) {
    // Math evaluation
    const mathResult = safeEval(text);
    if (mathResult !== null) {
        appendMessage(`🧮 ${text} = <strong>${mathResult}</strong>`, 'bot');
        return;
    }

    // Command matching (case-insensitive, no '/')
    const input = text.trim().toLowerCase();
    let found = null, foundKey = null, foundArgs = '';
    for (const [key, data] of Object.entries(commands)) {
        if (input === key || data.aliases.includes(input)) {
            found = data;
            foundKey = key;
            foundArgs = '';
            break;
        }
        // For commands with arguments
        if (input.startsWith(key + ' ')) {
            found = data;
            foundKey = key;
            foundArgs = text.slice(key.length + 1);
            break;
        }
        for (const alias of data.aliases) {
            if (input.startsWith(alias + ' ')) {
                found = data;
                foundKey = key;
                foundArgs = text.slice(alias.length + 1);
                break;
            }
        }
        if (found) break;
    }

    if (found) {
        let output = found.execute(foundArgs.trim());
        if (output instanceof Promise) output = await output;
        if (output) appendMessage(output, 'bot');
        return;
    }

    // Greetings (hi/hello/hey)
    if (/^(hi|hello|hey|yo|hola)\b/i.test(input)) {
        appendMessage("👋 Hello Abhiuday Pratap Singh! How can I help you today?", 'bot');
        return;
    }

    // Fallback
    appendMessage(`🤔 I didn't understand that. Type <strong>help</strong> to see what I can do.`, 'bot');
}
