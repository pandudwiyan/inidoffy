/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, Suspense, useEffect } from "react";
import { motion } from "motion/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stars, Ring, Sphere, Float } from "@react-three/drei";
import * as THREE from "three";
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react";

// --- Custom Icons ---

const SaweriaIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.3"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.94 4.58C17.51 3.93 15.97 3.47 14.36 3.24C14.34 3.24 14.32 3.25 14.31 3.27C14.11 3.63 13.89 4.09 13.73 4.47C11.99 4.21 10.27 4.21 8.56 4.47C8.4 4.09 8.17 3.63 7.97 3.27C7.96 3.25 7.94 3.24 7.92 3.24C6.31 3.47 4.77 3.93 3.34 4.58C3.33 4.58 3.32 4.59 3.32 4.6C0.44 8.91 -0.35 13.12 0.04 17.27C0.04 17.28 0.05 17.3 0.06 17.31C1.96 18.71 3.8 19.56 5.6 20.12C5.62 20.13 5.65 20.12 5.66 20.1C6.09 19.52 6.47 18.9 6.8 18.24C6.82 18.21 6.8 18.17 6.77 18.16C6.17 17.93 5.59 17.65 5.04 17.33C5.01 17.31 5.01 17.27 5.03 17.25C5.15 17.16 5.27 17.07 5.38 16.97C5.39 16.96 5.41 16.96 5.42 16.96C9.07 18.63 13.01 18.63 16.62 16.96C16.63 16.96 16.65 16.96 16.66 16.97C16.77 17.07 16.89 17.16 17.01 17.25C17.03 17.27 17.03 17.31 17 17.33C16.45 17.65 15.87 17.93 15.27 18.16C15.24 18.17 15.22 18.21 15.24 18.24C15.57 18.9 15.95 19.52 16.38 20.1C16.39 20.12 16.42 20.13 16.44 20.12C18.24 19.56 20.08 18.71 21.98 17.31C21.99 17.3 22 17.28 22 17.27C22.46 12.42 21.25 8.25 18.95 4.6C18.95 4.59 18.94 4.58 18.94 4.58ZM8.02 14.88C6.94 14.88 6.05 13.89 6.05 12.67C6.05 11.45 6.91 10.46 8.02 10.46C9.13 10.46 10.02 11.45 10 12.67C10 13.89 9.12 14.88 8.02 14.88ZM14.01 14.88C12.93 14.88 12.04 13.89 12.04 12.67C12.04 11.45 12.9 10.46 14.01 10.46C15.12 10.46 16.01 11.45 15.99 12.67C15.99 13.89 15.11 14.88 14.01 14.88Z" fill="currentColor"/>
  </svg>
);

// --- 3D Orbiting Planets ---

function OrbitingPlanet({ radius, speed, size, color = "#ffffff", offset = 0 }: { radius: number, speed: number, size: number, color?: string, offset?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed + offset;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.position.y = Math.sin(t * 0.5) * (radius * 0.2);
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]}>
      <meshBasicMaterial color={color} transparent opacity={0.6} />
      <Ring args={[size * 1.2, size * 1.25, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </Ring>
    </Sphere>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 15]} />
      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      <Suspense fallback={null}>
        {/* Orbiting Planets around the center */}
        <OrbitingPlanet radius={4} speed={0.5} size={0.15} offset={0} />
        <OrbitingPlanet radius={6} speed={0.3} size={0.25} offset={Math.PI} />
        <OrbitingPlanet radius={8} speed={0.2} size={0.1} offset={Math.PI / 2} />
        <OrbitingPlanet radius={5} speed={0.4} size={0.2} offset={-Math.PI / 4} />
      </Suspense>
      <ambientLight intensity={0.1} />
    </>
  );
}

// --- UI Components ---

