import json

data = [{
	"name": "Sol",
	"texture": "./images/sunmap.jpg",
	"a": 0,
	"r": 696342,
	"m": 1.98855e30,
	"ord": 0
}]

table2bRows = {
	"Jupiter": 0,
	"Saturn": 1,
	"Uranus": 2,
	"Neptune": 3,
	"Pluto": 4
}

planets = {
	"Mercury": {
		"texture": "./images/mercurymap.jpg",
		"r": 2439.7,
		"m": 0.330104e24,
		"ord": 1
	},
	"Venus": {
		"texture": "./images/venusmap.jpg",
		"r": 6051.8,
		"m": 4.86732e24,
		"ord": 2
	},
	"Earth": {
		"texture": "./images/earthmap1k.jpg",
		"r": 6371,
		"m": 5.97219e24,
		"ord": 3
	},
	"Mars": {
		"texture": "./images/marsmap1k.jpg",
		"r": 3389.5,
		"m": 0.641693e24,
		"ord": 4
	},
	"Jupiter": {
		"texture": "./images/jupitermap.jpg",
		"r": 69911,
		"m": 1898.13e24,
		"ord": 5
	},
	"Saturn": {
		"texture": "./images/saturnmap.jpg",
		"r": 58232,
		"m": 568.319e24,
		"ord": 6
	},
	"Uranus": {
		"texture": "./images/uranusmap.jpg",
		"r": 25362,
		"m": 86.8103e24,
		"ord": 7
	},
	"Neptune": {
		"texture": "./images/neptunemap.jpg",
		"r": 24622,
		"m": 102.41e24,
		"ord": 8
	},
	"Pluto": {
		"texture": "./images/plutomap1k.jpg",
		"r": 1151,
		"m": 0.01309e24,
		"ord": 9
	}
}

with open("p_elem_t1.txt") as f:
	table2a = f.readlines()

#with open("t2b.txt") as f:
#	table2b = f.readlines()

for i in xrange(0, 18,2):
	name = table2a[i][0:9].strip()
	p = {
		"name": name,
		"a": float(table2a[i][9:20].strip()),
		"da": float(table2a[i+1][9:20].strip()),
		"e": float(table2a[i][20:36].strip()),
		"de": float(table2a[i+1][20:36].strip()),
		"I": float(table2a[i][36:52].strip()),
		"dI": float(table2a[i+1][36:52].strip()),
		"L": float(table2a[i][52:70].strip()),
		"dL": float(table2a[i+1][52:70].strip()),
		"w": float(table2a[i][70:86].strip()),
		"dw": float(table2a[i+1][70:86].strip()),
		"W": float(table2a[i][86:102].strip()),
		"dW": float(table2a[i+1][86:102].strip()),

		"texture": planets[name]["texture"],
		"r": planets[name]["r"],
		"m": planets[name]["m"],
		"ord": planets[name]["ord"]
	}

#	if name in table2bRows.keys():
#		r = table2bRows[name]
#		p["b"] = float(table2b[r][9:20].strip())
#		if r < 4:
#			p["c"] = float(table2b[r][21:34].strip())
#			p["s"] = float(table2b[r][35:48].strip())
#			p["f"] = float(table2b[r][49:62].strip())

	data.append(p)

print """
var AU = 149597870.700; //km
// http://ssd.jpl.nasa.gov/txt/aprx_pos_planets.pdf
// http://ssd.jpl.nasa.gov/txt/p_elem_t2.txt
// a=semi-major-axis
// e=eccentricity
// I=inclination
// W=longitude ascending node
// w=longitude perihelion
// L=mean longitude
// r=radius (km)
// m=mass (E24 kg)
// ord = order
"""

print "var planets = " + json.dumps(data, indent=4, separators=(',', ': ')) + ";"