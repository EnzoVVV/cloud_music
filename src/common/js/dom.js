export function hasClass(element,className) {
    return element.classList.contains(className)
}

export function addClass(element,className) {
    // element.classList 是一个只读属性，但是可以用add()和remove()方法修改它
    // add方法添加指定的类值，如果这些类已经存在于元素的属性中，那么它们将被忽略
    element.classList.add(className)
}

// 有些style不同浏览器有不同名称，比如tranform
// 写在style标签中的样式，vue-loader会自动兼容，但是js中的需要手动兼容

let elementStyle = document.createElement('div').style

let vendor = (() => {
	let transformNames = {
		webkit: 'webkitTransform',
		Moz: 'MozTransform',
		O: 'OTransform',
		ms: 'msTransform',
		standard: 'transform'
	}

	for (let key in transformNames) {
		if (elementStyle[transformNames[key]] !== undefined) {
			return key
		}
	}

  	return false
})()

export function prefixStyle(style) {
	if (vendor === false) {
		return false
	}

	if (vendor === 'standard') {
		return style
	}

	return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export const transform = prefixStyle('transform')
// IE9以及更早版本不支持transition属性
export const transitionDuration = prefixStyle('transitionDuration')
export const opacity = prefixStyle('opacity')
export const clipPath = prefixStyle('clipPath')

export function translate(el, x = 0, y = 0, options) {
    if (!el) return
    // transitionDuration必须带单位，如果为0s为是默认值，如果为0则是无效值
    const defaultOptions = {
        useTransfrom: true,
        // transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
		transitionDuration: '0s',
		percent: false
    }
    if(options) {
      	Object.assign(defaultOptions,options)
    }
    if (defaultOptions.useTransfrom) {
		const unit = defaultOptions.percent ? '%' : 'px'
        el.style[transform] = `translate3d(${x}${unit},${y}${unit},0)`
        // el.style.transitionProperty = 'transform'
        // el.style.transitionTimingFunction = defaultOptions.transitionTimingFunction
        el.style[transitionDuration] = defaultOptions.transitionDuration
    } else {
        el.style.left = x
        el.style.top = y
    }
}

// 获取元素的transform值
export function getTransformValue(el) {
	if(!el) return null
	let transformMatrix = getComputedStyle(el).transform
	if(transformMatrix == 'none') {
		return {
			x: 0,
			y: 0
		}
	}
	let split = transformMatrix.split(',')
	return {
		x: parseInt(split[split.length - 2]),
		y: parseInt(split[split.length - 1])
	}
}

// 旋转元素
export function rotate(el, angle, duration = 200) {
	el.style[transitionDuration] = duration + 'ms'
	el.style[transform] = `rotate(${angle}deg)`
}

// 改变透明度
export function changeOpacity(el, value, duration = 200) {
	el.style[transitionDuration] = duration + 'ms'
	el.style[opacity] = value
	// 把transitionDuration归0
	setTimeout(() => {
		el.style[transitionDuration] = 0
	}, duration)
}

// 元素的弹性效果
export function bubble(el) {
	// 放大阶段时间
	const duration1 = 200
	// 缩小阶段时间
	const duration2 = 200
	// 回弹到原状阶段时间
	const duration3 = 200
	// 放大阶段
	el.style[transitionDuration] = duration1 + 'ms'
	el.style[transform] = 'scale(1.5)'
	// 缩小阶段
	setTimeout(() => {
		el.style[transitionDuration] = duration2 + 'ms'
		el.style[transform] = 'scale(0.8)'
	}, duration1)
	// 回弹到原状阶段
	setTimeout(() => {
		el.style[transitionDuration] = duration3 + 'ms'
		el.style[transform] = 'scale(1)'
	}, duration1 + duration2)
	// 还原transitionDuration
	setTimeout(() => {
		el.style[transitionDuration] = 0
		el.style[transform] = 'scale(0.8)'
	}, duration1 + duration2 + duration3)
}

// 获取去掉px后的数字
export function getPxValue(s) {
	// parseInt('0.3px') 结果是0，不精确
	return Number(s.split('px')[0])
}