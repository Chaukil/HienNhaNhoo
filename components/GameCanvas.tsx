import React, { useState, useRef, useEffect } from 'react';
import { PlacedItem, GameItem } from '../types';
import { Move, RotateCw, Trash2, Maximize, Check } from 'lucide-react';
import { Armchair, Sofa, Table, Flower, Lamp, Library, Layers } from 'lucide-react'; // Mock icons

// Icon mapper helper
const getIconComponent = (name: string) => {
  const icons: any = { Armchair, Sofa, Table, Flower, Lamp, Library, Rug: Layers };
  return icons[name] || Armchair;
};

interface GameCanvasProps {
  placedItems: PlacedItem[];
  setPlacedItems: React.Dispatch<React.SetStateAction<PlacedItem[]>>;
  selectedInventoryItem: GameItem | null;
  onPlaceItem: (item: GameItem, x: number, y: number) => void;
}

const GRID_SIZE = 40; // px
const ROOM_WIDTH = 20; // grids
const ROOM_HEIGHT = 16; // grids

const GameCanvas: React.FC<GameCanvasProps> = ({ 
  placedItems, 
  setPlacedItems, 
  selectedInventoryItem,
  onPlaceItem 
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle selection
  const handleItemClick = (e: React.MouseEvent, item: PlacedItem) => {
    e.stopPropagation();
    if (selectedInventoryItem) return; // Prioritize placing over selecting
    setSelectedId(item.instanceId);
  };

  // Handle dragging (Simplified logic for demo robustness)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && selectedId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;
      
      // Snap to grid
      const gridX = Math.round(x / GRID_SIZE);
      const gridY = Math.round(y / GRID_SIZE);

      setPlacedItems(prev => prev.map(item => 
        item.instanceId === selectedId 
          ? { ...item, x: gridX, y: gridY } 
          : item
      ));
    }
  };

  const handleMouseDown = (e: React.MouseEvent, item: PlacedItem) => {
     if (selectedInventoryItem) return;
     if (e.button !== 0) return; // Only left click
     
     setSelectedId(item.instanceId);
     setIsDragging(true);
     
     // Calculate offset within the item so it doesn't jump to top-left
     const target = e.currentTarget as HTMLDivElement;
     const rect = target.getBoundingClientRect();
     setDragOffset({
       x: e.clientX - rect.left,
       y: e.clientY - rect.top
     });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (selectedInventoryItem && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left - (GRID_SIZE / 2)) / GRID_SIZE);
      const y = Math.round((e.clientY - rect.top - (GRID_SIZE / 2)) / GRID_SIZE);
      onPlaceItem(selectedInventoryItem, x, y);
    } else {
      setSelectedId(null);
    }
  };

  const handleDelete = (id: string) => {
    setPlacedItems(prev => prev.filter(i => i.instanceId !== id));
    setSelectedId(null);
  };

  const handleRotate = (id: string) => {
    setPlacedItems(prev => prev.map(i => {
      if (i.instanceId === id) {
        return { ...i, rotation: (i.rotation + 90) % 360 as 0 | 90 | 180 | 270 };
      }
      return i;
    }));
  };

  return (
    <div 
      className="flex-1 relative overflow-hidden bg-slate-200 isometric-grid shadow-inner"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        ref={containerRef}
        className="absolute inset-0 cursor-crosshair transform transition-transform"
        onClick={handleBackgroundClick}
      >
        {/* Render Items */}
        {placedItems.map(item => {
          const Icon = getIconComponent(item.iconName);
          const isSelected = selectedId === item.instanceId;
          
          return (
            <div
              key={item.instanceId}
              onMouseDown={(e) => handleMouseDown(e, item)}
              onClick={(e) => handleItemClick(e, item)}
              style={{
                left: item.x * GRID_SIZE,
                top: item.y * GRID_SIZE,
                width: item.width * GRID_SIZE,
                height: item.height * GRID_SIZE,
                zIndex: item.y + 10, // Simple depth sorting based on Y
                transform: `rotate(${item.rotation}deg)`,
                backgroundColor: item.color,
              }}
              className={`absolute transition-colors duration-200 rounded-md shadow-lg flex items-center justify-center cursor-move group
                ${isSelected ? 'ring-4 ring-white ring-opacity-70 z-50 shadow-2xl scale-105' : 'hover:brightness-110'}
              `}
            >
              <Icon size={24} className="text-white drop-shadow-md" />
              
              {/* Item Controls (Only visible when selected) */}
              {isSelected && !isDragging && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg p-1 flex gap-1 z-[60] animate-bounce-in">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRotate(item.instanceId); }}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600"
                    title="Rotate"
                  >
                    <RotateCw size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.instanceId); }}
                    className="p-1.5 hover:bg-red-50 rounded-full text-red-500"
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Ghost Item for Placement Preview */}
        {selectedInventoryItem && (
          <div className="fixed pointer-events-none opacity-50 z-[100] p-2 bg-blue-500 rounded text-white flex gap-2 items-center" style={{ left: 20, top: 80 }}>
            <Move size={16} />
            <span>Click anywhere to place {selectedInventoryItem.name}</span>
          </div>
        )}
      </div>

      {/* Room Bounds Overlay (Optional visual cues) */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-50">
        <h2 className="text-2xl font-bold text-slate-400 tracking-wider">LIVING ROOM</h2>
      </div>
    </div>
  );
};

export default GameCanvas;