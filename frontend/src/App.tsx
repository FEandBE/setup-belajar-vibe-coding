import { useState, useEffect } from 'react'
import { Layout, LogIn, UserPlus, LogOut, CheckCircle2, Circle, Trash2, Plus, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  
  return (
    <div className="min-h-screen">
      <div className="bg-overlay" />
      <div className="bg-blur" style={{ top: '10%', right: '20%' }} />
      <div className="bg-blur" style={{ bottom: '20%', left: '10%', background: '#7e22ce' }} />

      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-800 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-gradient">VibeCoding</span>
        </div>

        <div className="flex gap-4">
          {token ? (
            <button className="btn-secondary flex items-center gap-2" onClick={() => { localStorage.removeItem('token'); setToken('') }}>
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <div className="flex gap-3">
              <button className="btn-secondary flex items-center gap-2">
                <LogIn size={18} /> Login
              </button>
              <button className="btn-primary flex items-center gap-2">
                <UserPlus size={18} /> Register
              </button>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!token ? (
          <div className="flex flex-col items-center text-center mt-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold mb-6"
            >
              Elevate Your <br />
              <span className="text-gradient">Workflow</span>.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-text-secondary text-xl max-w-2xl mb-10"
            >
              A premium, minimalist todo system designed to keep you focused and inspired. 
              Built with Bun, Elysia, and Pure Passion.
            </motion.p>
            
            <div className="glass-card w-full max-w-md">
              <h2 className="text-2xl font-semibold mb-6">Welcome Back</h2>
              <input type="text" placeholder="Email Address" className="input-field" />
              <input type="password" placeholder="Password" className="input-field" />
              <button className="btn-primary w-full py-4 mt-2">Get Started</button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {/* Dashboard placeholder */}
             <div className="md:col-span-2 glass-card">
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold">Your Tasks</h2>
                 <button className="btn-primary flex items-center gap-2 p-2 px-4 text-sm">
                   <Plus size={16} /> New Task
                 </button>
               </div>
               <div className="space-y-4">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer">
                     <Circle className="text-purple-500" />
                     <div className="flex-1">
                       <h3 className="font-medium">Complete Backend Refactor</h3>
                       <p className="text-sm text-text-secondary">Migrate to Postgres as requested</p>
                     </div>
                     <Trash2 className="text-white/20 hover:text-red-500 transition-colors" size={18} />
                   </div>
                 ))}
               </div>
             </div>
             
             <div className="glass-card h-fit">
               <h2 className="text-xl font-bold mb-4">Profile</h2>
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold">U</div>
                 <div>
                   <p className="font-semibold">User Name</p>
                   <p className="text-xs text-text-secondary">user@example.com</p>
                 </div>
               </div>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between text-text-secondary">
                   <span>Tasks completed</span>
                   <span className="text-white">12</span>
                 </div>
                 <div className="flex justify-between text-text-secondary">
                    <span>Rank</span>
                    <span className="text-purple-500 font-semibold">Pro</span>
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>
    </div>
  )
}
