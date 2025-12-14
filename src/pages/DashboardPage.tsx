import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Target, CheckSquare, TrendingUp, Zap, Award } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import DashboardChart from '../components/DashboardChart';
import TodayHabits from '../components/TodayHabits';
import TodayTasks from '../components/TodayTasks';
import CollaborativeTasks from '../components/CollaborativeTasks';
import ActiveOKRs from '../components/ActiveOKRs';

const DashboardPage: React.FC = () => {
  const { user, tasks, habits, okrs, isPremium } = useTasks();

  if (!user) return null;

  // Calculer les statistiques du jour
  const today = new Date().toISOString().split('T')[0];
  const todayHabits = habits.filter(habit => habit.completions[today]);
  const todayTasks = tasks.filter(task => 
    !task.completed && 
    new Date(task.deadline).toDateString() === new Date().toDateString()
  );
  
  const totalHabitsTime = todayHabits.reduce((sum, habit) => sum + habit.estimatedTime, 0);
  const totalTasksTime = todayTasks.reduce((sum, task) => sum + task.estimatedTime, 0);
  const totalWorkTime = totalHabitsTime + totalTasksTime;

  const completedTasksToday = tasks.filter(task => 
    task.completed && 
    task.completedAt &&
    new Date(task.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const activeOKRs = okrs.filter(okr => !okr.completed);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const statCards = [
    {
      icon: CheckSquare,
      label: 'Tâches complétées',
      value: completedTasksToday,
      subtitle: "Aujourd'hui",
      gradient: 'from-blue-500 via-blue-600 to-cyan-600',
      borderGradient: 'from-blue-400/50 to-cyan-400/50',
      glowColor: 'group-hover:shadow-blue-500/40 dark:group-hover:shadow-blue-400/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      bgPattern: 'bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 dark:from-blue-400/10 dark:via-transparent dark:to-cyan-400/10'
    },
    {
      icon: Target,
      label: 'OKR actifs',
      value: activeOKRs.length,
      subtitle: 'En cours',
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      borderGradient: 'from-emerald-400/50 to-teal-400/50',
      glowColor: 'group-hover:shadow-emerald-500/40 dark:group-hover:shadow-emerald-400/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgPattern: 'bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 dark:from-emerald-400/10 dark:via-transparent dark:to-teal-400/10'
    },
    {
      icon: Clock,
      label: 'Habitudes',
      value: todayHabits.length,
      subtitle: 'Réalisées',
      gradient: 'from-purple-500 via-fuchsia-600 to-pink-600',
      borderGradient: 'from-purple-400/50 to-pink-400/50',
      glowColor: 'group-hover:shadow-purple-500/40 dark:group-hover:shadow-purple-400/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      bgPattern: 'bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 dark:from-purple-400/10 dark:via-transparent dark:to-pink-400/10'
    },
    {
      icon: TrendingUp,
      label: 'Productivité',
      value: '+12%',
      subtitle: 'Cette semaine',
      gradient: 'from-orange-500 via-red-600 to-rose-600',
      borderGradient: 'from-orange-400/50 to-rose-400/50',
      glowColor: 'group-hover:shadow-orange-500/40 dark:group-hover:shadow-orange-400/30',
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgPattern: 'bg-gradient-to-br from-orange-500/5 via-transparent to-rose-500/5 dark:from-orange-400/10 dark:via-transparent dark:to-rose-400/10'
    }
  ];

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))] p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <motion.div 
        className="max-w-[1600px] mx-auto space-y-6 lg:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header avec salutation */}
        <motion.div 
          className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6"
          variants={itemVariants}
        >
          <div className="flex-1">
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[rgb(var(--color-text-primary))] mb-2 lg:mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Bonjour, <motion.span
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                {user.name.split(' ')[0]}
              </motion.span> 👋
            </motion.h1>
            <motion.p 
              className="text-[rgb(var(--color-text-secondary))] text-base lg:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Voici votre tableau de bord pour aujourd'hui
            </motion.p>
          </div>
          
          {/* Résumé du temps */}
          <motion.div 
            className="card p-6 lg:p-8 w-full lg:min-w-[320px] lg:max-w-[380px] relative overflow-hidden backdrop-blur-sm"
            whileHover={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Gradient background effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-base lg:text-lg font-semibold text-[rgb(var(--color-text-primary))] mb-4 lg:mb-6 flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📊
                </motion.span>
                <span>Temps estimé aujourd'hui</span>
              </h3>
              <div className="space-y-3 lg:space-y-4">
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 transition-all duration-200"
                  whileHover={{ x: 5, backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
                >
                  <span className="text-sm text-blue-700 dark:text-[rgb(var(--color-text-secondary))] font-semibold">Habitudes</span>
                  <span className="font-bold text-blue-800 dark:text-blue-400 text-sm lg:text-base">
                    {Math.floor(totalHabitsTime / 60)}h{totalHabitsTime % 60}min
                  </span>
                </motion.div>
                <motion.div 
                  className="flex justify-between items-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/30 transition-all duration-200"
                  whileHover={{ x: 5, backgroundColor: 'rgba(249, 115, 22, 0.08)' }}
                >
                  <span className="text-sm text-orange-700 dark:text-[rgb(var(--color-text-secondary))] font-semibold">Tâches urgentes</span>
                  <span className="font-bold text-orange-800 dark:text-orange-400 text-sm lg:text-base">
                    {Math.floor(totalTasksTime / 60)}h{totalTasksTime % 60}min
                  </span>
                </motion.div>
                <motion.div 
                  className="border-t border-gray-200 dark:border-[rgb(var(--color-border))] pt-3 flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800/30"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="font-bold text-slate-800 dark:text-[rgb(var(--color-text-primary))]">Total</span>
                  <motion.span 
                    className="font-bold text-slate-900 dark:text-[rgb(var(--color-text-primary))] text-lg lg:text-xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {Math.floor(totalWorkTime / 60)}h{totalWorkTime % 60}min
                  </motion.span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Statistiques rapides */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6"
          variants={containerVariants}
        >
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className={`relative overflow-hidden group cursor-pointer`}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {/* Glassmorphic card background */}
              <div className="card p-6 lg:p-8 h-full backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 border border-white/20 dark:border-gray-700/30 relative z-10">
                {/* Animated gradient border overlay */}
                <motion.div 
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stat.borderGradient} opacity-0 group-hover:opacity-100 blur-sm -z-10 transition-opacity duration-500`}
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                />

                {/* Background pattern */}
                <div className={`absolute inset-0 ${stat.bgPattern} rounded-xl transition-all duration-500`} />

                {/* Floating orbs for depth */}
                <motion.div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-700`}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />

                <div className="relative z-10">
                  {/* Icon with enhanced animation */}
                  <motion.div 
                    className="mb-4 inline-flex"
                    whileHover={{ 
                      rotate: [0, -10, 10, -10, 0],
                      scale: 1.15
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.glowColor} transition-shadow duration-300`}>
                      <stat.icon size={26} className="text-white" strokeWidth={2.5} />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-[rgb(var(--color-text-secondary))] font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <motion.div
                      className="flex items-baseline gap-2"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                    >
                      <motion.p 
                        className={`text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {stat.value}
                      </motion.p>
                    </motion.div>
                    <p className={`text-xs font-semibold ${stat.iconColor} flex items-center gap-1`}>
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        •
                      </motion.span>
                      {stat.subtitle}
                    </p>
                  </div>
                </div>

                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"
                  style={{ skewX: "-20deg" }}
                />
              </div>

              {/* Outer glow shadow */}
              <div className={`absolute inset-0 rounded-xl shadow-2xl ${stat.glowColor} opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl -z-20`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Contenu principal en grille */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
        >
          {/* Colonne gauche - Graphique */}
          <motion.div 
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <DashboardChart />
          </motion.div>
          
          {/* Colonne droite - Habitudes du jour */}
          <motion.div 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <TodayHabits />
          </motion.div>
        </motion.div>

        {/* Deuxième rangée */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
          variants={containerVariants}
        >
          {/* OKR en cours */}
          <motion.div variants={itemVariants}>
            <ActiveOKRs />
          </motion.div>
          
          {/* Mini To-Do List du jour */}
          <motion.div variants={itemVariants}>
            <TodayTasks />
          </motion.div>
        </motion.div>

        {/* Section Tâches collaboratives */}
        <motion.div variants={itemVariants}>
          <CollaborativeTasks />
        </motion.div>

        {/* Floating action button for quick add */}
        <motion.button
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full shadow-2xl shadow-blue-500/30 dark:shadow-blue-400/20 flex items-center justify-center text-white z-50 hover:shadow-blue-500/50 dark:hover:shadow-blue-400/30 transition-shadow duration-300"
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <Zap size={24} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
