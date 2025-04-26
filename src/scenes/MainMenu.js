import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor('#00000a');

        // Imagen de fondo del menú
        this.add.image(510, 380, 'menu').setOrigin(0.5).setScale(1.7); 

        // Imagen del jugador (botón interactivo)
        const playerImage = this.add.image(512, 430, 'player').setOrigin(0.5).setScale(1.4);
        this.add.image(512, 465, 'player2').setOrigin(0.5).setScale(1.4);

        // Reproducir la música de menú
        this.menuMusic = this.sound.add('menu', { loop: true });
        this.menuMusic.play();

        // Hacer interactivo el botón
        playerImage.setInteractive();

        // Al hacer clic, parar música de menú y reproducir música de start
        playerImage.on('pointerdown', () => {
            // Evitar que se presione varias veces
            playerImage.disableInteractive();

            // Parar música de menú
            if (this.menuMusic.isPlaying) {
                this.menuMusic.stop();
            }

            // Reproducir música de start
            this.startMusic = this.sound.add('start');
            this.startMusic.play();

            // Cuando termine la música de start, cambiar a la escena Game
            this.startMusic.once('complete', () => {
                this.scene.start('Game');
            });
        });
    }
}
