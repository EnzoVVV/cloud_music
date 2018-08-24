export function hasClass(element,className) {
    return element.classList.contains(className)
}

export function addClass(element,className) {
    // element.classList 是一个只读属性，但是可以用add()和remove()方法修改它
    // add方法添加指定的类值，如果这些类已经存在于元素的属性中，那么它们将被忽略
    element.classList.add(className)
}