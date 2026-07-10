import { useEffect, useRef, useState } from "react";
import { Users, Tractor, CalendarCheck2, Star } from "lucide-react";

// Custom counter hook — no external dependency needed
function useCountUp(end: number, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    startTime.current = null;
    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration, decimals]);

  return count;
}

interface StatItem {
  icon: React.ReactNode;
  number: number;
  suffix: string;
  title: string;
  decimals?: number;
}

const stats: StatItem[] = [
  {
    icon: <Users size={40} className="text-green-700" />,
    number: 2500,
    suffix: "+",
    title: "Farmers",
  },
  {
    icon: <Tractor size={40} className="text-green-700" />,
    number: 500,
    suffix: "+",
    title: "Providers",
  },
  {
    icon: <CalendarCheck2 size={40} className="text-green-700" />,
    number: 15000,
    suffix: "+",
    title: "Bookings",
  },
  {
    icon: <Star size={40} className="text-yellow-500" />,
    number: 4.8,
    decimals: 1,
    suffix: "/5",
    title: "Rating",
  },
];

function StatCard({ item }: { item: StatItem }) {
  const count = useCountUp(item.number, 2000, item.decimals ?? 0);
  return (
    <div className="bg-slate-50 rounded-2xl shadow-lg hover:shadow-xl transition p-8 text-center">
      <div className="flex justify-center mb-5">{item.icon}</div>
      <h2 className="text-5xl font-bold text-green-700">
        {count.toFixed(item.decimals ?? 0)}
        {item.suffix}
      </h2>
      <p className="mt-3 text-gray-600 text-lg">{item.title}</p>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Stats;