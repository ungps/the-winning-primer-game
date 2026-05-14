// Clothing manifest for the dress-up scene.
//
// To add a new item: drop the PNG into public/assets/<category>/
// and add its filename to the matching array below.

export type Category = 'hats' | 'tops' | 'bottoms' | 'shoes';

export const CATEGORIES: Category[] = ['hats', 'tops', 'bottoms', 'shoes'];

export const CATEGORY_LABELS: Record<Category, string> = {
    hats:    'Hats',
    tops:    'Tops',
    bottoms: 'Bottoms',
    shoes:   'Shoes',
};

export const CLOTHING: Record<Category, string[]> = {
    hats:    [],
    tops:    [
        '7fe46b0a-1aa7-4049-82ea-3167bbab17df(1).png',
        '89552f54-cb9e-49e8-8bad-1635c4a24bb0(1).png',
        'ChatGPT Image May 14, 2026, 03_27_16 PM(1).png',
        'image.psd(5).png',
    ],
    bottoms: [
        '7fe46b0a-1aa7-4049-82ea-3167bbab17df(1).png',
        '89552f54-cb9e-49e8-8bad-1635c4a24bb0(1).png',
        'ChatGPT Image May 14, 2026, 03_27_16 PM(1).png',
        'ChatGPT Image May 14, 2026, 03_30_33 PM.png',
        'ChatGPT Image May 14, 2026, 03_31_37 PM.png',
        'ChatGPT Image May 14, 2026, 03_33_42 PM.png',
        'ChatGPT Image May 14, 2026, 03_34_01 PM.png',
        'ChatGPT Image May 14, 2026, 03_34_19 PM.png',
        'ChatGPT Image May 14, 2026, 03_35_25 PM.png',
        'ChatGPT Image May 14, 2026, 03_36_14 PM.png',
        'ChatGPT Image May 14, 2026, 03_37_27 PM.png',
        'ChatGPT Image May 14, 2026, 03_38_09 PM.png',
        'ChatGPT Image May 14, 2026, 03_38_19 PM.png',
        'ChatGPT Image May 14, 2026, 03_38_57 PM.png',
        'ChatGPT Image May 14, 2026, 03_40_14 PM.png',
        'ChatGPT Image May 14, 2026, 03_40_25 PM.png',
        'image.psd(5).png',
    ],
    shoes:   [
        'armour',
        'baguette',
        'ballerina',
        'blu_running_shoes.png',
        'bluez.png',
        'boots',
        'brown_leather.png',
        'chain_lace.png',
        'cowboy_boots',
        'disco_platform.png',
        'doggy.png',
        'hoofs.png',
        'peugeot.png',
    ],
};

// Where (relative to mannequin center) and how big to spawn a fresh item.
// Players can drag and resize from there.
export const CATEGORY_DEFAULTS: Record<Category, { dyFrac: number; widthFrac: number; depth: number }> = {
    hats:    { dyFrac: -0.45, widthFrac: 0.45, depth: 30 },
    tops:    { dyFrac: -0.05, widthFrac: 0.65, depth: 20 },
    bottoms: { dyFrac:  0.20, widthFrac: 0.55, depth: 10 },
    shoes:   { dyFrac:  0.42, widthFrac: 0.45, depth: 5  },
};

export function itemKey(category: Category, filename: string): string {
    return `clothing:${category}:${filename}`;
}

export function itemUrl(category: Category, filename: string): string {
    // Encode spaces, commas, parens etc. so paths with funky filenames still resolve.
    return `assets/${category}/${encodeURIComponent(filename)}`;
}
