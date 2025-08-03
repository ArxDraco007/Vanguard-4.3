import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Users, Globe, BookOpen, Heart, Target, Award, Lightbulb, Crown, Star } from 'lucide-react'
import { VanguardScene } from './3D/VanguardScene'

export const AboutPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    }
  }

  const vanguardPrinciples = [
    {
      icon: Shield,
      title: "Leadership through Discipline",
      description: "Vanguard candidates develop unwavering discipline as the foundation of effective leadership. Through structured training and self-mastery, they learn to lead by example and inspire others through their commitment to excellence.",
      color: "red"
    },
    {
      icon: Award,
      title: "Merit-based Excellence",
      description: "Every achievement in Vanguard is earned through merit. We believe that true leadership emerges when individuals consistently demonstrate excellence, integrity, and dedication to their growth and service to others.",
      color: "blue"
    },
    {
      icon: Heart,
      title: "Sacrifice for the Greater Good",
      description: "Vanguard leaders understand that true greatness comes through sacrifice - putting the needs of others and the nation before personal gain. This principle shapes servant leaders who dedicate their lives to solving pressing problems.",
      color: "green"
    },
    {
      icon: Globe,
      title: "Nation-building Vision",
      description: "Inspired by Dexterity Global's mission, Vanguard candidates are groomed to become nation-builders who bridge the gap between education and leadership, working together to serve India and solve global challenges.",
      color: "yellow"
    },
    {
      icon: Users,
      title: "Collaborative Leadership",
      description: "Vanguard emphasizes that the greatest achievements come through collective effort. Our candidates learn to work together, leveraging diverse strengths to create solutions that no individual could achieve alone.",
      color: "purple"
    },
    {
      icon: Lightbulb,
      title: "Innovation in Service",
      description: "We encourage creative problem-solving and innovative approaches to age-old challenges. Vanguard leaders use their education as a tool for transformation, developing new ways to serve people and communities.",
      color: "indigo"
    }
  ]

  const vanguardValues = [
    "Discipline", "Merit", "Sacrifice", "Leadership", "Service",
    "Innovation", "Excellence", "Integrity", "Collaboration", "Nation-building"
  ]

  return (
    <VanguardScene>
      <div className="min-h-screen bg-gradient-to-br from-black/20 via-red-900/10 to-black/30 backdrop-blur-sm">
        {/* Header */}
        <motion.div 
          className="bg-black/40 backdrop-blur-md shadow-2xl border-b border-red-500/20"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 border border-red-500/30">
                  <span className="text-white font-bold text-xl">V</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Vanguard</h1>
                  <p className="text-xs text-red-300 uppercase tracking-wider font-semibold">DISCIPLINE. MERIT. SACRIFICE.</p>
                </div>
              </motion.div>

              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center gap-8">
                {[
                  { name: 'HOME', href: '/' },
                  { name: 'ABOUT', href: '/about', active: true },
                  { name: 'VISION', href: '/vision' },
                  { name: 'PROGRAMS', href: '/programs' },
                  { name: 'DOCS', href: '/documentation' }
                ].map((item) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-semibold tracking-wider transition-all duration-300 ${
                      item.active 
                        ? 'text-red-400 border-b-2 border-red-400 pb-1' 
                        : 'text-gray-300 hover:text-red-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>
            </div>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Hero Quote */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/30"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(220, 38, 38, 0.3)",
                  "0 0 40px rgba(220, 38, 38, 0.5)",
                  "0 0 20px rgba(220, 38, 38, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Crown className="w-10 h-10 text-red-400" />
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">About Vanguard</h1>
            
            <div className="bg-gradient-to-br from-black/60 to-red-900/30 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-red-500/20">
              <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-6">
                "Vanguard represents the pinnacle of leadership development - where <span className="text-red-400">Discipline</span>, <span className="text-red-400">Merit</span>, and <span className="text-red-400">Sacrifice</span> converge to create tomorrow's nation-builders."
              </blockquote>
              <cite className="text-red-300 text-lg font-semibold">
                The Vanguard Leadership Philosophy
              </cite>
            </div>
          </motion.div>

          {/* What is Vanguard */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-black/40 to-red-900/20 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-red-500/20">
              <h2 className="text-4xl font-bold text-white mb-8 text-center">What is Vanguard?</h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Vanguard is an elite leadership development program inspired by the <span className="font-bold text-red-400">Dexterity Global</span> vision of creating servant leaders. 
                  We represent the cutting edge of educational transformation, where young minds are shaped into future nation-builders through a 
                  rigorous curriculum rooted in timeless values.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Our program goes beyond traditional education by instilling a deep sense of purpose, fostering collaborative leadership, 
                  and developing the courage to tackle the world's most pressing challenges. Every Vanguard candidate is trained to be a 
                  local role model whose example can inspire and elevate entire communities.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Through semi-monastic discipline and merit-based excellence, Vanguard candidates learn that true leadership is not about 
                  personal achievement, but about service to others and dedication to the greater good.
                </p>
              </div>
            </div>
          </motion.div>

          {/* The Vanguard Principles */}
          <motion.div 
            className="mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-4xl font-bold text-white text-center mb-16"
              variants={itemVariants}
            >
              The Vanguard Principles
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {vanguardPrinciples.map((principle, index) => (
                <motion.div
                  key={principle.title}
                  className="bg-gradient-to-br from-black/40 to-gray-900/20 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-500/20 hover:border-red-500/30 transition-all duration-500"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <motion.div 
                    className={`w-16 h-16 bg-${principle.color}-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-${principle.color}-500/30 relative`}
                    animate={{
                      boxShadow: [
                        `0 0 20px rgba(${principle.color === 'blue' ? '59, 130, 246' : principle.color === 'red' ? '220, 38, 38' : principle.color === 'green' ? '34, 197, 94' : principle.color === 'yellow' ? '234, 179, 8' : principle.color === 'purple' ? '147, 51, 234' : '99, 102, 241'}, 0.3)`,
                        `0 0 40px rgba(${principle.color === 'blue' ? '59, 130, 246' : principle.color === 'red' ? '220, 38, 38' : principle.color === 'green' ? '34, 197, 94' : principle.color === 'yellow' ? '234, 179, 8' : principle.color === 'purple' ? '147, 51, 234' : '99, 102, 241'}, 0.5)`,
                        `0 0 20px rgba(${principle.color === 'blue' ? '59, 130, 246' : principle.color === 'red' ? '220, 38, 38' : principle.color === 'green' ? '34, 197, 94' : principle.color === 'yellow' ? '234, 179, 8' : principle.color === 'purple' ? '147, 51, 234' : '99, 102, 241'}, 0.3)`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 rounded-2xl"
                    />
                    <principle.icon className={`w-8 h-8 text-${principle.color}-400 relative z-10`} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-4">{principle.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Vanguard Values Grid */}
          <motion.div 
            className="bg-gradient-to-br from-black/40 to-red-900/20 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-red-500/20 mb-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              className="text-4xl font-bold text-white text-center mb-8"
              variants={itemVariants}
            >
              The Vanguard Values
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 text-center mb-12 max-w-4xl mx-auto leading-relaxed text-lg"
              variants={itemVariants}
            >
              These ten core values form the foundation of every Vanguard candidate's development. 
              They represent the essential qualities needed to become a servant leader who can 
              bridge the gap between education and real-world impact.
            </motion.p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {vanguardValues.map((value, index) => (
                <motion.div
                  key={value}
                  className="bg-red-500/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-red-500/30 hover:bg-red-500/30 transition-all duration-300 relative"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="relative z-10">
                    <div className="text-3xl font-bold text-red-400 mb-2">{index + 1}</div>
                    <div className="text-white font-semibold text-sm">{value}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Connection to Dexterity Global */}
          <motion.div 
            className="bg-gradient-to-br from-black/40 to-blue-900/20 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-blue-500/20 mb-20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto border border-blue-500/30"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(59, 130, 246, 0.3)",
                    "0 0 40px rgba(59, 130, 246, 0.5)",
                    "0 0 20px rgba(59, 130, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Globe className="w-10 h-10 text-blue-400" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-white mb-6">Inspired by Dexterity Global</h3>
              <p className="text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed text-lg">
                Vanguard is proudly inspired by <span className="font-bold text-blue-400">Dexterity Global's</span> revolutionary 
                approach to education and leadership development. We embody their core belief that education should be rooted in purpose 
                and leadership should be rooted in service.
              </p>
              
              <div className="bg-blue-500/10 rounded-2xl p-8 border border-blue-500/20">
                <blockquote className="text-xl font-bold text-white mb-4">
                  "If India has to grow, a generation of young Indians will have to bridge the gap between classroom education and global leadership."
                </blockquote>
                <cite className="text-blue-300 font-semibold">
                  Sharad Sagar, Founder and CEO, The Dexterity Global Group
                </cite>
              </div>
            </div>
          </motion.div>

          {/* Our Mission */}
          <motion.div 
            className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-purple-500/20"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center">
              <motion.div 
                className="w-20 h-20 bg-purple-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 mx-auto border border-purple-500/30"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.3)",
                    "0 0 40px rgba(147, 51, 234, 0.5)",
                    "0 0 20px rgba(147, 51, 234, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Star className="w-10 h-10 text-purple-400" />
              </motion.div>
              
              <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
              <p className="text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed text-lg">
                To develop a generation of <span className="font-bold text-purple-400">servant leaders</span> who will use their education 
                not for personal gain, but to serve people and solve the pressing problems of our world. Every Vanguard graduate becomes 
                a beacon of hope and a catalyst for positive change in their communities and beyond.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                {[
                  { icon: Target, title: "Purpose-Driven Education", desc: "Learning with clear intent to serve" },
                  { icon: Users, title: "Collaborative Impact", desc: "Working together for greater good" },
                  { icon: Crown, title: "Excellence in Service", desc: "Leading through example and sacrifice" }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="bg-purple-500/10 rounded-2xl p-6 border border-purple-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <item.icon className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                    <h4 className="font-bold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </VanguardScene>
  )
}