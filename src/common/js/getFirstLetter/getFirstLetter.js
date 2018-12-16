
import { pinyin_letter_map } from './map'
export default function getFirstLetter(str) {
	if(!str || /^ +$/g.test(str)) return '';
	let unicode = str.charCodeAt(0);
	if(unicode >= 19968 && unicode <= 40869)
	{
		return pinyin_letter_map.charAt(unicode-19968);
	}
	return str.charAt(0)
}