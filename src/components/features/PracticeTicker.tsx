import React, { memo } from 'react';
import { Sparkles } from 'lucide-react';

const practiceAreas = [
    "Criminal Defense Law",
    "Tax Law",
    "Immigration Law",
    "Divorce Law",
    "Corporate Law",
    "Personal Injury Law",
    "Family law"
];

const TickerItem: React.FC<{ text: string }> = memo(({ text }) => (
    <div className="flex items-center gap-4 px-8 group">
        <Sparkles size={12} className="text-[#0F1E2E] opacity-50 group-hover:opacity-100 transition-opacity" />
        <span className="text-[#0F1E2E] font-bold tracking-[0.2em] text-[10px] uppercase whitespace-nowrap">
            {text}
        </span>
    </div>
));

const PracticeTicker: React.FC = () => {
    // Triple the list to ensure seamless infinite scroll
    const fullList = [...practiceAreas, ...practiceAreas, ...practiceAreas];

    return (
        <div className="bg-[#C6A75E] border-y border-[#0F1E2E]/10 py-3 relative overflow-hidden z-20">
            <div className="ticker-content flex items-center whitespace-nowrap">
                {fullList.map((area, i) => (
                    <TickerItem key={i} text={area} />
                ))}
            </div>
        </div>
    );
};

export default memo(PracticeTicker);
