import Phaser from 'phaser';
import { InputManager } from '../components/InputManager';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
        this.lives = 3;          // Mario comienza con 3 vidas
        this.score = 0;          // Contador de puntos
        this.isFloating = false;
        this.floatTimer = null;
        this.isClimbing = false; // Flag para controlar animación de escalada
        this.firstBarrelThrown = false; // Para diferenciar el primer barril
        this.marioFoundPauline = false;  // flag para detectar proximidad
        this.skipJumpAnim = false;    // flag para saltar sin animación
    }

    create() {
        this.inputManager = new InputManager(this);
        this.inputManager.setup();

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
        let stepY2 = -2;
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

        this.platforms.create(131, 207, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(320, 145, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(410, 125, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(498, 125, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(86, 207, 'floorbricks').setScale(0.7).refreshBody();
        

        // Configuración de la puntuación
        this.scoreText = this.add.text(120, 40, 'I- 0', { fontSize: '38px', fill: '#fff' });

        // Crear Mario con físicas
        this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.9);
        this.mario.setBounce(0.1);
        this.mario.setCollideWorldBounds(true);
        this.mario.body.setGravityY(300);

        // Ajuste: colisión un poquito más baja
        const w = this.mario.width * 0.6;      
        const h = this.mario.height * 0.8;     
        const offsetX = (this.mario.width - w) / 2;
        const offsetY = this.mario.height - h;
        this.mario.body.setSize(w, h);
        this.mario.body.setOffset(offsetX, offsetY);

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
            frames: [{ key: 'mario', frame: 11 }],
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
        this.dk = this.physics.add.sprite(200, 150, 'dk').setScale(3);
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

        // 1) Define tu animación (sólo frames 4,5,7, como lo vimos antes)
        this.anims.create({
            key: 'dk_special',
            frames: this.anims.generateFrameNumbers('dk', { frames: [4, 5, 7] }),
            frameRate: 2,
            repeat: 0
        });
        
        // 2) Programa un evento que la dispare cada 5 segundos (5000 ms)
        this.time.addEvent({
            delay: 2700,          
            callback: () => {
            this.dk.play('dk_special');
            },
            loop: true
        });
        
        // 3) (Opcional) Cuando termine, vuelve al idle
        this.dk.on('animationcomplete-dk_special', () => {
            this.dk.play('dk_idle');
        });

        // Aquí insertamos 'platbarrel' a la misma Y que DK y centrado en X:
        this.platbarrel = this.add.image(this.dk.x, this.dk.y, 'platbarrel')
        .setOrigin(2, 0.6)   // puedes ajustar el origen según quieras centrarlo
        .setScale(3.7);          // o el scale que necesites

        // Crear a Pauline
        this.pauline = this.physics.add.sprite(320, 100, 'pauline').setScale(2.3);
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
        this.oil = this.physics.add.sprite(180, 720, 'oil').setScale(2.9);
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
        this.generateLadder(860, 530, 5, 16, "ladder", 4);
        this.generateLadder(390, 425, 5, 16, "ladder", 4);    // cuarta plataforma
        this.generateLadder(245, 414, 4, 16, "ladder", 4);
        this.generateLadder(820, 410, 5, 16, "ladder", 4);
        this.generateLadder(450, 258, 3, 16, "ladder", 4);    // quinta plataforma
        this.generateLadder(450, 340, 3, 16, "ladder", 4);
        this.generateLadder(630, 310, 5, 16, "ladder", 4);
        this.generateLadder(525, 185, 5, 16, "ladder", 4);    // última plataforma
        this.generateLadder(350, 180, 9, 16, "ladder", 4);    // plataforma pauline
        this.generateLadder(290, 180, 9, 16, "ladder", 4);    // plataforma pauline

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
                this.skipJumpAnim = true; 
            }
        }, null, this);
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
                    this.skipJumpAnim = true; 
                }
            }, null, this);

        // Crear grupo de barriles
        this.firstBarrelThrown = false;
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
        this.barrelHeights = [667, 570, 460, 365, 271];
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

        // 1) Colisión Mario ⇆ plataformas: solo choca si baja y está justo encima
        this.physics.add.collider(
            this.mario,
            this.platforms,
            this.handlePlatformCollision,
            (mario, platform) => {
            return mario.body.velocity.y > 0 &&
                    mario.body.bottom <= platform.body.top + 5;
            },
            this
        );
  

        // ← NUEVO: animación de Fire (frames 0 y 1)
        this.anims.create({
            key: 'fireAnim',
            frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1
        });

        // ← NUEVO: Grupo de fueguitos
        this.fires = this.physics.add.group({ allowGravity: false, immovable: true });
        // ← NUEVO: programa la aparición del fire (e.g. 8s después):
        this.spawnFireAtOil(8000);
    }

    spawnFireAtOil(delay) {
        this.time.delayedCall(delay, () => {
          const fire = this.fires.create(this.oil.x + 20, this.oil.y, 'fire').setScale(2.8);
          fire.setCollideWorldBounds(true);
          fire.play('fireAnim');
      
          // Calcula un destino aleatorio dentro de la pantalla
          const minX = 50;
          const maxX = this.scale.width - 50;
          const targetX = Phaser.Math.Between(minX, maxX);
      
          // Duración aleatoria para que a veces sea rápido y a veces lento
          const duration = Phaser.Math.Between(4500, 4500);
      
          this.tweens.add({
            targets: fire,
            x: targetX,
            duration,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            onYoyo: () => fire.setFlipX(true),   // gira para mirar al volver
            onRepeat: () => fire.setFlipX(false) // gira para mirar al avanzar
          });
      
          this.physics.add.collider(fire, this.platforms);
          this.physics.add.overlap(this.mario, fire, this.hitByFire, null, this);
        });
      }
      

        // ← NUEVO: lógica de daño por fire
        hitByFire(mario, fire) {
            mario.setTint(0xff0000);
            this.time.delayedCall(300, () => mario.clearTint());
            this.lives--;
            if (this.lives <= 0) {
                this.scene.start('GameOver');
            }
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
            barrel.setScale(3.5);
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
            barrel.setScale(3.3);
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
            // Rompes el barril
            barrel.destroy();
    
            // +500 puntos
            this.score += 500;
            this.scoreText.setText('I- ' + this.score);
    
            // Texto flotante “+500”
            const pts = this.add.text(barrel.x, barrel.y, '500', {
                font: '34px Arial',
                fill: '#ffff00',
                stroke: '#000',
                strokeThickness: 3
            }).setOrigin(0.5);
    
            this.tweens.add({
                targets: pts,
                y:    pts.y - 50,
                alpha:0,
                duration: 800,
                ease: 'Power1',
                onComplete: () => pts.destroy()
            });
    
            return;
        }
    
        // Si no tienes martillo, golpe normal...
        this.lives -= 1;
        if (this.lives <= 0) {
            this.scene.start('GameOver');
        } else {
            // Reinicio de posición, etc.
            this.mario.setPosition(250, 710);
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
            this.scene.start('Game1', { prevScore: this.score });
        });
    }
    handlePlatformCollision(mario, platform) {
        // Aquí solo reaccionas a la colisión superior.
        // Si quieres, puedes quitar este método y manejar todo desde el processCallback.
    }

    update() {
        // 1) Actualizar gamepad
        this.inputManager.update();
        const padMove = this.inputManager.getMovement();
        const padJump = this.inputManager.isJumping();
      
        // 2) Declarar vx al inicio para que tenga alcance en todo el método
        let vx = 0;
      
        // 3) Detección de escalera
        this.onStairs = false;
        this.physics.overlap(this.mario, this.stairs, (m, ladder) => {
          const upPressed   = this.cursors.up.isDown   || padMove.y < -0.5;
          const downPressed = this.cursors.down.isDown || padMove.y >  0.5;
          if ((upPressed || downPressed) && Math.abs(m.x - ladder.x) < 10) {
            this.onStairs = true;
            this.skipJumpAnim = true;
          }
        }, null, this);
      
        if (this.onStairs) {
          this.mario.body.setAllowGravity(false);
          if (this.cursors.up.isDown || padMove.y < -0.5) {
            this.mario.setVelocityY(-100);
          } else if (this.cursors.down.isDown || padMove.y > 0.5) {
            this.mario.setVelocityY(100);
          } else {
            this.mario.setVelocityY(0);
          }
          this.mario.play('climb', true);
          return;
        } else {
          this.mario.body.setAllowGravity(true);
        }
      
        // 4) Movimiento horizontal (teclado o stick)
        if (this.cursors.left.isDown  || padMove.x < -0.1) {
          vx = -160;
          this.mario.setFlipX(true);
        } else if (this.cursors.right.isDown || padMove.x > 0.1) {
          vx = 160;
          this.mario.setFlipX(false);
        }
        this.mario.setVelocityX(vx);
      
        // 5) Salto (tecla ↑ o push stick hacia arriba)
        const jumpPressed = (this.cursors.up.isDown || padJump) && this.mario.body.onFloor();
        if (jumpPressed) {
          this.mario.setVelocityY(-290);
          this.isFloating = true;
          this.mario.body.setGravityY(100);
          if (this.floatTimer) this.floatTimer.remove();
          this.floatTimer = this.time.delayedCall(1000, () => {
            this.mario.body.setGravityY(300);
            this.isFloating = false;
          });
        }
      
        // 6) Lógica de barriles
        this.barrels.children.iterate(barrel => {
          if (!barrel) return;
          if (!barrel.getData('isFirst')) {
            this.barrelHeights.forEach(height => {
              if (Math.abs(barrel.y - height) < 5) {
                barrel.direction *= -1;
                barrel.setVelocityX(100 * barrel.direction);
              }
            });
          }
          if (barrel.scored === undefined) barrel.scored = false;
      
          // Puntuación al caer encima
          if (
            !barrel.scored &&
            this.mario.body.velocity.y > 0 &&
            barrel.y > this.mario.y &&
            Math.abs(this.mario.x - barrel.x) < 50
          ) {
            this.score += 100;
            this.scoreText.setText('I- ' + this.score);
            barrel.scored = true;
      
            const pts = this.add.text(barrel.x, barrel.y, '100', {
              font: '34px Arial',
              fill: '#ffffff',
              stroke: '#000000',
              strokeThickness: 5
            }).setOrigin(0.5);
      
            this.tweens.add({
              targets: pts,
              y:    pts.y - 50,
              alpha:0,
              duration: 800,
              ease: 'Power1',
              onComplete: () => pts.destroy()
            });
          }
        });
      
        // 7) Proximidad a Pauline y rescate
        if (!this.marioFoundPauline) {
          const distance = Phaser.Math.Distance.Between(
            this.mario.x, this.mario.y,
            this.pauline.x, this.pauline.y
          );
          if (distance < 100) {
            this.marioFoundPauline = true;
            this.physics.pause();
            this.mario.anims.pause();
            this.time.delayedCall(8000, () => this.scene.start('Game1'));
          }
        }
        const dist = Phaser.Math.Distance.Between(
          this.mario.x, this.mario.y,
          this.pauline.x, this.pauline.y
        );
        if (dist < 100) {
          this.triggerRescue();
          return;
        }
      
        // 8) Asignación de animación final según estado
        if (!this.mario.body.onFloor()) {
          if (this.skipJumpAnim) {
            this.skipJumpAnim = false;
          } else {
            this.mario.play('jump', true);
          }
        } else if (vx !== 0) {
          if (this.hasHammer) {
            this.mario.play('hammerWalk', true);
          } else {
            this.mario.play('walk', true);
          }
        } else {
          if (this.hasHammer) {
            this.mario.play('hammerIdle', true);
          } else {
            this.mario.play('idle', true);
          }
        }
      }
      

    handlePlatformCollision(mario, platform) {
        // si toca escalera, no rebotar ni empujar arriba/abajo
        if (this.physics.overlap(mario, this.stairs)) {
        return;
        }
    
        // rebote lateral normal
        if (mario.body.touching.left || mario.body.touching.right) {
        mario.setVelocityY(-150);
        this.skipJumpAnim = true;
        }
    }
  
}