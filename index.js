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
        // Adjust camera distance based on screen size
        const screenWidth = window.innerWidth;
        if (screenWidth <= 480) {
            return 8; // Mobile
        } else if (screenWidth <= 768) {
            return 7; // Tablet
        } else {
            return 5; // Desktop
        }
    }

    setupScene() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
        this.camera.position.z = 5;
        
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
                opacity: 0.85,
                side: THREE.DoubleSide,
                shininess: 50
            });
            
            const quadrant = new THREE.Mesh(geometry, material);
            quadrant.userData.index = i;
            quadrant.userData.originalPosition = quadrant.position.clone();
            this.quadrants.push(quadrant);
            this.scene.add(quadrant);
        }
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(10, 10, 10);
        
        this.scene.add(ambientLight, pointLight);
    }

    setupControls() {
        const container = this.renderer.domElement;
        
        container.addEventListener('mousedown', (e) => this.onPointerDown(e));
        container.addEventListener('mousemove', (e) => this.onPointerMove(e));
        container.addEventListener('mouseup', () => this.onPointerUp());
        
        container.addEventListener('touchstart', (e) => this.onTouchStart(e));
        container.addEventListener('touchmove', (e) => this.onTouchMove(e));
        container.addEventListener('touchend', () => this.onPointerUp());
        
        container.addEventListener('click', (e) => this.onClick(e));
        
        window.addEventListener('resize', () => this.onWindowResize());
        
        document.querySelector('.close-button').addEventListener('click', 
            () => document.querySelector('.info-overlay').classList.remove('active'));
    }

    onPointerDown(event) {
        this.isDragging = true;
        this.autoRotate = false;
        this.touchStartPosition.x = event.clientX;
        this.touchStartPosition.y = event.clientY;
    }

    onTouchStart(event) {
        if(event.touches.length === 1) {
            event.preventDefault();
            this.isDragging = true;
            this.autoRotate = false;
            this.touchStartPosition.x = event.touches[0].clientX;
            this.touchStartPosition.y = event.touches[0].clientY;
        }
    }

    onPointerMove(event) {
        if(!this.isDragging) return;
        
        const deltaX = (event.clientX - this.touchStartPosition.x) * 0.01;
        const deltaY = (event.clientY - this.touchStartPosition.y) * 0.01;
        
        this.rotateScene(deltaX, deltaY);
        
        this.touchStartPosition.x = event.clientX;
        this.touchStartPosition.y = event.clientY;
    }

    onTouchMove(event) {
        if(!this.isDragging || event.touches.length !== 1) return;
        
        const touch = event.touches[0];
        const deltaX = (touch.clientX - this.touchStartPosition.x) * 0.01;
        const deltaY = (touch.clientY - this.touchStartPosition.y) * 0.01;
        
        this.rotateScene(deltaX, deltaY);
        
        this.touchStartPosition.x = touch.clientX;
        this.touchStartPosition.y = touch.clientY;
    }

    rotateScene(deltaX, deltaY) {
        this.quadrants.forEach(quadrant => {
            quadrant.rotation.y += deltaX;
            quadrant.rotation.x += deltaY;
        });
    }

    onPointerUp() {
        this.isDragging = false;
        setTimeout(() => {
            this.autoRotate = true;
        }, 2000);
    }

    onClick(event) {
        event.preventDefault();
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const intersects = this.raycaster.intersectObjects(this.quadrants);
        
        if(intersects.length > 0) {
            const quadrant = intersects[0].object;
            this.selectQuadrant(quadrant);
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
                quadrant.rotation.y += 0.001;
            });
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new InteractiveSphere();
});