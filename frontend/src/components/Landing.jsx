import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function Hero() {
  return (
    <section className="relative w-full h-screen bg-black text-white">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        src="/hero.mp4"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-start">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Powering Ethiopia’s Industry,
          <span className="text-indigo-400"> Igniting Grassroots Innovation.</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-4 text-lg md:text-xl max-w-xl text-gray-200">
          From Industrial Machine Maintenance to Renewable Energy Solutions. We are ABK Technologies.
        </motion.p>

        <motion.div className="mt-8 flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <a href="#services" className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300">Explore Services</a>
          <a href="#partner" className="px-6 py-3 border border-white/20 rounded-md hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/20">Partner With Us</a>
        </motion.div>
      </div>
    </section>
  );
}

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = null;
    const from = 0;
    const to = target;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(from + (to - from) * progress));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

function StatsCounter() {
  const projects = useCountUp(50);
  const startups = useCountUp(10);
  const partners = useCountUp(1);

  const card = (label, value) => (
    <motion.div whileInView={{ y: [20, 0], opacity: [0, 1] }} viewport={{ once: true }} className="p-8 bg-white rounded-lg shadow">
      <div className="text-4xl font-bold text-indigo-600">{value}</div>
      <div className="mt-2 text-sm font-medium text-gray-700">{label}</div>
    </motion.div>
  );

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {card('Projects', `${projects}+`)}
          {card('Startups Incubated', `${startups}+`)}
          {card('Partnered', partners === 1 ? 'UoG' : `${partners}+`)}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold">ABK Technologies</h1>
      <p className="mt-2 text-gray-600">The original landing content has been moved to <code>frontend/seeds_backup/Landing.jsx</code> to remove demo/static seed content. This placeholder keeps the route functional.</p>

      <div className="mt-6">
        <a className="mr-4 text-indigo-600" href="/portal">Go to Portal</a>
        <a className="text-indigo-600" href="/about">About</a>
      </div>
    </div>
  )
}

function PartnersStrip() {
  const partners = [
    { name: 'University of Gondar', src: '/partners/uog.png' },
    { name: 'Etige Mintwabe', src: '/partners/etige.png' },
    { name: 'Partner 3', src: '/partners/partner3.png' },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-6">
        <h3 className="text-lg font-medium">Our Partners</h3>
        <div className="mt-4 flex items-center gap-6 overflow-x-auto py-4" role="list">
          {partners.map((p) => (
            <div key={p.name} role="listitem" className="flex-shrink-0 w-48 h-20 flex items-center justify-center">
              <img src={p.src} alt={p.name} className="max-h-12 object-contain filter grayscale opacity-80" onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
              <span className="sr-only">{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pillar({ title, icon, desc }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition">
      <div className="text-3xl">{icon}</div>
      <h4 className="mt-3 font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-gray-600">{desc}</p>
    </div>
  );
}

function FeaturedImpact() {
  const [pos, setPos] = useState(50);
  const sliderRef = useRef(null);

  // keyboard support for slider (left/right)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5));
      if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5));
      if (e.key === 'Home') setPos(0);
      if (e.key === 'End') setPos(100);
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section className="py-16 container mx-auto px-6">
      <h2 className="text-2xl font-semibold">Featured Impact Story</h2>
      <p className="mt-2 text-gray-600">Endoscopy Maintenance — healthcare impact case study</p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="text-xl font-bold">Endoscopy Maintenance — Gondar Hospital</h3>
          <p className="mt-4 text-gray-700">Challenge: Critical endoscopy equipment failure impacted patient care.
          Solution: Rapid diagnostics, rewinding, parts replacement and systematic testing to restore service within 48 hours.</p>
          <ul className="mt-4 list-disc ml-5 text-gray-700">
            <li>Rapid response and diagnostics</li>
            <li>Skilled technicians and parts procurement</li>
            <li>Long-term maintenance plan</li>
          </ul>
        </div>

        <div>
          <div className="relative w-full h-64 bg-gray-200 rounded overflow-hidden shadow-sm">
            {/* Before image (base) */}
            <img src="/cases/endoscopy-before.jpg" alt="Before repair - endoscopy machine" className="absolute inset-0 w-full h-full object-cover" />

            {/* After image clipped by slider position - use inline width but Tailwind for layout */}
            <div className="absolute left-0 top-0 h-full overflow-hidden" style={{ width: `${pos}%` }}>
              <img src="/cases/endoscopy-after.jpg" alt="After repair - endoscopy machine" className="w-full h-full object-cover" />
            </div>

            {/* Slider handle - visible bar + knob */}
            <div className="absolute top-0 bottom-0 transform -translate-x-1/2" style={{ left: `${pos}%` }} aria-hidden="true">
              <div className="w-0.5 h-full bg-white/80" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-600 shadow" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <input
              ref={sliderRef}
              type="range"
              min="0"
              max="100"
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              className="w-full accent-indigo-600"
              aria-label="Before and after slider"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pos}
            />
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Before</span>
              <span className="font-medium">{pos}%</span>
              <span>After</span>
            </div>
            <div className="sr-only" aria-live="polite">Slider position {pos} percent</div>
          </div>
        </div>
      </div>
    </section>
  );
}
