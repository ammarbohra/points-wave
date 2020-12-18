//TEXT CAROUSEL
var translate, rotate, rotateback, cameraRotate, cameraRotateback, lookUp, lookDown, active;

function next() {
  var currentImg = $('.text.active');
  var nextImg = currentImg.next();
  if(currentImg.hasClass('text1')) {rotate = true;translate = true}
  else if(currentImg.hasClass('text3')) {cameraRotate = true;translate = false}
  else if(currentImg.hasClass('text5')) {rotateback = true}
  else if(currentImg.hasClass('text6')) {lookDown = true;$('.dots-container').addClass('visible')}
  else if (currentImg.hasClass('text12')) {$('.dots-container').removeClass('visible')}
  if(nextImg.length) {
    currentImg.removeClass('active').css('z-index', -10);
    nextImg.addClass('active').css('z-index', 10);
  }
}

function prev() {
  var currentImg = $('.text.active');
  var prevImg = currentImg.prev();
  if(currentImg.hasClass('text2')) {rotateback = true;translate = false;}
  else if(currentImg.hasClass('text4')) {cameraRotateback = true;translate = true}
  else if(currentImg.hasClass('text6')) {rotate = true}
  else if(currentImg.hasClass('text7')) {lookUp = true;$('.dots-container').removeClass('visible')}
  else if (currentImg.hasClass('text13')) {$('.dots-container').addClass('visible')}
  if(prevImg.length){
    currentImg.removeClass('active').css('z-index', -10);
    prevImg.addClass('active').css('z-index', 10);
  }
}

$(document).ready(function(){
  var position = 0;
  var recentScroll = false;
  $('.next').on('click', function(){
    next();
  });
  $('.prev').on('click', function(){
    prev();
  });
  $(window).on("mousewheel", function(e) {
    var scroll = $(window).scrollTop();
    if(!recentScroll && e.deltaY < 0) {
      next();
      recentScroll = true;
      window.setTimeout(() => { recentScroll = false; }, 1500)
    }
    else if(!recentScroll && e.deltaY > 0) {
      prev();
      recentScroll = true;
      window.setTimeout(() => { recentScroll = false; }, 1500)
    }
    position = scroll;
  });
})
//text carousel


//POINTS
var SEPARATION = 100, AMOUNTX = 80, AMOUNTY = 80;
var container;
var camera, scene, renderer;
var particles, count = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 4000 );
  camera.position.z = 2500;
  camera.position.y = 250;

  scene = new THREE.Scene();
  scene.rotation.y = Math.PI/4;

  var numParticles = AMOUNTX * AMOUNTY;
  var positions = new Float32Array( numParticles * 3 );
  var scales = new Float32Array( numParticles );

  var i = 0, j = 0;
  for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
    for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
      positions[ i ] = ix * SEPARATION - ( ( AMOUNTX * SEPARATION ) / 2 );
      positions[ i + 1 ] = 0;
      positions[ i + 2 ] = iy * SEPARATION - ( ( AMOUNTY * SEPARATION ) / 2 );
      scales[ j ] = 1;
      i += 3;
      j ++;
    }
  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'scale', new THREE.BufferAttribute( scales, 1 ) );

  var material = new THREE.ShaderMaterial( {
    uniforms: {
      color: { value: new THREE.Color( 0xcaf0f8 ) },
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent
  });

  particles = new THREE.Points( geometry, material );
  scene.add( particles );

  renderer = new THREE.WebGLRenderer( { alpha: true } );
  renderer.setClearColor( 0x000000, 0 );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  if(rotate) {
    scene.rotation.y = scene.rotation.y - (Math.PI/180)*1.5;
    if(scene.rotation.y <= 0) {rotate = false;}
  }
  if(translate) {
    scene.position.z = scene.position.z + 10;
    if(scene.position.z >= 2500) {scene.position.z = 0;}
  }
  if(rotateback) {
    scene.rotation.y = scene.rotation.y + (Math.PI/180)*1.5;
    if(scene.rotation.y >= Math.PI/4) {rotateback = false;}
  }
  if(cameraRotate) {
    camera.rotation.z = camera.rotation.z - (Math.PI/180)*4;
    if(camera.rotation.z <= -Math.PI) {cameraRotate = false;}
  }
  if(cameraRotateback) {
    camera.rotation.z = camera.rotation.z + (Math.PI/180)*4;
    if(camera.rotation.z >= 0) {cameraRotateback = false;}
  }
  if(lookDown) {
    camera.rotation.x = camera.rotation.x + (Math.PI/180)*2;
    if(camera.rotation.x >= Math.PI/2) {lookDown = false}
  }
  if(lookUp) {
    camera.rotation.x = camera.rotation.x - (Math.PI/180)*2;
    if(camera.rotation.x <= 0) {lookUp = false}
  }

  var positions = particles.geometry.attributes.position.array;
  var scales = particles.geometry.attributes.scale.array;

  var i = 0, j = 0;

  for ( var ix = 0; ix < AMOUNTX; ix ++ ) {
    for ( var iy = 0; iy < AMOUNTY; iy ++ ) {
        positions[ i + 1 ] = ( Math.sin( ( ix + count ) * 0.3 ) * 50 ) + ( Math.sin( ( iy + count ) * 0.5 ) * 50 );
        scales[ j ] = ( Math.sin( ( ix + count ) * 0.3 ) + 1 ) * 8 + ( Math.sin( ( iy + count ) * 0.5 ) + 1 ) * 8;
        i += 3;
        j ++;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;

  renderer.render( scene, camera );

  count += 0.1;
}
//points