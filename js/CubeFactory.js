"use strict";

var APP = {} || APP;

APP.Cube = function () {
    this.age = 0;
    this.direction = null;
    this.mesh = null;
    this.origin = null;
    this.speed = 1;
    this.maxLifeSpan = 1;
};

APP.Line = function () {
    this.end = null;
    this.mesh = null;
    this.start = null;
};

APP.Line.prototype.updatePosition = function () {
    this.mesh.geometry.vertices[0] = this.start.mesh.position;
    this.mesh.geometry.vertices[1] = this.end.mesh.position;
    this.mesh.geometry.verticesNeedUpdate = true;
};

APP.CubeFactory = function () {
    this.positionBase = new THREE.Vector3();
    this.positionSpread = new THREE.Vector3(20, 20, 20);

    this.directionSpread = new THREE.Vector3(1, 1, 1);

    this.speedBase = 1;
    this.speedSpread = 1;

    this.cubeMaterial = new THREE.MeshBasicMaterial({color: 0xc2c2c2});
    this.lineMaterial = new THREE.LineBasicMaterial({color: 0xa2a2a2});

    this.cubeSize = 0.25;
    this.cubeSegmentsSize = 0.25;

    this.maxLifeSpanBase = 50;
    this.maxLifeSpanSpread = 10;

    this.defaultCubeCount = 100;

    this.defaultAmplitude = 0.05;

    this.cubeArray = [];
    this.lineArray = [];
};

APP.CubeFactory.prototype.newCube = function () {

    var cube = new APP.Cube();

    cube.speed = this.randomValue(this.speedBase, this.speedSpread);
    cube.maxLifeSpan = this.randomValue(this.maxLifeSpanBase, this.maxLifeSpanSpread);

    var geometry = new THREE.BoxBufferGeometry(this.cubeSize, this.cubeSize, this.cubeSegmentsSize, this.cubeSegmentsSize);
    cube.mesh = new THREE.Mesh(geometry, this.cubeMaterial);
    cube.origin = this.randomVector3(this.positionBase, this.positionSpread);
    cube.mesh.position.set(cube.origin.x, cube.origin.y, cube.origin.z);

    return cube;
};


APP.CubeFactory.prototype.newLine = function (origin, end) {
    var line = new APP.Line();
    line.start = origin;
    line.end = end;

    var geometry = new THREE.Geometry();
    geometry.vertices.push(origin.mesh.position, end.mesh.position);

    line.mesh = new THREE.Line(geometry, this.lineMaterial);

    return line;
};

APP.CubeFactory.prototype.initialize = function (scene) {
    for (var i = 0; i < this.defaultCubeCount; i++) {
        var cube = this.newCube();
        this.cubeArray.push(cube);
        scene.add(cube.mesh);

        for (var j = 0; j < this.cubeArray.length; j++) {
            if (Math.random() > 0.85 && i != j) {
                var line = this.newLine(cube, this.cubeArray[j]);
                scene.add(line.mesh);
                this.lineArray.push(line);
            }
        }
    }
};

APP.CubeFactory.prototype.update = function () {
    for (var i = 0; i < this.cubeArray.length; i++) {
        var cube = this.cubeArray[i];

        if (cube.age < cube.maxLifeSpan) {
            if (cube.age == 0) {
                cube.direction = this.randomVector3(this.positionBase, this.directionSpread);
                cube.speed = this.randomValue(this.speedBase, this.speedSpread);
            }

            cube.mesh.position.addScaledVector(cube.direction, cube.speed * this.defaultAmplitude);
            cube.age++;
        } else {
            cube.age = 0;
        }
    }

    for (var j = 0; j < this.lineArray.length; j++) {
        this.lineArray[j].updatePosition();
    }
};

APP.CubeFactory.prototype.randomValue = function (base, spread) {
    return base + spread * (Math.random() - 0.5);
};

APP.CubeFactory.prototype.randomVector3 = function (base, spread) {
    var rand3 = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
    return new THREE.Vector3().addVectors(base, new THREE.Vector3().multiplyVectors(spread, rand3));
};


