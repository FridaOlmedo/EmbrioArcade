export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    preload() {
        this.load.image('victory_bg', 'assets/victory_background.png');
        this.load.image('sperm1', 'assets/sperm_1.png');
        this.load.audio('victory_sound', 'assets/victory_sound.wav');
    }

    create() {
        this.add.image(0, 0, 'victory_bg').setOrigin(0).setDisplaySize(990, 750);

        // 🎵 Sonido de victoria
        this.sound.play('victory_sound');

        // Zonas invisibles sobre botones ilustrados
        this.add.zone(150, 640, 200, 60)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameScene'));

        this.add.zone(640, 640, 200, 60)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => document.querySelector('canvas').style.display = 'none');

        // Partículas decorativas
        const particles = this.add.particles('sperm1');
        particles.createEmitter({
            x: { min: 0, max: 990 },
            y: 0,
            lifespan: 4000,
            speedY: { min: 50, max: 100 },
            scale: { start: 0.1, end: 0 },
            quantity: 1,
            frequency: 300,
            alpha: { start: 1, end: 0 }
        });
    }
}