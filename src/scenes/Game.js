import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.lives = 3;          // Mario comienza con 3 vidas
        this.score = 0;          // Contador de puntos
        this.isFloating = false;
        this.floatTimer = null;
    }

    create() {
        // Fondo y piso
        this.cameras.main.setBackgroundColor('#00000a');
        
        // Crear grupo de plataformas
        this.platforms = this.physics.add.staticGroup();
        
        // Agregar suelo principal
        for (let x = 0; x < 1024; x += 50) {
            this.platforms.create(x, 770, 'floorbricks');
        }
        
        // Generar escalones de las plataformas con bucles (ya tenés la misma lógica)
        // Plataforma en forma de escalera (usando un bucle)
        let startX = 860; 
        let startY = 685;
        let stepX = -90;
        let stepY = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX + (i * stepX), startY + (i * stepY), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        
        // Plataforma 01
        let startX1 = 180;
        let startY1 = 580;
        let stepX1 = 90;
        let stepY1 = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX1 + (i * stepX1), startY1 + (i * stepY1), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        
        // Plataforma 02
        let startX2 = 845;
        let startY2 = 470;
        let stepX2 = -90;
        let stepY2 = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX2 + (i * stepX2), startY2 + (i * stepY2), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        
        // Plataforma 03
        let startX3 = 180;
        let startY3 = 370;
        let stepX3 = 90;
        let stepY3 = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX3 + (i * stepX3), startY3 + (i * stepY3), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        
        // Plataforma 04
        let startX4 = 815;
        let startY4 = 270;
        let stepX4 = -85;
        let stepY4 = -9;
        for (let i = 0; i < 8; i++) {
            let escalon = this.platforms.create(startX4 + (i * stepX4), startY4 + (i * stepY4), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        
        this.platforms.create(135, 207, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(320, 130, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(410, 105, 'floorbricks').setScale(0.7).refreshBody();
        
        // Configuración de puntuación visual
        this.scoreText = this.add.text(800, 20, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Crear Mario con físicas
        this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.8);
        this.mario.setBounce(0.1);
        this.mario.setCollideWorldBounds(true);
        this.mario.body.setGravityY(300);
        
        // Colisión con plataformas (la callback se usa para detectar escalera y evitar empuje)
        this.physics.add.collider(this.mario, this.platforms, this.handlePlatformCollision, null, this);
        
        // Ajustar cuerpo para facilitar el movimiento en escalones
        this.mario.body.setSize(this.mario.width * 0.6, this.mario.height * 0.5);
        this.mario.body.setOffset(this.mario.width * 0.2, this.mario.height * 0.5);
        
        // Crear animaciones de Mario
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'mario', frame: 0 }],
            frameRate: 10
        });
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'mario', frame: 5 }],
            frameRate: 2
        });

        // Teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.mario.play('idle');

        // Crear a Donkey Kong
        this.dk = this.physics.add.sprite(200, 150, 'dk').setScale(2.9);
        this.dk.setBounce(0.1);
        this.dk.setCollideWorldBounds(true);
        this.physics.add.collider(this.dk, this.platforms);
        this.anims.create({
            key: 'dk_idle',
            frames: this.anims.generateFrameNumbers('dk', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: -1
        });
        this.dk.play('dk_idle');

        // Crear a Pauline
        this.pauline = this.physics.add.sprite(320, 100, 'pauline').setScale(2);
        this.pauline.setBounce(0.1);
        this.pauline.setCollideWorldBounds(true);
        this.physics.add.collider(this.pauline, this.platforms);
        this.anims.create({
            key: 'pauline_idle',
            frames: this.anims.generateFrameNumbers('pauline', { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        this.pauline.play('pauline_idle');

        // Agregar oil
        this.oil = this.physics.add.sprite(180, 720, 'oil').setScale(2.6);
        this.physics.add.collider(this.oil, this.platforms);
        this.anims.create({
            key: 'oil',
            frames: this.anims.generateFrameNumbers('oil', { start: 1, end: 2 }),
            frameRate: 3,
            repeat: -1
        });
        this.oil.play('oil');

        // Crear grupo de escaleras y generar escalera(s) con la función generateLadder
        this.stairs = this.physics.add.staticGroup();
        // Por ejemplo, genera una escalera en (500,680) con 5 escalones y separación de 32px
        this.generateLadder(380, 740, 3, 32);//primera plataforma
        this.generateLadder(830, 730, 2, 32);
        this.generateLadder(245, 640, 3, 32);//segunda plataforma
        this.generateLadder(450, 640, 3, 32);
        this.generateLadder(350, 550, 4, 32);//tercera plataforma
        this.generateLadder(500, 530, 3, 32);
        this.generateLadder(830, 510, 2, 32);
        this.generateLadder(390, 430, 3, 32);//cuarta plataforma
        this.generateLadder(245, 430, 3, 32);
        this.generateLadder(780, 450, 4, 32);
        this.generateLadder(450, 330, 4, 32);//quinta plataforma
        this.generateLadder(830, 310, 2, 32);
        
        

        // Ajustar la profundidad de la escalera para que Mario se muestre por encima
        this.stairs.children.iterate((ladder) => {
            ladder.setDepth(0);
        });
        this.mario.setDepth(1);

        this.onStairs = false;
        // Detección de escalera por overlap (con alineación ±10px)
        this.physics.add.overlap(this.mario, this.stairs, (mario, ladder) => {
            if (Math.abs(mario.x - ladder.x) < 10) {
                this.onStairs = true;
            }
        }, null, this);

        // Crear grupo de barriles
        this.barrels = this.physics.add.group();
        this.anims.create({
            key: 'barrelRoll',
            frames: this.anims.generateFrameNumbers('barrel', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.physics.add.collider(this.mario, this.barrels, this.hitByBarrel, null, this);
        this.barrelHeights = [675, 570, 460, 360, 260];
        this.time.addEvent({
            delay: 3000,
            loop: true,
            callback: this.throwBarrel,
            callbackScope: this
        });

        // Crear grupo de martillos
        this.hammers = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        this.hammers.create(150, 260, 'hammer').setScale(2.8);
        this.hammers.create(150, 500, 'hammer').setScale(2.8);
        this.hasHammer = false;
        this.physics.add.overlap(this.mario, this.hammers, this.pickUpHammer, null, this);
    }

    // Función modular para generar escaleras
    generateLadder(x, y, numSteps, stepSpacing = 32, key = 'ladder') {
        for (let i = 0; i < numSteps; i++) {
            this.stairs.create(x, y - i * stepSpacing, key);
        }
    }

    throwBarrel() {
        let barrel = this.barrels.create(this.dk.x, this.dk.y + 20, 'barrel');
        barrel.setScale(3);
        barrel.setBounce(0.2);
        barrel.setVelocityX(100);
        barrel.setGravityY(300);
        barrel.direction = 1;
        this.physics.add.collider(barrel, this.platforms);
        barrel.play('barrelRoll');
        barrel.scored = false;
    }

    hitByBarrel(mario, barrel) {
        if (this.hasHammer) {
            barrel.destroy();
            this.score += 100;
            this.scoreText.setText('Score: ' + this.score);
            return;
        }
    
        this.lives -= 1;
        console.log(`Vidas restantes: ${this.lives}`);
        if (this.lives <= 0) {
            this.scene.start('GameOver');
        } else {
            this.mario.setX(250);
            this.mario.setY(710);
        }
    }
    
    pickUpHammer(mario, hammer) {
        hammer.disableBody(true, true);
        this.hasHammer = true;
        mario.setTint(0xffff00);
        this.time.delayedCall(8000, () => {
            this.hasHammer = false;
            mario.clearTint();
        });
    }
    
    update() {
        // Al comienzo, asumimos que no está en escalera
        this.onStairs = false;
        // Detectar overlap con cualquier escalera
        this.physics.overlap(this.mario, this.stairs, (mario, ladder) => {
            // Puedes ajustar la condición si necesitás una alineación específica
            if (Math.abs(mario.x - ladder.x) < 10) {
                this.onStairs = true;
            }
        }, null, this);
    
        // Movimiento horizontal
        this.mario.setVelocityX(0);
        if (this.cursors.left.isDown) {
            this.mario.setVelocityX(-160);
            this.mario.anims.play('walk', true);
            this.mario.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            this.mario.setVelocityX(160);
            this.mario.anims.play('walk', true);
            this.mario.setFlipX(false);
        } else {
            this.mario.anims.play('idle', true);
        }
    
        // Salto normal (solo si no está en escalera)
        if (this.cursors.up.isDown && this.mario.body.onFloor() && !this.onStairs) {
            this.mario.setVelocityY(-330);
            this.mario.anims.play('jump', true);
            this.isFloating = true;
            this.mario.body.setGravityY(100);
            if (this.floatTimer) this.floatTimer.remove();
            this.floatTimer = this.time.delayedCall(1000, () => {
                this.mario.body.setGravityY(300);
                this.isFloating = false;
            });
        }
    
        // Movimiento en escaleras
        if (this.onStairs) {
            // Desactivar la gravedad para movimiento vertical libre
            this.mario.body.setAllowGravity(false);
            this.mario.setVelocityY(0);
            // Si se presiona ↑, sube y deshabilitamos la colisión superior para poder atravesar la plataforma de arriba
            if (this.cursors.up.isDown) {
                this.mario.setVelocityY(-100);
                this.mario.body.checkCollision.up = false;
            } else if (this.cursors.down.isDown) {
                this.mario.setVelocityY(100);
                this.mario.body.checkCollision.up = true;
            } else {
                this.mario.body.checkCollision.up = true;
            }
        } else {
            this.mario.body.setAllowGravity(true);
            this.mario.body.checkCollision.up = true;
        }
    
        // Lógica de los barriles (sin cambios)
        this.barrels.children.iterate(barrel => {
            if (barrel) {
                this.barrelHeights.forEach(height => {
                    if (Math.abs(barrel.y - height) < 5) {
                        barrel.direction *= -1;
                        barrel.setVelocityX(100 * barrel.direction);
                    }
                });
    
                if (barrel.scored === undefined) {
                    barrel.scored = false;
                }
    
                if (
                    !barrel.scored &&
                    this.mario.body.velocity.y > 0 &&
                    barrel.y > this.mario.y &&
                    Math.abs(this.mario.x - barrel.x) < 50
                ) {
                    this.score += 100;
                    barrel.scored = true;
                    this.scoreText.setText('Score: ' + this.score);
                }
            }
        });
    }
    
       
    handlePlatformCollision(mario, platform) {
        // Si Mario está en escalera, no se aplica el empuje vertical (permite el ascenso)
        if (this.onStairs) return;
        
        if (mario.body.touching.right) {
            mario.setVelocityY(-150);
        } 
        if (mario.body.touching.left) {
            mario.setVelocityY(-150);
        }
    }
}
