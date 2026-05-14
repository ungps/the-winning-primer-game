import { Scene, GameObjects } from 'phaser';

export class LanguagePrompt extends Scene
{
    typed = '';
    inputText: GameObjects.Text;
    feedback: GameObjects.Text;

    constructor() { super('LanguagePrompt'); }

    create() {
        this.typed = '';

        this.add.image(512, 384, 'background').setAlpha(0.55);

        this.add.text(512, 140, 'Bonjour, Chris.', {
            fontFamily: 'Arial Black', fontSize: 56, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8
        }).setOrigin(0.5);

        this.add.text(512, 220, 'What language do you speak?', {
            fontFamily: 'Arial', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.add.rectangle(512, 340, 520, 80, 0x000000, 0.55).setStrokeStyle(3, 0xffffff);

        this.inputText = this.add.text(512, 340, '_', {
            fontFamily: 'Courier', fontSize: 44, color: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(512, 420, '(type and press Enter)', {
            fontFamily: 'Arial', fontSize: 20, color: '#cccccc'
        }).setOrigin(0.5);

        this.feedback = this.add.text(512, 520, '', {
            fontFamily: 'Arial Black', fontSize: 30, color: '#ff66aa',
            stroke: '#000000', strokeThickness: 6
        }).setOrigin(0.5);

        this.input.keyboard!.on('keydown', this.handleKey, this);
        this.events.once('shutdown', () => {
            this.input.keyboard!.off('keydown', this.handleKey, this);
        });
    }

    handleKey(event: KeyboardEvent) {
        const key = event.key;
        if (key === 'Backspace') {
            this.typed = this.typed.slice(0, -1);
        } else if (key === 'Enter') {
            this.submit();
            return;
        } else if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
            if (this.typed.length < 16) this.typed += key;
        } else {
            return;
        }
        this.inputText.setText(this.typed + '_');
    }

    submit() {
        const trimmed = this.typed.trim();
        if (trimmed.toLowerCase() === 'french') {
            this.cameras.main.flash(300, 120, 255, 180);
            this.time.delayedCall(220, () => this.scene.start('Game'));
        } else if (trimmed === '') {
            this.reject('Mon dieu. You speak French.');
        } else {
            this.reject(`Non, "${trimmed}" — you speak French.`);
        }
    }

    reject(msg: string) {
        this.feedback.setText(msg);
        this.feedback.setAlpha(1);
        this.cameras.main.shake(250, 0.012);
        this.typed = '';
        this.inputText.setText('_');
        this.tweens.add({
            targets: this.feedback,
            alpha: 0,
            duration: 2000,
            ease: 'Sine.In'
        });
    }
}
