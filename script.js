//Abrir e Fechar o Popup
function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

// pegar elemento canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

//Dimensões do canva
canvas.width = 700;
canvas.height = 400;

// Define os tanques e suas posições iniciais
var tank1 = {
    x: 50,
    y: canvas.height - 375,
    width: 60,
    height: 50,
    color: "darkblue"
};

var tank2 = {
    x: canvas.width - 100,
    y: canvas.height - 80,
    width: 60,
    height: 50,
    color: "red"
};

// Desenha os tanques no canvas
function drawTank(tank) {
    ctx.fillStyle = tank.color;
    ctx.fillRect(tank.x, tank.y, tank.width, tank.height);
}

drawTank(tank1);
drawTank(tank2);

// Move os tanques com as teclas do teclado
document.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
        
        //Controle Player 1
        case 37: // Esquerda
            tank2.x -= 15;
            break;
        case 39: // Direita
            tank2.x += 15;
            break;
        case 38: // Cima
            tank2.y += -15;
            break;
        case 40: // Baixo
            tank2.y += 15;
            break;

        //Controle Player 2
        case 65: // A
            tank1.x -= 15;
            break;
        case 68: // D
            tank1.x += 15;
            break;
        case 87: // W
            tank1.y += -15;
            break;
        case 83: // S
            tank1.y += 15;
            break;
    }
});

// Atualiza a posição dos tanques no canvas
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTank(tank1);
    drawTank(tank2);
}

setInterval(update, 10);

// Define a classe Bullet para representar as balas
class Bullet {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
    }

    // Desenha a bala no canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.closePath();
    }

    // Atualiza a posição da bala com base em sua velocidade
    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// Cria uma lista para armazenar as balas disparadas pelos tanques
var bullets = [];

// Adiciona a lógica para disparar com os tanques
document.addEventListener("keydown", function(event) {
    switch(event.keyCode) {
        case 32: // Barra de espaço
            // Cria uma bala na posição do tanque que atirou com uma velocidade para cima
            bullets.push(new Bullet(tank1.x + tank1.width / 2, tank1.y - 8, {x: 10, y: 1}));
            break;
        case 13: // Enter
            // Cria uma bala na posição do tanque que atirou com uma velocidade para baixo
            bullets.push(new Bullet(tank2.x + tank2.width / 2, tank2.y + tank2.height - 8, {x: -10, y: 1}));
            break;
    }
});

// Desenha as balas no canvas e atualiza suas posições
function updateBullets() {
    for (var i = 0; i < bullets.length; i++) {
        var bullet = bullets[i];
        bullet.draw();
        bullet.update();
    }
}

setInterval(updateBullets, 10);

function checkCollisions() {
    if (intersects(tank1, tank2)) {
        // Se os tanques se sobrepõem, o jogo acaba e o tanque atingido perde
        alert("Game over! Os tanques se sobreporam.");
        restartGame();
    }
    
    // Verifica se o tanque 1 foi atingido
    bullets.forEach(function(bullet) {
        if (intersects(tank1, {
            x: bullet.x - 50,
            y: bullet.y - 375,
            width: 60,
            height: 50
        })) {
            // Se o tanque 1 foi atingido, o jogo acaba e o tanque 2 vence
            alert("Game over! Tanque 2 venceu.");
            restartGame();
        }
    });
    
    // Verifica se o tanque 2 foi atingido
    bullets.forEach(function(bullet) {
        if (intersects(tank2, {
            x: bullet.x - 100,
            y: bullet.y - 80,
            width: 60,
            height: 50
        })) {
            // Se o tanque 2 foi atingido, o jogo acaba e o tanque 1 vence
            alert("Game over! Tanque 1 venceu.");
            restartGame();
        }
    });
}


// Verifica se dois retângulos se sobrepõem
function intersects(rect1, rect2) {
    return !(rect1.x + rect1.width < rect2.x ||
             rect2.x + rect2.width < rect1.x ||
             rect1.y + rect1.height < rect2.y ||
             rect2.y + rect2.height < rect1.y);
}

// Verifica as colisões a cada 200 milissegundos
setInterval(checkCollisions, 200);


function restartGame() {
    // Reinicia a posição dos tanques
    tank1.x = 50;
    tank1.y = canvas.height - 375;
    tank2.x = canvas.width - 100;
    tank2.y = canvas.height - 80;
    
    // Limpa a lista de balas
    bullets = [];
    
    // // Remove o alerta de game over, caso exista
    // var alerts = document.querySelectorAll(".alert");
    // for (var i = 0; i < alerts.length; i++) {
    //     alerts[i].remove();
    // }
    
    // Reinicia o jogo
    setInterval(update, 10);
    setInterval(updateBullets, 10);
    setInterval(checkCollisions, 10);
}
