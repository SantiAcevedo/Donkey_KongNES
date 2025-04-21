import { Scene } from 'phaser';

export class Game1 extends Scene
{
    constructor ()
    {
        super('Game1');
    }

    create() {
        // — Fondo —
        this.cameras.main.setBackgroundColor('#00000a');

        // — Plataformas estáticas —
        this.platforms = this.physics.add.staticGroup();
        // Plataforma inicial en x=250, y=770 (ajustá según tu lienzo)
        for (let x = 0; x < 1024; x += 95) {
            this.platforms.create(x, 770, 'floorbricks');
        }

        // Generar escalones de las plataformas con bucles
        let startX = 774; 
        let startY = 650;
        let stepX = -100;
        let stepY = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX + (i * stepX), startY + (i * stepY), 'floorbricks');
            escalon.setScale(0.8).refreshBody();
        }
       
        let startX1 = 774; 
        let startY1 = 530;
        let stepX1 = -100;
        let stepY1 = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX1 + (i * stepX1), startY1 + (i * stepY1), 'floorbricks');
            escalon.setScale(0.8).refreshBody();
        }
    
        let startX2 = 774; 
        let startY2 = 410;
        let stepX2 = -100;
        let stepY2 = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX2 + (i * stepX2), startY2 + (i * stepY2), 'floorbricks');
            escalon.setScale(0.8).refreshBody();
        }

        let startX3 = 774; 
        let startY3 = 280;
        let stepX3 = -100;
        let stepY3 = 0;
        for (let i = 0; i < 6; i++) {
            let escalon = this.platforms.create(startX3 + (i * stepX3), startY3 + (i * stepY3), 'floorbricks');
            escalon.setScale(0.8).refreshBody();
        }

        this.platforms.create(150, 650, 'floorbricks').setScale(0.8).refreshBody();
        this.platforms.create(900, 650, 'floorbricks').setScale(0.8).refreshBody();

        // — Mario —
        this.mario = this.physics.add.sprite(250, 710, 'mario').setScale(2.8);
        this.mario.setBounce(0.1);
        this.mario.setCollideWorldBounds(true);
        this.mario.body.setGravityY(300);

        // Crear a Donkey Kong
        this.dk = this.physics.add.sprite(500, 220, 'dk').setScale(3);
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

        // Reducir la caja de colisión si querés (igual que antes)
        const w = this.mario.width * 0.6;
        const h = this.mario.height * 0.8;
        this.mario.body.setSize(w, h);
        this.mario.body.setOffset((this.mario.width - w) / 2, this.mario.height - h);

        // — Colisiones —
        this.physics.add.collider(this.mario, this.platforms);

        // — Animaciones —
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

        // — Controles —
        this.cursors = this.input.keyboard.createCursorKeys();
        this.mario.play('idle');
    }

    update() {
        const onFloor = this.mario.body.onFloor();
        let vx = 0;

        // Movimiento horizontal
        if (this.cursors.left.isDown) {
            vx = -160;
            this.mario.setFlipX(true);
        } else if (this.cursors.right.isDown) {
            vx = 160;
            this.mario.setFlipX(false);
        }
        this.mario.setVelocityX(vx);

        // Salto
        if (this.cursors.up.isDown && onFloor) {
            this.mario.setVelocityY(-290);
        }

        // Asignación de animación (una sola vez por frame)
        if (!onFloor) {
            // En el aire → salto
            this.mario.play('jump', true);
        } else if (vx !== 0) {
            // En tierra y moviéndose → caminar
            this.mario.play('walk', true);
        } else {
            // En tierra y quieto → idle
            this.mario.play('idle', true);
        }
    }
}