class InteractiveSphere {
    constructor() {
        this.init();
        this.setupScene();
        this.createSphere();
        this.setupLights();
        this.setupControls();
        this.animate();
    }

    init() {
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
    
        // Set initial camera position
        this.camera.position.z = this.getOptimalCameraDistance();
        // Add this line to position camera slightly above
        this.camera.position.y = 2;
        // Look at the center
        this.camera.lookAt(0, 0, 0);            

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

    
                // Color palette - shades of green using complementary and analogous theory
        this.colors = [
            0x2E7D32, // Forest Green
            0x66BB6A, // Light Green
            0x1B5E20, // Dark Green
            0x81C784, // Pale Green
            0x4CAF50, // Medium Green
            0xA5D6A7, // Sage Green
            0x388E3C, // Kelly Green
            0xC8E6C9  // Mint Green
        ];
        
        this.camera.position.z = this.getOptimalCameraDistance();
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
    }

    setupScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        
        
        this.scene.background = new THREE.Color(0x0a0a0a);
    }

     createSphere() {
        const radius = 2;
        const segments = 32;
        
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
                opacity: 0.9, // Increased opacity
                side: THREE.DoubleSide,
                shininess: 100, // Increased shininess
                specular: new THREE.Color(0xffffff) // Add specular highlight
            });
            
            const quadrant = new THREE.Mesh(geometry, material);
            quadrant.userData.index = i;
            quadrant.userData.originalPosition = quadrant.position.clone();
            this.quadrants.push(quadrant);
            this.scene.add(quadrant);
        }
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
    
        const pointLight1 = new THREE.PointLight(0xffffff, 1);
        pointLight1.position.set(10, 10, 10);
        
        const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
        pointLight2.position.set(-10, -10, -10);
        
        this.scene.add(pointLight1, pointLight2);
    }

    setupControls() {
        const container = this.renderer.domElement;
        
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
        event.preventDefault(); // Prevent default touch behavior
        
        if(event.touches.length === 1) {
            this.isTap = true;
            this.isDragging = false;
            this.autoRotate = false;
            
            const touch = event.touches[0];
            this.touchStartPosition.x = touch.clientX;
            this.touchStartPosition.y = touch.clientY;
            
            // Clear any existing tap timeout
            if(this.tapTimeout) {
                clearTimeout(this.tapTimeout);
            }
            
            // Set a new tap timeout
            this.tapTimeout = setTimeout(() => {
                this.isTap = false;
            }, 200); // Consider it a tap if touch duration is less than 200ms
        }
    }

    onTouchMove(event) {
        if(event.touches.length !== 1) return;
        
        const touch = event.touches[0];
        const deltaX = touch.clientX - this.touchStartPosition.x;
        const deltaY = touch.clientY - this.touchStartPosition.y;
        
        // If moved more than 10 pixels, consider it a drag instead of a tap
        if(Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            this.isTap = false;
            this.isDragging = true;
        }
        
        if(this.isDragging) {
            const rotationDeltaX = deltaX * 0.01;
            const rotationDeltaY = deltaY * 0.01;
            this.rotateScene(rotationDeltaX, rotationDeltaY);
        }
        
        this.touchStartPosition.x = touch.clientX;
        this.touchStartPosition.y = touch.clientY;
    }

    onTouchEnd(event) {
        if(this.isTap) {
            // Get the touch position
            const touch = event.changedTouches[0];
            const rect = this.renderer.domElement.getBoundingClientRect();
            
            // Convert touch position to normalized device coordinates
            this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
            
            // Perform raycasting and selection
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
        if(this.tapTimeout) {
            clearTimeout(this.tapTimeout);
        }
        
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