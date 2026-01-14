import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  path: string;
}

const categories: Category[] = [
  {
    id: 'visa',
    title: 'Visa Interview',
    subtitle: 'US Embassy Preparation',
    icon: '🛂',
    gradient: 'from-emerald-500 to-teal-600',
    path: '/visa',
  },
  {
    id: 'ielts',
    title: 'IELTS Speaking',
    subtitle: 'Band 7+ Practice',
    icon: '🎓',
    gradient: 'from-blue-500 to-indigo-600',
    path: '/chat/ielts',
  },
];

export function CategorySelector() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      {categories.map((category, index) => (
        <motion.button
          key={category.id}
          onClick={() => navigate(category.path)}
          className="group relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-8 min-w-[280px]">
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

            <div className="relative z-10">
              <span className="text-5xl mb-4 block">{category.icon}</span>
              <h3 className="text-xl font-semibold text-white mb-1">{category.title}</h3>
              <p className="text-white/50 text-sm">{category.subtitle}</p>
            </div>

            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export function CategoryGrid() {
  const navigate = useNavigate();

  const visaTypes = [
    { id: 'work', label: 'Work Visa', emoji: '💼', desc: 'H1B, L1, O1' },
    { id: 'student', label: 'Student Visa', emoji: '📚', desc: 'F1, J1, M1' },
    { id: 'travel', label: 'Tourist Visa', emoji: '✈️', desc: 'B1/B2' },
    { id: 'worktravel', label: 'Work & Travel', emoji: '🌍', desc: 'J1 Summer' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visaTypes.map((type, index) => (
          <motion.button
            key={type.id}
            onClick={() => navigate(`/chat/visa-${type.id}`)}
            className="group relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/[0.06] p-6 text-left hover:bg-white/[0.06] transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{type.emoji}</span>
              <div>
                <h4 className="text-white font-medium text-lg">{type.label}</h4>
                <p className="text-white/40 text-sm">{type.desc}</p>
              </div>
            </div>

            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-white/40 transition-colors"
              whileHover={{ x: 4 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
