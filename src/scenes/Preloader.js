import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        this.load.image('background', 'public/assets/background.png');
        this.load.image('floorbricks', 'public/assets/floorbricks.png');

        // Cargar el spritesheet de Mario
        this.load.spritesheet('mario', 'public/assets/jumpman.png', {
            frameWidth: 36, // Ancho de cada frame
            frameHeight: 34 // Alto de cada frame
        });

        //cargar spritesheet de donkey kong
        this.load.spritesheet('dk', 'public/assets/Donkey_Kong.png', {
            frameWidth: 46, // Ancho de cada frame
            frameHeight: 31 // Alto de cada frame
        });

        //Cargar spritesheet de Pauline
        this.load.spritesheet('pauline', 'public/assets/pauline.png', {
            frameWidth: 15, // Ancho de cada frame
            frameHeight: 22 // Alto de cada frame
        });
    }
    

    create() {
        this.scene.start('MainMenu'); // O la escena que deba seguir
    }
}
