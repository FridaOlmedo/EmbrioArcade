export class DefeatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DefeatScene' });
    }

    preload() {
        this.load.image('defeat_bg', 'assets/fondo_derrota.jpg');
        this.load.audio('defeat_sound', 'assets/defeat_sound.wav');
    }

    create() {
        this.add.image(0, 0, 'defeat_bg').setOrigin(0).setDisplaySize(990, 750);

        // 🎵 Sonido de derrota
        this.sound.play('defeat_sound');

        // Zonas invisibles sobre botones ilustrados
        this.add.zone(150, 640, 200, 60)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameScene'));

        this.add.zone(640, 640, 200, 60)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => document.querySelector('canvas').style.display = 'none');
    }
}

