let Colors = {
    red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0,
};

let scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane,
    WIDTH, HEIGHT,
    renderer,
    container;

let hemisphereLight, shadowLight;

let sea;
let sky;
let airplane;

let mousePos = {
    x: 0,
    y: 0,
};




Sea = function() {
    let geom = new THREE.CylinderGeometry(600, 600,800, 40, 10);
    geom.rotateX(-Math.PI / 2);

    let mat = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        transparent: true,
        opacity: 0.6,
        shading: THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
}

Cloud = function() {
    this.mesh = new THREE.Object3D();

    let geom = new THREE.BoxGeometry(20, 20, 20);
    let mat = new THREE.MeshPhongMaterial({
        color: Colors.white,
    });

    let nBlocs = 3 + Math.floor(Math.random() * 3);
    for(let i = 0; i < nBlocs; ++i) {
        let m = new THREE.Mesh(geom, mat);

        m.position.x = i * 15;
        m.position.y = Math.random() * 10;
        m.position.z = Math.random() * 10;
        m.rotation.z = Math.random() * Math.PI * 2;
        m.rotation.y = Math.random() * Math.PI * 2;

        let s = 0.1 + Math.random() * 0.9;
        m.scale.set(s, s, s);

        m.castShadow = true;
        m.receiveShadow = true;

        this.mesh.add(m);
    }
}

Sky = function() {
    this.mesh = new THREE.Object3D();

    this.nClouds = 20;

    let stepAngle = Math.PI * 2 / this.nClouds;

    for(let i = 0; i < this.nClouds; ++i) {
        let c = new Cloud();

        let a = stepAngle * i;
        let h = 750 + Math.random() * 200;

        c.mesh.position.x = Math.cos(a) * h;
        c.mesh.position.y = Math.sin(a) * h;
        c.mesh.position.z = -400 - Math.random() * 400;

        c.mesh.rotation.z = a + Math.PI / 2;

        let s = 1 + Math.random() * 2;
        c.mesh.scale.set(s, s, s);

        this.mesh.add(c.mesh);
    }
}

AirPlane = function(){
    this.mesh = new THREE.Object3D();

    // cockpit
    let geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
    geomCockpit.vertices[4].y -= 10;
    geomCockpit.vertices[4].z += 20;
    geomCockpit.vertices[5].y -= 10;
    geomCockpit.vertices[5].z -= 20;
    geomCockpit.vertices[6].y += 30;
    geomCockpit.vertices[6].z += 20;
    geomCockpit.vertices[7].y += 30;
    geomCockpit.vertices[7].z -= 20;
    let matCockpit = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading
    })
    let cockpit = new THREE.Mesh(geomCockpit, matCockpit);
    cockpit.castShadow = true;
    cockpit.receiveShadow = true;
    this.mesh.add(cockpit);

    // engine
    let geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    let matEngine = new THREE.MeshPhongMaterial({
        color: Colors.white,
        shading: THREE.FlatShading,
    });
    let engine = new THREE.Mesh(geomEngine, matEngine);
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // tailPlane
    let geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
    let matTailPlane = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading,
    })
    let tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
    tailPlane.position.set(-35, 25, 0);
    tailPlane.castShadow = true;
    tailPlane.receiveShadow = true;
    this.mesh.add(tailPlane);

    // sideWing
    let geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    let matSideWing = new THREE.MeshPhongMaterial({
        color: Colors.red,
        shading: THREE.FlatShading,
    });
    let sideWing = new THREE.Mesh(geomSideWing, matSideWing);
    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    this.mesh.add(sideWing);

    // propeller
    let geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    let matPropeller = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        shading: THREE.FlatShading,
    });
    this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);

    // blade
    let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    let matBlade = new THREE.MeshPhongMaterial({
        color: Colors.brownDark,
        shading: THREE.FlatShading,
    });
    let blade = new THREE.Mesh(geomBlade, matBlade);
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;

    this.propeller.add(blade);
}

