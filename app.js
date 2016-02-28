
var scene;
var camera;
var renderer;

//var currentDate = moment('2000-01-01T12:00:00.000Z');
var currentDate = moment();

function createBody(body) {
	
	var calc = new OrbitCalculator();
	var coords = calc.calculate(body, currentDate);

	//var geometry	= new THREE.SphereGeometry(body.r, 32, 32);
	if(body.ord == 0) {
		var scale = 10;
	}
	else {
		var scale = 500;
	}
	var geometry	= new THREE.SphereGeometry(body.r * scale, 32, 32);
	var texture	= THREE.ImageUtils.loadTexture(body.texture);
	var material	= new THREE.MeshPhongMaterial({
		map	: texture,
		bumpMap	: texture,
		bumpScale: 0.05,
		opacity: 1
	});

	var mesh = new THREE.Mesh(geometry, material);
	// mesh.receiveShadow	= true;
	// mesh.castShadow	= true;

	var container	= new THREE.Object3D();
	container.position.x = coords.x / 1000;
	container.position.y = coords.y / 1000;
	container.position.z = coords.z / 1000;
	container.name = body.name;
	container.add(mesh);

	if(body.ord > 0) {
		var geometry2 = new THREE.RingGeometry( body.r * scale * 2, body.r * scale * 2.1, 32 );
		var material2 = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );
		var mesh2 = new THREE.Mesh( geometry2, material2 );	
		container.add(mesh2);
	}

	if(body.name == "Earth") {
		camera.position.x = coords.x / 1000;
		camera.position.y = coords.y / 1000;
		camera.position.z = coords.z / 1000 + body.r * 2;
		camera.lookAt(centre);
	}
	return container;

}

var centre = new THREE.Vector3(0, 0, 0);
var step = 0.0;
function render() {

	//camera.rotation.y += Math.PI / 360;

	var calc = new OrbitCalculator();
	for(var i in planets) {
		var coords = calc.calculate(planets[i], currentDate);
		var obj = scene.getObjectByName(planets[i].name);
		if(obj) {
			obj.position.x = coords.x / 1000;
			obj.position.y = coords.y / 1000;
			obj.position.z = coords.z / 1000;
		}

		if(i == 3) {
			camera.position.x = obj.position.x;
			camera.position.y = obj.position.y;
			camera.position.z = obj.position.z + planets[i].r * 2;
			camera.lookAt(centre);			
		}

		//camera.rotation.x = Math.sin(step) * 2 * Math.PI;
		//camera.lookAt(centre);			
		//step += 0.001;
	}

	requestAnimationFrame( render );
	renderer.render( scene, camera );

	currentDate.add(12, "hours");
}


function app() {

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.01, 10 * AU );

	renderer = new THREE.WebGLRenderer({
		antialias	: true
	});
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.enableZoom = false;

	var l1	= new THREE.AmbientLight(0xffffff);
	scene.add( l1 );

	// var light = new THREE.PointLight( 0xff0000, 100, 100 );
	// light.position.set( 0, 0, 0 );
	// scene.add( light );

	// var light	= new THREE.DirectionalLight( 0xffffff, 1 );
	// light.position.set(5,5,5);
	// scene.add( light );
	// light.castShadow	= true;
	// light.shadowCameraNear	= 0.01;
	// light.shadowCameraFar	= 15;
	// light.shadowCameraFov	= 45;
	// light.shadowCameraLeft	= -1;
	// light.shadowCameraRight	=  1;
	// light.shadowCameraTop	=  1;
	// light.shadowCameraBottom= -1;
	// // light.shadowCameraVisible	= true
	// light.shadowBias	= 0.001;
	// light.shadowDarkness	= 0.2;
	// light.shadowMapWidth	= 1024;
	// light.shadowMapHeight	= 1024;


	for(p in planets) {
		body = createBody(planets[p]);
		scene.add(body);
	}

	camera.position.z = 0;
	camera.position.y = 0;
	camera.position.x = 1.2 * AU;
	
	camera.lookAt(centre);
	//camera.rotation.x = Math.PI;
	render();
}