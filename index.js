import {addClasses, createChild, createLabel} from './element_util.js';
import {HSVToRGB, RGBToHSV, colorToString} from './color_util.js';
import {remap, squish} from './math.js';
import {createSlider} from './slider.js';
import {createColorPicker} from './color_picker.js';

let body = document.getElementsByTagName("body")[0];

let clr_picker = createColorPicker( (v) => {

});


body.appendChild(clr_picker);

let vs = createSlider(body, "Frontljus", 255, (v) => {}, true);
/*
for (let i = 0; i < clr_pickers.length; i++) {
	constructColorPicker(clr_pickers[i], (v) => {console.log(v);});
}
*/
