import React, { useRef, useEffect, useState } from 'react';
import { useLab } from '../context/LabContext';

const CircuitPlayground = () => {
  const canvasRef = useRef(null);
  const [components, setComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [isDrawingWire, setIsDrawingWire] = useState(false);
  const [wireStart, setWireStart] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const { selectedTool, logExperiment } = useLab();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    drawCanvas(ctx);
  }, [components, wires, isSimulating]);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        simulateCircuit();
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSimulating, components, wires]);

  const drawCanvas = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGrid(ctx);
    wires.forEach(wire => drawWire(ctx, wire));
    components.forEach(component => drawComponent(ctx, component));
  };

  const drawGrid = (ctx) => {
    const gridSize = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let x = 0; x < ctx.canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < ctx.canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
      ctx.stroke();
    }
  };

  const drawComponent = (ctx, component) => {
    const { x, y, type, rotation = 0 } = component;
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation * Math.PI / 180);
    
    switch (type) {
      case 'battery':
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(-20, -10, 40, 20);
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🔋', 0, 5);
        break;
        
      case 'bulb':
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, 2 * Math.PI);
        ctx.fillStyle = component.lit ? '#fef3c7' : '#f3f4f6';
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('💡', 0, 5);
        break;
        
      case 'resistor':
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        for (let i = -15; i <= 15; i += 5) {
          ctx.lineTo(i, (i % 10 === 0) ? -8 : 8);
        }
        ctx.lineTo(20, 0);
        ctx.stroke();
        break;
        
      case 'capacitor':
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-5, -15);
        ctx.lineTo(-5, 15);
        ctx.moveTo(5, -15);
        ctx.lineTo(5, 15);
        ctx.stroke();
        // Charge indicator
        if (component.charge > 0) {
          ctx.fillStyle = `rgba(59, 130, 246, ${component.charge})`;
          ctx.fillRect(-8, -15, 6, 30);
          ctx.fillRect(2, -15, 6, 30);
        }
        break;
        
      case 'diode':
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, -10);
        ctx.lineTo(0, 0);
        ctx.lineTo(-15, 10);
        ctx.closePath();
        ctx.fill();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.stroke();
        break;
        
      case 'led':
        ctx.beginPath();
        ctx.arc(0, 0, 12, 0, 2 * Math.PI);
        ctx.fillStyle = component.lit ? '#ef4444' : '#f3f4f6';
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.stroke();
        // LED symbol
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, -5);
        ctx.lineTo(0, 0);
        ctx.lineTo(-8, 5);
        ctx.moveTo(0, -5);
        ctx.lineTo(0, 5);
        ctx.stroke();
        break;
        
      case 'potentiometer':
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        for (let i = -15; i <= 15; i += 5) {
          ctx.lineTo(i, (i % 10 === 0) ? -8 : 8);
        }
        ctx.lineTo(20, 0);
        ctx.stroke();
        // Slider
        const sliderPos = -15 + (component.value || 0.5) * 30;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(sliderPos, -12, 4, 0, 2 * Math.PI);
        ctx.fill();
        break;
        
      case 'ground':
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 0);
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.moveTo(-10, 5);
        ctx.lineTo(10, 5);
        ctx.moveTo(-5, 10);
        ctx.lineTo(5, 10);
        ctx.stroke();
        break;
        
      case 'motor':
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, 2 * Math.PI);
        ctx.fillStyle = '#6b7280';
        ctx.fill();
        ctx.strokeStyle = '#374151';
        ctx.stroke();
        // Rotation indicator
        if (component.rotating) {
          ctx.save();
          ctx.rotate((Date.now() * component.speed || 0) * 0.01);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(12, 0);
          ctx.stroke();
          ctx.restore();
        }
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('M', 0, 4);
        break;
        
      case 'switch':
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(component.closed ? 15 : 10, component.closed ? 0 : -8);
        ctx.stroke();
        ctx.fillStyle = '#374151';
        ctx.beginPath();
        ctx.arc(-15, 0, 3, 0, 2 * Math.PI);
        ctx.arc(15, 0, 3, 0, 2 * Math.PI);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  };

  const drawWire = (ctx, wire) => {
    ctx.strokeStyle = wire.current > 0 ? '#dc2626' : '#6b7280';
    ctx.lineWidth = wire.current > 0 ? 4 : 3;
    ctx.beginPath();
    ctx.moveTo(wire.start.x, wire.start.y);
    ctx.lineTo(wire.end.x, wire.end.y);
    ctx.stroke();
  };

  const simulateCircuit = () => {
    const batteries = components.filter(c => c.type === 'battery');
    const grounds = components.filter(c => c.type === 'ground');
    
    if (batteries.length === 0 || grounds.length === 0) return;
    
    // Simple circuit analysis
    const voltage = batteries.reduce((sum, b) => sum + (b.voltage || 9), 0);
    const totalResistance = components
      .filter(c => ['resistor', 'bulb', 'potentiometer'].includes(c.type))
      .reduce((sum, c) => {
        if (c.type === 'potentiometer') return sum + (c.value || 0.5) * 1000;
        return sum + (c.resistance || 100);
      }, 1);
    
    const current = voltage / totalResistance;
    
    // Update component states
    setComponents(prev => prev.map(comp => {
      switch (comp.type) {
        case 'bulb':
          return { ...comp, lit: current > 0.01 };
        case 'led':
          return { ...comp, lit: current > 0.005 };
        case 'capacitor':
          const newCharge = Math.min(1, (comp.charge || 0) + current * 0.01);
          return { ...comp, charge: newCharge };
        case 'motor':
          return { 
            ...comp, 
            rotating: current > 0.01,
            speed: Math.min(current * 10, 5)
          };
        default:
          return comp;
      }
    }));
    
    // Update wire currents
    setWires(prev => prev.map(wire => ({ ...wire, current })));
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridSize = 20;
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;

    // Check if clicking on existing component
    const clickedComponent = components.find(comp => 
      Math.abs(comp.x - snappedX) < 25 && Math.abs(comp.y - snappedY) < 25
    );

    if (clickedComponent) {
      if (clickedComponent.type === 'switch') {
        setComponents(prev => prev.map(comp => 
          comp.id === clickedComponent.id 
            ? { ...comp, closed: !comp.closed }
            : comp
        ));
      } else {
        setSelectedComponent(clickedComponent);
      }
      return;
    }

    if (selectedTool === 'wire') {
      handleWireDrawing(snappedX, snappedY);
    } else if (selectedTool && selectedTool !== 'wire') {
      addComponent(snappedX, snappedY, selectedTool);
    }
  };

  const handleWireDrawing = (x, y) => {
    if (!isDrawingWire) {
      setIsDrawingWire(true);
      setWireStart({ x, y });
    } else {
      const newWire = {
        id: Date.now(),
        start: wireStart,
        end: { x, y },
        current: 0
      };
      setWires(prev => [...prev, newWire]);
      setIsDrawingWire(false);
      setWireStart(null);
      
      logExperiment('wire_connected', { from: wireStart, to: { x, y } });
    }
  };

  const addComponent = (x, y, type) => {
    const newComponent = {
      id: Date.now(),
      x,
      y,
      type,
      lit: false,
      closed: type === 'switch' ? true : undefined,
      charge: type === 'capacitor' ? 0 : undefined,
      value: type === 'potentiometer' ? 0.5 : undefined,
      voltage: type === 'battery' ? 9 : undefined,
      resistance: type === 'resistor' ? 100 : type === 'bulb' ? 50 : undefined,
      rotating: false,
      speed: 0
    };
    
    setComponents(prev => [...prev, newComponent]);
    logExperiment('component_added', { type, position: { x, y } });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Delete' && selectedComponent) {
      setComponents(prev => prev.filter(comp => comp.id !== selectedComponent.id));
      setSelectedComponent(null);
    }
    if (e.key === 'r' && selectedComponent) {
      setComponents(prev => prev.map(comp => 
        comp.id === selectedComponent.id 
          ? { ...comp, rotation: (comp.rotation || 0) + 90 }
          : comp
      ));
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedComponent]);

  return (
    <div className="h-full bg-white relative">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair"
        style={{ background: 'linear-gradient(to bottom, #f0f9ff, #e0f2fe)' }}
      />
      
      {/* Control Panel */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <button
          onClick={() => setIsSimulating(!isSimulating)}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isSimulating 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isSimulating ? '⏹️ Stop' : '▶️ Run Simulation'}
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
        <h3 className="font-semibold text-gray-800 mb-2">⚡ Enhanced Circuit Builder</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Click components to interact (switches toggle)</p>
          <p>• Press 'R' to rotate selected component</p>
          <p>• Press 'Delete' to remove selected component</p>
          <p>• Connect components with wires</p>
          <p>• Click "Run Simulation" to see realistic behavior</p>
        </div>
      </div>

      {/* Component Properties Panel */}
      {selectedComponent && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <h4 className="font-semibold mb-2">{selectedComponent.type.toUpperCase()}</h4>
          {selectedComponent.type === 'potentiometer' && (
            <div>
              <label className="block text-sm">Resistance: {Math.round(selectedComponent.value * 1000)}Ω</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedComponent.value}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value);
                  setComponents(prev => prev.map(comp => 
                    comp.id === selectedComponent.id 
                      ? { ...comp, value: newValue }
                      : comp
                  ));
                  setSelectedComponent(prev => ({ ...prev, value: newValue }));
                }}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}

      {isDrawingWire && (
        <div className="absolute top-4 right-32 bg-amber-100 border border-amber-300 rounded-lg p-3">
          <p className="text-amber-800 font-medium">🔌 Click to finish wire</p>
        </div>
      )}
    </div>
  );
};

export default CircuitPlayground;
