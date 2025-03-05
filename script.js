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

// Bouncing text class with improved collision physics
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
        // Add mass property to improve collision physics
        this.mass = 1;
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
                
                // Calculate collision response vectors
                const vCollision = {
                    x: text.x - this.x,
                    y: text.y - this.y
                };
                
                // Calculate distance
                const distance = Math.sqrt(
                    (text.x - this.x) * (text.x - this.x) +
                    (text.y - this.y) * (text.y - this.y)
                );
                
                // Normalized collision vector
                const vCollisionNorm = {
                    x: vCollision.x / distance,
                    y: vCollision.y / distance
                };
                
                // Relative velocity
                const vRelativeVelocity = {
                    x: this.dx - text.dx,
                    y: this.dy - text.dy
                };
                
                // Calculate speed after collision
                const speed = vRelativeVelocity.x * vCollisionNorm.x +
                            vRelativeVelocity.y * vCollisionNorm.y;
                
                // If objects are moving away from each other, skip
                if (speed < 0) continue;
                
                // Calculate impulse scalar
                const impulse = 2 * speed / (this.mass + text.mass);
                
                // Apply impulse
                this.dx -= impulse * text.mass * vCollisionNorm.x;
                this.dy -= impulse * text.mass * vCollisionNorm.y;
                text.dx += impulse * this.mass * vCollisionNorm.x;
                text.dy += impulse * this.mass * vCollisionNorm.y;
                
                // Move objects apart to prevent sticking
                const overlap = this.width / 2 + text.width / 2 - distance;
                if (overlap > 0) {
                    this.x -= overlap * vCollisionNorm.x / 2;
                    this.y -= overlap * vCollisionNorm.y / 2;
                    text.x += overlap * vCollisionNorm.x / 2;
                    text.y += overlap * vCollisionNorm.y / 2;
                }
            }
        }

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }
}

// Create bouncing texts with the same message
const bouncingTexts = [];
const colors = ['#FFD700', '#0F0', '#FF00FF', '#00FFFF', '#FF0000', '#FFFFFF', '#FFA500'];
// All texts will be "Alev, bir alevidir" as requested
const message = "Alev, bir alevidir.";

// Create 7 instances of the same message with distinct starting positions
for (let i = 0; i < 7; i++) {
    // Use a more distributed approach for initial positions
    const sectionWidth = canvas.width / 3;
    const sectionHeight = canvas.height / 3;
    
    // Calculate position based on section grid to ensure better distribution
    const gridX = i % 3;
    const gridY = Math.floor(i / 3);
    
    const x = (gridX * sectionWidth) + (Math.random() * (sectionWidth - 100));
    const y = (gridY * sectionHeight) + (Math.random() * (sectionHeight - 30)) + 30;
    
    // Create more varied velocities
    const dx = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 1);
    const dy = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 1);
    
    // Create bouncing text with custom velocity
    const text = new BouncingText(message, x, y, colors[i]);
    
    // Override the default velocities
    text.dx = dx;
    text.dy = dy;
    
    bouncingTexts.push(text);
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