import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const AstronomyPreview = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffa500, 2, 100);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Sun
    const sunGeometry = new THREE.SphereGeometry(1.2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Sun glow
    const glowGeometry = new THREE.SphereGeometry(1.4, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffa500,
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Planet 1
    const planet1Geometry = new THREE.SphereGeometry(0.4, 32, 32);
    const planet1Material = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });
    const planet1 = new THREE.Mesh(planet1Geometry, planet1Material);
    scene.add(planet1);

    // Planet 2
    const planet2Geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const planet2Material = new THREE.MeshStandardMaterial({ color: 0xe74c3c });
    const planet2 = new THREE.Mesh(planet2Geometry, planet2Material);
    scene.add(planet2);

    // Orbit paths
    const createOrbitPath = (radius) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(64);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x333333 });
      const orbit = new THREE.Line(geometry, material);
      orbit.rotation.x = Math.PI / 2;
      return orbit;
    };

    scene.add(createOrbitPath(4));
    scene.add(createOrbitPath(6.5));

    // Stars
    const starsGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 500; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starVertices.push(x, y, z);
    }
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate sun
      sun.rotation.y += 0.002;
      glow.rotation.y += 0.002;

      // Orbit planet 1
      planet1.position.x = Math.cos(time * 0.5) * 4;
      planet1.position.z = Math.sin(time * 0.5) * 4;
      planet1.rotation.y += 0.01;

      // Orbit planet 2
      planet2.position.x = Math.cos(time * 0.3) * 6.5;
      planet2.position.z = Math.sin(time * 0.3) * 6.5;
      planet2.rotation.y += 0.015;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default AstronomyPreview;
