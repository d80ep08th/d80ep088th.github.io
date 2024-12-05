class InteractiveSphere {
    constructor() {
        console.log('Constructor called');
        this.init();
        console.log('Init completed');
        this.setupScene();
        console.log('Scene setup completed');
        this.createSphere();
        console.log('Sphere created');
        this.setupLights();
        console.log('Lights setup completed');
        this.setupControls();
        console.log('Controls setup completed');
        this.animate();
        console.log('Animation started');
    }

    init() {
        console.log('Starting init');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.touchStartPosition = new THREE.Vector2();
        this.isDragging = false;
        this.selectedQuadrant = null;
        this.quadrants = [];
        this.autoRotate = true;
        this.labelSprites = [];
    
        // Camera setup - only do this once
        this.camera.position.z = this.getOptimalCameraDistance();
        this.camera.position.y = 2;
        this.camera.lookAt(0, 0, 0);

        console.log('Camera position set to:', {
            z: this.camera.position.z,
            y: this.camera.position.y
        });
    
        this.lastTouchPosition = {
            x: 0,
            y: 0
        };

        this.portfolioData = {
            about: {
                title: "About Me",
                content: `<h2>Parth P. Dodë</h2>
                    <p>Technology enthusiast specializing in Cybersecurity, Linux, and IoT. Currently pursuing MEng. Design at McMaster University.</p>
                    <div class="social-links">
                        <a href="mailto:dodep@mcmaster.ca"><i class="fas fa-envelope"></i></a>
                        <a href="https://linkedin.com/in/parthdode"><i class="fab fa-linkedin"></i></a>
                        <a href="https://github.com/d80ep08th"><i class="fab fa-github"></i></a>
                    </div>`
            },
            experience: {
                title: "Experience",
                content: `<h2>Work Experience</h2>
                    <div class="timeline-item">
                        <h3>Google Summer of Code '22</h3>
                        <p>The Linux Foundation - Automated infrastructure and optimized deployments</p>
                    </div>`
            },
            education: {
                title: "Education",
                content: `<h2>Education</h2>
                    <div class="timeline-item">
                        <h3>McMaster University</h3>
                        <p>Master of Engineering Design (2023-2025)</p>
                    </div>`
            },
            skills: {
                title: "Skills",
                content: `<h2>Technical Skills</h2>
                    <div class="skills-grid">
                        <div class="skill-item">
                            <h3>DevOps</h3>
                            <p>Kubernetes, Docker, Ansible</p>
                        </div>
                    </div>`
            }
        };

    
        this.colors = Array(8).fill(0xFFFFFF);

        // Labels for each quadrant
        this.labels = [
            'About Me: Technology enthusiast & MEng student',
            'Experience: Google Summer of Code & DevOps',
            'Education: Masters at McMaster University',
            'Skills: Kubernetes, Docker, Security',
            'Projects: Automotive Linux & Cloud',
            'Certifications: Security & Development',
            'Research: IoT & Cybersecurity',
            'Contact: Find me @parthdode'
        ];



        
    }



    getOptimalCameraDistance() {
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            return 10; // Mobile
        } else if (screenWidth <= 768) {
            return 8; // Tablet
        } else {
            return 6; // Desktop
        }

        console.log('Optimal camera distance calculated:', {
            screenWidth,
            distance
        });
    }

    setupScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        console.log('Setting up scene with window dimensions:', {
            width: window.innerWidth,
            height: window.innerHeight
        });
        
        this.scene.background = new THREE.Color(0x0a0a0a);
        console.log('Scene container element:', document.getElementById('scene-container'));
    }

    rotateScene(deltaX, deltaY) {
        this.quadrants.forEach(quadrant => {
            quadrant.rotation.y += deltaX;
            quadrant.rotation.x += deltaY;
        });
    }

    createSphere() {
        const radius = 2;
        const segments = 64;
        
        for(let i = 0; i < 8; i++) {
            const geometry = new THREE.SphereGeometry(
                radius,
                segments,
                segments,
                (i % 4) * Math.PI/2,
                Math.PI/2,
                (i < 4) ? 0 : Math.PI/2,
                Math.PI/2
            );
            
            const material = new THREE.MeshPhongMaterial({
                color: this.colors[i],
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
                shininess: 100,
                specular: new THREE.Color(0x444444)
            });
            
            const quadrant = new THREE.Mesh(geometry, material);
            quadrant.userData.index = i;
            quadrant.userData.originalPosition = quadrant.position.clone();
            
            // Create label for each quadrant
            const sections = ['about', 'experience', 'education', 'skills'];
            const title = this.portfolioData[sections[i % 4]].title;
            
            // Create canvas for text
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 64;
            context.font = 'bold 24px Arial';
            context.fillStyle = this.colors[i] === 0x000000 ? '#FFFFFF' : '#000000';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(title, 128, 32);
            
            // Create sprite from canvas
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            
            // Position sprite relative to quadrant
            const angle = (i % 4) * Math.PI/2 + Math.PI/4;
            sprite.position.set(
                Math.cos(angle) * (radius + 0.5),
                i < 4 ? 1 : -1,
                Math.sin(angle) * (radius + 0.5)
            );
            sprite.scale.set(1, 0.25, 1);
            
            const group = new THREE.Group();
            group.add(quadrant);
            group.add(sprite);
            
            this.quadrants.push(group);
            this.scene.add(group);
        }
    
        // Add circular border
        const borderGeometry = new THREE.TorusGeometry(radius, 0.05, 16, 100);
        const borderMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x4a90e2,
            shininess: 100
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        this.scene.add(border);
    }


    setupLights() {
        console.log('Setting up lights');
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
    
        const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
        frontLight.position.set(0, 0, 5);
        
        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(0, 0, -5);
        
        const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
        topLight.position.set(0, 5, 0);
        
        this.scene.add(frontLight, backLight, topLight);
    }

    setupControls() {
        const container = this.renderer.domElement;
        
        container.addEventListener('click', (e) => this.onClick(e));


        // Track if it's a tap vs drag
        this.isTap = false;
        this.tapTimeout = null;
        
        // Mouse events
        container.addEventListener('mousedown', (e) => this.onPointerDown(e));
        container.addEventListener('mousemove', (e) => this.onPointerMove(e));
        container.addEventListener('mouseup', (e) => this.onPointerUp(e));
        
        // Touch events
        container.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        container.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        container.addEventListener('touchend', (e) => this.onTouchEnd(e));
        
        window.addEventListener('resize', () => this.onWindowResize());
        
        document.querySelector('.close-button').addEventListener('click', 
            () => document.querySelector('.info-overlay').classList.remove('active'));
    }

    onTouchStart(event) {
        event.preventDefault();
        
        if(event.touches.length === 1) {
            this.isTap = true;
            this.isDragging = true; // Set to true immediately
            this.autoRotate = false;
            
            const touch = event.touches[0];
            this.touchStartPosition.x = touch.clientX;
            this.touchStartPosition.y = touch.clientY;
    
            this.lastTouchPosition = {
                x: touch.clientX,
                y: touch.clientY
            };
        }
    }

    onTouchMove(event) {
        event.preventDefault();
        
        if(!this.isDragging || event.touches.length !== 1) return;
        
        const touch = event.touches[0];
        
        // Calculate the distance moved
        const deltaX = touch.clientX - this.lastTouchPosition.x;
        const deltaY = touch.clientY - this.lastTouchPosition.y;
        
        // If moved more than 10 pixels, definitely not a tap
        if(Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            this.isTap = false;
        }
        
        // Rotate the sphere based on touch movement
        // Adjust these multipliers to control rotation sensitivity
        const rotationX = deltaX * 0.005;
        const rotationY = deltaY * 0.005;
        
        this.quadrants.forEach(quadrant => {
            quadrant.rotation.y += rotationX;
            quadrant.rotation.x += rotationY;
        });
        
        // Update the last position
        this.lastTouchPosition = {
            x: touch.clientX,
            y: touch.clientY
        };
    }

    onTouchEnd(event) {
        if(this.isTap) {
            const touch = event.changedTouches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            
            this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.quadrants);
            
            if(intersects.length > 0) {
                const quadrant = intersects[0].object;
                this.selectQuadrant(quadrant);
            }
        }
        
        // Reset states
        this.isDragging = false;
        this.isTap = false;
        
        // Re-enable auto-rotation after a delay
        setTimeout(() => {
            this.autoRotate = true;
        }, 2000);
    }

    onPointerDown(event) {
        this.isDragging = true;
        this.autoRotate = false;
        this.touchStartPosition.x = event.clientX;
        this.touchStartPosition.y = event.clientY;
    }

 

    onPointerMove(event) {
        if(!this.isDragging) return;
        
        const deltaX = (event.clientX - this.touchStartPosition.x) * 0.01;
        const deltaY = (event.clientY - this.touchStartPosition.y) * 0.01;
        
        this.rotateScene(deltaX, deltaY);
        
        this.touchStartPosition.x = event.clientX;
        this.touchStartPosition.y = event.clientY;
    }



    onPointerUp() {
        this.isDragging = false;
        setTimeout(() => {
            this.autoRotate = true;
        }, 2000);
    }

    onClick(event) {
        // Only handle actual mouse clicks here
        if(event.type === 'click' && !this.isDragging) {
            event.preventDefault();
            
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(this.quadrants);
            
            if(intersects.length > 0) {
                const quadrant = intersects[0].object;
                this.selectQuadrant(quadrant);
            }
        }
    }

    selectQuadrant(quadrant) {
        const sections = ['about', 'experience', 'education', 'skills'];
        const content = this.portfolioData[sections[quadrant.userData.index % 4]];
        
        const overlay = document.querySelector('.info-overlay');
        overlay.querySelector('.content').innerHTML = content.content;
        overlay.classList.add('active');
        
        if(this.selectedQuadrant) {
            this.selectedQuadrant.position.copy(this.selectedQuadrant.userData.originalPosition);
        }
        
        const direction = quadrant.position.clone().normalize();
        quadrant.position.copy(direction.multiplyScalar(0.2));
        this.selectedQuadrant = quadrant;


    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.position.z = this.getOptimalCameraDistance();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        console.log('First animation frame');

        requestAnimationFrame(() => this.animate());
        
        if(this.autoRotate) {
            this.quadrants.forEach(quadrant => {
                quadrant.rotation.y += 0.002;
                quadrant.rotation.x += 0.001;
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InteractiveSphere();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    console.log('THREE.js version:', THREE.REVISION);
    if (typeof THREE === 'undefined') {
        console.error('THREE is not defined! Script might not be loading properly');
        return;
    }
    new InteractiveSphere();
});

try {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Starting application');
        new InteractiveSphere();
    });
} catch (error) {
    console.error('Error in application:', error);
}