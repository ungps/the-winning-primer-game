import { Scene } from 'phaser';

type ItemOption =
    | { kind: 'none' }
    | { kind: 'emoji';  emoji: string; size: number; dxFrac: number; dyFrac: number; depth: number; label: string }
    | { kind: 'sprite'; key: string;   widthFrac: number; dxFrac: number; dyFrac: number; depth: number; label: string };

interface FinaleData {
    items?: ItemOption[];
}

const CHRIS_TARGET_H = 540;
const EMOJI_FONT = 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Arial';

const RATINGS = [
    { min: 0, title: 'Hmm.',         subtitle: 'Are you... certain?' },
    { min: 2, title: "C'est bien.",  subtitle: 'Has potential.' },
    { min: 4, title: 'Magnifique!',  subtitle: 'Très chic, mon ami.' },
    { min: 6, title: 'INCROYABLE!',  subtitle: 'A look. A vibe. A moment.' },
];

export class GameOver extends Scene
{
    constructor() { super('GameOver'); }

    create(data: FinaleData) {
        this.add.image(512, 384, 'background').setAlpha(0.55).setDepth(-1);

        this.add.particles(512, 720, 'sparkle', {
            speedY: { min: -130, max: -50 },
            speedX: { min: -70, max: 70 },
            lifespan: 2500,
            quantity: 2,
            frequency: 70,
            scale: { start: 1, end: 0 },
            alpha: { start: 0.9, end: 0 },
            blendMode: 'ADD'
        });

        const items = data?.items ?? [];
        const equipped = items.filter(i => i.kind !== 'none').length;
        const rating = [...RATINGS].reverse().find(r => equipped >= r.min) ?? RATINGS[0];

        this.add.text(512, 70, rating.title, {
            fontFamily: 'Arial Black', fontSize: 78, color: '#ffcc33',
            stroke: '#ff3399', strokeThickness: 10
        }).setOrigin(0.5);

        this.add.text(512, 130, rating.subtitle, {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        const chrisX = 512;
        const chrisY = 440;
        const chris = this.add.image(chrisX, chrisY, 'chris').setDepth(0);
        chris.setScale(CHRIS_TARGET_H / chris.height);
        const chrisW = chris.displayWidth;
        const chrisH = chris.displayHeight;

        items.forEach(opt => {
            if (opt.kind === 'none') return;
            const x = chrisX + opt.dxFrac * chrisW;
            const y = chrisY + opt.dyFrac * chrisH;
            if (opt.kind === 'emoji') {
                this.add.text(x, y, opt.emoji, {
                    fontFamily: EMOJI_FONT, fontSize: opt.size
                }).setOrigin(0.5).setDepth(opt.depth);
            } else {
                const img = this.add.image(x, y, opt.key).setOrigin(0.5).setDepth(opt.depth);
                img.setScale((opt.widthFrac * chrisW) / img.width);
            }
        });

        const prompt = this.add.text(512, 735, 'click to redress', {
            fontFamily: 'Arial', fontSize: 24, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);
        this.tweens.add({
            targets: prompt,
            alpha: 0.3, ease: 'Sine.InOut', duration: 700, yoyo: true, repeat: -1
        });

        this.input.once('pointerdown', () => this.scene.start('NamePrompt'));
    }
}
