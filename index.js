console.log("hello world");

let output = document.getElementById("logout");
function log(str) {
	console.log(str);
	output.innerHTML = str;
}
let color_preview_items = document.getElementsByClassName("color-preview");

function toHex(v) {
	let l = Math.floor(v).toString(16)
	for (let i = l.length; i < 2; i++) {
		l= '0'+l
	}
	return l;
}

function createChild(p, classes) {
	let child = document.createElement("div");
	if (typeof(classes) == "string") {
		child.classList.add(classes);
	} else {
		for (let i = 0; i < classes.length; i++) {
			child.classList.add(classes[i]);
		}
	}
	p.appendChild(child);
	return child;
}

function createLabel(p, text, classes=[]) {
 	let container = document.createElement("div");
	container.classList.add("labeled");
	for (let i = 0; i < classes.length; i++) {
		container.classList.add(classes[i]);
	}
	let label = document.createElement("p");
	label.classList.add("label");
	label.innerHTML = text;
	container.appendChild(label);
	p.appendChild(container);
	return container;
}


function colorToString(rgb) {
	return "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]);
}

function lerp(a, b, t) {return (1.0-t)*a+b*t;}
function invlerp(a, b, v) {return (v-a)/(b-a);}
function remap(im, ix, om, ox, v) {return lerp(om, ox, invlerp(im, ix, v));}

function HSVToRGB(hsv) { // Hue, Saturation, Brightness/Value
	let h=hsv[0], s=hsv[1], v=hsv[2];
	let r, g, b;
	let i = Math.floor(h*6);
	let f = h * 6 - i;
	let p = v * (1 - s);
	let q = v * (1 - f * s);
	let t = v * (1 - (1 - f) * s);
	
	switch (i%6) {
		case 0: r=v,g=t,b=p; break;
		case 1: r=q,g=v,b=p; break;
		case 2: r=p,g=v,b=t; break;
		case 3: r=p,g=q,b=v; break;
		case 4: r=t,g=p,b=v; break;
		case 5: r=v,g=p,b=q; break;
	}
	return [r*255,g*255,b*255];
}

function RGBToHSV(rgb) {
	let r=rgb[0]/255,g=rgb[1]/255,b=rgb[2]/255;
	let max = Math.max(r,g,b), min = Math.min(r,g,b);
	let h,s,v=max;
	let d = max - min;
	s = max == 0 ? 0 : d / max;
	if (max == min) {
		h = 0;
	} else {
		switch(max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}
		h /= 6;
	}
	return [h,s,v];
}

function handleSlider(evt, valueCallback) {
	evt.preventDefault();
	let pos =0;
	let target;
	if (evt instanceof MouseEvent) { 
		if (evt.buttons == undefined || evt.buttons != 1) {
			return;
		}
		target = evt.originalTarget;
		if (evt.originalTarget == undefined) {
			target = evt.srcElement;
		}
		pos = evt.layerX;
	}
	else if (evt instanceof TouchEvent) {
		if (evt.targetTouches.length > 0) {
			target = evt.targetTouches[0].target;
			pos = evt.targetTouches[0].pageX - target.getBoundingClientRect().left;
		}
	}
	else {
		log("not mouse nor touch event!");
	}
	if (target == undefined) {
		return;
	}
	let pic = target.getElementsByClassName("slider-picker")[0];
	let p_width = pic.offsetWidth;

	let width = target.clientWidth - p_width;
	pos = Math.min(width, pos);
	pos = Math.max(0, pos);
	if (pic != undefined) {
		pic.style.left = pos + "px";
	}
	let val = remap(0, width, 0, 1, pos);
	valueCallback(val);
}


function mapSlider(slider, callback) {
	let picker = slider.getElementsByClassName("slider-picker");
	if (picker.length < 1) {
		picker = createChild(slider, "slider-picker");
	} else {
		picker = picker[0];
		console.log("hello", picker);
	}
	slider.setValue = (v) => {
		let width = slider.clientWidth - picker.offsetWidth;
		if (v < 0) {
			v = 0;
		} else if (v > 1) {
			v = 1;
		}
		let pos = remap(0,1,0,width,v); 
		picker.style.left = pos + "px";
	}
	slider.addEventListener("touchstart", (evt) => {handleSlider(evt, callback);});
	slider.addEventListener("touchend", (evt) => {handleSlider(evt, callback);});
	slider.addEventListener("touchcancel", (evt) => {handleSlider(evt, callback);});
	slider.addEventListener("touchmove", (evt) => {handleSlider(evt, callback);});
	slider.addEventListener("mousedown", (evt) => {handleSlider(evt, callback);});
	slider.addEventListener("mousemove", (evt) => {handleSlider(evt, callback);});
	slider.addEventListener("click", (evt) => {handleSlider(evt, callback);});
	return slider;
}

