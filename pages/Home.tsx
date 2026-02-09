
import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Briefcase, ArrowRight, Shield, Rocket, Zap, 
  Twitter, Linkedin, Github, Layout, 
  MousePointer2, Layers, Check, Star, Quote
} from 'lucide-react';
import { STRIPE_LINKS } from '../constants';

const { Link } = ReactRouterDOM as any;

export const Home: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      title: "Project Command Center",
      description: "Get a bird's-eye view of every project. Track deadlines, budgets, and progress in real-time.",
      icon: <Layout size={24} />,
      color: "from-cyan-400 to-blue-500"
    },
    {
      title: "Task Automation",
      description: "Link tasks directly to projects. Never lose track of a deliverable again with our intuitive Kanban-lite view.",
      icon: <Layers size={24} />,
      color: "from-purple-400 to-pink-500"
    },
    {
      title: "Client CRM",
      description: "Manage your professional network. Store contact info, project history, and communication preferences.",
      icon: <MousePointer2 size={24} />,
      color: "from-emerald-400 to-teal-500"
    },
    {
      title: "Smart Invoicing",
      description: "Generate professional invoices in seconds. Track paid and outstanding balances with ease.",
      icon: <Zap size={24} />,
      color: "from-amber-400 to-orange-500"
    },
    {
      title: "Financial Analytics",
      description: "See your growth with built-in earnings charts. Understand your monthly performance at a glance.",
      icon: <Rocket size={24} />,
      color: "from-indigo-400 to-blue-600"
    },
    {
      title: "Secure & Encrypted",
      description: "Your business data is private. We use industry-standard encryption to keep your workspace safe.",
      icon: <Shield size={24} />,
      color: "from-rose-400 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Alex Rivera",
      role: "Full-stack Developer",
      content: "WorkDesk has completely streamlined my freelance workflow. I can manage 5+ projects simultaneously without missing a single deadline.",
      avatar: "https://i.pravatar.cc/150?u=alex"
    },
    {
      name: "Sarah Jenkins",
      role: "UX Designer",
      content: "The cleanest interface I've ever used. The invoice tracking alone saved me at least 4 hours of admin work every month.",
      avatar: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Michael Chen",
      role: "Brand Strategist",
      content: "Linking tasks directly to projects is a game changer. It keeps my clients happy and my head clear. Highly recommend!",
      avatar: "https://i.pravatar.cc/150?u=mike"
    }
  ];

  const pricingTiers = [
    {
      name: "Starter",
      price: "0",
      description: "Perfect for new freelancers getting organized.",
      features: ["3 Credits Included", "Up to 3 Projects", "Basic Task Tracking", "Unlimited Clients", "Community Support"],
      cta: "Start Free Trial",
      highlight: false,
      link: "/signup"
    },
    {
      name: "Professional",
      price: "5",
      description: "Everything you need to scale your business.",
      features: ["10 Credits Monthly", "Unlimited Projects", "Project-Linked Tasks", "Advanced Invoicing", "Financial Analytics"],
      cta: "Upgrade to Pro",
      highlight: true,
      link: STRIPE_LINKS.pro
    },
    {
      name: "Agency",
      price: "10",
      description: "For teams and high-volume solo-preneurs.",
      features: ["50 Credits Monthly", "Multiple User Profiles", "Custom Branding", "API Access", "Dedicated Success Manager"],
      cta: "Get Agency Plus",
      highlight: false,
      link: STRIPE_LINKS.agency
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-[#F8FAFC] flex flex-col selection:bg-[#22D3EE] selection:text-[#020617] scroll-smooth">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#22D3EE]/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      <nav className="sticky top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-md border-b border-[#1E2938]">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 group">
            <div className="bg-gradient-to-tr from-[#22D3EE] to-[#3B82F6] p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-[#22D3EE20]">
              <Briefcase size={22} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-[#22D3EE] bg-clip-text text-transparent">WorkDesk</span>
          </button>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8]">
            <button onClick={() => scrollToSection('features')} className="hover:text-[#22D3EE] transition-colors">Features</button>
            <button onClick={() => scrollToSection('testimonials')} className="hover:text-[#22D3EE] transition-colors">Testimonials</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-[#22D3EE] transition-colors">Pricing</button>
          </div>
          
          <div className="flex gap-4 items-center">
            <Link to="/login" className="hidden sm:block text-[#94A3B8] hover:text-[#22D3EE] transition-colors font-bold text-xs uppercase tracking-widest">Login</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-[#22D3EE] text-[#020617] rounded-xl font-bold hover:bg-cyan-300 transition-all hover:scale-105 shadow-lg shadow-[#22D3EE20] text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <header className="relative z-10 container mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E293B] border border-[#22D3EE]/20 text-[#22D3EE] text-[10px] font-bold uppercase tracking-[0.2em] mb-10">
          <Zap size={12} fill="currentColor" className="animate-pulse" /> Precision tool for freelancers
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
          Master your craft.<br />
          <span className="bg-gradient-to-r from-[#22D3EE] via-white to-[#3B82F6] bg-clip-text text-transparent">We'll handle the desk.</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-[#94A3B8] mb-12 leading-relaxed font-medium">
          The elite workstation for modern freelancers. Manage projects, 
          track credits, and scale your business without the administrative headache.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link to="/signup" className="group flex items-center justify-center gap-2 px-10 py-5 bg-[#22D3EE] text-[#020617] rounded-2xl font-black text-lg hover:bg-cyan-300 transition-all shadow-2xl shadow-[#22D3EE30] hover:-translate-y-1">
            Start Free Trial <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <button onClick={() => scrollToSection('features')} className="flex items-center justify-center gap-2 px-10 py-5 bg-[#0F172A] border border-[#1E2938] text-[#F8FAFC] rounded-2xl font-bold text-lg hover:bg-[#1E2938] transition-all">
            Explore Features
          </button>
        </div>
      </header>

      <section id="features" className="relative z-10 py-32 border-t border-[#1E2938]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Built for High Performance</h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto font-medium text-lg">Every feature is designed to eliminate friction from your daily operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-[2rem] border border-[#1E2938] bg-[#0F172A]/50 backdrop-blur-sm hover:border-[#22D3EE]/50 transition-all group">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[#94A3B8] leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative z-10 py-32 bg-gradient-to-b from-transparent to-[#0F172A]/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6">Trusted by the best in the game</h2>
              <p className="text-[#94A3B8] text-lg font-medium">Join thousands of creators who've leveled up their business with WorkDesk.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 rounded-[2.5rem] bg-[#020617] border border-[#1E2938] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Quote size={80} />
                </div>
                <p className="text-lg text-[#F8FAFC] leading-relaxed mb-8 italic relative z-10">"{t.content}"</p>
                <div className="flex items-center gap-4 relative z-10">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border border-[#1E2938]" />
                  <div>
                    <h4 className="font-bold text-white">{t.name}</h4>
                    <p className="text-xs text-[#22D3EE] font-black uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="relative z-10 py-32 bg-[#0F172A]/30 border-t border-[#1E2938]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6">Simple, Honest Pricing</h2>
            <p className="text-[#94A3B8] max-w-2xl mx-auto font-medium">Choose the plan that fits your current workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`relative p-8 rounded-[2.5rem] border ${tier.highlight ? 'border-[#22D3EE] bg-[#0F172A] shadow-[0_0_40px_rgba(34,211,238,0.1)]' : 'border-[#1E2938] bg-[#020617]'} transition-all hover:scale-[1.02]`}>
                {tier.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#22D3EE] text-[#020617] text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">${tier.price}</span>
                    <span className="text-[#94A3B8] text-sm font-bold">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-10">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-[#F8FAFC]">
                      <Check size={14} className="text-[#22D3EE]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {tier.link.startsWith('http') ? (
                  <a href={tier.link} target="_blank" rel="noopener noreferrer" className={`block w-full py-4 rounded-2xl text-center font-bold transition-all ${tier.highlight ? 'bg-[#22D3EE] text-[#020617] hover:bg-cyan-300' : 'bg-[#1E293B] text-white hover:bg-[#2D3748]'}`}>
                    {tier.cta}
                  </a>
                ) : (
                  <Link to={tier.link} className={`block w-full py-4 rounded-2xl text-center font-bold transition-all ${tier.highlight ? 'bg-[#22D3EE] text-[#020617] hover:bg-cyan-300' : 'bg-[#1E293B] text-white hover:bg-[#2D3748]'}`}>
                    {tier.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 bg-[#020617] border-t border-[#1E2938] py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#22D3EE] p-2 rounded-lg">
                <Briefcase size={20} className="text-[#020617]" />
              </div>
              <span className="text-2xl font-bold">WorkDesk</span>
            </div>
            <nav className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-[#475569]">
              <button onClick={() => scrollToSection('features')} className="hover:text-[#22D3EE]">Features</button>
              <button onClick={() => scrollToSection('pricing')} className="hover:text-[#22D3EE]">Pricing</button>
              <Link to="/login" className="hover:text-[#22D3EE]">Login</Link>
            </nav>
            <div className="flex gap-6 text-[#475569]">
              <Twitter size={20} className="hover:text-[#22D3EE]" />
              <Linkedin size={20} className="hover:text-[#22D3EE]" />
              <Github size={20} className="hover:text-[#22D3EE]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
