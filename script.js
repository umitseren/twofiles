const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to a smaller, fixed size
canvas.width = 600;
canvas.height = 400;

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
        ctx.font = `${this.fontSize}px Arial`;
        this.width = ctx.measureText(this.text).width;
        this.height = this.fontSize;
    }

    draw() {
        ctx.font = `${this.fontSize}px Arial`;
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

// Create 10 bouncing texts
const bouncingTexts = [];
const colors = ['#FFD700', '#0F0', '#FF00FF', '#00FFFF', '#FF0000', '#FFFFFF', '#FFA500', '#1E90FF', '#32CD32', '#FF69B4'];

for (let i = 0; i < 10; i++) {
    const x = Math.random() * (canvas.width - 200) + 100;
    const y = Math.random() * (canvas.height - 50) + 25;
    bouncingTexts.push(new BouncingText("Alev, bir alevidir.", x, y, colors[i]));
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