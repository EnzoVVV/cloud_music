export function isCharacter(value) {
    if(typeOf(value) != 'string' || value.length > 1) {
        return false
    }
    const Regx = /^[A-Za-z]*$/
    return Regx.test(value)
}

export function typeOf(obj) {
    const toString = Object.prototype.toString
    const map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
    }
    return map[toString.call(obj)]
}


// 得到一个[min,max]之间的整数随机数
function generateRangeRandom(min,max) {
    // Math.random生成一个[0,1)随机数
    // Math.random()*（max-min-1)+min的区间是[min,max+1)
    // floor取整后区间是[min,max]
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function generateRandomList(list) {
    let randomList = list.slice()
    for(let i=0;i < randomList.length; i++) {
        let temp = randomList[i]
        let replacement = generateRangeRandom(0,i)
        randomList[i] = randomList[replacement]
        randomList[replacement] = temp
    }
    return randomList
}