function constructColorPicker(p) {
	let preview;
	p.hsv = [0, 1, 0];
	p.rgb = HSVToRGB(p.hsv);

	p.updateValues = () => {}
	let sliders = {};
	sliders.hue = mapSlider(createChild(createLabel(p, "Hue", ["a"]), ["hue","slider"]), (v) => {
		p.hsv[0] = v;
		p.rgb = HSVToRGB(p.hsv);
		p.updateValues();
	});
	sliders.sat = mapSlider(createChild(createLabel(p, "Saturation", ["c"]), ["sat","slider"]), (v) => {
		p.hsv[1] = v;
		p.rgb = HSVToRGB(p.hsv);
		p.updateValues();
	});
	sliders.bri = mapSlider(createChild(createLabel(p, "Brightness", ["e"]), ["bri","slider"]), (v) => {
		p.hsv[2] = v;
		p.rgb = HSVToRGB(p.hsv);
		p.updateValues();
	});
	sliders.red = mapSlider(createChild(createLabel(p, "Red", ["b"]), ["red","slider"]), (v) => {
		p.rgb[0] = v*255;
		p.hsv = RGBToHSV(p.rgb);
		p.updateValues();
	});
	sliders.green = mapSlider(createChild(createLabel(p, "Green", ["d"]), ["green","slider"]), (v) => {
		p.rgb[1] = v*255;
		p.hsv = RGBToHSV(p.rgb);
		p.updateValues();
	});
	sliders.blue = mapSlider(createChild(createLabel(p, "Blue", ["f"]), ["blue","slider"]), (v) => {
		p.rgb[2] = v*255;
		p.hsv = RGBToHSV(p.rgb);
		p.updateValues();
	});
	
	console.log(sliders);
	p.updateValues = () => {
		preview.style.background = colorToString(p.rgb);
		sliders.hue.setValue(p.hsv[0]);

		sliders.sat.setValue(p.hsv[1]);
		let s1 = colorToString(HSVToRGB([p.hsv[0], 0, p.hsv[2]]));
		let s2 = colorToString(HSVToRGB([p.hsv[0], 1, p.hsv[2]]));
		sliders.sat.style.background = "linear-gradient(to right,"+s1+","+s2+")";

		sliders.bri.setValue(p.hsv[2]);
		let v1 = colorToString(HSVToRGB([p.hsv[0], p.hsv[1], 0]));
		let v2 = colorToString(HSVToRGB([p.hsv[0],p.hsv[1],1]));
		sliders.bri.style.background = "linear-gradient(to right,"+v1+","+v2+")";
		
		sliders.red.setValue(p.rgb[0]/255);
		let r1 = colorToString([0,p.rgb[1],p.rgb[2]]);
		let r2 = colorToString([255,p.rgb[1],p.rgb[2]]);
		sliders.red.style.background = "linear-gradient(to right,"+r1+","+r2+")";

		sliders.green.setValue(p.rgb[1]/255);		
		let g1 = colorToString([p.rgb[0],0,p.rgb[2]]);
		let g2 = colorToString([p.rgb[0],255,p.rgb[2]]);
		sliders.green.style.background = "linear-gradient(to right,"+g1+","+g2+")";

		sliders.blue.setValue(p.rgb[2]/255);
		let b1 = colorToString([p.rgb[0],p.rgb[1],0]);
		let b2 = colorToString([p.rgb[0],p.rgb[1],255]);
		sliders.blue.style.background = "linear-gradient(to right,"+b1+","+b2+")";
	}

	preview = createChild(p, "color-preview");
	p.updateValues();
}

let clr_pickers = document.getElementsByClassName("color-picker");

for (let i = 0; i < clr_pickers.length; i++) {
	constructColorPicker(clr_pickers[i]);
}
