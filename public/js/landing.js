// Initialize variables
let scene, camera, renderer, particles = [];
let isMusicPlaying = false;
let statsAnimationRunning = false;

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2000);
});

// Initialize Three.js Scene
function initThreeJS() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('threejs-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.3);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0x06ffa5, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Create particles
    createParticles();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

// Create floating particles
function createParticles() {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
        color: 0x6366f1,
        transparent: true,
        opacity: 0.6
    });

    for (let i = 0; i < 100; i++) {
        const particle = new THREE.Mesh(geometry, material);

        // Random position
        particle.position.x = Math.random() * 100 - 50;
        particle.position.y = Math.random() * 100 - 50;
        particle.position.z = Math.random() * 100 - 50;

        // Random velocity
        particle.userData = {
            velocity: new THREE.Vector3(
                Math.random() * 0.02 - 0.01,
                Math.random() * 0.02 - 0.01,
                Math.random() * 0.02 - 0.01
            )
        };

        particles.push(particle);
        scene.add(particle);
    }
}

// Window resize handler
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Animate particles
    particles.forEach(particle => {
        particle.position.x += particle.userData.velocity.x;
        particle.position.y += particle.userData.velocity.y;
        particle.position.z += particle.userData.velocity.z;

        // Bounce off imaginary boundaries
        if (Math.abs(particle.position.x) > 50) particle.userData.velocity.x *= -1;
        if (Math.abs(particle.position.y) > 50) particle.userData.velocity.y *= -1;
        if (Math.abs(particle.position.z) > 50) particle.userData.velocity.z *= -1;

        // Pulsing effect
        particle.scale.setScalar(1 + 0.1 * Math.sin(Date.now() * 0.001 + particle.position.x));
    });

    // Rotate camera slightly
    camera.position.x = Math.sin(Date.now() * 0.0005) * 10;
    camera.position.y = Math.cos(Date.now() * 0.0003) * 5;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Create floating icons
function createFloatingIcons() {
    const icons = ['🎮', '🤖', '✨', '⚡', '🎯', '🏆', '🎨', '🔊'];
    const container = document.getElementById('floating-icons');

    setInterval(() => {
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];
        icon.style.left = `${Math.random() * 100}vw`;
        icon.style.fontSize = `${Math.random() * 32 + 24}px`;
        icon.style.animationDuration = `${Math.random() * 8 + 8}s`;

        container.appendChild(icon);

        // Remove icon after animation completes
        setTimeout(() => {
            icon.remove();
        }, 12000);
    }, 1000);
}

function toggleMusic() {
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');

  if (!audio) {
    console.error('Audio element not found');
    return;
  }

  if (audio.paused) {
    audio.volume = 0.4;

    audio.play()
      .then(() => {
        isMusicPlaying = true;
        btn.textContent = '🎶';
        btn.classList.add('playing');
      })
      .catch(err => {
        console.log('Play blocked:', err);
        alert('Tap anywhere once to enable sound');
      });

  } else {
    audio.pause();
    isMusicPlaying = false;
    btn.textContent = '🎵';
    btn.classList.remove('playing');
  }
}

// Animate statistics counters
function animateStats() {
    if (statsAnimationRunning) return;

    const playerCount = document.getElementById('player-count');
    const gamesCount = document.getElementById('games-count');

    let players = 10000;
    let games = 500000;
    let playerCounter = 0;
    let gameCounter = 0;

    const playerInterval = setInterval(() => {
        playerCounter += Math.ceil(players / 50);
        if (playerCounter >= players) {
            playerCounter = players;
            clearInterval(playerInterval);
        }
        playerCount.textContent = playerCounter.toLocaleString() + '+';
    }, 30);

    const gameInterval = setInterval(() => {
        gameCounter += Math.ceil(games / 50);
        if (gameCounter >= games) {
            gameCounter = games;
            clearInterval(gameInterval);
            statsAnimationRunning = false;
        }
        gamesCount.textContent = gameCounter.toLocaleString() + '+';
    }, 30);

    statsAnimationRunning = true;
}

// Scroll animations
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate stats when they come into view
                if (entry.target.id === 'features') {
                    setTimeout(animateStats, 500);
                }
            }
        });
    }, { threshold: 0.1 });

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    createFloatingIcons();
    initScrollAnimations();
    initNavbarScroll();

    // Initialize background music (autoplay is disabled by browsers)
    const audio = document.getElementById('bg-music');
    audio.volume = 0.3;

    // Add click event to start music on user interaction
    document.addEventListener(
        'click',
        () => {
            if (!isMusicPlaying) {
                toggleMusic(); // use same function everywhere
            }
        },
        { once: true }
    );


    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add hover effect to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effect to buttons
    document.querySelectorAll('.play-button, .learn-button').forEach(button => {
        button.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.3);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        width: ${size}px;
                        height: ${size}px;
                        top: ${y}px;
                        left: ${x}px;
                    `;

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add keyframe for ripple animation
    const style = document.createElement('style');
    style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
    document.head.appendChild(style);
});

// Prevent default context menu
document.addEventListener('contextmenu', e => {
    e.preventDefault();
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // M key toggles music
    if (e.key === 'm' || e.key === 'M') {
        toggleMusic();
    }
    // Spacebar scrolls to next section
    if (e.key === ' ' && !e.target.matches('input, textarea, button, a')) {
        e.preventDefault();
        const sections = document.querySelectorAll('section');
        const currentScroll = window.scrollY + 100;

        for (let section of sections) {
            if (section.offsetTop > currentScroll) {
                window.scrollTo({
                    top: section.offsetTop - 100,
                    behavior: 'smooth'
                });
                break;
            }
        }
    }
});

// Add mouse parallax effect
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    document.querySelectorAll('.feature-card, .preview-container').forEach(el => {
        el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    // Update camera position for Three.js scene
    if (camera) {
        camera.position.x += (x * 0.01 - camera.position.x) * 0.05;
        camera.position.y += (y * 0.01 - camera.position.y) * 0.05;
    }
});