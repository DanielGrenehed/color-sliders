import {addClasses, createChild, createLabel} from './element_util.js';
import {HSVToRGB, RGBToHSV, colorToString} from './color_util.js';
import {remap, squish} from './math.js';
import {mapSlider} from './slider.js';
import {constructColorPicker} from './color_picker.js';


let clr_pickers = document.getElementsByClassName("color-picker");

for (let i = 0; i < clr_pickers.length; i++) {
	constructColorPicker(clr_pickers[i], (v) => {console.log(v);});
}


