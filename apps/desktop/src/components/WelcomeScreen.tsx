import { motion } from 'framer-motion'

const ParticlePattern = () => {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    delay: Math.random() * 2,
  }))

  return (
    <div className="relative w-48 h-48 mb-8">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {particles.map((particle) => (
          <motion.line
            key={particle.id}
            x1={100}
            y1={100}
            x2={100 + particle.x}
            y2={100 + particle.y}
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ opacity: 0, x2: 100, y2: 100 }}
            animate={{
              opacity: [0, 0.8, 0],
              x2: [100, 100 + particle.x * 1.5, 100 + particle.x * 2],
              y2: [100, 100 + particle.y * 1.5, 100 + particle.y * 2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-between px-6 py-12">
      <div className="w-full flex justify-center mt-8">
        <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm w-full">
        <ParticlePattern />
        
        <motion.h1 
          className="text-4xl font-bold text-white mb-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 text-center mb-12 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your journey starts from here
        </motion.p>

        <motion.div
          className="w-full space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <button className="w-full bg-white text-black font-semibold py-4 px-6 rounded-full hover:bg-gray-100 transition-colors">
            Continue
          </button>
          
          <button className="w-full bg-[#1C1C1E] text-white font-semibold py-4 px-6 rounded-full border border-gray-700 flex items-center justify-center gap-2 hover:bg-[#2C2C2E] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Continue with Apple
          </button>
        </motion.div>
      </div>

      <div className="w-full max-w-sm text-center text-gray-500 text-xs leading-relaxed mb-4">
        <p>By pressing on "Continue with..." you agree</p>
        <p>to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span></p>
      </div>
      
      <div className="w-32 h-1 bg-white rounded-full"></div>
    </div>
  )
}
