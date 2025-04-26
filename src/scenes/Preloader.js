import Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {

    //IMAGENES

        this.load.image('floorbricks', '/assets/vigas.png');
        this.load.image('viga', '/assets/viga2.png');
        this.load.image('menu','/assets/menu_background.png');
        this.load.image('player','/assets/menu_1player_button.png');
        this.load.image('player2','/assets/menu_2player_button.png');
        this.load.image('ladder','/assets/stairs.png');
        this.load.image('ladderG', '/assets/stairs_green.png');
        this.load.image('hammer','/assets/hammer.png');
        this.load.image('platbarrel','/assets/barrels.png');
        this.load.image('button', '/assets/Ybutton.png');
        this.load.image('umbrella', '/assets/umbrella.png');
        this.load.image('bag', '/assets/bag.png');
        this.load.image('heart', '/assets/heart.png');

    //SPRITESHEETS

        // Cargar el spritesheet de Mario
        this.load.spritesheet('mario', '/assets/MarioN.png', {
            frameWidth: 36, // Ancho de cada frame
            frameHeight: 30 // Alto de cada frame
        });

        //cargar spritesheet de donkey kong
        this.load.spritesheet('dk', '/assets/Kong.png', {
            frameWidth: 50, // Ancho de cada frame
            frameHeight: 36 // Alto de cada frame
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

        this.load.spritesheet('fire', '/assets/fire_ball.png', {
            frameWidth: 16, // Ancho de cada frame
            frameHeight: 16 // Alto de cada frame
        });

        this.load.spritesheet('flames', '/assets/flames.png', {
            frameWidth: 16, // Ancho de cada frame
            frameHeight: 14 // Alto de cada frame
        });



    //AUDIO
    this.load.audio('menu', '/music/assets_audio_menu.mp3');
    this.load.audio('start', '/music/assets_audio_start.mp3');
    this.load.audio ('levelIntro', '/music/assets_audio_levelIntro.mp3');
    this.load.audio ('stage', '/music/assets_audio_stageTheme.mp3');
    this.load.audio ('run', '/music/assets_audio_run.mp3');
    this.load.audio ('jump', '/music/assets_audio_NES - Donkey Kong - Sound Effects_jump.wav');
    this.load.audio ('hammer', '/music/assets_audio_hammer.mp3');
    this.load.audio ('jumpBarrel', '/music/assets_audio_NES - Donkey Kong - Sound Effects_scoreUp.wav');
    this.load.audio ('win1', '/music/assets_audio_roundClear.mp3');
    this.load.audio ('dead', '/music/assets_audio_hit.mp3');
    this.load.audio ('stage2', '/music/stage2.mp3');
    this.load.audio ('kong', '/music/assets_audio_kong.mp3');
    this.load.audio ('final', '/music/assets_audio_allRoundsCleared.mp3');
    }
    

    create() {
        this.scene.start('MainMenu'); // O la escena que deba seguir
    }
}
