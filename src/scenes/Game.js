import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.lives = 3;          // Mario comienza con 3 vidas
        this.score = 0;          // Contador de puntos
        this.isFloating = false;
        this.floatTimer = null;
        this.isClimbing = false; // Flag para controlar animación de escalada
        this.firstBarrelThrown = false; // Para diferenciar el primer barril
        this.marioFoundPauline = false;  // ← NUEVO: flag para detectar proximidad
    }

    create() {
        // Fondo y piso
        this.cameras.main.setBackgroundColor('#00000a');

        // Crear grupo de plataformas
        this.platforms = this.physics.add.staticGroup();

        // Agregar suelo principal (incremento de 95 para evitar solapamientos)
        for (let x = 0; x < 1024; x += 95) {
            this.platforms.create(x, 770, 'floorbricks');
        }
        

        // Generar escalones de las plataformas con bucles
        let startX = 860; 
        let startY = 685;
        let stepX = -90;
        let stepY = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX + (i * stepX), startY + (i * stepY), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }

        let startX1 = 180;
        let startY1 = 580;
        let stepX1 = 90;
        let stepY1 = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX1 + (i * stepX1), startY1 + (i * stepY1), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }

        let startX2 = 845;
        let startY2 = 470;
        let stepX2 = -90;
        let stepY2 = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX2 + (i * stepX2), startY2 + (i * stepY2), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }

        let startX3 = 180;
        let startY3 = 370;
        let stepX3 = 90;
        let stepY3 = -3;
        for (let i = 0; i < 9; i++) {
            let escalon = this.platforms.create(startX3 + (i * stepX3), startY3 + (i * stepY3), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }

        let startX4 = 815;
        let startY4 = 270;
        let stepX4 = -85;
        let stepY4 = -9;
        for (let i = 0; i < 8; i++) {
            let escalon = this.platforms.create(startX4 + (i * stepX4), startY4 + (i * stepY4), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }

        this.platforms.create(135, 207, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(320, 145, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(410, 125, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(498, 125, 'floorbricks').setScale(0.7).refreshBody();

        // Configuración de la puntuación
        this.scoreText = this.add.text(800, 20, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        // Crear Mario con físicas
        this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.8);
        this.mario.setBounce(0.1);
        this.mario.setCollideWorldBounds(true);
        this.mario.body.setGravityY(300);

        // Colisión con plataformas
        this.physics.add.collider(this.mario, this.platforms, this.handlePlatformCollision, null, this);

        // Ajustar cuerpo para facilitar el movimiento en escalones
        this.mario.body.setSize(this.mario.width * 0.6, this.mario.height * 0.5);
        this.mario.body.setOffset(this.mario.width * 0.2, this.mario.height * 0.5);

        // Animaciones de Mario
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
        this.anims.create({
            key: 'climb',
            frames: this.anims.generateFrameNumbers('mario', { start: 4, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        // Animación para oil: reproducirá frames 1 y 2 cíclicamente
        this.anims.create({
            key: 'oilAnim',
            frames: this.anims.generateFrameNumbers('oil', { start: 1, end: 2 }),
            frameRate: 5,
            repeat: -1
        });

        // Animaciones para cuando Mario tiene martillo:
        this.anims.create({
            key: 'hammerIdle',
            frames: this.anims.generateFrameNumbers('mario', { start: 8, end: 9 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'hammerWalk',
            frames: this.anims.generateFrameNumbers('mario', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
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
        this.marioFoundPauline = false;  // ← NUEVO

        // Agregar oil: iniciamos en frame 0
        this.oil = this.physics.add.sprite(180, 720, 'oil').setScale(2.6);
        this.oil.setFrame(0);
        this.physics.add.collider(this.oil, this.platforms);
        // La animación "oilAnim" se activará al colisionar con el primer barril

        // Crear grupo de escaleras y generar escaleras
        this.stairs = this.physics.add.staticGroup();
        this.generateLadder(380, 715, 4, 16, "ladder", 4);    // primera plataforma
        this.generateLadder(860, 730, 4, 16, "ladder", 4);
        this.generateLadder(245, 640, 5, 16, "ladder", 4);    // segunda plataforma
        this.generateLadder(450, 648, 6, 16, "ladder", 4);
        this.generateLadder(350, 545, 7, 16, "ladder", 4);    // tercera plataforma
        this.generateLadder(500, 535, 6, 16, "ladder", 4);
        this.generateLadder(1640, 530, 9, 16, "ladder", 4);
        this.generateLadder(390, 425, 5, 16, "ladder", 4);    // cuarta plataforma
        this.generateLadder(245, 414, 4, 16, "ladder", 4);
        this.generateLadder(7160, 450, 4, 16, "ladder", 4);
        this.generateLadder(450, 258, 3, 16, "ladder", 4);    // quinta plataforma
        this.generateLadder(450, 340, 3, 16, "ladder", 4);
        this.generateLadder(630, 310, 5, 16, "ladder", 4);
        this.generateLadder(525, 185, 5, 16, "ladder", 4);    // última plataforma
        this.generateLadder(380, 190, 9, 16, "ladder", 4);    // plataforma pauline
        this.generateLadder(320, 190, 9, 16, "ladder", 4);    // plataforma pauline

        // Ajustar profundidad de escaleras para que Mario se muestre sobre ellas
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
        this.anims.create({
            key: 'barrelFirstAnim',
            frames: this.anims.generateFrameNumbers('barrel', { start: 4, end: 7 }), // Ajustá estos valores según tu spritesheet
            frameRate: 4,
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

    // Función para generar escaleras
    generateLadder(x, y, numSteps, stepSpacing = 32, key = 'ladder', scale = 1) {
        for (let i = 0; i < numSteps; i++) {
            this.stairs.create(x, y - i * stepSpacing, key).setScale(scale).refreshBody();
        }
    }

    throwBarrel() {
        let barrel;
        if (!this.firstBarrelThrown) {
            this.firstBarrelThrown = true;
            barrel = this.barrels.create(this.dk.x, this.dk.y + 20, 'barrel');
            barrel.setScale(3);
            barrel.setBounce(0.2);
            // Lanzar el primer barril verticalmente con velocidad menor
            barrel.setVelocity(0, 50);
            // Marcarlo como primer barril
            barrel.setData('isFirst', true);
            // No se agrega collider con las plataformas para este barril

            // Overlap para detectar colisión con el oil
            this.physics.add.overlap(barrel, this.oil, (b, oil) => {
                oil.play('oilAnim', true);
                this.time.delayedCall(500, () => {
                    barrel.destroy();
                });
            }, null, this);

            // Reproducir la animación especial para el primer barril (usa tus nuevos frames)
            barrel.play('barrelFirstAnim');
        } else {
            barrel = this.barrels.create(this.dk.x, this.dk.y + 20, 'barrel');
            barrel.setScale(3);
            barrel.setBounce(0.2);
            barrel.setVelocityX(100);
            barrel.setGravityY(300);
            barrel.direction = 1;
            this.physics.add.collider(barrel, this.platforms);
            barrel.play('barrelRoll');
        }
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
        // Reproducir la animación idle con martillo (sin tint)
        mario.play('hammerIdle', true);
        this.time.delayedCall(8000, () => {
            this.hasHammer = false;
            mario.play('idle', true);
        });
    }
    // Nuevo método
    triggerRescue() {
        this.reachedPauline = true;

        // Pausar físicas
        this.physics.world.pause();

        // Pausar animaciones clave
        this.dk.anims.pause();
        this.pauline.anims.pause();
        this.barrels.children.iterate(b => b.anims.pause());
        this.mario.anims.pause();

        // Tras 3 segundos, cambiar de escena
        this.time.delayedCall(3000, () => {
            this.scene.start('Game1');
        });
    }

    update() {
        // --- Detección de escalera: se activa si se presionan ↑ o ↓ y existe overlap ---
        this.onStairs = false;
        this.physics.overlap(this.mario, this.stairs, (mario, ladder) => {
            if ((this.cursors.up.isDown || this.cursors.down.isDown) && Math.abs(mario.x - ladder.x) < 10) {
                this.onStairs = true;
            }
        }, null, this);

        // Movimiento horizontal (solo si no está en escalera)
        if (!this.onStairs) {
            this.mario.setVelocityX(0);
            if (this.cursors.left.isDown) {
                this.mario.setVelocityX(-160);
                if (this.hasHammer) {
                    this.mario.play('hammerWalk', true);
                } else {
                    this.mario.play('walk', true);
                }
                this.mario.setFlipX(true);
            } else if (this.cursors.right.isDown) {
                this.mario.setVelocityX(160);
                if (this.hasHammer) {
                    this.mario.play('hammerWalk', true);
                } else {
                    this.mario.play('walk', true);
                }
                this.mario.setFlipX(false);
            } else {
                if (this.mario.body.onFloor()) {
                    if (this.hasHammer) {
                        this.mario.play('hammerIdle', true);
                    } else {
                        this.mario.play('idle', true);
                    }
                }
            }
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

        // Movimiento en escaleras: reproducir "climb" solo si se presiona la flecha arriba
        if (this.onStairs) {
            this.mario.body.setAllowGravity(false);
            if (this.cursors.up.isDown && !this.cursors.down.isDown) {
                this.mario.setVelocityY(-100);
                this.mario.body.checkCollision.up = false;
                if (!this.isClimbing) {
                    this.mario.play('climb', true);
                    this.isClimbing = true;
                }
            } else if (this.cursors.down.isDown) {
                this.mario.setVelocityY(100);
                this.mario.body.checkCollision.up = true;
                if (this.isClimbing) {
                    this.mario.play('idle', true);
                    this.isClimbing = false;
                }
            } else {
                this.mario.setVelocityY(0);
                this.mario.body.checkCollision.up = true;
            }
        } else {
            this.mario.body.setAllowGravity(true);
            this.mario.body.checkCollision.up = true;
            this.isClimbing = false;
        }

        // Lógica de los barriles
        this.barrels.children.iterate(barrel => {
            if (barrel) {
                // Aplicar cambio de dirección solo a los barriles que NO sean el primero
                if (!barrel.getData('isFirst')) {
                    this.barrelHeights.forEach(height => {
                        if (Math.abs(barrel.y - height) < 5) {
                            barrel.direction *= -1;
                            barrel.setVelocityX(100 * barrel.direction);
                        }
                    });
                }
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
        // ← NUEVO: Detectar proximidad a Pauline
        if (!this.marioFoundPauline) {
            const distance = Phaser.Math.Distance.Between(
                this.mario.x, this.mario.y,
                this.pauline.x, this.pauline.y
            );
            if (distance < 100) {  // ajustá el umbral a tu gusto
                this.marioFoundPauline = true;
                this.physics.pause();      // pausa la física
                this.mario.anims.pause();  // opcional: pausa animación de Mario
                // si querés, podés también desactivar entrada:
                // this.input.keyboard.enabled = false;

                // Esperar 3 s y lanzar la siguiente escena
                this.time.delayedCall(3000, () => {
                    this.scene.start('Game1');
                });
            }
        }
        const dist = Phaser.Math.Distance.Between(
            this.mario.x, this.mario.y,
            this.pauline.x, this.pauline.y
        );
        if (dist < 50) {
            this.triggerRescue();
            return;
        }
    }

    handlePlatformCollision(mario, platform) {
        if (this.onStairs) return;
        if (mario.body.touching.right) {
            mario.setVelocityY(-150);
        }
        if (mario.body.touching.left) {
            mario.setVelocityY(-150);
        }
    }
}
