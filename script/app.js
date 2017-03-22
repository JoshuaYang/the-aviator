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

    camera.position.x = 0;
    camera.position.y = 100;
    camera.position.z = 200;

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
    });
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enable = true;

    container = document.getElementBtId('world');
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {

}

function createLights() {

}

function createPlane() {

}

function createSea() {

}

function createSky() {

}

function loop() {

}

window.addEventListener('load', init, false);