Pilot = function() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'pilot';

    this.angleHairs = 0;

    // body
    let geomBody = new THREE.BoxGeometry(15, 15, 15);
    let matBody = new THREE.MeshPhongMaterial({
        color: Colors.brown,
        shading: THREE.FlatShading,
    });
    let body = new THREE.Mesh(geomBody, matBody);
    body.position.set(2, -12, 0);
    this.mesh.add(body);

    // face
    let geomFace = new THREE.BoxGeometry(10, 10, 10);
    let matFace = new THREE.MeshLambertMaterial({
        color: Colors.pink,
    });
    let face = new THREE.Mesh(geomFace, matFace);
    this.mesh.add(face);

    // hair
    let geomHair = new THREE.BoxGeometry(4, 4, 4);
    let matHair = new THREE.MeshLambertMaterial({
        color: Colors.brown,
    });
    let hair = new THREE.Mesh(geomHair, matHair);
    hair.geometry.translateY(2);

    let hairs = new THREE.Object3D();

    this.hairTop = new THREE.Object3D();

    for(let i = 0; i < 12; ++i) {
        let h = hair.clone();
        let col = i % 3;
        let row = Math.floor(i / 3);
        let startPosZ = -4;
        let startPosX = -4;
        h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
        this.hairTop.add(h);
    }
    hairs.add(this.hairTop);

    ler geomHairSide = new THREE.BoxGeometry(12, 4, 2);
    geomHairSide.translateX(-6);
    let hairSideL = new THREE.Mesh(geomHairSide, matHair);
    let hairSideR = hairSideL.clone();
    hairSideL.position.set(8, -2, -6);
    hairSideR.position.set(8, -2, 6);
    hairs.add(hairSideL);
    hairs.add(hairSideR);

    // hairBack
    let geomHairBack = new THREE.BoxGeometry(2, 8, 10);
    let hairBack = new THREE.Mesh(geomHairBack, matHair);
    hairBack.position.set(-1, -4, 0);
    hairs.add(hairBack);
    hairs.position.set(-5, 5, 0);

    this.mesh.add(hairs);

    // glass
    let geomGlass = new THREE.BoxGeometry(5, 5, 5);
    let matGlass = new THREE.MeshLambertMaterial({
        color: Colors.brown,
    });
    let glassR = new THREE.Mesh(geomGlass, matGlass);
    glassR.position.set(6, 0, 3);
    let glassL = glassR.clone();
    glassL.position.z = -glassR.position.z;

    let geomGlassA = new THREE.BoxGeometry(11, 1, 11);
    let glassA = new THREE.Mesh(geomGlassA, matGlass);
    this.mesh.add(glassR);
    this.mesh.add(glassL);
    this.mesh.add(glassA);

    // ear
}


function init() {
    createScene();

    createLights();

    createPlane();
    createSea();
    createSky();

    document.addEventListener('mousemove', handleMouseMove, false);

    loop();
}

function createScene() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    fieldOfView = 60;
    aspectRatio = WIDTH / HEIGHT;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
    );

    camera.position.set(0, 100, 200);

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enable = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;

    renderer.setSize(WIDTH, HEIGHT);

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
    let tx = -1 + (event.clientX / WIDTH) * 2;
    let ty = 1 - (event.clientY / HEIGHT) * 2;

    mousePos = {
        x: tx,
        y: ty,
    };
}


function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    shadowLight.position.set(150, 350, 350);
    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createPlane() {
    airplane = new AirPlane();
    airplane.mesh.scale.set(0.25, 0.25, 0.25);
    airplane.mesh.position.y = 100;

    scene.add(airplane.mesh);
}

function createSea() {
    sea = new Sea();

    sea.mesh.position.y = -600;

    scene.add(sea.mesh);
}

function createSky() {
    sky = new Sky();
    sky.mesh.position.y = -600;

    scene.add(sky.mesh);
}

function loop() {
    airplane.propeller.rotation.x += 0.3;
    sea.mesh.rotation.z += 0.005;
    sky.mesh.rotation.z += 0.01;

    updatePlane();

    renderer.render(scene, camera);

    requestAnimationFrame(loop);
}

function updatePlane() {
    let targetX = normalize(mousePos.x, -1, 1, -100, 100);
    let targetY = normalize(mousePos.y, -1, 1, 25, 175);

    airplane.mesh.position.x = targetX;
    airplane.mesh.position.y = targetY;
}

function normalize(v, vmin, vmax, tmin, tmax) {
    let  nv = Math.max(Math.min(v, vmax), vmin);
    let  dv = vmax - vmin;
    let  pc = (nv - vmin) / dv;
    let  dt = tmax - tmin;
    let  tv = tmin + (pc * dt);

    return tv;
}

window.addEventListener('load', init, false);
