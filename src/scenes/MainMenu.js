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
        const playerImagen = this.add.image(512, 465, 'player2').setOrigin(0.5).setScale(1.4);


        // Hacerla interactiva
        playerImage.setInteractive();

        // Al hacer clic, pasar a la escena 'Game'
        playerImage.on('pointerdown', () => {
            this.scene.start('Game1');
        });
    }
}

