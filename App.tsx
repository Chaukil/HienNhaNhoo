import React, { useState } from 'react';
import { PageView, UserProfile, GameItem, PlacedItem } from './types';
import { Home, ShoppingBag, User as UserIcon, LogOut, Settings, Sparkles } from 'lucide-react';
import Login from './components/Login';
import GameCanvas from './components/GameCanvas';
import Store from './components/Store';
import Profile from './components/Profile';
import Admin from './components/Admin';
import DesignAssistant from './components/DesignAssistant';

const App: React.FC = () => {
  const [view, setView] = useState<PageView>(PageView.LOGIN);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Game State
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<GameItem | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Authentication Handlers
  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setView(PageView.GAME);
  };

  const handleAdminLogin = () => {
    setUser({
      username: 'Administrator',
      level: 99,
      xp: 99999,
      currency: 999999,
      inventory: [],
      joinedDate: new Date().toISOString(),
      isAdmin: true
    });
    setView(PageView.ADMIN);
  };

  const handleLogout = () => {
    setUser(null);
    setView(PageView.LOGIN);
    setPlacedItems([]);
  };

  // Game Logic Handlers
  const handleBuyItem = (item: GameItem) => {
    if (!user) return;
    if (user.currency >= item.price) {
      setUser({
        ...user,
        currency: user.currency - item.price,
        inventory: [...user.inventory, item]
      });
      // Optional: Add visual feedback toast here
    }
  };

  const handlePlaceItem = (item: GameItem, x: number, y: number) => {
    const newItem: PlacedItem = {
      ...item,
      instanceId: Math.random().toString(36).substr(2, 9),
      x,
      y,
      rotation: 0,
      zIndex: 1
    };
    setPlacedItems([...placedItems, newItem]);
    setSelectedInventoryItem(null); // Clear selection after placing
  };

  const handleSelectFromInventory = (item: GameItem) => {
    setSelectedInventoryItem(item);
    setView(PageView.GAME); // Switch to game view to place it
  };

  // Render
  if (view === PageView.LOGIN) {
    return <Login onLogin={handleLogin} onAdminLogin={handleAdminLogin} />;
  }

  const NavButton = ({ target, icon: Icon, label }: any) => (
    <button
      onClick={() => {
        setView(target);
        if (target !== PageView.GAME) setSelectedInventoryItem(null);
      }}
      className={`p-3 rounded-xl transition-all duration-200 flex flex-col items-center gap-1
        ${view === target 
          ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 scale-105' 
          : 'text-slate-400 hover:bg-white hover:text-slate-600'
        }`}
    >
      <Icon size={24} strokeWidth={view === target ? 2.5 : 2} />
      <span className="text-[10px] font-bold tracking-wide hidden sm:block">{label}</span>
    </button>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden font-sans text-slate-900">
      
      {/* Top HUD (Heads-up Display) */}
      <header className="h-16 bg-white/80 backdrop-blur-md border-b border-white/20 px-6 flex items-center justify-between z-40 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-slate-800">{user?.username}</h2>
            <div className="text-xs text-slate-500 font-mono">Lvl {user?.level}</div>
          </div>
        </div>

        {/* Inventory Bar (Only visible in Game View) */}
        {view === PageView.GAME && (
          <div className="flex-1 max-w-xl mx-4 overflow-x-auto no-scrollbar hidden md:flex gap-2 p-1">
             {user?.inventory.length === 0 && (
               <div className="text-xs text-slate-400 italic">Inventory empty. Visit the store!</div>
             )}
             {user?.inventory.map((item, idx) => (
               <button 
                 key={idx}
                 onClick={() => handleSelectFromInventory(item)}
                 className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 hover:border-violet-400 hover:bg-white flex items-center justify-center transition-colors flex-shrink-0"
                 title={`Place ${item.name}`}
               >
                 <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: item.color }} />
               </button>
             ))}
          </div>
        )}

        <div className="flex items-center gap-4">
           {/* Currency Display */}
           <div className="px-3 py-1.5 bg-amber-50 rounded-full border border-amber-100 flex items-center gap-2 text-amber-700 font-bold text-sm">
             <span className="text-lg">💰</span>
             {user?.currency}
           </div>
           
           {/* Mobile Menu Toggle could go here */}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {view === PageView.GAME && (
          <>
            <GameCanvas 
              placedItems={placedItems}
              setPlacedItems={setPlacedItems}
              selectedInventoryItem={selectedInventoryItem}
              onPlaceItem={handlePlaceItem}
            />
            {/* Design Assistant FAB */}
            <button
               onClick={() => setIsAssistantOpen(!isAssistantOpen)}
               className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center text-violet-600 hover:scale-110 transition-transform z-40 border border-violet-100"
            >
              <Sparkles size={24} fill="currentColor" className="opacity-20" />
              <Sparkles size={24} className="absolute" />
            </button>
            <DesignAssistant 
              items={placedItems} 
              isOpen={isAssistantOpen} 
              onClose={() => setIsAssistantOpen(false)} 
            />
          </>
        )}
        {view === PageView.STORE && (
          <Store 
            currency={user?.currency || 0} 
            onBuy={handleBuyItem} 
            inventory={user?.inventory || []}
          />
        )}
        {view === PageView.PROFILE && user && <Profile user={user} />}
        {view === PageView.ADMIN && <Admin />}
      </main>

      {/* Bottom Navigation Dock */}
      <nav className="h-20 bg-white border-t border-slate-200 px-6 flex items-center justify-center gap-2 sm:gap-6 z-50">
        <NavButton target={PageView.GAME} icon={Home} label="Room" />
        <NavButton target={PageView.STORE} icon={ShoppingBag} label="Store" />
        <NavButton target={PageView.PROFILE} icon={UserIcon} label="Profile" />
        {user?.isAdmin && <NavButton target={PageView.ADMIN} icon={Settings} label="Admin" />}
        <div className="w-px h-10 bg-slate-200 mx-2" />
        <button 
          onClick={handleLogout}
          className="p-3 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors flex flex-col items-center gap-1"
        >
          <LogOut size={24} />
          <span className="text-[10px] font-bold tracking-wide hidden sm:block">Logout</span>
        </button>
      </nav>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-in {
          0% { transform: translate(-50%, 0) scale(0); }
          50% { transform: translate(-50%, 0) scale(1.2); }
          100% { transform: translate(-50%, 0) scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
