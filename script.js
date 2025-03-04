const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to a smaller, fixed size
canvas.width = 550;
canvas.height = 300;

// Add blinking functionality for the <blink> tag (classic 2000s feature)
setInterval(() => {
    const blinkElements = document.querySelectorAll('blink');
    blinkElements.forEach(element => {
        element.style.visibility = element.style.visibility === 'hidden' ? 'visible' : 'hidden';
    });
}, 500);

// Add early 2000s cursor trail effect
const cursorTrail = [];
const maxTrailLength = 20;
const trailColor = ['#ff0000', '#ff9900', '#ffff00', '#33cc33', '#3399ff', '#9933ff'];

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({
        x: e.clientX,
        y: e.clientY,
        color: trailColor[Math.floor(Math.random() * trailColor.length)]
    });
    
    if (cursorTrail.length > maxTrailLength) {
        cursorTrail.shift();
    }
});

// Function to draw the cursor trail
function drawCursorTrail() {
    for (let i = 0; i < cursorTrail.length; i++) {
        const point = cursorTrail[i];
        const size = (i / cursorTrail.length) * 15;
        
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${point.x}px`;
        div.style.top = `${point.y}px`;
        div.style.width = `${size}px`;
        div.style.height = `${size}px`;
        div.style.borderRadius = '50%';
        div.style.backgroundColor = point.color;
        div.style.pointerEvents = 'none';
        div.style.zIndex = '9999';
        div.style.opacity = i / cursorTrail.length;
        div.className = 'cursor-trail';
        
        document.body.appendChild(div);
        
        setTimeout(() => {
            div.remove();
        }, 500);
    }
}

// Run cursor trail effect
setInterval(drawCursorTrail, 50);

// Update button effects
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => {
    button.addEventListener('mouseover', () => {
        button.style.border = '2px inset #ff9900';
    });
    button.addEventListener('mouseout', () => {
        button.style.border = '2px outset #ff9900';
    });
    button.addEventListener('click', () => {
        alert('This page is still under construction! Check back soon!');
    });
});

// Bouncing text class
class BouncingText {
    constructor(text, x, y, color) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.fontSize = 16;
        // Random velocity
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
        // Calculate width of text
        ctx.font = `${this.fontSize}px "Comic Sans MS", cursive`;
        this.width = ctx.measureText(this.text).width;
        this.height = this.fontSize;
    }

    draw() {
        ctx.font = `${this.fontSize}px "Comic Sans MS", cursive`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.text, this.x, this.y);
    }

    update(texts) {
        // Bounce off walls
        if (this.x + this.width > canvas.width || this.x < 0) {
            this.dx = -this.dx;
        }
        if (this.y > canvas.height || this.y - this.height < 0) {
            this.dy = -this.dy;
        }

        // Check collision with other texts
        for (let text of texts) {
            if (text === this) continue;
            
            // Simple bounding box collision
            if (this.x < text.x + text.width &&
                this.x + this.width > text.x &&
                this.y - this.height < text.y &&
                this.y > text.y - text.height) {
                
                // Swap velocities for simple collision response
                const tempDx = this.dx;
                const tempDy = this.dy;
                this.dx = text.dx;
                this.dy = text.dy;
                text.dx = tempDx;
                text.dy = tempDy;
            }
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create bouncing texts with early 2000s messages
const bouncingTexts = [];
const colors = ['#FFD700', '#0F0', '#FF00FF', '#00FFFF', '#FF0000', '#FFFFFF', '#FFA500', '#1E90FF', '#32CD32', '#FF69B4'];
const messages = [
    "Welcome!",
    "Early 2000s",
    "Awesome Site",
    "Under Construction",
    "Netscape Now!",
    "IE 5.0",
    "Sign Guestbook",
    "Flash Player",
    "Java Applet",
    "Alev, bir alevidir."
];

for (let i = 0; i < messages.length; i++) {
    const x = Math.random() * (canvas.width - 200) + 100;
    const y = Math.random() * (canvas.height - 50) + 25;
    bouncingTexts.push(new BouncingText(messages[i], x, y, colors[i]));
}

// Animation loop
function animate() {
    // Clear the canvas with solid black
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw all texts
    for (let text of bouncingTexts) {
        text.update(bouncingTexts);
    }

    requestAnimationFrame(animate);
}

// Start animation
animate();

// Add visitor counter functionality
let visitorCount = 1337;
setInterval(() => {
    visitorCount++;
    const counter = document.querySelector('.counter p');
    if (counter) {
        counter.textContent = `You are visitor number: ${visitorCount}`;
    }
}, 30000); // Increase visitor count every 30 seconds 