3.3005383602218714
3.3006398136929715
3.3332083921338196
3.3330863453064055

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

function OrbitCalculator() {
	this.ephDate = moment('2000-01-01T11:58:55.816Z');
	this.secondsInCentury = 86400 * 365.25 * 100;
}

OrbitCalculator.prototype.calculate = function(forPlanet, onDate) {

	if(forPlanet.ord == 0) {
		return { x: 0, y: 0, z: 0 };
	}

	var p = {};

	p.days = (onDate.valueOf() - this.ephDate.valueOf()) / 86400000;
	p.T = p.days / 36525;

	p.a = (forPlanet.a * AU + forPlanet.da * AU * p.T) * 1000; //convert to metres
	p.e = forPlanet.e + forPlanet.de * p.T;
	p.I = Math.radians(forPlanet.I + forPlanet.dI * p.T);
	p.L = Math.radians(forPlanet.L + forPlanet.dL * p.T);
	p.w = Math.radians(forPlanet.w + forPlanet.dw * p.T);
	p.W = Math.radians(forPlanet.W + forPlanet.dW * p.T);

	// arg of perihelion
	p.w_ = p.w - p.W;

	// mean anomaly
	p.M = p.L - p.w;
	if(undefined !== forPlanet.b) {
		p.M += forPlanet.b * p.T * p.T;
	}

	if(undefined !== forPlanet.f) {
	 	p.M += forPlanet.c * Math.cos(Math.radians(forPlanet.f) * p.T) + forPlanet.s * Math.sin(Math.radians(forPlanet.f) * p.T);
	}

	// mod to 360deg
	//M = M % (2 * Math.PI);
	p.M = p.M % (2 * Math.PI);

	// eccentric anomaly
	p.E = this.solveEccentricAnomaly(p.e, 0, p.M);

	// coordinates in orbital plane
	p.xOrb = p.a * (Math.cos(p.E) - p.e);
	p.yOrb = p.a * Math.sqrt(1 - p.e * p.e) * Math.sin(p.E);
	p.zOrb = 0;

	p.pos = new THREE.Vector3(p.xOrb, p.yOrb, p.zOrb);

	var a1 = new THREE.Euler(0, 0, p.W, 'XYZ');
	var q1 = new THREE.Quaternion().setFromEuler(a1);
	var a2 = new THREE.Euler(p.I, 0, p.w_, 'XYZ');
	var q2 = new THREE.Quaternion().setFromEuler(a2);

	var planeQuat = new THREE.Quaternion().multiplyQuaternions(q1, q2);
	p.pos.applyQuaternion(planeQuat);

	return p.pos;

	// coordinates in ecliptic
	//xEcl = 
	console.log(forPlanet, p);
	return { x: p.xEcl, y: p.yEcl, z: p.zEcl };

};

OrbitCalculator.prototype.solveEccentricAnomaly = function(e0, E, M) {

	var E2 = E + (M - (E - e0 * Math.sin(E))) / (1 - e0 * Math.cos(E));

	if(Math.abs(E - E2) > 1e-6) {
		return this.solveEccentricAnomaly(e0, E2, M);
	}
	else {
		return E2;
	}
	
};

OrbitCalculator.prototype.solveKepler = function(e, M) {
	return function(x) {
		
	};
};