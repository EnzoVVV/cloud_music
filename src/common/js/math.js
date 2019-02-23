// 角度转弧度
function getRadian(degree) {
    return degree * Math.PI / 180
}
// 弧度转角度
function getDegree(radian) {
    return radian * 180 / Math.PI
}

export function sin(degree) {
    const radian = getRadian(degree)
    return Math.sin(radian)
}
export function cos(degree) {
    const radian = getRadian(degree)
    return Math.cos(radian)
}

export function arcsin(val) {
    const radian = Math.asin(val)
    return getDegree(radian)
}
export function arccos(val) {
    const radian = Math.acos(val)
    return getDegree(radian)
}
export function arctan(val) {
    const radian = Math.atan(val)
    return getDegree(radian)
}

// 勾股定理
export function Pythagorean(x, y) {
    return Math.sqrt(pow(x, 2) + pow(y, 2))
}

// 平方
export function pow(x) {
    return Math.pow(x, 2)
}

// 已知三角形三边abc，求ab边夹角的角度
export function getDegreeInTriangle(a, b, c) {
    return arccos((pow(a) + pow(b) - pow(c)) / (2 * a * b))
}