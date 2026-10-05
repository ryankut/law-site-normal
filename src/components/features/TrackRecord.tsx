import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, Scale, Users, TrendingUp } from 'lucide-react';

// --- CountUp Component (Remains same) ---
const CountUp: React.FC<{ end: number; suffix?: string; prefix?: string }> = ({ end, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setHasStarted(true);
      },
      { threshold: 0.1 }
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end]);

  return <span ref={countRef}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// --- NEW: Individual Stat Card Component ---
// This isolates the hover state so only the specific card responds
interface StatData {
  label: string;
  value: number;
  suffix?: string;
  description: string;
  icon: React.ReactNode;
  dark: boolean;
}

const StatCard = ({ stat }: { stat: StatData }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-10 rounded-2xl flex flex-col h-full border transition-all duration-500 ease-out ${
        isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm scale-100'
      } ${
        stat.dark 
        ? 'bg-[#0F1E2E] text-[#F7F5F0] border-white/10' 
        : 'bg-[#F2EFE8] text-[#0F1E2E] border-[#0F1E2E]/15'
      }`}
    >
      <div className={`w-fit mb-12 transition-transform duration-700 ease-in-out ${
        stat.dark ? 'text-[#C6A75E]' : 'text-[#0F1E2E]'
      } ${isHovered ? '[transform:rotateY(360deg)]' : ''}`}>
        {stat.icon}
      </div>
      
      <div className="mt-auto">
        <div className="text-4xl md:text-5xl font-bold serif mb-2">
          <CountUp end={stat.value} suffix={stat.suffix} />
        </div>
        <div className={`text-[10px] font-bold tracking-widest uppercase mb-6 ${
          stat.dark ? 'text-[#F7F5F0]/70' : 'text-[#0F1E2E]/60'
        }`}>
          {stat.label}
        </div>
        <p className={`text-xs font-light leading-relaxed ${
          stat.dark ? 'text-[#F7F5F0]/40' : 'text-[#4A5568]'
        }`}>
          {stat.description}
        </p>
      </div>
    </div>
  );
};

// --- Main TrackRecord Component ---
const TrackRecord: React.FC = () => {
  const stats = [
    {
      label: "CLIENT SATISFACTION",
      value: 98,
      suffix: "%",
      description: "Consistently exceeding client expectations",
      icon: <CheckCircle className="w-6 h-6" />,
      dark: true
    },
    {
      label: "CASES CLOSED",
      value: 2345,
      description: "Successful resolutions achieved",
      icon: <Scale className="w-6 h-6" />,
      dark: false
    },
    {
      label: "ACTIVE CLIENTS",
      value: 500,
      suffix: "+",
      description: "Businesses and individuals served",
      icon: <Users className="w-6 h-6" />,
      dark: false
    },
    {
      label: "WIN RATE",
      value: 95,
      suffix: "%",
      description: "In litigation and dispute resolution",
      icon: <TrendingUp className="w-6 h-6" />,
      dark: false
    }
  ];

  return (
    <section className="py-24 bg-[#F7F5F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F1E2E] serif">Proven Track Record</h2>
          <p className="text-[#4A5568] max-w-sm text-sm font-light leading-relaxed">
            Our results speak for themselves. Discover the impact we've made for our clients across various sectors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrackRecord;
