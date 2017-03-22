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

function init() {
    createScene();

    createLights();

    createPlane();
    createSea();
    createSky();

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

}


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

function createSea() {
    sea = new Sea();

    sea.mesh.position.y = -600;

    scene.add(sea.mesh);
}

function createSky() {

}

function loop() {

}

window.addEventListener('load', init, false);
