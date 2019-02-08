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

export function findComponentUpward(component,targetName) {
    if(!component) {
        return null
    }
    const parent = component.$parent
    if(parent) {
        const name = parent.$options.name
        if(name && name.toLowerCase() == targetName.toLowerCase()) {
            return parent
        } else {
            let deepFind = findComponentUpward(parent,targetName)
            if(deepFind) {
                return deepFind
            }
        }
    }
    return null
}

export function findComponentDownward(component,targetName) {
    if(!component) {
        return null
    }
    if(component.$children && component.$children.length) {
        for(let i=0;i<component.$children.length;i++) {
            const child = component.$children[i]
            const name = child.$options.name
            if(name && name.toLowerCase() == targetName.toLowerCase()) {
                return child
            } else {
                let deepFind = findComponentDownward(child,targetName)
                if(deepFind) {
                    return deepFind
                }
            }
        }
    }
    return null
}

// 限流
export function debounce(func, delay) {
    let timer = null
    return function(...args) {
        if(timer) {
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

// 数组去重
export function uniqueArr(arr) {
    if(!arr) return arr
    let newArr = []
    // 遍历原数组
    for(let i of arr) {
        if(newArr.length == 0) {
            newArr.push(i)
        } else {
            let flag = false
            // 遍历新数组， 如果新数组中没有这一项, 则push进去
            for(let j of newArr) {
                if(compare(i, j)) {
                    flag = true
                    break
                }
            }
            if(!flag) {
                newArr.push(i)
            }
        }
    }
    return deepCopy(newArr)
}

// 对比， 支持所有类型
export function compare(item1, item2) {
    if(typeof item1 != 'object' || typeof item2 != 'object') {
        return item1 === item2
    } else if(typeOf(item1) === 'object' && typeOf(item2) === 'object') {
        return compareObject(item1, item2)
    } else if(typeOf(item1) === 'array' && typeOf(item2) === 'array') {
        return compareArray(item1, item2)
    }
    return false
}

// 对象对比
export function compareObject(o1, o2) {
    if(typeOf(o1) != 'object' || typeOf(o2) != 'object') return false
    // 将key的数组排序
    const keys1 = Object.keys(o1).sort()
    const keys2 = Object.keys(o2).sort()
    if(keys1.length != keys2.length) return false
    const len = keys1.length
    let index = 0
    while(index < len) {
        // 排序后，对应index的key若不相同，则肯定是不同对象
        if(keys1[index] !== keys2[index]) return false
        const value1 = o1[keys1[index]]
        const value2 = o2[keys2[index]]
        if(typeof value1 != 'object' || typeof value2 != 'object') {
            if(value1 != value2) return false
        } else if(typeOf(value1) === 'object' && typeOf(value2) === 'object') {
            if(!compareObject(value1, value2)) return false
        } else if(typeOf(value1) === 'array' && typeOf(value2) === 'array') {
            if(!compareArray(value1, value2)) return false
        }
        index++
    }
    return true
}

// 数组对比
export function compareArray(a1, a2) {
    if(typeOf(a1) != 'array' || typeOf(a2) != 'array') return false
    if(a1.length != a2.length) return false
    a1.sort()
    a2.sort()
    const len = a1.length
    let index = 0
    while(index < len) {
        const item1 = a1[index]
        const item2 = a2[index]
        if(typeof item1 != 'object' && typeof item2 != 'object') {
            if(item1 != item2) return false
        } else if(typeOf(item1) === 'object' && typeOf(item2) === 'object') {
            if(!compareObject(item1, item2)) return false
        } else if(typeOf(item1) === 'array' && typeOf(item2) === 'array') {
            if(!compareArray(item1, item2)) return false
        }
        index++
    }
    return true
}

// 深复制
export function deepCopy(data) {
    const type = typeOf(data)
    let result
    if(type == 'array') {
        result = []
        for(let i of data) {
            result.push(deepCopy(i))
        }
    } else if(type == 'object') {
        result = {}
        for(let i in data) {
            result[i] = deepCopy(data[i])
        }
    } else {
        return data
    }
    return result
}

export function formatTimestamp(timestamp) {
    const time = new Date(timestamp)
    return [time.getFullYear(), time.getMonth(), time.getDate()].join('.')
}

import storage from 'good-storage'
export function mock(key) {
    let result = storage.get(key, [])
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(result)
        },1)
    })
}

export function formatNumber(num) {
    let s = parseInt(num).toString()
    if(s.length <= 5) {
        return s
    } else if(s.length <= 8) {
        return s.slice(0, s.length - 4) + '万'
    } else {
        return s.slice(0, s.length - 8) + '亿'
    }
}