class InteractiveSphere {
    constructor() {
        console.log('Constructor called');
        this.init();
        console.log('Init completed');
        this.setupScene();
        console.log('Scene setup completed');
        this.createSceneText();
        console.log('Name & Tag Line rendered');
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
                content: `<h2>Parth P. Dodë </h2>
                    <p>26 year old, curious, trilingual and a lifelong student of design thinking, Parth is an engineer raised in an academic family of engineers.</p>
                    <p>He was being mentored by hackers from The Linux Foundation as he was finishing his undergrad in computer engineering which led to him securing contracts
                       from international and national startups as a devops engineer for the next year and a half at the end of which he again pursued The Linux Foundation
                       to sharpen his devops and backend chops under the mentorship of their hackers. His last experience as an apprentice influenced him to study design and 
                       as of December 2024, Parth will have the credits required to receive his "Master's in Engineering Design degree with a specialization in Product Design"
                       from McMaster University, Hamilton, Canada.
                    </p>
                    <div class="social-links">
                        <a href="mailto:pd.devsecops@gmail.com"><i class="fas fa-envelope"></i></a>
                        <a href="https://linkedin.com/in/parthdode"><i class="fab fa-linkedin"></i></a>
                        <a href="https://github.com/d80ep08th"><i class="fab fa-github"></i></a>
                    </div>`
            },
            experience: {
                title: "Experience",
                content: `<h2>Professional Experience</h2>
                    
                    <div class="timeline-item">
                        <h3>Google Summer of Code Contributor</h3>
                        <p class="timeline-date">2022</p>
                        <p>The Linux Foundation - Uptane Project</p>
                        <ul>
                            <li>Developed secure OTA update system using Go and React</li>
                            <li>Implemented zero-trust security architecture for vehicle software distribution</li>
                            <li>Created automated testing infrastructure for continuous deployment</li>
                        </ul>
                    </div>
                    <div class="timeline-item">
                        <h3>Developer Operations Contractor</h3>
                        <p class="timeline-date">2021-2022</p>
                        <p>Multiple Tech Startups:</p>
                        <ul>
                            <li>Resurface Labs: Implemented end-to-end API security monitoring using ELK stack and custom alerting systems</li>
                            <li>Rug Pull Index: Architected blockchain monitoring infrastructure using GraphQL and distributed systems</li>
                            <li>Tattle: 
                                <ul>
                                    <li>Designed CI/CD pipelines with GitHub Actions and ArgoCD</li>
                                    <li>Implemented Infrastructure as Code using Terraform and Ansible</li>
                                    <li>Managed Kubernetes clusters with custom Helm charts and Kustomize</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="timeline-item">
                        <h3>Google Summer of Code Contributor</h3>
                        <p class="timeline-date">2020</p>
                        <p>The Linux Foundation - Automotive Grade Linux</p>
                        <ul>
                            <li>Built cloud-native vehicle connectivity platform using Node.js and TypeScript</li>
                            <li>Implemented WebSocket-based real-time communication system</li>
                            <li>Created comprehensive E2E testing suite using Playwright</li>
                        </ul>
                    </div>`
            },
            frontend: {
                title: "Frontend",
                content: `<h2>Frontend Development</h2>
                    <div class="skills-grid">
                        <div class="skill-item">
                            <h3>Core Technologies</h3>
                            
                                React.js with TypeScript</br>
                                Vue.js 3 with Composition API</br>
                                Next.js & Server Components</br>
                                Three.js & WebGL</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>State Management & APIs</h3>
                            
                             Redux Toolkit & RTK Query</br>
                             GraphQL with Apollo Client</br>
                             RESTful API Integration</br>
                             WebSocket Real-time Updates</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>Styling & UI</h3>
                            
                            Tailwind CSS & CSS Modules</br>
                            Responsive & Mobile-first Design</br>
                            WCAG Accessibility Standards</br>
                            Component Libraries (shadcn/ui)</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>Testing & Performance</h3>
                            
                            Jest & React Testing Library</br>
                            Playwright E2E Testing</br>
                            Storybook Component Testing</br>
                            Web Vitals Optimization</br>
                            
                        </div>
                    </div>`
            },
            backend: {
                title: "Backend",
                content: `<h2>Backend Development</h2>
                    <div class="skills-grid">
                        <div class="skill-item">
                            <h3>Languages & Frameworks</h3>
                            
                                Node.js (Express, NestJS)</br>
                                Ruby on Rails with Sorbet</br>
                                Python (Django, FastAPI)</br>
                                Go for Microservices</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>Databases & Search</h3>
                            
                                PostgreSQL & MySQL</br>
                                MongoDB & ScyllaDB</br>
                                Elasticsearch & Redis</br>
                                TimescaleDB for IoT</br>
                            </ul>
                        </div>
                        <div class="skill-item">
                            <h3>API Design</h3>
                            
                                RESTful API Architecture
                                GraphQL API Development
                                gRPC & Protocol Buffers
                                OpenAPI Specification
                            
                        </div>
                        <div class="skill-item">
                            <h3>Message Queues & Jobs</h3>
                            
                               RabbitMQ & Apache Kafka</br>
                               Redis Pub/Sub</br>
                               Sidekiq Background Jobs</br>
                               Bull Queue Management</br>
                            
                        </div>
                    </div>`
            },
            devops: {
                title: "DevOps",
                content: `<h2>DevOps & Cloud Infrastructure</h2>
                    <div class="skills-grid">
                        <div class="skill-item">
                            <h3>Cloud Platforms</h3>
                            
                                AWS (EC2, Lambda, ECS)</br>
                                GCP (Cloud Run, GKE)</br>
                                Cloudflare (Workers, R2)</br>
                                Infrastructure as Code</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>Container Orchestration</h3>
                            
                                Kubernetes & EKS/GKE</br>
                                Helm Charts & Kustomize</br>
                                Docker & Containerization</br>
                                Service Mesh (Istio)</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>Infrastructure Automation</h3>
                            
                                Terraform & Terragrunt</br>
                                Ansible & Puppet</br>
                          GitHub Actions & GitLab CI</br>
                         ArgoCD & Flux CD</br>
                        
                        </div>
                        <div class="skill-item">
                            <h3>Monitoring & Security</h3>
                            
                                Prometheus & Grafana</br>
                                ELK Stack & CloudWatch</br>
                                HashiCorp Vault</br>
                                Security Scanning (Trivy)</br>
                            
                        </div>
                    </div>`
            },
            design: {
                title: "Design",
                content: `<h2>Product & System Design</h2>
                    <div class="skills-grid">
                        <div class="skill-item">
                            <h3>UI/UX Design</h3>
                          
                                Figma & Design Systems</br>
                                User Research & Testing</br>
                                Responsive Prototypes</br>
                                Accessibility Standards</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>System Architecture</h3>
                            
                                Distributed Systems Design</br>
                                Microservices Architecture</br>
                                Event-Driven Design</br>
                                API Gateway Patterns</br>
                            
                        </div>
                        <div class="skill-item">
                            <h3>3D & Manufacturing</h3>
                           
                                Fusion 360 CAD/CAM</br>
                                3D Printing (Prusa)</br>
                                CNC Programming</br>
                                IoT Integration</br>
                        </div>
                    </div>`
            },
            education: {
                title: "Education",
                content: `<h2>Academic Background</h2>
                    <div class="timeline-item">
                        <h3>McMaster University</h3>
                        <p class="timeline-date">2023-2024</p>
                        <p>Master of Engineering Design [Specializing in Product Design]</p>
                        <p>Courses Taken:</p>
                        <ol>
                            <li>Human Centered Design</li>
                            <li>Design Thinking</li>
                            <li>Internet of Things and Industrial Internet of Things</li>
                            <li>Manufacturing Systems</li>
                        </ol>
                    </div>
                    <div class="timeline-item">
                        <h3>Mumbai University</h3>
                        <p class="timeline-date">2016-2020</p>
                        <p>Bachelor of Computer Engineering</p>
                      
                    </div>`
            }
        };
        this.colors = Array(8).fill(0x0000FF);

        // Labels for each quadrant
        this.labels = [
            'About Me: Technology enthusiast & MEng student',
            'Experience: Google Summer of Code & DevOps',
            'Education: Masters at McMaster University',
            'Skills: Kubernetes, Docker, Security',
            'Frontend: Automotive Linux & Cloud',
            'DevOps: Security & Development',
            'Backend: IoT & Cybersecurity',
            'Design: Find me @parthdode'
        ];



        
    }


    createSceneText() {
        // Create canvas for the name
        const nameCanvas = document.createElement('canvas');
        const nameCtx = nameCanvas.getContext('2d');
        nameCanvas.width = 512;
        nameCanvas.height = 128;
    
        // Set up the hacker-style font for name
        nameCtx.font = 'bold 48px "Courier New", monospace';
        nameCtx.fillStyle = '#00FF00'; // Bright green
        nameCtx.textAlign = 'center';
        nameCtx.textBaseline = 'middle';
        
        // Add a glow effect
        nameCtx.shadowColor = '#00FF00';
        nameCtx.shadowBlur = 10;
        nameCtx.fillText('Parth P. Dodë', 256, 64);
    
        // Create texture and sprite for name
        const nameTexture = new THREE.CanvasTexture(nameCanvas);
        const nameSpriteMaterial = new THREE.SpriteMaterial({ map: nameTexture });
        const nameSprite = new THREE.Sprite(nameSpriteMaterial);
        nameSprite.position.set(0, 3.5, 0); // Position above the sphere
        nameSprite.scale.set(2.5, 0.6, 1);
    
        // Create canvas for the tagline
        const taglineCanvas = document.createElement('canvas');
        const tagCtx = taglineCanvas.getContext('2d');
        taglineCanvas.width = 512;
        taglineCanvas.height = 128;
    
        // Set up the hacker-style font for tagline
        tagCtx.font = '32px "Courier New", monospace';
        tagCtx.fillStyle = '#00FF00'; // Same green color
        tagCtx.textAlign = 'center';
        tagCtx.textBaseline = 'middle';
        
        // Add glow effect to tagline
        tagCtx.shadowColor = '#00FF00';
        tagCtx.shadowBlur = 8;
        tagCtx.fillText('WELL ROUNDED', 256, 64);
    
        // Create texture and sprite for tagline
        const taglineTexture = new THREE.CanvasTexture(taglineCanvas);
        const taglineSpriteMaterial = new THREE.SpriteMaterial({ map: taglineTexture });
        const taglineSprite = new THREE.Sprite(taglineSpriteMaterial);
        taglineSprite.position.set(0, 3, 0); // Position below the name
        taglineSprite.scale.set(2, 0.4, 1);
    
        // Add both sprites to the scene
        this.scene.add(nameSprite);
        this.scene.add(taglineSprite);
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
        
        // Define all 8 section titles
        const sections = [
            'About', 'Experience', 'Education', 'Résumé',
            'Frontend', 'DevOps', 'Backend', 'Design'
        ];
        
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
            
            // Create quadrant with blue material
            const material = new THREE.MeshPhongMaterial({
                color: 0x0000FF,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide,
                shininess: 100,
                specular: new THREE.Color(0x444444)
            });
            
            const quadrant = new THREE.Mesh(geometry, material);
            quadrant.userData.index = i;
            quadrant.userData.originalPosition = quadrant.position.clone();
            
            // Store original color for hover effect
            quadrant.userData.originalColor = 0x0000FF;  // Blue
            quadrant.userData.hoverColor = 0x000000;     // Black
            
            // Label creation with green text
            const title = sections[i];
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = 256;
            canvas.height = 64;
            context.font = 'bold 24px Arial';
            context.fillStyle = '#00FF00';  // Green color for labels
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(title, 128, 32);
            
            const texture = new THREE.CanvasTexture(canvas);
            const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
            const sprite = new THREE.Sprite(spriteMaterial);
            
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
        
        // Main sphere border
        const borderGeometry = new THREE.TorusGeometry(radius, 0.05, 16, 100);
        const borderMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x000000,
            shininess: 100
        });
        const border = new THREE.Mesh(borderGeometry, borderMaterial);
        this.scene.add(border);
    }
    

    setupLights() {
        // Simplified lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
    
        const mainLightUp = new THREE.DirectionalLight(0x00ff00, 0.8);
        mainLightUp.position.set(0, 100, -300);
        this.scene.add(mainLightUp);


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

    // Add touch support for hover effects
    // Update touch handling for mobile devices
    onTouchMove(event) {
        event.preventDefault();
        
        if(!this.isDragging || event.touches.length !== 1) return;
        
        const touch = event.touches[0];
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
            this.quadrants.map(group => group.children[0])
        );
        
        // Reset previously hovered quadrant
        if (this.hoveredQuadrant && this.hoveredQuadrant !== intersects[0]?.object) {
            this.hoveredQuadrant.material.color.setHex(this.hoveredQuadrant.userData.originalColor);
        }
        
        // Set new hovered quadrant
        if (intersects.length > 0) {
            const quadrant = intersects[0].object;
            quadrant.material.color.setHex(quadrant.userData.hoverColor);
            this.hoveredQuadrant = quadrant;
        } else {
            this.hoveredQuadrant = null;
        }
        
        // Existing touch rotation logic
        const deltaX = touch.clientX - this.lastTouchPosition.x;
        const deltaY = touch.clientY - this.lastTouchPosition.y;
        
        if(Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
            this.isTap = false;
        }
        
        const rotationX = deltaX * 0.005;
        const rotationY = deltaY * 0.005;
        
        this.quadrants.forEach(quadrant => {
            quadrant.rotation.y += rotationX;
            quadrant.rotation.x += rotationY;
        });
        
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

 

    // Update the hover effect in onPointerMove
    onPointerMove(event) {
        if(!this.isDragging) {
            const rect = this.renderer.domElement.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const intersects = this.raycaster.intersectObjects(
                this.quadrants.map(group => group.children[0])
            );
            
            // First reset the previously hovered quadrant (if any) back to blue
            if (this.hoveredQuadrant && this.hoveredQuadrant !== intersects[0]?.object) {
                this.hoveredQuadrant.material.color.setHex(this.hoveredQuadrant.userData.originalColor);
            }
            
            // Then set the newly hovered quadrant to black
            if (intersects.length > 0) {
                const quadrant = intersects[0].object;
                quadrant.material.color.setHex(quadrant.userData.hoverColor);
                this.hoveredQuadrant = quadrant;
            } else {
                this.hoveredQuadrant = null;
            }
        }
        
        // Existing rotation logic
        if(this.isDragging) {
            const deltaX = (event.clientX - this.touchStartPosition.x) * 0.01;
            const deltaY = (event.clientY - this.touchStartPosition.y) * 0.01;
            this.rotateScene(deltaX, deltaY);
            this.touchStartPosition.x = event.clientX;
            this.touchStartPosition.y = event.clientY;
        }
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
        // Reorder the sections array to match the actual quadrant rendering order
        const sections = [
            'experience', 'about', 'résumé', 'education',  // Top half
            'devops', 'frontend', 'design', 'backend'      // Bottom half
        ];
        
        // Use the quadrant's index to get the correct content
        const content = this.portfolioData[sections[quadrant.userData.index]];
        
        // Update overlay with content
        const overlay = document.querySelector('.info-overlay');
        overlay.querySelector('.content').innerHTML = content.content;
        overlay.classList.add('active');
        
        // Handle quadrant animation
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