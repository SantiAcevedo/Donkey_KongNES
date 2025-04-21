import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {

    //IMAGENES

        this.load.image('floorbricks', '/assets/vigas.png');
        this.load.image('menu','/assets/menu_background.png');
        this.load.image('player','/assets/menu_1player_button.png');
        this.load.image('player2','/assets/menu_2player_button.png');
        this.load.image('ladder','/assets/stairs.png');
        this.load.image('hammer','/assets/hammer.png');
        this.load.image('platbarrel','/assets/barrels.png');

    //SPRITESHEETS

        // Cargar el spritesheet de Mario
        this.load.spritesheet('mario', '/assets/MarioN.png', {
            frameWidth: 36, // Ancho de cada frame
            frameHeight: 30 // Alto de cada frame
        });

        //cargar spritesheet de donkey kong
        this.load.spritesheet('dk', '/assets/Donkey_Kong.png', {
            frameWidth: 46, // Ancho de cada frame
            frameHeight: 31 // Alto de cada frame
        });

        //Cargar spritesheet de Pauline
        this.load.spritesheet('pauline', '/assets/pauline.png', {
            frameWidth: 15, // Ancho de cada frame
            frameHeight: 22 // Alto de cada frame
        });

        this.load.spritesheet('oil', '/assets/oil.png', {
            frameWidth: 16, // Ancho de cada frame
            frameHeight: 24 // Alto de cada frame
        });

        this.load.spritesheet('barrel', '/assets/barrel.png', {
            frameWidth: 15, // Ancho de cada frame
            frameHeight: 10 // Alto de cada frame
        });

        this.load.spritesheet('fire', 'public/assets/fire_ball.png', {
            frameWidth: 16, // Ancho de cada frame
            frameHeight: 16 // Alto de cada frame
        });

    //AUDIO
    }
    

    create() {
        this.scene.start('MainMenu'); // O la escena que deba seguir
    }
}