const links = [
  {
    name: "Saweria",
    label: "Support the silence",
    url: "https://saweria.co/inidoffy",
    icon: SaweriaIcon,
  },
  {
    name: "Discord",
    label: "inidoffy",
    url: "https://discord.gg/dqcHDaEm",
    icon: DiscordIcon,
  }
];

const GlowingRing = () => (
  <div className="absolute -inset-[2px] pointer-events-none z-0">
    {/* Animated Neon Border */}
    <motion.div
      animate={{ 
        boxShadow: [
          "0 0 5px #3b82f6, 0 0 10px #3b82f6",
          "0 0 10px #a855f7, 0 0 20px #a855f7",
          "0 0 5px #3b82f6, 0 0 10px #3b82f6"
        ],
        borderColor: ["#3b82f6", "#a855f7", "#3b82f6"]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className="absolute inset-0 rounded-full border-2 border-cyan-400"
    />
    {/* Rotating Gradient Ring */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute -inset-1 rounded-full border border-transparent bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-border opacity-50"
      style={{ 
        maskImage: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'destination-out'
      }}
    />
  </div>
);

export default function App() {
  const [profileData, setProfileData] = useState({
    nickname: "Skizoo",
    avatar: "https://unavatar.io/tiktok/inidoffy"
  });

  // Dynamic TikTok Data Fetching via Gemini
  useEffect(() => {
    const fetchTikTokData = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "What is the current nickname of TikTok user @inidoffy? Return only the nickname string.",
          config: { tools: [{ googleSearch: {} }] }
        });
        
        const nickname = response.text?.trim();
        if (nickname && nickname.length < 50) {
          setProfileData(prev => ({ ...prev, nickname }));
        }
      } catch (error) {
        console.error("Failed to fetch dynamic TikTok data:", error);
      }
    };

    fetchTikTokData();
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center selection:bg-white/10 overflow-y-auto overflow-x-hidden bg-black">
      
      <div className="vignette" />

      {/* 3D Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas dpr={[1, 2]}>
          <Scene />
        </Canvas>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-2xl px-6 py-24 md:py-40 flex flex-col items-center">
        
        {/* Profile Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <div className="relative mb-8">
            <GlowingRing />
            {/* Scanline Overlay for Profile */}
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20 opacity-20">
              <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
            </div>
            {/* Orbiting Rings Animation */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-white/10 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-8 border border-white/5 rounded-full"
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-12 border border-white/[0.02] rounded-full"
            />
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-6 border border-white/10 rounded-full"
            />
            
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden relative z-10">
              <img 
                src={profileData.avatar} 
                alt={profileData.nickname} 
                className="w-full h-full object-cover grayscale brightness-75 contrast-125 sepia-[0.5] hue-rotate-[180deg] opacity-90"
                referrerPolicy="no-referrer"
              />
              {/* Hologram Flicker Overlay */}
              <motion.div 
                animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-cyan-400 mix-blend-overlay pointer-events-none"
              />
            </div>
          </div>

          <div className="glitch-wrapper mb-6">
            <h1 className="glitch-text" data-text={profileData.nickname}>
              {profileData.nickname}
            </h1>
          </div>
        </motion.div>

        {/* Links Section */}
        <div className="w-full space-y-4 mb-20">
          {links.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-between p-5 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md transition-all duration-300"
            >
              <div className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 group-hover:text-white transition-colors">
                  <link.icon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">
                    {link.name}
                  </span>
                  <span className="text-xs text-white/30">
                    {link.label}
                  </span>
                </div>
              </div>
              
              <ExternalLink size={18} className="text-white/10 group-hover:text-white/40 transition-all" />
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="w-full flex flex-col items-center gap-6 pt-12 border-t border-white/5"
        >
          <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">
            Free Thinker
          </p>
          <div className="flex items-center gap-3 text-white/5">
            <div className="w-8 h-px bg-current" />
            <Sparkles size={12} />
            <div className="w-8 h-px bg-current" />
          </div>
        </motion.footer>
      </div>
    </main>
  );
}
