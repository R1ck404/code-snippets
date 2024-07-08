import { useState } from 'react';
import colors from 'tailwindcss/colors';

interface ColorPickerProps {
    selectedColor: string;
    setSelectedColor: (color: string) => void;
}

export default function ColorPicker({ selectedColor, setSelectedColor }: ColorPickerProps) {
    const colorList = Object.keys(colors).splice(3, Object.keys(colors).length - 9);

    return (
        <div className="flex flex-wrap">
            {colorList.map((color) => (
                <div className={`w-5 h-5 rounded-lg bg-${color}-500 m-0.5 cursor-pointer ${selectedColor === color ? 'border-2 border-white' : 'border-0'}`} key={color} style={{ backgroundColor: (colors as any)[color][500] ?? (colors as any)[color] }} onClick={() => setSelectedColor(color)}></div>
            ))}
        </div>
    )
}