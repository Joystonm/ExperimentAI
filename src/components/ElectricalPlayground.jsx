import React, { useState, useRef, useEffect } from 'react';

const ElectricalPlayground = () => {
  const [components, setComponents] = useState([]);
  const [wires, setWires] = useState([]);
  const [mode, setMode] = useState('select');
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [isDrawingWire, setIsDrawingWire] = useState(false);
  const [wireStart, setWireStart] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const tools = [
    { id: 'battery', name: 'Battery', icon: '🔋', category: 'power' },
    { id: 'resistor', name: 'Resistor', icon: '⚡', category: 'passive' },
    { id: 'bulb', name: 'Light Bulb', icon: '💡', category: 'output' },
    { id: 'switch', name: 'Switch', icon: '🔘', category: 'control' },
    { id: 'led', name: 'LED', icon: '🔴', category: 'output' },
    { id: 'capacitor', name: 'Capacitor', icon: '⚡', category: 'passive' },
    { id: 'ground', name: 'Ground', icon: '⏚', category: 'reference' }
  ];

  const modes = [
    { id: 'select', name: 'Select', icon: 'cursor-arrow-rays' },
    { id: 'wire', name: 'Wire', icon: 'bolt' },
    { id: 'delete', name: 'Delete', icon: 'trash' }
  ];

  useEffect(() => {
    drawCanvas();
    simulateCircuit();
  }, [components, wires, selectedComponent, mousePos]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    drawGrid(ctx);
    
    // Draw wires
    wires.forEach(wire => drawWire(ctx, wire));
    
    // Draw wire preview when drawing
    if (isDrawingWire && wireStart) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(wireStart.x, wireStart.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw components
    components.forEach(comp => drawComponent(ctx, comp));
    
    // Highlight terminals when in wire mode
    if (mode === 'wire') {
      components.forEach(comp => {
        const leftTerminal = { x: comp.x - 20, y: comp.y };
        const rightTerminal = { x: comp.x + 20, y: comp.y };
        
        // Highlight terminals on hover
        const distLeft = Math.sqrt((mousePos.x - leftTerminal.x) ** 2 + (mousePos.y - leftTerminal.y) ** 2);
        const distRight = Math.sqrt((mousePos.x - rightTerminal.x) ** 2 + (mousePos.y - rightTerminal.y) ** 2);
        
        if (distLeft < 15) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(leftTerminal.x, leftTerminal.y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        
        if (distRight < 15) {
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(rightTerminal.x, rightTerminal.y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }
    
    // Draw cursor indicator
    if (mousePos.x > 0 && mousePos.y > 0) {
      ctx.fillStyle = mode === 'wire' ? '#3b82f6' : mode === 'delete' ? '#ef4444' : '#10b981';
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 3, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add cursor ring
      ctx.strokeStyle = mode === 'wire' ? '#3b82f6' : mode === 'delete' ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 8, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw selection highlight
    if (selectedComponent) {
      const comp = components.find(c => c.id === selectedComponent);
      if (comp) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(comp.x - 25, comp.y - 25, 50, 50);
        ctx.setLineDash([]);
      }
    }
  };

  const drawGrid = (ctx) => {
    const gridSize = 20;
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= 800; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 600);
      ctx.stroke();
    }
    
    for (let y = 0; y <= 600; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(800, y);
      ctx.stroke();
    }
  };

  const drawComponent = (ctx, comp) => {
    const { x, y, type } = comp;
    
    ctx.save();
    
    // Draw component based on type
    switch (type) {
      case 'battery':
        drawBattery(ctx, x, y, comp);
        break;
      case 'resistor':
        drawResistor(ctx, x, y, comp);
        break;
      case 'bulb':
        drawBulb(ctx, x, y, comp);
        break;
      case 'switch':
        drawSwitch(ctx, x, y, comp);
        break;
      case 'led':
        drawLED(ctx, x, y, comp);
        break;
      case 'capacitor':
        drawCapacitor(ctx, x, y, comp);
        break;
      case 'ground':
        drawGround(ctx, x, y, comp);
        break;
    }
    
    // Draw terminals
    drawTerminals(ctx, x, y);
    
    ctx.restore();
  };

  const drawBattery = (ctx, x, y, comp) => {
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(x - 15, y - 20, 30, 40);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 10, y - 25, 20, 10);
    
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('+', x, y - 8);
    ctx.fillText('-', x, y + 8);
    ctx.fillText(`${comp.voltage || 9}V`, x, y + 35);
  };

  const drawResistor = (ctx, x, y, comp) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fbbf24';
    
    // Resistor body
    ctx.fillRect(x - 20, y - 8, 40, 16);
    ctx.strokeRect(x - 20, y - 8, 40, 16);
    
    // Value label
    ctx.fillStyle = '#374151';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${comp.resistance || 100}Ω`, x, y + 25);
  };

  const drawBulb = (ctx, x, y, comp) => {
    const isOn = comp.isOn || false;
    
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = isOn ? '#fbbf24' : '#f3f4f6';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    if (isOn) {
      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 5, x, y, 25);
      gradient.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
      gradient.addColorStop(1, 'rgba(251, 191, 36, 0.1)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  const drawSwitch = (ctx, x, y, comp) => {
    const isOpen = comp.isOpen || false;
    
    ctx.strokeStyle = isOpen ? '#ef4444' : '#10b981';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x - 15, y);
    ctx.lineTo(x + (isOpen ? 10 : 15), y + (isOpen ? -8 : 0));
    ctx.stroke();
    
    // Connection points
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(x - 15, y, 3, 0, 2 * Math.PI);
    ctx.arc(x + 15, y, 3, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawLED = (ctx, x, y, comp) => {
    const isOn = comp.isOn || false;
    
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = isOn ? '#ef4444' : '#f3f4f6';
    ctx.fill();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // LED symbol
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 6, y - 6);
    ctx.lineTo(x + 6, y);
    ctx.lineTo(x - 6, y + 6);
    ctx.closePath();
    ctx.stroke();
  };

  const drawCapacitor = (ctx, x, y, comp) => {
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 15);
    ctx.lineTo(x - 5, y + 15);
    ctx.moveTo(x + 5, y - 15);
    ctx.lineTo(x + 5, y + 15);
    ctx.stroke();
  };

  const drawGround = (ctx, x, y, comp) => {
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 5);
    ctx.moveTo(x - 12, y + 5);
    ctx.lineTo(x + 12, y + 5);
    ctx.moveTo(x - 8, y + 10);
    ctx.lineTo(x + 8, y + 10);
    ctx.moveTo(x - 4, y + 15);
    ctx.lineTo(x + 4, y + 15);
    ctx.stroke();
  };

  const drawTerminals = (ctx, x, y) => {
    // Left terminal
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x - 20, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Right terminal
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x + 20, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawWire = (ctx, wire) => {
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(wire.x1, wire.y1);
    ctx.lineTo(wire.x2, wire.y2);
    ctx.stroke();
    
    // Connection points
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(wire.x1, wire.y1, 4, 0, 2 * Math.PI);
    ctx.arc(wire.x2, wire.y2, 4, 0, 2 * Math.PI);
    ctx.fill();
  };

  const simulateCircuit = () => {
    // Reset all component states
    const updatedComponents = components.map(comp => ({
      ...comp,
      isOn: false,
      current: 0
    }));

    // Find battery and check if circuit is complete
    const battery = updatedComponents.find(c => c.type === 'battery');
    if (!battery) {
      setComponents(updatedComponents);
      return;
    }

    // Check if there's a complete circuit path
    const circuitComplete = isCircuitComplete(battery.id);
    if (!circuitComplete) {
      setComponents(updatedComponents);
      return;
    }

    // Check if all switches are closed
    const switches = updatedComponents.filter(c => c.type === 'switch');
    const allSwitchesClosed = switches.every(s => !s.isOpen);
    
    if (!allSwitchesClosed) {
      setComponents(updatedComponents);
      return;
    }

    // Calculate total resistance in circuit
    const resistors = updatedComponents.filter(c => c.type === 'resistor');
    const bulbs = updatedComponents.filter(c => c.type === 'bulb');
    const leds = updatedComponents.filter(c => c.type === 'led');
    
    let totalResistance = 0;
    resistors.forEach(r => totalResistance += r.resistance);
    bulbs.forEach(b => totalResistance += 100); // Default bulb resistance
    leds.forEach(l => totalResistance += 50); // Default LED resistance

    if (totalResistance === 0) totalResistance = 1; // Prevent division by zero

    // Calculate current using Ohm's law (I = V/R)
    const current = battery.voltage / totalResistance;

    // Update component states based on current
    updatedComponents.forEach(comp => {
      if (comp.type === 'bulb' || comp.type === 'led') {
        comp.isOn = current > 0.01; // Minimum current to light up
        comp.current = current;
      }
    });

    setComponents(updatedComponents);
  };

  const isCircuitComplete = (batteryId) => {
    // Simple circuit completion check
    // Check if battery terminals are connected through wires and components
    const battery = components.find(c => c.id === batteryId);
    if (!battery) return false;

    const batteryLeftTerminal = { x: battery.x - 20, y: battery.y };
    const batteryRightTerminal = { x: battery.x + 20, y: battery.y };

    // Check if both battery terminals have wire connections
    const leftWire = wires.find(w => 
      (w.x1 === batteryLeftTerminal.x && w.y1 === batteryLeftTerminal.y) ||
      (w.x2 === batteryLeftTerminal.x && w.y2 === batteryLeftTerminal.y)
    );

    const rightWire = wires.find(w => 
      (w.x1 === batteryRightTerminal.x && w.y1 === batteryRightTerminal.y) ||
      (w.x2 === batteryRightTerminal.x && w.y2 === batteryRightTerminal.y)
    );

    return leftWire && rightWire && wires.length >= 2;
  };

  const snapToGrid = (value) => Math.round(value / 20) * 20;

  const getComponentAt = (x, y) => {
    return components.find(comp => 
      Math.abs(comp.x - x) < 25 && Math.abs(comp.y - y) < 25
    );
  };

  const getTerminalAt = (x, y) => {
    for (const comp of components) {
      const leftTerminal = { x: comp.x - 20, y: comp.y, compId: comp.id };
      const rightTerminal = { x: comp.x + 20, y: comp.y, compId: comp.id };
      
      if (Math.abs(leftTerminal.x - x) < 15 && Math.abs(leftTerminal.y - y) < 15) {
        return leftTerminal;
      }
      if (Math.abs(rightTerminal.x - x) < 15 && Math.abs(rightTerminal.y - y) < 15) {
        return rightTerminal;
      }
    }
    return null;
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (mode === 'select') {
      if (selectedTool) {
        // Add component
        const newComponent = {
          id: Date.now(),
          type: selectedTool,
          x: snapToGrid(x),
          y: snapToGrid(y),
          voltage: selectedTool === 'battery' ? 9 : undefined,
          resistance: selectedTool === 'resistor' ? 100 : undefined,
          isOn: false,
          isOpen: selectedTool === 'switch' ? false : undefined
        };
        setComponents([...components, newComponent]);
        setSelectedTool(null);
      } else {
        // Select component
        const clickedComponent = getComponentAt(x, y);
        setSelectedComponent(clickedComponent?.id || null);
      }
    } else if (mode === 'wire') {
      const terminal = getTerminalAt(x, y);
      if (terminal) {
        if (!isDrawingWire) {
          setIsDrawingWire(true);
          setWireStart(terminal);
        } else if (wireStart && terminal.compId !== wireStart.compId) {
          // Complete wire
          const newWire = {
            id: Date.now(),
            x1: wireStart.x,
            y1: wireStart.y,
            x2: terminal.x,
            y2: terminal.y
          };
          setWires([...wires, newWire]);
          setIsDrawingWire(false);
          setWireStart(null);
        }
      }
    } else if (mode === 'delete') {
      const clickedComponent = getComponentAt(x, y);
      if (clickedComponent) {
        setComponents(components.filter(c => c.id !== clickedComponent.id));
        setWires(wires.filter(w => 
          !((w.x1 === clickedComponent.x - 20 || w.x1 === clickedComponent.x + 20) && w.y1 === clickedComponent.y) &&
          !((w.x2 === clickedComponent.x - 20 || w.x2 === clickedComponent.x + 20) && w.y2 === clickedComponent.y)
        ));
      }
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const toggleComponent = (id) => {
    setComponents(components.map(comp => {
      if (comp.id === id) {
        if (comp.type === 'switch') {
          return { ...comp, isOpen: !comp.isOpen };
        }
      }
      return comp;
    }));
  };

  const updateComponentProperty = (id, property, value) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, [property]: value } : comp
    ));
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Circuit Builder</h1>
          <p className="text-sm text-gray-600">Build and simulate electrical circuits</p>
        </div>

        {/* Mode Selection */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Mode</h3>
          <div className="grid grid-cols-3 gap-2">
            {modes.map(modeOption => (
              <button
                key={modeOption.id}
                onClick={() => {
                  setMode(modeOption.id);
                  setSelectedTool(null);
                  setIsDrawingWire(false);
                  setWireStart(null);
                }}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  mode === modeOption.id
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {modeOption.name}
              </button>
            ))}
          </div>
          {mode === 'wire' && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
              Click red terminals to connect components
            </div>
          )}
        </div>

        {/* Component Tools */}
        {mode === 'select' && (
          <div className="p-4 flex-1 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Components</h3>
            <div className="space-y-2">
              {tools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border text-left transition-all ${
                    selectedTool === tool.id
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span className="font-medium">{tool.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {mode === 'select' && (selectedTool ? `Click to place ${selectedTool}` : 'Select components or click a tool to add')}
              {mode === 'wire' && (isDrawingWire ? 'Click another red terminal to complete wire' : 'Click red terminals to connect with wires')}
              {mode === 'delete' && 'Click components to delete them'}
            </div>
            <button
              onClick={() => {
                setComponents([]);
                setWires([]);
                setSelectedComponent(null);
                setSelectedTool(null);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex">
          <div className="flex-1 p-4 bg-gray-50">
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
              style={{ cursor: 'none' }}
              onClick={handleCanvasClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setMousePos({ x: -1, y: -1 })}
            />
          </div>
          
          {/* Right Panel - Components on Board */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Components on Board</h3>
              <p className="text-sm text-gray-600">Control your circuit components</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {components.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-2">⚡</div>
                  <p>No components added yet</p>
                  <p className="text-sm">Add components from the left panel</p>
                </div>
              ) : (
                components.map(comp => (
                  <div key={comp.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{tools.find(t => t.id === comp.type)?.icon}</span>
                        <span className="font-medium capitalize">{comp.type}</span>
                      </div>
                      <button
                        onClick={() => {
                          setComponents(components.filter(c => c.id !== comp.id));
                          setWires(wires.filter(w => 
                            !((w.x1 === comp.x - 20 || w.x1 === comp.x + 20) && w.y1 === comp.y) &&
                            !((w.x2 === comp.x - 20 || w.x2 === comp.x + 20) && w.y2 === comp.y)
                          ));
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {comp.type === 'battery' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Voltage: {comp.voltage}V</label>
                        <input
                          type="range"
                          min="1"
                          max="24"
                          value={comp.voltage}
                          onChange={(e) => updateComponentProperty(comp.id, 'voltage', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>1V</span>
                          <span>24V</span>
                        </div>
                      </div>
                    )}
                    
                    {comp.type === 'resistor' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Resistance: {comp.resistance}Ω</label>
                        <input
                          type="range"
                          min="10"
                          max="1000"
                          value={comp.resistance}
                          onChange={(e) => updateComponentProperty(comp.id, 'resistance', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>10Ω</span>
                          <span>1000Ω</span>
                        </div>
                      </div>
                    )}
                    
                    {comp.type === 'switch' && (
                      <div className="space-y-2">
                        <button
                          onClick={() => toggleComponent(comp.id)}
                          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                            comp.isOpen
                              ? 'bg-red-100 text-red-700 border border-red-200'
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}
                        >
                          {comp.isOpen ? '🔴 Open (Off)' : '🟢 Closed (On)'}
                        </button>
                      </div>
                    )}
                    
                    {(comp.type === 'bulb' || comp.type === 'led') && (
                      <div className="space-y-2">
                        <div className={`text-sm font-medium flex items-center space-x-2 ${comp.isOn ? 'text-yellow-600' : 'text-gray-500'}`}>
                          <span>{comp.isOn ? '💡' : '⚫'}</span>
                          <span>Status: {comp.isOn ? 'ON' : 'OFF'}</span>
                        </div>
                        {comp.current > 0 && (
                          <div className="text-xs text-gray-600">
                            Current: {comp.current.toFixed(3)}A
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectricalPlayground;
