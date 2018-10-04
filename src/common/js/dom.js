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

export function translate(el, x = 0, y = 0, options) {
    if (!el) return
    const defaultOptions = {
        useTransfrom: true,
        // transitionTimingFunction: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        transitionDuration: '0s'
    }
    for (let option in options) {
        defaultOptions[option] = options[option]
    }
    if (defaultOptions.useTransfrom) {
        el.style[transform] = `translate3d(${x}px,${y}px,0)`
        // el.style.transitionProperty = 'transform'
        // el.style.transitionTimingFunction = defaultOptions.transitionTimingFunction
        el.style[transitionDuration] = defaultOptions.transitionDuration
    } else {
        el.style.left = x
        el.style.top = y
    }
}