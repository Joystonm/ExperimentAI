import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const PendulumPreview = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Pendulum stand
    const standGeometry = new THREE.BoxGeometry(0.1, 3, 0.1);
    const standMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 1.5;
    scene.add(stand);

    const topBarGeometry = new THREE.BoxGeometry(2, 0.1, 0.1);
    const topBar = new THREE.Mesh(topBarGeometry, standMaterial);
    topBar.position.y = 3;
    scene.add(topBar);

    // Pendulum string
    const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
    const stringMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const string = new THREE.Mesh(stringGeometry, stringMaterial);
    string.position.y = 2;
    scene.add(string);

    // Pendulum bob
    const bobGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const bobMaterial = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const bob = new THREE.Mesh(bobGeometry, bobMaterial);
    bob.castShadow = true;
    scene.add(bob);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation
    let angle = Math.PI / 4;
    let angularVelocity = 0;
    const gravity = 9.8;
    const length = 2;

    const animate = () => {
      requestAnimationFrame(animate);

      // Pendulum physics
      const angularAcceleration = (-gravity / length) * Math.sin(angle);
      angularVelocity += angularAcceleration * 0.016;
      angle += angularVelocity * 0.016;
      angularVelocity *= 0.999; // damping

      // Update positions
      const x = length * Math.sin(angle);
      const y = 3 - length * Math.cos(angle);

      bob.position.set(x, y, 0);
      string.position.set(x / 2, (3 + y) / 2, 0);
      string.rotation.z = angle;

      // Slow camera rotation
      camera.position.x = Math.sin(Date.now() * 0.0002) * 8;
      camera.position.z = Math.cos(Date.now() * 0.0002) * 8;
      camera.lookAt(0, 2, 0);

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

export default PendulumPreview;
