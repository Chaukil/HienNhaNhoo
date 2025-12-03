import React from 'react';
import { GameItem } from '../types';
import { ShoppingBag, Star, Coins } from 'lucide-react';
import { FURNITURE_ITEMS } from '../constants';

interface StoreProps {
  currency: number;
  onBuy: (item: GameItem) => void;
  inventory: GameItem[];
}

const Store: React.FC<StoreProps> = ({ currency, onBuy, inventory }) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <ShoppingBag className="text-violet-500" />
            Design Shop
          </h1>
          <p className="text-slate-500 mt-1">Find the perfect pieces for your sanctuary</p>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-inner">
          <Coins size={20} />
          {currency}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FURNITURE_ITEMS.map((item) => {
            const ownedCount = inventory.filter(i => i.id === item.id).length;
            const canAfford = currency >= item.price;

            return (
              <div 
                key={item.id} 
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-violet-200 transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Image Placeholder */}
                <div 
                  className="h-48 flex items-center justify-center transition-colors duration-300"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div 
                    className="w-24 h-24 rounded-lg shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
                
                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                    <div className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-xs font-semibold text-slate-600">
                      {item.type}
                    </div>
                  </div>
                  
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{item.description}</p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bold text-amber-600 flex items-center gap-1 text-lg">
                      <Coins size={16} />
                      {item.price}
                    </span>
                    
                    <button
                      onClick={() => onBuy(item)}
                      disabled={!canAfford}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all transform active:scale-95 ${
                        canAfford 
                          ? 'bg-slate-900 text-white hover:bg-violet-600 shadow-lg hover:shadow-violet-500/30' 
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy Now' : 'Too Expensive'}
                    </button>
                  </div>
                </div>

                {/* Badge */}
                {ownedCount > 0 && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star size={10} fill="currentColor" />
                    Owned: {ownedCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Store;
