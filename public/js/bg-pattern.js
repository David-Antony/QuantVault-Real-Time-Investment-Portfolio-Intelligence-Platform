/**
 * Dynamic Hexagonal Geometric Background with Neon Pulses
 * This script generates a responsive honeycomb pattern and animates glowing
 * neon paths that randomly traverse the edges of the geometry.
 */
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    // Grid settings
    const HEX_SIZE = 45; // radius
    const HEX_WIDTH = Math.sqrt(3) * HEX_SIZE;
    const HEX_HEIGHT = 2 * HEX_SIZE;
    const Y_OFFSET = HEX_HEIGHT * 0.75;
    
    // Store vertices and edges for pathing
    let vertices = []; // {x, y, id}
    let edges = []; // {v1, v2} (indices of vertices)
    let adjList = new Map(); // vId -> [vId1, vId2...]
    
    // Pulses
    let pulses = []; // {path: [vId1, vId2...], progress: 0, speed: 0.05, color: '#38BDF8', alpha: 1}
    
    // Styling colors
    let gridColor = 'rgba(255, 255, 255, 0.08)';
    let neonColors = ['#38BDF8', '#818CF8', '#10B981']; // Cyan, Purple, Emerald
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        
        // Detect theme to adjust grid color
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';
        gridColor = isLightMode ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)';
        
        buildGrid();
    }
    
    function getVertexId(x, y) {
        return `${Math.round(x)},${Math.round(y)}`;
    }
    
    function addEdge(x1, y1, x2, y2) {
        const id1 = getVertexId(x1, y1);
        const id2 = getVertexId(x2, y2);
        
        if (!adjList.has(id1)) adjList.set(id1, {x: x1, y: y1, neighbors: new Set()});
        if (!adjList.has(id2)) adjList.set(id2, {x: x2, y: y2, neighbors: new Set()});
        
        adjList.get(id1).neighbors.add(id2);
        adjList.get(id2).neighbors.add(id1);
    }
    
    function buildGrid() {
        adjList.clear();
        const cols = Math.ceil(width / HEX_WIDTH) + 1;
        const rows = Math.ceil(height / Y_OFFSET) + 1;
        
        for (let row = -1; row < rows; row++) {
            for (let col = -1; col < cols; col++) {
                let x = col * HEX_WIDTH;
                let y = row * Y_OFFSET;
                
                // Offset odd rows
                if (row % 2 !== 0) {
                    x += HEX_WIDTH / 2;
                }
                
                // Calculate 6 vertices of hexagon
                let hexVertices = [];
                for (let i = 0; i < 6; i++) {
                    const angle_deg = 60 * i - 30;
                    const angle_rad = Math.PI / 180 * angle_deg;
                    const vx = x + HEX_SIZE * Math.cos(angle_rad);
                    const vy = y + HEX_SIZE * Math.sin(angle_rad);
                    hexVertices.push({x: vx, y: vy});
                }
                
                // Add edges
                for (let i = 0; i < 6; i++) {
                    const v1 = hexVertices[i];
                    const v2 = hexVertices[(i + 1) % 6];
                    addEdge(v1.x, v1.y, v2.x, v2.y);
                }
            }
        }
    }
    
    function spawnPulse() {
        const verticesArray = Array.from(adjList.keys());
        if (verticesArray.length === 0) return;
        
        // Pick a random starting vertex on the edge of the screen if possible
        const startId = verticesArray[Math.floor(Math.random() * verticesArray.length)];
        
        // Generate a random walk path
        let path = [startId];
        let currentId = startId;
        let length = Math.floor(Math.random() * 8) + 5; // Path length 5-12 segments
        
        for (let i = 0; i < length; i++) {
            const node = adjList.get(currentId);
            const neighbors = Array.from(node.neighbors);
            // Avoid going back exactly where we came from if possible
            const validNeighbors = neighbors.filter(n => n !== path[path.length - 2]);
            const nextOptions = validNeighbors.length > 0 ? validNeighbors : neighbors;
            
            const nextId = nextOptions[Math.floor(Math.random() * nextOptions.length)];
            path.push(nextId);
            currentId = nextId;
        }
        
        pulses.push({
            path: path,
            progress: 0, // 0 to path.length - 1
            speed: (Math.random() * 0.02) + 0.015,
            color: neonColors[Math.floor(Math.random() * neonColors.length)],
            alpha: 1
        });
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // 1. Draw static grid
        ctx.beginPath();
        let drawnEdges = new Set();
        
        for (let [id, node] of adjList.entries()) {
            for (let neighborId of node.neighbors) {
                // Ensure edge is drawn only once
                const edgeKey = [id, neighborId].sort().join('-');
                if (!drawnEdges.has(edgeKey)) {
                    drawnEdges.add(edgeKey);
                    const neighborNode = adjList.get(neighborId);
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(neighborNode.x, neighborNode.y);
                }
            }
        }
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // 2. Draw and update pulses
        for (let i = pulses.length - 1; i >= 0; i--) {
            let p = pulses[i];
            
            // Current segment index
            let segIndex = Math.floor(p.progress);
            let localProgress = p.progress - segIndex;
            
            if (segIndex >= p.path.length - 1) {
                // Fade out at end of path
                p.alpha -= 0.05;
                if (p.alpha <= 0) {
                    pulses.splice(i, 1);
                    continue;
                }
                segIndex = p.path.length - 2;
                localProgress = 1; // Stay at end
            }
            
            const startNode = adjList.get(p.path[segIndex]);
            const endNode = adjList.get(p.path[segIndex + 1]);
            
            if (!startNode || !endNode) {
                pulses.splice(i, 1);
                continue;
            }
            
            // Calculate current position of the head of the pulse
            const hx = startNode.x + (endNode.x - startNode.x) * localProgress;
            const hy = startNode.y + (endNode.y - startNode.y) * localProgress;
            
            // Draw pulse trail (trailing behind by about 1.5 segments)
            ctx.beginPath();
            let trailLength = 1.5;
            let drawProgress = p.progress;
            
            ctx.moveTo(hx, hy);
            
            while (trailLength > 0 && drawProgress > 0) {
                let sIdx = Math.floor(drawProgress);
                if (sIdx >= p.path.length - 1) sIdx = p.path.length - 2;
                
                let sLocal = drawProgress - sIdx;
                let sStart = adjList.get(p.path[sIdx]);
                let sEnd = adjList.get(p.path[sIdx + 1]);
                
                if(!sStart || !sEnd) break;
                
                let tx = sStart.x + (sEnd.x - sStart.x) * sLocal;
                let ty = sStart.y + (sEnd.y - sStart.y) * sLocal;
                
                ctx.lineTo(tx, ty);
                
                // Step back
                let step = Math.min(sLocal, trailLength);
                if (sLocal === 0) step = Math.min(1, trailLength); // At exact vertex
                
                drawProgress -= step;
                trailLength -= step;
            }
            
            // Render Neon Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = p.alpha;
            ctx.stroke();
            
            // Render bright core
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.globalAlpha = 1;
            
            // Update progress
            p.progress += p.speed;
        }
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    
    // Init
    resize();
    draw();
    
    // Spawn pulses randomly
    setInterval(() => {
        // Spawn 1-3 pulses at random times
        if (Math.random() > 0.3) {
            spawnPulse();
        }
    }, 800);
});
