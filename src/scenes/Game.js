import Phaser from 'phaser';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Fondo y piso
        this.cameras.main.setBackgroundColor('#00000a');
        
        // Crear grupo de plataformas
        this.platforms = this.physics.add.staticGroup();
        
        // Agregar suelo principal
        for (let x = 0; x < 1024; x += 50) {
            this.platforms.create(x, 755, 'floorbricks');
        }
        
        // Agregar plataformas en forma de escalera con un bucle
        let startX = 800; // Posición inicial en X
        let startY = 650; // Posición inicial en Y
        let stepX = -128;  // Diferencia de X entre cada escalón
        let stepY = -6;  // Diferencia de Y entre cada escalón
        
        for (let i = 0; i < 6; i++) {  // Número de escalones
            this.platforms.create(startX + (i * stepX), startY + (i * stepY), 'floorbricks');
        }
        
        this.platforms.create(200, 170, 'floorbricks');
        this.platforms.create(350, 130, 'floorbricks');
        
        // Crear Mario con físicas
        this.mario = this.physics.add.sprite(512, 600, 'mario').setScale(2.5);
        this.mario.setBounce(0.1);
        this.mario.setCollideWorldBounds(true);
        
        // Colisión con plataformas
        this.physics.add.collider(this.mario, this.platforms, this.handlePlatformCollision, null, this);
        
        // Ajustar el tamaño del cuerpo de colisión para facilitar el movimiento en escalones
        this.mario.body.setSize(this.mario.width * 0.6, this.mario.height * 0.5);
        this.mario.body.setOffset(this.mario.width * 0.2, this.mario.height * 0.5);
        
        
        // Crear animaciones
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'mario', frame: 0 }], // Frame quieto
            frameRate: 10
        });

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('mario', { start: 1, end: 2 }), // Frames de caminar
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: [{ key: 'mario', frame: 5 }], // Frame de salto
            frameRate: 2
        });

        // Teclado
        this.cursors = this.input.keyboard.createCursorKeys();

        // Mario inicia en animación "idle"
        this.mario.play('idle');

        // Crear a Donkey Kong
        this.dk = this.physics.add.sprite(200, 110, 'dk').setScale(2.5);
        this.dk.setBounce(0.1);
        this.dk.setCollideWorldBounds(true);

        // Colisión con plataformas
        this.physics.add.collider(this.dk, this.platforms);

        // Definir la animación "idle" de DK (frames 0, 1 y 2 en loop)
        this.anims.create({
            key: 'dk_idle',
            frames: this.anims.generateFrameNumbers('dk', { start: 0, end: 2 }),
            frameRate: 2, // Ajusta la velocidad si es necesario
            repeat: -1 // Se repite infinitamente
        });

        // DK inicia con la animación "dk_idle"
        this.dk.play('dk_idle');

        //Crear a Pauline
        this.pauline = this.physics.add.sprite(350, 90, 'pauline').setScale(2);
        this.pauline.setBounce(0.1);
        this.pauline.setCollideWorldBounds(true);

        // Colisión con plataformas
        this.physics.add.collider(this.pauline, this.platforms);

        // Definir la animación "idle" de Pauline
        this.anims.create({
            key: 'pauline_idle',
            frames: this.anims.generateFrameNumbers('pauline', { start: 0, end: 1 }),
            frameRate: 1, // Ajusta la velocidad si es necesario
            repeat: -1 // Se repite infinitamente
        });
    }

    update() {
        // Reiniciar velocidad
        this.mario.setVelocityX(0);

        // Movimiento
        if (this.cursors.left.isDown) {
            this.mario.setVelocityX(-160);
            this.mario.flipX = true; // Voltear sprite a la izquierda
            this.mario.play('walk', true);
        } else if (this.cursors.right.isDown) {
            this.mario.setVelocityX(160);
            this.mario.flipX = false;
            this.mario.play('walk', true);
        } else {
            this.mario.play('idle', true);
        }

        // Salto
        if (this.cursors.up.isDown && this.mario.body.touching.down) {
            this.mario.setVelocityY(-330);
            this.mario.play('jump', true);
        }
    }

    handlePlatformCollision(mario, platform) {
        if (mario.body.touching.right) {
            mario.setVelocityY(-150); // Empuje hacia arriba al chocar desde la derecha
        } 
        if (mario.body.touching.left) {
            mario.setVelocityY(-150); // Empuje hacia arriba al chocar desde la izquierda
        }
    }
    
}
