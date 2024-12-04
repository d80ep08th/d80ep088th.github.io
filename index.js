class PortfolioCube {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.cube = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.cubeContent = {
            front: {
                title: "About Me",
                content: `
                    <h2>Parth P. Dodë</h2>
                    <p>Technology enthusiast excelling at the confluence of Cybersecurity, Linux, IoT, and Product Design. MEng. Design student at McMaster University.</p>
                    <div class="social-links">
                        <a href="mailto:dodep@mcmaster.ca"><i class="fas fa-envelope"></i></a>
                        <a href="https://linkedin.com/in/parthdode"><i class="fab fa-linkedin"></i></a>
                        <a href="https://github.com/d80ep08th"><i class="fab fa-github"></i></a>
                    </div>
                `
            },
            back: {
                title: "Skills",
                content: `
                    <h2>Technical Skills</h2>
                    <div class="skills-grid">
                        <div class="skill-item">
                            <h3>DevOps</h3>
                            <p>Kubernetes, Docker, Ansible</p>
                        </div>
                        <div class="skill-item">
                            <h3>Security</h3>
                            <p>Cybersecurity, Network Security</p>
                        </div>
                        <div class="skill-item">
                            <h3>Development</h3>
                            <p>Python, JavaScript, C++</p>
                        </div>
                    </div>
                `
            },
            right: {
                title: "Experience",
                content: `
                    <h2>Work Experience</h2>
                    <div class="timeline-item">
                        <h3>Google Summer of Code '22</h3>
                        <p>The Linux Foundation</p>
                        <ul>
                            <li>Automated server infrastructure release</li>
                            <li>Optimized microservices deployment</li>
                        </ul>
                    </div>
                    <div class="timeline-item">
                        <h3>Tattle Civic Technologies</h3>
                        <p>Backend and DevOps Engineer</p>
                        <ul>
                            <li>Automated AWS S3 data recovery</li>
                            <li>Implemented CI/CD processes</li>
                        </ul>
                    </div>
                `
            },
            left: {
                title: "Education",
                content: `
                    <h2>Education</h2>
                    <div class="timeline-item">
                        <h3>McMaster University</h3>
                        <p>Master of Engineering Design (MED)</p>
                        <p>2023 - 2025</p>
                    </div>
                    <div class="timeline-item">
                        <h3>Datta Meghe College of Engineering</h3>
                        <p>Bachelor of Engineering, Computer Engineering</p>
                        <p>2016 - 2020</p>
                    </div>
                `
            },
            top: {
                title: "Projects",
                content: `
                    <h2>Key Projects</h2>
                    <div class="timeline-item">
                        <h3>Automotive Grade Linux</h3>
                        <p>Developed virtual automotive grade bare metal firmware</p>
                    </div>
                    <div class="timeline-item">
                        <h3>Uptane OTA System</h3>
                        <p>Remodeled documentation and optimized deployment workflow</p>
                    </div>
                `
            },
            bottom: {
                title: "Contact",
                content: `
                    <h2>Get in Touch</h2>
                    <p>Located in Hamilton, Ontario, Canada</p>
                    <p>Email: dodep@mcmaster.ca</p>
                    <p>Phone: +1 (808) 204-2689</p>
                    <div class="social-links">
                        <a href="mailto:dodep@mcmaster.ca"><i class="fas fa-envelope"></i></a>
                        <a href="https://linkedin.com/in/parthdode"><i class="fab fa-linkedin"></i></a>
                        <a href="https://github.com/d80ep08th"><i class="fab fa-github"></i></a>
                    </div>
                `
            }
        };

        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.createCube();
        this.setupLights();
        this.setupEventListeners();
        this.animate();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('scene-container').appendChild(this.renderer.domElement);
    }

    setupCamera() {
        this.camera.position.z = 5;
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0x0a192f, transparent: true, opacity: 0.9 }), // right
            new THREE.MeshPhongMaterial({ color: 0x0a192f, transparent: true, opacity: 0.9 }), // left
            new THREE.MeshPhongMaterial({ color: 0x0a192f, transparent: true, opacity: 0.9 }), // top
            new THREE.MeshPhongMaterial({ color: 0x0a192f, transparent: true, opacity: 0.9 }), // bottom
            new THREE.MeshPhongMaterial({ color: 0x0a192f, transparent: true, opacity: 0.9 }), // front
            new THREE.MeshPhongMaterial({ color: 0x0a192f, transparent: true, opacity: 0.9 })  // back
        ];

        this.cube = new THREE.Mesh(geometry, materials);
        this.scene.add(this.cube);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', () => this.onMouseUp());
        document.addEventListener('click', (e) => this.onClick(e));

        document.querySelector('.close-btn').addEventListener('click', () => {
            document.querySelector('.info-panel').classList.remove('active');
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    onMouseMove(event) {
        if (!this.isDragging) return;

        const deltaMove = {
            x: event.clientX - this.previousMousePosition.x,
            y: event.clientY - this.previousMousePosition.y
        };

        this.cube.rotation.y += deltaMove.x * 0.01;
        this.cube.rotation.x += deltaMove.y * 0.01;

        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    }

    onMouseUp() {
        this.isDragging = false;
    }

    onClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.cube);

        if (intersects.length > 0) {
            const faceIndex = Math.floor(intersects[0].faceIndex / 2);
            const faces = ['right', 'left', 'top', 'bottom', 'front', 'back'];
            const face = faces[faceIndex];
            
            const content = this.cubeContent[face];
            const infoPanel = document.querySelector('.info-panel');
            const contentDiv = infoPanel.querySelector('.content');
            
            contentDiv.innerHTML = content.content;
            infoPanel.classList.add('active');
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.isDragging) {
            this.cube.rotation.y += 0.001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioCube();
});