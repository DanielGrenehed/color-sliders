import {createSlider} from './slider.js';
import {createChild, createLabel, createTabbedContainer} from './element_util.js';
import {HSVToRGB, RGBToHSV, colorToString, stringToColor} from './color_util.js';

function constructColorPicker(p, callback) {
	let preview;
	p.hsv = [0, 1, 0];
	p.rgb = HSVToRGB(p.hsv);

	let hsv_container = document.createElement("div");
	hsv_container.classList.add("grid-column");
	let rgb_container = document.createElement("div");
	rgb_container.classList.add("grid-column");

	
	p.updateValues = () => {};
	let sliders = {};

	sliders.hue = createSlider(hsv_container, "Hue", 360, (v) => {
		p.hsv[0] = v;
		p.rgb = HSVToRGB(p.hsv);
		let c = p.color;
		p.updateValues();
		if (c != p.color) {
			callback(p.color);
		}
	});
	sliders.hue.classList.add("hue");

	sliders.sat = createSlider(hsv_container, "Saturation", 100, (v) => {
		p.hsv[1] = v;
		p.rgb = HSVToRGB(p.hsv);
		let c = p.color;
		p.updateValues();
		if (c != p.color) {
			callback(p.color);
		}
	});
	sliders.bri = createSlider(hsv_container, "Brightness", 100, (v) => {
		p.hsv[2] = v;
		p.rgb = HSVToRGB(p.hsv);
		let c = p.color;
		p.updateValues();
		if (c != p.color) {
			callback(p.color);
		}
	});
	sliders.red = createSlider(rgb_container, "Red", 255, (v) => {
		p.rgb[0] = v*255;
		p.hsv = RGBToHSV(p.rgb);
		let c = p.color;
		p.updateValues();
		if (c != p.color) {
			callback(p.color);
		}
	});
	sliders.green = createSlider(rgb_container, "Green", 255, (v) => {
		p.rgb[1] = v*255;
		p.hsv = RGBToHSV(p.rgb);
		let c = p.color;
		p.updateValues();
		if (c != p.color) {
			callback(p.color);
		}
	});
	sliders.blue = createSlider(rgb_container, "Blue", 255, (v) => {
		p.rgb[2] = v*255;
		p.hsv = RGBToHSV(p.rgb);
		let c = p.color;
		p.updateValues();
		if (c != p.color) {
			callback(p.color);
		}
	});
	
	let tab = createTabbedContainer(["HSV", "RGB"], (tab) => {p.updateValues();});
	tab.tabs.HSV.appendChild(hsv_container);
	tab.tabs.RGB.appendChild(rgb_container);
	p.appendChild(tab);

	p.updateValues = () => {
		p.color = colorToString(p.rgb);
		preview.style.background = p.color;
		p.style.outlineColor = p.color;
		
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
	
	p.setColor = (clr) => {
		let rgb = stringToColor(clr);
		if (rgb == null) {
			console.log("clr not hex string");
			return;
		}
		p.rgb = rgb;
		p.hsv = RGBToHSV(p.rgb);
		p.updateValues();
	}
	
	let preview_container = document.createElement("div");
	preview_container.classList.add("grid-row");
	preview = createChild(preview_container, "color-preview");
	p.appendChild(preview_container);

	p.updateValues();
	return p;
}

export {constructColorPicker}; 
