import React, { useState, useRef, useEffect } from 'react';

const AstronomyLab = () => {
  const [selectedExperiment, setSelectedExperiment] = useState('solar-system');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [planets, setPlanets] = useState([]);
  const [time, setTime] = useState(0);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  const experiments = [
    {
      id: 'solar-system',
      name: 'Solar System',
      description: 'Explore planetary orbits and gravitational dynamics',
      icon: '🌍'
    },
    {
      id: 'gravity-sim',
      name: 'Gravity Simulation',
      description: 'Interactive n-body gravitational system',
      icon: '🌌'
    },
    {
      id: 'orbital-mechanics',
      name: 'Orbital Mechanics',
      description: 'Study satellite trajectories and escape velocities',
      icon: '🛰️'
    },
    {
      id: 'tidal-forces',
      name: 'Tidal Forces',
      description: 'Visualize tidal effects and Roche limits',
      icon: '🌊'
    }
  ];

  const solarSystemData = [
    { name: 'Sun', radius: 25, distance: 0, speed: 0, color: '#FDB813', mass: 1000, angle: 0 },
    { name: 'Mercury', radius: 4, distance: 100, speed: 0.04, color: '#8C7853', mass: 0.33, angle: 0 },
    { name: 'Venus', radius: 6, distance: 130, speed: 0.035, color: '#FFC649', mass: 4.87, angle: Math.PI/4 },
    { name: 'Earth', radius: 6, distance: 160, speed: 0.03, color: '#6B93D6', mass: 5.97, angle: Math.PI/2 },
    { name: 'Mars', radius: 5, distance: 200, speed: 0.024, color: '#C1440E', mass: 0.64, angle: Math.PI },
    { name: 'Jupiter', radius: 18, distance: 280, speed: 0.013, color: '#D8CA9D', mass: 1898, angle: Math.PI*1.5 },
    { name: 'Saturn', radius: 15, distance: 340, speed: 0.009, color: '#FAD5A5', mass: 568, angle: Math.PI*0.3 },
    { name: 'Uranus', radius: 10, distance: 400, speed: 0.007, color: '#4FD0E7', mass: 86.8, angle: Math.PI*0.7 },
    { name: 'Neptune', radius: 10, distance: 450, speed: 0.005, color: '#4B70DD', mass: 102, angle: Math.PI*1.2 }
  ];

  useEffect(() => {
    initializeExperiment();
  }, [selectedExperiment]);

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        const deltaTime = speed * 0.016;
        setTime(prevTime => prevTime + deltaTime);
        
        if (selectedExperiment === 'solar-system') {
          setPlanets(prevPlanets => 
            prevPlanets.map(planet => {
              if (planet.name === 'Sun') return planet;
              
              const newAngle = (planet.angle || 0) + planet.speed * deltaTime;
              return {
                ...planet,
                angle: newAngle,
                x: 400 + Math.cos(newAngle) * planet.distance,
                y: 300 + Math.sin(newAngle) * planet.distance
              };
            })
          );
        } else {
          setPlanets(prevPlanets => {
            const newPlanets = prevPlanets.map(p => ({ 
              ...p, 
              trail: [...(p.trail || []), { x: p.x || 0, y: p.y || 0 }].slice(-100),
              x: p.x || 0,
              y: p.y || 0,
              vx: p.vx || 0,
              vy: p.vy || 0
            }));
            
            for (let i = 0; i < newPlanets.length; i++) {
              if (newPlanets[i].fixed) continue;
              
              let fx = 0, fy = 0;
              
              for (let j = 0; j < newPlanets.length; j++) {
                if (i !== j) {
                  const dx = newPlanets[j].x - newPlanets[i].x;
                  const dy = newPlanets[j].y - newPlanets[i].y;
                  const distance = Math.sqrt(dx * dx + dy * dy);
                  
                  if (distance > (newPlanets[i].radius + newPlanets[j].radius)) {
                    const G = selectedExperiment === 'gravity-sim' ? 100 : 
                              selectedExperiment === 'orbital-mechanics' ? 200 : 150;
                    
                    const force = (G * newPlanets[j].mass) / (distance * distance);
                    const forceX = force * dx / distance;
                    const forceY = force * dy / distance;
                    
                    fx += forceX;
                    fy += forceY;
                  }
                }
              }
              
              const ax = fx / newPlanets[i].mass;
              const ay = fy / newPlanets[i].mass;
              
              newPlanets[i].vx += ax * deltaTime;
              newPlanets[i].vy += ay * deltaTime;
              
              newPlanets[i].x += newPlanets[i].vx * deltaTime;
              newPlanets[i].y += newPlanets[i].vy * deltaTime;
              
              if (newPlanets[i].x < newPlanets[i].radius) {
                newPlanets[i].x = newPlanets[i].radius;
                newPlanets[i].vx = Math.abs(newPlanets[i].vx) * 0.8;
              }
              if (newPlanets[i].x > 800 - newPlanets[i].radius) {
                newPlanets[i].x = 800 - newPlanets[i].radius;
                newPlanets[i].vx = -Math.abs(newPlanets[i].vx) * 0.8;
              }
              if (newPlanets[i].y < newPlanets[i].radius) {
                newPlanets[i].y = newPlanets[i].radius;
                newPlanets[i].vy = Math.abs(newPlanets[i].vy) * 0.8;
              }
              if (newPlanets[i].y > 600 - newPlanets[i].radius) {
                newPlanets[i].y = 600 - newPlanets[i].radius;
                newPlanets[i].vy = -Math.abs(newPlanets[i].vy) * 0.8;
              }
            }
            
            return newPlanets;
          });
        }
        
        if (isPlaying) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, speed, selectedExperiment]);

  const initializeExperiment = () => {
    if (selectedExperiment === 'solar-system') {
      setPlanets(solarSystemData.map(planet => ({
        ...planet,
        x: planet.name === 'Sun' ? 400 : 400 + Math.cos(planet.angle) * planet.distance,
        y: planet.name === 'Sun' ? 300 : 300 + Math.sin(planet.angle) * planet.distance
      })));
    } else if (selectedExperiment === 'gravity-sim') {
      setPlanets([
        { 
          name: 'Star A', radius: 20, x: 300, y: 300, vx: 0, vy: 0.5, 
          color: '#FDB813', mass: 300, trail: [], fixed: false 
        },
        { 
          name: 'Star B', radius: 15, x: 500, y: 300, vx: 0, vy: -0.5, 
          color: '#FF6B6B', mass: 200, trail: [], fixed: false 
        },
        { 
          name: 'Planet', radius: 8, x: 400, y: 250, vx: 1.2, vy: 0, 
          color: '#4ECDC4', mass: 10, trail: [], fixed: false 
        }
      ]);
    } else if (selectedExperiment === 'orbital-mechanics') {
      setPlanets([
        { 
          name: 'Earth', radius: 30, x: 400, y: 300, vx: 0, vy: 0, 
          color: '#6B93D6', mass: 1000, trail: [], fixed: true 
        },
        { 
          name: 'Low Orbit', radius: 4, x: 500, y: 300, vx: 0, vy: 3.2, 
          color: '#FFD700', mass: 1, trail: [], fixed: false, orbitRadius: 100 
        },
        { 
          name: 'Medium Orbit', radius: 4, x: 550, y: 300, vx: 0, vy: 2.6, 
          color: '#FF69B4', mass: 1, trail: [], fixed: false, orbitRadius: 150 
        },
        { 
          name: 'High Orbit', radius: 4, x: 600, y: 300, vx: 0, vy: 2.2, 
          color: '#00FF7F', mass: 1, trail: [], fixed: false, orbitRadius: 200 
        }
      ]);
    } else if (selectedExperiment === 'tidal-forces') {
      setPlanets([
        { 
          name: 'Planet', radius: 40, x: 250, y: 300, vx: 0, vy: 0, 
          color: '#8B4513', mass: 800, trail: [], fixed: true 
        },
        { 
          name: 'Moon', radius: 18, x: 450, y: 300, vx: 0, vy: 1.8, 
          color: '#C0C0C0', mass: 50, trail: [], fixed: false, tidalLocked: true 
        }
      ]);
    }
    setTime(0);
  };

  const animate = () => {
    const deltaTime = speed * 0.016; // 60fps normalized
    setTime(prevTime => prevTime + deltaTime);
    
    if (selectedExperiment === 'solar-system') {
      setPlanets(prevPlanets => 
        prevPlanets.map(planet => {
          if (planet.name === 'Sun') return planet;
          
          const newAngle = (planet.angle || 0) + planet.speed * deltaTime;
          return {
            ...planet,
            angle: newAngle,
            x: 400 + Math.cos(newAngle) * planet.distance,
            y: 300 + Math.sin(newAngle) * planet.distance
          };
        })
      );
    } else {
      setPlanets(prevPlanets => {
        const newPlanets = prevPlanets.map(p => ({ 
          ...p, 
          trail: [...(p.trail || []), { x: p.x || 0, y: p.y || 0 }].slice(-100),
          x: p.x || 0,
          y: p.y || 0,
          vx: p.vx || 0,
          vy: p.vy || 0
        }));
        
        // Physics simulation for non-solar system experiments
        for (let i = 0; i < newPlanets.length; i++) {
          if (newPlanets[i].fixed) continue;
          
          let fx = 0, fy = 0;
          
          // Calculate gravitational forces from all other bodies
          for (let j = 0; j < newPlanets.length; j++) {
            if (i !== j) {
              const dx = newPlanets[j].x - newPlanets[i].x;
              const dy = newPlanets[j].y - newPlanets[i].y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance > (newPlanets[i].radius + newPlanets[j].radius)) {
                const G = selectedExperiment === 'gravity-sim' ? 100 : 
                          selectedExperiment === 'orbital-mechanics' ? 200 : 150;
                
                const force = (G * newPlanets[j].mass) / (distance * distance);
                const forceX = force * dx / distance;
                const forceY = force * dy / distance;
                
                fx += forceX;
                fy += forceY;
              }
            }
          }
          
          // Update velocity (F = ma, so a = F/m)
          const ax = fx / newPlanets[i].mass;
          const ay = fy / newPlanets[i].mass;
          
          newPlanets[i].vx += ax * deltaTime;
          newPlanets[i].vy += ay * deltaTime;
          
          // Update position
          newPlanets[i].x += newPlanets[i].vx * deltaTime;
          newPlanets[i].y += newPlanets[i].vy * deltaTime;
          
          // Boundary conditions - bounce off walls
          if (newPlanets[i].x < newPlanets[i].radius) {
            newPlanets[i].x = newPlanets[i].radius;
            newPlanets[i].vx = Math.abs(newPlanets[i].vx) * 0.8;
          }
          if (newPlanets[i].x > 800 - newPlanets[i].radius) {
            newPlanets[i].x = 800 - newPlanets[i].radius;
            newPlanets[i].vx = -Math.abs(newPlanets[i].vx) * 0.8;
          }
          if (newPlanets[i].y < newPlanets[i].radius) {
            newPlanets[i].y = newPlanets[i].radius;
            newPlanets[i].vy = Math.abs(newPlanets[i].vy) * 0.8;
          }
          if (newPlanets[i].y > 600 - newPlanets[i].radius) {
            newPlanets[i].y = 600 - newPlanets[i].radius;
            newPlanets[i].vy = -Math.abs(newPlanets[i].vy) * 0.8;
          }
        }
        
        return newPlanets;
      });
    }
    
    drawCanvas();
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    try {
      // Clear with space background
      const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, 600);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#0f0f23');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);
      
      // Draw stars
      ctx.fillStyle = 'white';
      for (let i = 0; i < 100; i++) {
        const x = (i * 37) % 800;
        const y = (i * 73) % 600;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.5, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      if (selectedExperiment === 'solar-system') {
        drawSolarSystem(ctx);
      } else if (selectedExperiment === 'gravity-sim') {
        drawGravitySimulation(ctx);
      } else if (selectedExperiment === 'orbital-mechanics') {
        drawOrbitalMechanics(ctx);
      } else if (selectedExperiment === 'tidal-forces') {
        drawTidalForces(ctx);
      }
    } catch (error) {
      console.error('Canvas drawing error:', error);
      // Fallback: just clear the canvas
      ctx.fillStyle = '#0f0f23';
      ctx.fillRect(0, 0, 800, 600);
    }
  };

  const drawSolarSystem = (ctx) => {
    // Draw orbital paths
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    planets.forEach(planet => {
      if (planet.name !== 'Sun') {
        ctx.beginPath();
        ctx.arc(400, 300, planet.distance, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
    
    // Draw planets
    planets.forEach(planet => {
      if (planet.name === 'Sun') {
        // Draw sun with corona effect
        const gradient = ctx.createRadialGradient(400, 300, 0, 400, 300, planet.radius * 3);
        gradient.addColorStop(0, planet.color);
        gradient.addColorStop(0.7, 'rgba(253, 184, 19, 0.4)');
        gradient.addColorStop(1, 'rgba(253, 184, 19, 0.1)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(400, 300, planet.radius * 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // Sun core
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(400, 300, planet.radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Sun surface details
        ctx.fillStyle = '#FFE55C';
        for (let i = 0; i < 8; i++) {
          const angle = (time * 0.001 + i * Math.PI / 4);
          const x = 400 + Math.cos(angle) * (planet.radius * 0.7);
          const y = 300 + Math.sin(angle) * (planet.radius * 0.7);
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      } else {
        // Draw planet shadow/3D effect
        const shadowGradient = ctx.createRadialGradient(
          planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 0,
          planet.x, planet.y, planet.radius
        );
        shadowGradient.addColorStop(0, planet.color);
        shadowGradient.addColorStop(1, `${planet.color}80`);
        
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Planet atmosphere for gas giants
        if (['Jupiter', 'Saturn', 'Uranus', 'Neptune'].includes(planet.name)) {
          ctx.strokeStyle = `${planet.color}60`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(planet.x, planet.y, planet.radius + 3, 0, 2 * Math.PI);
          ctx.stroke();
        }
        
        // Saturn's rings
        if (planet.name === 'Saturn') {
          ctx.strokeStyle = '#FAD5A5';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(planet.x, planet.y, planet.radius + 8, planet.radius + 3, 0, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(planet.x, planet.y, planet.radius + 12, planet.radius + 5, 0, 0, 2 * Math.PI);
          ctx.stroke();
        }
        
        // Planet labels
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(planet.name, planet.x, planet.y + planet.radius + 15);
      }
    });
  };

  const drawGravitySimulation = (ctx) => {
    planets.forEach(planet => {
      if (!planet.x || !planet.y || !isFinite(planet.x) || !isFinite(planet.y)) return;
      
      // Draw orbital trails with fading effect
      if (planet.trail && planet.trail.length > 2) {
        for (let i = 1; i < planet.trail.length; i++) {
          const alpha = i / planet.trail.length;
          ctx.strokeStyle = `${planet.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(planet.trail[i-1].x, planet.trail[i-1].y);
          ctx.lineTo(planet.trail[i].x, planet.trail[i].y);
          ctx.stroke();
        }
      }
      
      // Draw gravitational influence (larger for more massive objects)
      const influenceRadius = Math.sqrt(planet.mass) * 2;
      const gradient = ctx.createRadialGradient(
        planet.x, planet.y, planet.radius,
        planet.x, planet.y, influenceRadius
      );
      gradient.addColorStop(0, `${planet.color}40`);
      gradient.addColorStop(1, `${planet.color}10`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, influenceRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw the celestial body with realistic shading
      const bodyGradient = ctx.createRadialGradient(
        planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 0,
        planet.x, planet.y, planet.radius
      );
      bodyGradient.addColorStop(0, planet.color);
      bodyGradient.addColorStop(1, `${planet.color}80`);
      
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add surface details for stars
      if (planet.name.includes('Star')) {
        ctx.fillStyle = '#FFFFFF60';
        for (let i = 0; i < 6; i++) {
          const angle = (time * 2 + i * Math.PI / 3);
          const x = planet.x + Math.cos(angle) * planet.radius * 0.6;
          const y = planet.y + Math.sin(angle) * planet.radius * 0.6;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
      
      // Labels with velocity info
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(planet.name, planet.x, planet.y + planet.radius + 20);
      
      const velocity = Math.sqrt((planet.vx || 0) ** 2 + (planet.vy || 0) ** 2);
      ctx.font = '10px Arial';
      ctx.fillText(`v: ${velocity.toFixed(1)}`, planet.x, planet.y + planet.radius + 35);
    });
  };

  const drawOrbitalMechanics = (ctx) => {
    const earth = planets.find(p => p.name === 'Earth');
    if (!earth) return;
    
    // Draw Earth with realistic details
    const earthGradient = ctx.createRadialGradient(
      earth.x - earth.radius * 0.3, earth.y - earth.radius * 0.3, 0,
      earth.x, earth.y, earth.radius
    );
    earthGradient.addColorStop(0, '#87CEEB');
    earthGradient.addColorStop(0.7, earth.color);
    earthGradient.addColorStop(1, '#4169E1');
    
    ctx.fillStyle = earthGradient;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw continents
    ctx.fillStyle = '#228B22';
    const continents = [
      { angle: 0, size: 0.3 },
      { angle: Math.PI * 0.6, size: 0.25 },
      { angle: Math.PI * 1.2, size: 0.35 },
      { angle: Math.PI * 1.8, size: 0.2 }
    ];
    
    continents.forEach(continent => {
      const x = earth.x + Math.cos(continent.angle) * earth.radius * 0.6;
      const y = earth.y + Math.sin(continent.angle) * earth.radius * 0.6;
      ctx.beginPath();
      ctx.arc(x, y, earth.radius * continent.size, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Draw atmosphere
    ctx.strokeStyle = 'rgba(135, 206, 235, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(earth.x, earth.y, earth.radius + 8, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw satellites
    planets.forEach(satellite => {
      if (satellite.name === 'Earth') return;
      
      // Draw orbital path
      if (satellite.orbitRadius) {
        ctx.strokeStyle = `${satellite.color}40`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(earth.x, earth.y, satellite.orbitRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      // Draw satellite trail with fading
      if (satellite.trail && satellite.trail.length > 2) {
        for (let i = 1; i < satellite.trail.length; i++) {
          const alpha = i / satellite.trail.length;
          ctx.strokeStyle = `${satellite.color}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(satellite.trail[i-1].x, satellite.trail[i-1].y);
          ctx.lineTo(satellite.trail[i].x, satellite.trail[i].y);
          ctx.stroke();
        }
      }
      
      // Draw satellite body
      ctx.fillStyle = satellite.color;
      ctx.beginPath();
      ctx.arc(satellite.x, satellite.y, satellite.radius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw solar panels
      ctx.fillStyle = '#4169E1';
      ctx.fillRect(satellite.x - satellite.radius - 4, satellite.y - 1.5, 8, 3);
      ctx.fillRect(satellite.x + satellite.radius - 4, satellite.y - 1.5, 8, 3);
      
      // Draw communication dish
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(satellite.x, satellite.y - satellite.radius - 2, 3, 0, Math.PI, true);
      ctx.stroke();
      
      // Calculate and display orbital data
      const distance = Math.sqrt((satellite.x - earth.x) ** 2 + (satellite.y - earth.y) ** 2);
      const velocity = Math.sqrt((satellite.vx || 0) ** 2 + (satellite.vy || 0) ** 2);
      const orbitalPeriod = 2 * Math.PI * distance / velocity;
      
      ctx.fillStyle = 'white';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(satellite.name, satellite.x, satellite.y + satellite.radius + 15);
      ctx.fillText(`Alt: ${Math.floor(distance - earth.radius)}km`, satellite.x, satellite.y + satellite.radius + 28);
      ctx.fillText(`v: ${velocity.toFixed(1)}km/s`, satellite.x, satellite.y + satellite.radius + 41);
    });
    
    // Earth label
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Earth', earth.x, earth.y + earth.radius + 25);
  };

  const drawTidalForces = (ctx) => {
    const planet = planets.find(p => p.name === 'Planet');
    const moon = planets.find(p => p.name === 'Moon');
    
    if (!planet || !moon || !isFinite(planet.x) || !isFinite(moon.x)) return;
    
    // Draw planet with realistic surface
    const planetGradient = ctx.createRadialGradient(
      planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 0,
      planet.x, planet.y, planet.radius
    );
    planetGradient.addColorStop(0, '#CD853F');
    planetGradient.addColorStop(0.7, planet.color);
    planetGradient.addColorStop(1, '#654321');
    
    ctx.fillStyle = planetGradient;
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add surface features to planet
    ctx.fillStyle = '#8B4513';
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 4;
      const x = planet.x + Math.cos(angle) * planet.radius * 0.7;
      const y = planet.y + Math.sin(angle) * planet.radius * 0.7;
      ctx.beginPath();
      ctx.arc(x, y, planet.radius * 0.15, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Calculate tidal effects
    const dx = moon.x - planet.x;
    const dy = moon.y - planet.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    
    if (isFinite(angle) && distance > 0) {
      // Draw moon with tidal deformation
      ctx.save();
      ctx.translate(moon.x, moon.y);
      ctx.rotate(angle);
      
      // Tidal stretching factor based on distance
      const tidalStretch = Math.max(1, 300 / distance);
      const moonRadius = moon.radius;
      
      // Main moon body (tidally deformed)
      const moonGradient = ctx.createRadialGradient(-moonRadius * 0.3, -moonRadius * 0.3, 0, 0, 0, moonRadius);
      moonGradient.addColorStop(0, '#E0E0E0');
      moonGradient.addColorStop(0.7, moon.color);
      moonGradient.addColorStop(1, '#A0A0A0');
      
      ctx.fillStyle = moonGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, moonRadius + tidalStretch * 2, moonRadius - tidalStretch * 0.5, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Tidal bulges (more pronounced closer to planet)
      const bulgeSize = tidalStretch * 3;
      ctx.fillStyle = '#F0F0F0';
      
      // Near-side bulge (toward planet)
      ctx.beginPath();
      ctx.ellipse(-moonRadius - bulgeSize/2, 0, bulgeSize, bulgeSize * 1.5, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Far-side bulge (away from planet)
      ctx.beginPath();
      ctx.ellipse(moonRadius + bulgeSize/2, 0, bulgeSize, bulgeSize * 1.5, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Surface cracks from tidal stress
      ctx.strokeStyle = '#808080';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const crackAngle = i * Math.PI / 3;
        const startR = moonRadius * 0.5;
        const endR = moonRadius + bulgeSize;
        ctx.beginPath();
        ctx.moveTo(Math.cos(crackAngle) * startR, Math.sin(crackAngle) * startR);
        ctx.lineTo(Math.cos(crackAngle) * endR, Math.sin(crackAngle) * endR);
        ctx.stroke();
      }
      
      ctx.restore();
      
      // Draw tidal force vectors
      ctx.strokeStyle = '#FF4444';
      ctx.lineWidth = 3;
      
      // Differential force arrows
      const forceScale = 25;
      
      // Near side - stronger pull toward planet
      const nearX = moon.x - Math.cos(angle) * moonRadius;
      const nearY = moon.y - Math.sin(angle) * moonRadius;
      drawArrow(ctx, nearX, nearY, nearX - Math.cos(angle) * forceScale * 1.2, nearY - Math.sin(angle) * forceScale * 1.2);
      
      // Far side - weaker pull toward planet (net away from center)
      const farX = moon.x + Math.cos(angle) * moonRadius;
      const farY = moon.y + Math.sin(angle) * moonRadius;
      drawArrow(ctx, farX, farY, farX + Math.cos(angle) * forceScale * 0.8, farY + Math.sin(angle) * forceScale * 0.8);
      
      // Side compression forces
      const sideAngle1 = angle + Math.PI / 2;
      const sideAngle2 = angle - Math.PI / 2;
      
      const side1X = moon.x + Math.cos(sideAngle1) * moonRadius;
      const side1Y = moon.y + Math.sin(sideAngle1) * moonRadius;
      drawArrow(ctx, side1X, side1Y, side1X - Math.cos(sideAngle1) * forceScale * 0.6, side1Y - Math.sin(sideAngle1) * forceScale * 0.6);
      
      const side2X = moon.x + Math.cos(sideAngle2) * moonRadius;
      const side2Y = moon.y + Math.sin(sideAngle2) * moonRadius;
      drawArrow(ctx, side2X, side2Y, side2X - Math.cos(sideAngle2) * forceScale * 0.6, side2Y - Math.sin(sideAngle2) * forceScale * 0.6);
      
      // Roche limit visualization
      const rocheLimit = planet.radius * 2.44; // Simplified Roche limit
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, rocheLimit, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Roche limit label
      ctx.fillStyle = 'rgba(255, 100, 100, 0.9)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Roche Limit', planet.x, planet.y - rocheLimit - 10);
      
      // Warning if moon is inside Roche limit
      if (distance < rocheLimit) {
        ctx.fillStyle = '#FF0000';
        ctx.font = '14px Arial';
        ctx.fillText('⚠️ TIDAL DISRUPTION!', moon.x, moon.y - moonRadius - 30);
      }
    }
    
    // Draw orbital trail
    if (moon.trail && moon.trail.length > 2) {
      for (let i = 1; i < moon.trail.length; i++) {
        const alpha = i / moon.trail.length;
        ctx.strokeStyle = `${moon.color}${Math.floor(alpha * 128).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(moon.trail[i-1].x, moon.trail[i-1].y);
        ctx.lineTo(moon.trail[i].x, moon.trail[i].y);
        ctx.stroke();
      }
    }
    
    // Labels with tidal data
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Planet', planet.x, planet.y + planet.radius + 25);
    ctx.fillText('Moon (Tidally Locked)', moon.x, moon.y + moon.radius + 25);
    
    // Display tidal force strength
    const tidalForce = planet.mass / Math.pow(distance, 3);
    ctx.font = '10px Arial';
    ctx.fillText(`Tidal Force: ${tidalForce.toFixed(3)}`, moon.x, moon.y + moon.radius + 40);
    ctx.fillText(`Distance: ${Math.floor(distance)}`, moon.x, moon.y + moon.radius + 55);
  };
  
  // Helper function to draw arrows
  const drawArrow = (ctx, fromX, fromY, toX, toY) => {
    const headLength = 8;
    const angle = Math.atan2(toY - fromY, toX - fromX);
    
    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
    
    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
  };

  useEffect(() => {
    drawCanvas();
  }, [planets, selectedExperiment]);

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-2">🌌 Astronomy Lab</h1>
          <p className="text-sm text-gray-300">Explore the cosmos and gravitational physics</p>
        </div>

        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Experiments</h3>
          <div className="space-y-2">
            {experiments.map(exp => (
              <button
                key={exp.id}
                onClick={() => setSelectedExperiment(exp.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border text-left transition-all ${
                  selectedExperiment === exp.id
                    ? 'bg-purple-900 border-purple-600 text-purple-100'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="text-lg">{exp.icon}</span>
                <div>
                  <div className="font-medium">{exp.name}</div>
                  <div className="text-xs opacity-75">{exp.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Controls</h3>
          <div className="space-y-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Speed: {speed}x</label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Information</h3>
          <div className="space-y-2 text-sm text-gray-400">
            {selectedExperiment === 'solar-system' && (
              <div>
                <p>• Planets orbit according to Kepler's laws</p>
                <p>• Inner planets move faster than outer planets</p>
                <p>• Orbital periods increase with distance</p>
                <p>• Time: {Math.floor(time / 100)} Earth days</p>
              </div>
            )}
            {selectedExperiment === 'gravity-sim' && (
              <div>
                <p>• N-body gravitational simulation</p>
                <p>• Objects attract each other with F = Gm₁m₂/r²</p>
                <p>• Watch for orbital patterns and chaos</p>
                <p>• Bodies: {planets.length}</p>
              </div>
            )}
            {selectedExperiment === 'orbital-mechanics' && (
              <div>
                <p>• Different orbital altitudes</p>
                <p>• Higher orbits = slower speeds</p>
                <p>• Demonstrates satellite mechanics</p>
                <p>• Orbital velocity: v = √(GM/r)</p>
              </div>
            )}
            {selectedExperiment === 'tidal-forces' && (
              <div>
                <p>• Gravitational gradient effects</p>
                <p>• Tidal bulges on both sides</p>
                <p>• Roche limit demonstration</p>
                <p>• Force ∝ 1/r³ for tidal effects</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">
              {experiments.find(e => e.id === selectedExperiment)?.name} - 
              {isPlaying ? ' Running' : ' Paused'}
            </div>
            <div className="text-xs text-gray-400">
              Use controls to interact with the simulation
            </div>
          </div>
        </div>
        
        <div className="flex-1 p-4 bg-gray-900 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="bg-black rounded-lg shadow-2xl border border-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default AstronomyLab;
