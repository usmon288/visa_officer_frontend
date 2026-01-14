import { motion } from 'framer-motion';

export function InterviewVideoBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.15 }}
      >
        <source
          src="https://videos.pexels.com/video-files/3194521/3194521-sd_640_360_24fps.mp4"
          type="video/mp4"
        />
        <source
          src="https://videos.pexels.com/video-files/3194521/3194521-sd_640_360_24fps.webm"
          type="video/webm"
        />
      </video>

      {/* Animated Interview Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Examiner Icon */}
          <motion.div
            className="mb-8 text-6xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            👨‍🏫
          </motion.div>

          {/* Conversation Bubble */}
          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-6 max-w-md mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-white/80 text-sm leading-relaxed">
              "Tell me about your academic background and why you want to study in the United States..."
            </p>
          </motion.div>

          {/* Student Icon */}
          <motion.div
            className="text-6xl"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            👨‍🎓
          </motion.div>

          {/* Response Bubble */}
          <motion.div
            className="bg-cyan-500/10 backdrop-blur-md border border-cyan-400/30 rounded-2xl px-8 py-6 max-w-md mx-auto mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <p className="text-cyan-300 text-sm leading-relaxed">
              "I have completed my Bachelor's in Engineering. I'm passionate about..."
            </p>
          </motion.div>

          {/* Live Indicator */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-2"
            animate={{ opacity: [0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/40 text-sm font-medium">LIVE INTERVIEW</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 pointer-events-none" />
    </div>
  );
}

export function SimpleInterviewScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.12 }}
      >
        <source
          src="https://videos.pexels.com/video-files/3194521/3194521-sd_640_360_24fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

      {/* Animated dots/particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
