export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('fondo_menu', 'assets/fondo_menu.png');
        this.load.audio('menu_music', 'assets/music_menu.mp3');
    }

    create() {
        this.add.image(0, 0, 'fondo_menu').setOrigin(0).setDisplaySize(990, 750);

        // Música en bucle
        this.music = this.sound.add('menu_music', { loop: true, volume: 0.5 });
        this.music.play();

        // Botón JUGAR
        this.add.zone(180, 550, 300, 150)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.music.stop();
                this.scene.start('GameScene');
            });

        // Botón INSTRUCCIONES
        this.add.zone(380, 550, 300, 150)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => this.mostrarPopup());

        // Botón SALIR
        this.add.zone(660, 550, 300, 150)
            .setOrigin(0)
            .setInteractive()
            .on('pointerdown', () => {
                this.music.stop();
                document.querySelector('canvas').style.display = 'none';
            });
    }

    mostrarPopup() {
        const fondoPopup = this.add.rectangle(495, 375, 600, 200, 0xffffff)
            .setStrokeStyle(4, 0xfab58a)
            .setDepth(1);

        const texto = this.add.text(240, 320,
            '¡Tienes que ayudar al espermatozoide a\n encontrar el óvulo para lograr\n una fecundación ideal!', {
            fontFamily: 'Arial',
            fontSize: '20px',
            color: '#333',
            align: 'center'
        }).setDepth(2);

        const botonCerrar = this.add.text(450, 420, 'Cerrar', {
            fontSize: '22px',
            backgroundColor: '#f7c78a',
            color: '#000',
            padding: { x: 20, y: 10 }
        }).setInteractive()
          .on('pointerdown', () => {
              fondoPopup.destroy();
              texto.destroy();
              botonCerrar.destroy();
          }).setDepth(2);
    }
}
