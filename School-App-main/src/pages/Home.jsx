import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-slate-900/90 mix-blend-multiply" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-100 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Inscriptions Ouvertes 2026-2027
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
          École Supérieure de <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
            Technologie Sidi Bennour
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-blue-100 mb-10 leading-relaxed drop-shadow-md">
          Bienvenue sur la plateforme officielle d'inscription. 
          Gérez votre dossier académique et suivez votre parcours en toute simplicité.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            to="/register"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:bg-blue-500 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="relative z-10 flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              S'inscrire maintenant
            </span>
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            to="/login"
            className="group inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-white/10 border border-white/20 rounded-full backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <span className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Connexion Étudiant
            </span>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <GraduationCap className="w-8 h-8 text-blue-300 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Formation d'Excellence</h3>
            <p className="text-blue-200/80 text-sm">Accédez à des programmes académiques de haut niveau.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Processus Simplifié</h3>
            <p className="text-blue-200/80 text-sm">Inscription 100% en ligne, rapide et sécurisée.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Suivi en Temps Réel</h3>
            <p className="text-blue-200/80 text-sm">Restez informé de l'état de votre dossier à tout moment.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
