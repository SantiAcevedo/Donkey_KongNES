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
            this.platforms.create(x, 770, 'floorbricks');
        }
        
        // Agregar platwaformas en forma de escalera con un bucle 00
        let startX = 860; // Posición inicial en X
        let startY = 685; // Posición inicial en Y
        let stepX = -90;  // Diferencia de X entre cada escalón
        let stepY = -3;  // Diferencia de Y entre cada escalón
        
        for (let i = 0; i < 9; i++) {  // Número de escalones
            let escalon = this.platforms.create(startX + (i * stepX), startY + (i * stepY), 'floorbricks');
            escalon.setScale(0.7).refreshBody();  // Escala la plataforma y actualiza su cuerpo de colisión
        }
        //plataforma 01
        let startX1 = 180; // Posición inicial en X
        let startY1 = 580; // Posición inicial en Y
        let stepX1 = 90;  // Diferencia de X entre cada escalón
        let stepY1 = -3;  // Diferencia de Y entre cada escalón
        
        for (let i = 0; i < 9; i++) {  // Número de escalones
            let escalon = this.platforms.create(startX1 + (i * stepX1), startY1 + (i * stepY1), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        //plataforma 02
        let startX2 = 845; // Posición inicial en X
        let startY2 = 470; // Posición inicial en Y
        let stepX2 = -90;  // Diferencia de X entre cada escalón
        let stepY2 = -3;  // Diferencia de Y entre cada escalón
                
        for (let i = 0; i < 9; i++) {  // Número de escalones
                let escalon = this.platforms.create(startX2 + (i * stepX2), startY2 + (i * stepY2), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        //plataforma 03
        let startX3 = 180; // Posición inicial en X
        let startY3 = 370; // Posición inicial en Y
        let stepX3 = 90;  // Diferencia de X entre cada escalón
        let stepY3 = -3;  // Diferencia de Y entre cada escalón
        
        for (let i = 0; i < 9; i++) {  // Número de escalones
            let escalon = this.platforms.create(startX3 + (i * stepX3), startY3 + (i * stepY3), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        //plataforma 04
        let startX4 = 815; // Posición inicial en X
        let startY4 = 270; // Posición inicial en Y
        let stepX4 = -85;  // Diferencia de X entre cada escalón
        let stepY4 = -9;  // Diferencia de Y entre cada escalón
                
        for (let i = 0; i < 8; i++) {  // Número de escalones
                let escalon = this.platforms.create(startX4 + (i * stepX4), startY4 + (i * stepY4), 'floorbricks');
            escalon.setScale(0.7).refreshBody();
        }
        
        this.platforms.create(135, 207, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(320, 160, 'floorbricks').setScale(0.7).refreshBody();
        this.platforms.create(410, 140, 'floorbricks').setScale(0.7).refreshBody();
        
        
        // Crear Mario con físicas
        this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.8);
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
        this.dk = this.physics.add.sprite(200, 150, 'dk').setScale(2.9);
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
        this.pauline = this.physics.add.sprite(320, 130, 'pauline').setScale(2);
        this.pauline.setBounce(0.1);
        this.pauline.setCollideWorldBounds(true);

        // Colisión con plataformas
        this.physics.add.collider(this.pauline, this.platforms);

        // Definir la animación "idle" de Pauline
        this.anims.create({
            key: 'pauline_idle',
            frames: this.anims.generateFrameNumbers('pauline', { start: 0, end: 1 }),
            frameRate: 4, // Ajusta la velocidad si es necesario
            repeat: -2 // Se repite infinitamente
        });
        // Pau inicia con la animación "paline_idle"
        this.pauline.play('pauline_idle');

        //Agregar oil
        this.oil = this.physics.add.sprite(180, 720, 'oil').setScale(2.6);

        //Colision con plataformas
        this.physics.add.collider(this.oil, this.platforms);

        // Definir la animación "idle" de oil
        this.anims.create({
            key: 'oil',
            frames: this.anims.generateFrameNumbers('oil', { start: 1, end: 2 }),
            frameRate: 3, // Ajusta la velocidad si es necesario
            repeat: -1 // Se repite infinitamente
        });
        this.oil.play('oil');

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
