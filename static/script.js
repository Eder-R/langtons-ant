
const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const stepsDisplay = document.getElementById("steps");
const startButton = document.getElementById("start");
const stepButton = document.getElementById("step");
const resetButton = document.getElementById("reset");
const speedInput = document.getElementById("speed");

let state = null;
let running = false;
let timer = null;

const CELL_SIZE = 26;
const VISIBLE_CELLS = 25;


async function requestAPI(endpoint) {
    const response = await fetch(endpoint, {
        method: endpoint === "/api/state" ? "GET" : "POST"
    });

    if (!response.ok) {
        throw new Error("Falha na comunicação com o servidor.");
    }

    return await response.json();
}


function draw() {
    if (!state) return;

    const ratio = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * ratio;
    canvas.height = canvas.clientHeight * ratio;

    ctx.scale(ratio, ratio);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    ctx.fillStyle = "#111d31";
    ctx.fillRect(0, 0, width, height);

    const size = Math.min(
        CELL_SIZE,
        width / VISIBLE_CELLS,
        height / VISIBLE_CELLS
    );

    const columns = Math.ceil(width / size);
    const rows = Math.ceil(height / size);

    const ant = state.ant;

    const startX = Math.floor(ant.x - columns / 2);
    const startY = Math.floor(ant.y - rows / 2);

    // Desenha a grade
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {

            const x = col + startX;
            const y = row + startY;

            const screenX = (width - columns * size) / 2 + col * size;
            const screenY = (height - rows * size) / 2 + row * size;

            ctx.fillStyle = "#192941";

            ctx.beginPath();
            ctx.roundRect(
                screenX + 1,
                screenY + 1,
                size - 2,
                size - 2,
                5
            );
            ctx.fill();
        }
    }

    // Desenha os quadrados acesos
    for (const cell of state.active_cells) {

        const col = cell.x - startX;
        const row = cell.y - startY;

        if (
            col < 0 || col >= columns ||
            row < 0 || row >= rows
        ) continue;

        const screenX = (width - columns * size) / 2 + col * size;
        const screenY = (height - rows * size) / 2 + row * size;

        ctx.fillStyle = "#ffcc42";
        ctx.shadowColor = "#ffcc42";
        ctx.shadowBlur = 9;

        ctx.beginPath();
        ctx.roundRect(
            screenX + 2,
            screenY + 2,
            size - 4,
            size - 4,
            6
        );
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    // Desenha a formiga
    const antX = width / 2;
    const antY = height / 2;

    ctx.save();
    ctx.translate(antX, antY);

    // Direções: 0 Norte, 1 Leste, 2 Sul, 3 Oeste
    ctx.rotate(ant.direction * Math.PI / 2);

    ctx.font = `${size * 0.85}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 12;

    ctx.fillText("🐜", 0, 0);

    ctx.restore();

    stepsDisplay.textContent = ant.steps;
}


async function advance() {
    state = await requestAPI("/api/step");
    draw();
}


function stop() {
    running = false;
    clearTimeout(timer);
    startButton.textContent = "Iniciar";
}


function schedule() {
    if (!running) return;

    timer = setTimeout(async () => {
        try {
            await advance();
            schedule();
        } catch (error) {
            console.error(error);
            stop();
        }
    }, 1010 - Number(speedInput.value) * 10);
}


// Iniciar ou pausar
startButton.addEventListener("click", () => {
    running = !running;

    startButton.textContent = running ? "Pausar" : "Iniciar";

    if (running) schedule();
    else clearTimeout(timer);
});


// Avançar um passo
stepButton.addEventListener("click", async () => {
    if (running) return;

    try {
        await advance();
    } catch (error) {
        console.error(error);
    }
});


// Reiniciar
resetButton.addEventListener("click", async () => {
    stop();

    try {
        state = await requestAPI("/api/reset");
        draw();
    } catch (error) {
        console.error(error);
    }
});


// Ajustar velocidade durante a execução
speedInput.addEventListener("input", () => {
    if (running) {
        clearTimeout(timer);
        schedule();
    }
});


// Ajustar grade quando a janela mudar de tamanho
window.addEventListener("resize", draw);


// Inicialização
async function initialize() {
    try {
        state = await requestAPI("/api/state");
        draw();
    } catch (error) {
        console.error(error);
        alert("Não foi possível conectar ao servidor Python.");
    }
}

initialize();
