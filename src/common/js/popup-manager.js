let zIndex = 4500
let compNames = []
// 这些cover comp会覆盖住miniplayer
const coverComps = ['comment', 'songselect', 'collection']

const isCoverComp = function(comp) {
    return coverComps.indexOf(comp) > -1
}

const PopupManager = {
    nextZIndex: function() {
        return PopupManager.zIndex
    },
    addComp(comp) {
        compNames.push(comp)
        if(isCoverComp(comp)) {
            // 添加cover comp，不显示miniplayer
            PopupManager.coverMiniPlayer(true)
        } else {
            // 当前组件不是cover comp，可显示miniplayer
            PopupManager.coverMiniPlayer(false)
            // 加入了非cover comp时，将miniplayer的zIndex提高
            window.$bus.emit('liftMiniPlayer')
        }
    },
    popComp() {
        let popComp = compNames.pop()
        if(isCoverComp(popComp)) {
            // 移除cover comp，可显示miniplayer
            PopupManager.coverMiniPlayer(false)
        }
        let curComp = compNames[compNames.length - 1]
        if(isCoverComp(curComp)) {
            // 当前组件是cover comp，不显示miniplayer
            PopupManager.coverMiniPlayer(true)
        }
    },
    coverMiniPlayer: function(flag) {
        window.$bus.emit('coverMiniPlayer', flag)
    }
}


Object.defineProperty(PopupManager, 'zIndex', {
    configurable: true,
    get() {
        return ++zIndex
    },
    set(value) {
        zIndex = value
    }
})

export default PopupManager