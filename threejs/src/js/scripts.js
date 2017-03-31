(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// Browserify handles scoping; so we don't need to IIFE this file.

// Sample module
// var helloWorld = require("./modules/helloWorld");

// document content loaded wrapper
document.addEventListener('DOMContentLoaded', function () {
  // Let's get this party started.
  console.log("hello let us begin");

  // Three.js experiments

  var scene = new THREE.Scene({
    background: 0xffffff
  });
  var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  var gridBox = document.getElementById("gridBox");
  gridBox.appendChild(renderer.domElement);

  // var geometry = new THREE.BoxGeometry(1, 1, 1);
  // var material = new THREE.MeshBasicMaterial({
  //   color: 0x00ff00
  // });
  // var cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  var ambientLight = new THREE.AmbientLight(Math.random() * 0x10);
  scene.add(ambientLight);

  var directionalLight = new THREE.DirectionalLight(Math.random() * 0xffffff);
  directionalLight.position.x = Math.random() - 0.5;
  directionalLight.position.y = Math.random() - 0.5;
  directionalLight.position.z = Math.random() - 0.5;
  directionalLight.position.normalize();
  scene.add(directionalLight);

  var counter = 0;
  var colors = [0xff0000, 0xaa5577];

  camera.position.z = 5;

  function render() {
    requestAnimationFrame(render);

    if (counter < 60) {
      counter++;
    } else {
      var geometry = new THREE.BoxGeometry(Math.random() * 5, Math.random() * 5, Math.random() * 5);
      var material = new THREE.MeshLambertMaterial({
        color: colors[getRandomInt(0, colors.length - 1)],
        opacity: 0.75,
        transparent: true
      });
      var cube = new THREE.Mesh(geometry, material);

      cube.rotation.x += Math.random();
      cube.rotation.y += Math.random();

      scene.add(cube);

      var directionalLight = new THREE.DirectionalLight(Math.random() * 0x333333);
      directionalLight.position.x = Math.random() - 0.5;
      directionalLight.position.y = Math.random() - 0.5;
      directionalLight.position.z = Math.random() - 0.5;
      directionalLight.position.normalize();
      scene.add(directionalLight);

      counter = 0;
    }

    var timer = Date.now() * 0.0001;
    camera.position.x = Math.cos(timer) * 6;
    camera.position.z = Math.sin(timer) * 6;
    camera.lookAt(scene.position);
    // renderer.render( scene, camera );

    renderer.render(scene, camera);
  }

  render();
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

},{}]},{},[1])

//# sourceMappingURL=scripts.js.map