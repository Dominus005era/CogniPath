import { motion } from 'motion/react';
import { useState } from 'react';
import { Moon, Sun, ArrowRight, Brain, Zap, Target, Users, BookOpen, Star, Trophy, BarChart3 } from 'lucide-react';

export default function LandingView({ setView, darkMode, setDarkMode }: { setView: (view: 'dashboard' | 'landing') => void, darkMode: boolean, setDarkMode: (d: boolean) => void }) {
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const blogPosts = [
    { 
      title: 'The Future of AI in Education', 
      desc: 'How adaptive learning is changing classrooms.', 
      content: 'Artificial intelligence is fundamentally reshaping how knowledge is structured, transmitted, and consumed. Traditional classrooms operate on a one-size-fits-all model, leaving struggling students behind and stalling advanced learners.\n\nAdaptive learning engines, like CogniPath, dynamically assess a learner\'s mastery in real-time, tailoring the curriculum, pacing, and challenges to their precise cognitive profile.\n\nBy combining natural language processing, cognitive path mapping, and gamified progress tracking, we can create hyper-personalized educational journeys that make mastery accessible to everyone. In the coming decade, we will witness a transition from rigid curriculum structures to fluid, living roadmaps that grow and adapt alongside the student, ensuring that learning is always engaging, deeply rewarding, and incredibly efficient.' 
    },
    { 
      title: 'Gamification Strategies', 
      desc: 'Why rewards motivate lifelong learners.', 
      content: 'Gamification is not just about points and badges; it is about leveraging core human drives to foster deep motivation and consistency. By integrating game mechanics into serious learning, we tap into our desire for progression, competence, and achievement.\n\nEarning EXP provides immediate micro-feedback that validates the user\'s focus and effort, while visual roadmaps satisfy the desire for clear goals and milestone progression.\n\nDaily streak mechanics maintain momentum, encouraging small, consistent acts of learning that compile into lifelong mastery over time. When we make the struggle of learning rewarding, we transform curiosity into habit, enabling anyone to master complex fields without burning out.' 
    },
    { 
      title: 'Mastering Deep Work', 
      desc: 'Tips for focused, intensive study sessions.', 
      content: 'In an age of endless digital distraction, the capacity for deep work has become a rare and highly valuable superpower. Deep work refers to professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit.\n\nThese efforts create new value, improve your skill, and are hard to replicate. To cultivate this ability, learners must design focused, intensive study sessions.\n\nStart by eliminating all environmental noise and notifications, committing to a single, challenging topic for a 90-minute block. Visualizing your milestones beforehand using a structured roadmap reduces the cognitive load of deciding \'what to study next\', letting you channel 100% of your mental energy directly into comprehension and synthesis.' 
    },
    { 
      title: 'Cognitive Mapping', 
      desc: 'How we visualize complex relationships.', 
      content: 'Our brains do not store information in isolated index cards; they construct interconnected semantic networks of concepts, relationships, and hierarchies. Cognitive mapping is the science of visualizing these complex relationships, allowing learners to see both the forest and the trees simultaneously.\n\nBy mapping a field of study—such as computer science or philosophy—as a network of nodes and pathways, learners can understand how basic prerequisites connect to advanced concepts.\n\nThis spatial approach to knowledge organization dramatically improves memory retention, speeds up information retrieval, and helps identify knowledge gaps, making the path to mastery clear and structured.' 
    },
    { 
      title: 'Lifelong Learning', 
      desc: 'Building habits for perpetual growth.', 
      content: 'Learning is no longer an activity confined to the first quarter of our lives; it is a continuous, lifelong necessity. As technologies and industries evolve at an exponential pace, the ability to rapidly acquire new skills has become the ultimate career and personal asset.\n\nTo build a robust habit of lifelong learning, one must shift their identity from \'someone who knows\' to \'someone who learns\'. This requires setting aside a dedicated block of time daily, maintaining a diverse portfolio of intellectual curiosity, and using tools that structure open-ended subjects into manageable, bite-sized quests.\n\nOver months and years, these small daily additions of knowledge accumulate into compound growth, completely transforming your personal and professional capabilities.' 
    },
    { 
      title: 'AI Prompt Engineering', 
      desc: 'Getting the best from your roadmaps.', 
      content: 'To get the most out of automated learning platforms, understanding prompt engineering is crucial. How you frame your learning goals, background knowledge, and desired depth dictates the quality of the generated roadmap.\n\nWhen initiating a new topic, be highly specific: define your current level, specify your primary goal (e.g., \'to build a working web app\' vs \'to pass a theoretical exam\'), and mention any constraints.\n\nBy guiding the AI with precise constraints and contexts, the resulting curriculum is perfectly aligned with your immediate needs, turning a generic roadmap into a hyper-targeted, laser-focused instrument of skill acquisition.' 
    },
    { 
      title: 'Skill Acquisition 101', 
      desc: 'The science behind mastery.', 
      content: 'The science of skill acquisition demonstrates that anyone can learn a new skill efficiently if they systematically deconstruct it. According to cognitive science, the first phase involves identifying the sub-skills that contribute to the target competency.\n\nBy breaking down a massive topic into its core components, you can focus on mastering one sub-skill at a time, avoiding cognitive overload.\n\nPair this with active practice—recalling information, building small projects, and testing yourself—rather than passive reading. This active, deliberate practice strengthens neural connections, rapidly shifting skills from slow, conscious processing to fast, automatic mastery.' 
    },
    { 
      title: 'The Road to 10k EXP', 
      desc: 'A guide for power users.', 
      content: 'Reaching 10,000 EXP on CogniPath is a milestone reserved for dedicated learners who have mastered the art of learning consistency. To reach this elite level, power users must optimize their daily schedule.\n\nThe secret lies in pairing learning with existing habits—such as studying for 20 minutes with your morning coffee.\n\nUtilize the active assessment milestones to earn massive bonus points, and never let your daily streak multiplier reset. By approaching your learning roadmap as a grand, gamified quest, you not only accumulate experience points rapidly but also build a powerful mental momentum that makes study feel like play.' 
    },
    { 
      title: 'Data-Driven Growth', 
      desc: 'Using analytics to track your path.', 
      content: 'Subjective self-assessment is notoriously prone bias, which is why tracking your learning journey with quantitative analytics is so powerful. By analyzing metrics such as daily focus duration, lesson completion rates, streak history, and conceptual mastery percentages, you gain an objective, mirror-like view of your cognitive progress.\n\nData-driven growth allows you to spot performance bottlenecks—such as a specific subject block that took twice as long to complete—allowing you to adapt your study strategies.\n\nWhen progress is visualized, motivation rises, and learning becomes a precise, optimized science.' 
    }
  ];

  const NavItem = ({ label }: { label: string }) => (
    <a href={`#${label.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold transition-colors duration-200">{label}</a>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0a0f1c] text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30 font-sans transition-colors duration-500 overflow-x-hidden">
      {/* Premium Glassmorphism Header */}
      <header className="fixed top-0 left-0 right-0 h-20 px-6 md:px-12 flex items-center justify-between bg-white/70 dark:bg-[#0a0f1c]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45 transform group-hover:rotate-90 transition-transform duration-500"></div>
          </div>
          <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tight">CogniPath</span>
        </div>
        <nav className="hidden md:flex items-center space-x-10">
          <NavItem label="Platform" />
          <NavItem label="Methodology" />
          <NavItem label="How it Works" />
          <NavItem label="Insights" />
        </nav>
        <div className="flex items-center gap-5">
          <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all duration-200">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setView('dashboard')}
            className="group relative px-7 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Platform <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 dark:group-hover:opacity-10 transition-opacity duration-300 z-0"></div>
          </button>
        </div>
      </header>

      {/* Hero Section with Dynamic Mesh Gradient */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 dark:bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-600/20 rounded-full blur-[128px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold text-sm mb-8 shadow-sm"
        >
          <SparklesIcon /> Announcing CogniPath 2.0: AI-Powered Learning
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 max-w-5xl tracking-tighter leading-[1.1] relative z-10 text-slate-900 dark:text-white"
        >
          Unlock Your Potential with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Gamified Cognition</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-3xl relative z-10 font-medium leading-relaxed"
        >
          Transform any complex topic into a structured, interactive, and deeply rewarding learning journey. Earn EXP, build streaks, and master new skills faster than ever before.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 relative z-10"
        >
          <button
            onClick={() => setView('dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl text-lg font-bold shadow-xl shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
          >
            Start Your Journey <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl text-lg font-bold shadow-sm backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-3">
            View Live Demo
          </button>
        </motion.div>
        
        {/* Dashboard Preview Image/Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 60 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-20 relative w-full max-w-6xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-indigo-500/10 border border-slate-200/50 dark:border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0a0f1c] via-transparent to-transparent z-10 pointer-events-none h-full"></div>
          <img src="https://picsum.photos/seed/cognipath-dashboard/1920/1080" alt="Platform Dashboard Preview" className="w-full h-auto object-cover opacity-90 dark:opacity-70 scale-105" />
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-y border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-8">Trusted by lifelong learners at top organizations</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Abstract Logos using Lucide icons */}
            <div className="flex items-center gap-2 text-xl font-bold font-serif"><Brain size={28}/> NeuroTech</div>
            <div className="flex items-center gap-2 text-xl font-bold tracking-tighter"><Zap size={28}/> SYNAPSE</div>
            <div className="flex items-center gap-2 text-xl font-bold"><Target size={28}/> Focus Corp</div>
            <div className="flex items-center gap-2 text-xl font-bold italic"><Users size={28}/> CrowdLearn</div>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section id="platform" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">The Enterprise Learning Engine</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Our platform leverages cutting-edge AI to decompose complex subjects into bite-sized, gamified milestones that keep you motivated and engaged.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                {icon: <BookOpen className="text-blue-500" size={32}/>, title: 'Interactive Roadmaps', desc: 'Visual, step-by-step learning paths that intelligently adapt to your individual pace and comprehension level.', color: 'bg-blue-500/10'},
                {icon: <Trophy className="text-amber-500" size={32}/>, title: 'Gamified Progression', desc: 'Earn real EXP, unlock dynamic achievements, and climb the leaderboards to stay deeply motivated.', color: 'bg-amber-500/10'},
                {icon: <Brain className="text-purple-500" size={32}/>, title: 'AI-Driven Insights', desc: 'Hyper-personalized content generation based exactly on your unique learning goals and knowledge gaps.', color: 'bg-purple-500/10'},
                {icon: <BarChart3 className="text-emerald-500" size={32}/>, title: 'Advanced Analytics', desc: 'Track your long-term growth with highly detailed cognitive mastery reports and retention metrics.', color: 'bg-emerald-500/10'},
                {icon: <Users className="text-pink-500" size={32}/>, title: 'Collaborative Cohorts', desc: 'Join elite learning cohorts to master complex, highly technical subjects together in real-time.', color: 'bg-pink-500/10'},
                {icon: <Zap className="text-orange-500" size={32}/>, title: 'Habit-Forming Streaks', desc: 'Build lasting intellectual habits with consistent, daily engagement mechanics and targeted micro-learning.', color: 'bg-orange-500/10'}
            ].map((item, i) => (
                <div key={i} className="group relative bg-white dark:bg-slate-900/50 p-10 rounded-[2rem] shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-white/5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center mb-6 shadow-inner`}>
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 relative z-10">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed relative z-10">{item.desc}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Methodology Section with Premium Styling */}
      <section id="methodology" className="py-32 relative overflow-hidden bg-slate-900 dark:bg-black">
        {/* Abstract Backgrounds */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-600/30 to-transparent rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 to-transparent rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">The CogniPath Methodology</h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                We've revolutionized self-directed learning by marrying cognitive science with advanced artificial intelligence. Here is how we guarantee your success.
              </p>
              <ul className="space-y-6">
                {[
                  {title: 'Analyze', text: 'AI maps your specific goal to the exact core knowledge nodes required.'},
                  {title: 'Structure', text: 'Complex subjects are algorithmically broken down into perfectly paced modules.'},
                  {title: 'Learn', text: 'Master deep content through highly interactive, distraction-free sessions.'},
                  {title: 'Validate', text: 'Prove your expertise with gamified assessments and verifiable certificates.'}
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black flex-shrink-0 border border-indigo-500/30">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-slate-400">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="relative p-2 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-xl border border-white/10 shadow-2xl">
                <img 
                  src="https://picsum.photos/seed/methodology-premium/800/800" 
                  alt="Methodology Visual" 
                  className="w-full h-auto rounded-[2rem] object-cover mix-blend-overlay opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Video style section */}
      <section id="how-it-works" className="py-32 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white tracking-tight">Fluid Workflow</h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">From an initial prompt to certified mastery in four seamless steps.</p>
        </div>
        <div className="space-y-6">
            {[
                {step: 'Input & Intent', text: 'Provide any topic, link, or media source. Tell us your exact career goal.', icon: <SparklesIcon />},
                {step: 'Neural Analysis', text: 'CogniPath AI parses, cross-references, and structures the optimal knowledge tree.', icon: <Brain />},
                {step: 'Deep Engagement', text: 'Engage with interactive content directly in our optimized, distraction-free roadmap UI.', icon: <Target />},
                {step: 'Accreditation', text: 'Master concepts to gain EXP, level up your profile, and export your digital certificates.', icon: <Trophy />}
            ].map((item, i) => (
                <div key={i} className="flex gap-6 md:gap-8 items-center bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-white/5 hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-2xl md:rounded-3xl shadow-inner border border-indigo-100 dark:border-indigo-500/20">
                      {item.icon}
                    </div>
                    <div>
                        <h4 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{i+1}. {item.step}</h4>
                        <p className="text-slate-600 dark:text-slate-400 md:text-lg">{item.text}</p>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 bg-slate-100 dark:bg-slate-900/50 border-y border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center mb-20 text-slate-900 dark:text-white tracking-tight">Voices of Mastery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {name: "Sarah J.", role: "Senior Software Engineer", quote: "CogniPath completely transformed how I learn complex programming concepts. The enterprise gamification keeps me engaged daily, resulting in a 300% increase in my skill acquisition rate."},
                {name: "Dr. David M.", role: "Machine Learning Researcher", quote: "The AI-generated roadmaps are astonishingly accurate. They cut through the noise of traditional search, saving me hundreds of hours. This is the future of corporate upskilling."},
                {name: "Elena R.", role: "Product Manager", quote: "I used to struggle with completing online courses. The micro-learning milestones and habit-forming streak mechanics in CogniPath finally unlocked my ability to finish what I start."}
              ].map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-950 p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative">
                  <div className="text-indigo-500 opacity-20 absolute top-8 right-8">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.714 4.02-9.609 9.983-9.609v3.391c-3.15 0-5.187 1.874-5.187 5.751v2.868h5.187v4.99H14.017zm-14.017 0v-7.391c0-5.714 4.02-9.609 9.983-9.609v3.391c-3.15 0-5.187 1.874-5.187 5.751v2.868h5.187v4.99H0z"/></svg>
                  </div>
                  <div className="flex gap-1 mb-6 text-yellow-500">
                    <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.name}`} alt={t.name} />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{t.name}</h5>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Insights / Blog */}
      <section id="insights" className="py-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-900 dark:text-white tracking-tight">Enterprise Insights</h2>
        
        {selectedBlog ? (
            <div className="bg-white dark:bg-slate-900/80 p-8 md:p-16 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-white/5 relative">
                <button onClick={() => setSelectedBlog(null)} className="absolute top-8 left-8 md:top-12 md:left-12 text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition">
                  <ArrowRight className="rotate-180" size={16} /> Back
                </button>
                <div className="mt-16 md:mt-0">
                  <div className="w-full h-64 md:h-96 rounded-[2rem] overflow-hidden mb-12 shadow-inner">
                    <img src={`https://picsum.photos/seed/${selectedBlog.title}/1200/600`} alt={selectedBlog.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h3 className="text-4xl md:text-5xl font-black mb-8 text-slate-900 dark:text-white tracking-tight">{selectedBlog.title}</h3>
                  <div className="space-y-8 prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                      {selectedBlog.content.split('\n\n').map((para: string, idx: number) => (
                          <p key={idx} className="leading-relaxed text-lg">
                              {para}
                          </p>
                      ))}
                  </div>
                </div>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(0, 3).map((blog, i) => (
                    <div 
                        key={i} 
                        onClick={() => setSelectedBlog(blog)}
                        className="group bg-white dark:bg-slate-900/50 rounded-[2rem] shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/50 dark:border-white/5 hover:border-indigo-500/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col hover:-translate-y-2"
                    >
                        <div className="w-full h-48 md:h-56 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${blog.title}/600/400`} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-between bg-gradient-to-t from-white to-transparent dark:from-slate-900 dark:to-transparent">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">{blog.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">{blog.desc}</p>
                            </div>
                            <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                              Read Article <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-slate-200/80 dark:border-white/5 bg-white dark:bg-black text-slate-600 dark:text-slate-400 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-indigo-500/10 rounded-[100%] blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-left mb-20 relative z-10">
              <div className="col-span-2 space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm rotate-45"></div>
                    </div>
                    <span className="text-xl font-black text-slate-900 dark:text-white">CogniPath</span>
                  </div>
                  <p className="text-sm leading-relaxed max-w-sm">Empowering lifelong enterprise learners through adaptive AI roadmaps and scientifically proven gamification mechanics.</p>
                  <div className="flex gap-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Star size={18} /></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Users size={18} /></a>
                      <a href="#" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"><Zap size={18} /></a>
                  </div>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Platform</h4>
                  <ul className="space-y-4 text-sm font-medium">
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cognitive Roadmaps</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Enterprise Analytics</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Achievement Badges</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Developer API</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Company</h4>
                  <ul className="space-y-4 text-sm font-medium">
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Us</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Press</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a></li>
                  </ul>
              </div>
              <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm">Resources</h4>
                  <ul className="space-y-4 text-sm font-medium">
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Insights Blog</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                      <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                  </ul>
              </div>
          </div>
          <div className="text-center text-sm font-medium border-t border-slate-200/80 dark:border-white/10 pt-8 relative z-10">
            © {new Date().getFullYear()} CogniPath Enterprise Solutions. All rights reserved. Built for professional learning.
          </div>
        </div>
      </footer>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
