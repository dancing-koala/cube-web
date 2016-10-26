"use strict";

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var windowHalfX = SCREEN_WIDTH / 2;
var windowHalfY = SCREEN_HEIGHT / 2;

var camera, scene, light, controls;
var renderer, stats;
var playAnimation = false;
var factory;
var clock;

var container;

function sceneSetup() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 1000);
    camera.position.set(0, 0, 50);

    // scene.add(new THREE.AxisHelper());

    //LIGHTS
    var ambientLight = new THREE.AmbientLight(0x999999);
    scene.add(ambientLight);


    // RENDERER
    renderer = new THREE.WebGLRenderer({alpha: false});
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    renderer.domElement.style.position = "relative";
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColor(0xa1a1a1, 0);
    container.appendChild(renderer.domElement);

    enableControls();

    window.addEventListener('resize', onWindowResize, false);
}

function sceneComposition() {

    factory = new APP.CubeFactory();

    factory.initialize(scene);

    clock = new THREE.Clock();
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    stats.begin();
    controls.update();
    requestAnimationFrame(animate);
    render();
    stats.end();
}

function render() {
    factory.update();
    renderer.render(scene, camera);
}

function enableControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = false;
    controls.enableZoom = true;
}

function initStats() {
    stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.getElementById("stats-output").appendChild(stats.domElement);
}

function toggleAnimation() {
    playAnimation = !playAnimation;
}

sceneSetup();
sceneComposition();
initStats();
animate();