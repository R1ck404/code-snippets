import colors from 'tailwindcss/colors';

/**
 * Convert an RGB color value to relative luminance.
 * @param r Red component (0-255)
 * @param g Green component (0-255)
 * @param b Blue component (0-255)
 * @returns Luminance (0-1)
 */
export function luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

/**
 * Calculate the contrast ratio between two luminances.
 * @param lum1 Luminance of the first color
 * @param lum2 Luminance of the second color
 * @returns Contrast ratio (1-21)
 */
export function contrastRatio(lum1: number, lum2: number): number {
    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

/**
 * Convert a hex color to an RGB object.
 * @param hex Hex color string (e.g., "#FFFFFF")
 * @returns RGB object
 */
export function hexToRgb(hex: string): { r: number, g: number, b: number } {
    const bigint = parseInt(hex.slice(1), 16);
    return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
    };
}

export function stringToTailwindHex(color: string): string {
    let colorHex = '';

    if (color === 'black') {
        colorHex = '#000000';
    } else if (color === 'white') {
        colorHex = '#FFFFFF';
    } else {
        Object.keys(colors).forEach((colorKey) => {
            if (color === colorKey) {
                colorHex = (colors as any)[colorKey][500];
            }
        });
    }

    return colorHex;
}