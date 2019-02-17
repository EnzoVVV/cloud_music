<template>
    <div class='sortlist'>
        <scroll ref='scroll' class='scroll' :listen-scroll='listenScroll' :probe-type='probeType' @scroll='handleScroll' @scrollEnd='scrollEnd'>
            <ul ref='wrapper'>
                <!-- data-def-index, 初始index; id, 当前排序的index -->
                <li v-for='(item, index) in content' :key='item.id' :ref='item.id' :id='index' :data-def-index='index' :data-item-id='item.id' class='sort-list-line'>
                    <!-- TODO，item.singer不是通用的 -->
                    <liner :picUrl='item.picUrl' :main='item.name' :sub='item.singer' :sort='true' :showCheck='true' :itemId='item.id' @sortstart='touchstart' @sortmove='touchmove' @sortend='touchend' @check='check' ref='liner'></liner>
                </li>
            </ul>
        </scroll>
    </div>
</template>
<script>
    import { deepCopy } from 'common/js/tools'
    import liner from 'base/liner/liner'
    import { changeOpacity } from 'common/js/dom'
    import { scrollMixin } from 'common/js/mixins'
    const duration = 200
    export default {
        name: 'sortlist',
        mixins: [ scrollMixin ],
        components: {
            liner
        },
        props: {
            list: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                content: deepCopy(this.list),
                // 被勾选的项的id数组
                checkList: []
            }
        },
        computed: {
            title() {
                return `已选${this.checkList.length}项`
            },
            checkAll() {
                return this.checkList.length === this.content.length ? '取消全选' : '全选'
            }
        },
        methods: {
            touchstart(e, itemId) {
                this.touch.initiated = true
                // e.currentTarget时liner里的class='sort'的div，事件的监听者, e.target是IconSvg， 事件的发起者
                // e.currentTarget不可用，这里需要找到被拖动的li元素
                this.touch.curEl = this.$refs[itemId][0]
                // 元素的id才是当前排序顺序的index
                this.touch.startIndex = parseInt(this.touch.curEl.getAttribute('id'))
                // 当前元素设为透明
                this.touch.curEl.style.opacity = 0.5
                // 初始pageY
                this.touch.startY = e.touches[0].pageY
                // 初始scroll值
                this.touch.startScrollY = this.scrollY
                // 初始top值
                this.touch.startTop = parseInt(this.touch.curEl.style.top)
                // 自动滚动距离
                this.touch.autoScrollDistance = 0
                // 初次touchmove标志位
                this.touch.isFirstMove = true
            },
            touchmove(e) {
                if(!this.touch.initiated) {
                    return
                }

                // 检测手动相反方向移动，停止自动滚动
                if(this.scrolling) {
                    // 与自动滚动方向相反的移动4px以上时，停止自动滚动
                    if(this.auto.direction != undefined && this.auto.direction * (e.touches[0].pageY - this.start_pageY_atuo) < -4) {
                        this.stopAutoScroll()
                        this.stopScroll = true
                        // 3秒后再将stopScroll置为false，防止停止自动滚动时，元素还处在bottom区域，还会再次触发自动scroll
                        setTimeout(() => {
                            this.stopScroll = false
                        }, 3000)
                    }
                    // 自动滚动时，不处理手动touchmove触发的touchmove函数
                    return
                }

                // 这里的totalDiff是touchmove的距离
                let preTotalDiff = this.touch.totalDiff || 0
                // 自动滚动时touch.totalDiff是不变的，滚动结束时计算自动滚动距离autoScrollDistance，加入到touch.totalDiff中来将totalDiff更新到当前值
                let curTotalDiff = this.touch.totalDiff = e.touches[0].pageY - this.touch.startY + this.touch.autoScrollDistance
                // 检测是否开启自动滚动
                if(!this.scrolling && !this.stopScroll) {
                    // direction是整体过程的方向，这里计算即时方向
                    this.up = curTotalDiff < preTotalDiff
                    const approaching = this.approaching(this.touch.curEl)
                    let approaching_bottom = !this.up && approaching.bottom && (Math.abs(this.scrollY) < Math.abs(this.maxScrollY))
                    let approaching_top = this.up && approaching.top && this.scrollY != 0
                    if(approaching_bottom || approaching_top) {
                        this.touch.autoScrollDistance = 0
                        this.scrolling = true
                        // 自动滚动初始时的pageY
                        this.start_pageY_auto = e.touches[0].pageY
                        // 自动滚动目标元素
                        const targetElement = approaching_bottom ? this.lastElement : this.firstElement
                        // 滚动时间
                        const scrollTime = 30 * Math.abs(this.scrollY - this.maxScrollY)
                        // 令scrollY组件自动滚动
                        this.$refs.scroll.scrollToElement(targetElement, scrollTime)
                        // 初始化auto的数据
                        this.auto.startDiff = this.touch.totalDiff
                        this.auto.startScrollY = this.scrollY
                        this.auto.startIndex = this.touch.startIndex
                        this.auto.curEl = this.touch.curEl
                        this.auto.startTop = this.touch.startTop
                        this.auto.isFirstMove = true
                        // 执行自动滚动函数
                        this.timer = setInterval(() => {
                            this.autoMove()
                            // scroll组件滚动到底了
                            if(!this.scrolling) {
                                this.stopAutoScroll()
                            }
                        }, 5)
                        return
                    }
                }
                this.move('touch')
            },
            autoMove() {
                // 自动滚动时，时手动触发的toumove函数，实际上e.touches[0].pageY并没有改变, 所以这里需要加上scrollY的变化量，模拟改变totalDiff的值
                this.auto.totalDiff = this.auto.startDiff + this.auto.startScrollY - this.scrollY
                this.move('auto')
            },
            // 执行元素的挪动
            move(type) {
                const touch = this[type]
                
                // 移动了多少行, 向上取整
                const lineCount = Math.ceil(Math.abs(touch.totalDiff) / this.lineHeight)
                // 移动方向, 向下移动为1，向上移动为-1
                touch.direction = Math.sign(touch.totalDiff)

                // 被动移动元素的index
                touch.moveElIndex = touch.startIndex + touch.direction * lineCount
                // 获取被动移动元素
                this.calculateMoveEl(type)
                // 执行移动
                // 以初始top值startTop为基准, 加上移动距离totalDiff
                const curElTop = this.circumscribe(touch.startTop + touch.totalDiff)
                touch.curEl.style.top = curElTop + 'px'
                if(touch.moveEl !== null) {
                    // moveEl的startTop要进行round，不然不准
                    let roundMoveElStartTop = this.getRound(touch.moveElStartTop)
                    const curDirection = Math.sign(roundMoveElStartTop - curElTop)
                    if(curDirection * this.touch.direction === 1) {
                        touch.moveElDiff = -touch.direction * ((Math.abs(touch.totalDiff) - (lineCount - 1) * this.lineHeight))
                    } else {
                        touch.moveElDiff = -touch.direction * ((Math.abs(touch.totalDiff) - lineCount * this.lineHeight))
                    }
                    touch.moveEl.style.top = this.circumscribe(touch.moveElStartTop + touch.moveElDiff) + 'px'
                }
                touch.isFirstMove = false
            },
            touchend(e) {
                if(!this.touch.initiated) {
                    return
                }
                // 没进行移动, 是click
                if(this.touch.totalDiff === undefined) {
                    setTimeout(() => {
                        changeOpacity(this.touch.curEl, 1, duration)
                        this.touch = {}
                    }, duration)
                    return
                }
                // 自动滚动时松手, touchend
                if(this.scrolling === true) {
                    // 从auto中继承一些数据到touch
                    this.touch.moveElDiff = this.auto.moveElDiff
                    this.touch.moveEl = this.auto.moveEl
                    this.touch.moveElStartTop = this.auto.moveElStartTop
                    this.touch.totalDiff = this.auto.totalDiff
                    this.stopAutoScroll()
                }

                // totalDiff大于行高时，认为有行重新排列了，getSortedList函数中重新计算
                if(this.lineMoved === undefined && this.touch.totalDiff >= this.lineHeight) {
                    this.lineMoved = true
                }

                const lineCount = Math.ceil(Math.abs(this.touch.totalDiff) / this.lineHeight)
                // touch.direction是总体方向，当跨越很多行时，touch.direction并不能反映end时元素应该移动的方向，比如元素一直往下移动了很多行，结束时无论如何touch.direction都为1
                // 这里需要用moveElDiff来计算方向
                // curDirection = 1时，end时moveEl向上移动，curEl向下移动；curDirection = -1时，end时moveEl向下移动，curEl向上移动
                const curDirection = Math.sign(-this.touch.moveElDiff)
                // 当滑动距离超过一半就进行完整移动
                if(Math.abs(this.touch.moveElDiff) > this.lineHeight / 2) {
                    if(this.touch.moveEl !== null) {
                        this.touch.moveEl.style.top = this.circumscribe(this.touch.moveElStartTop - curDirection * this.lineHeight) + 'px'
                    }
                    if(curDirection * this.touch.direction === 1) {
                        this.touch.curEl.style.top = this.circumscribe(this.touch.startTop + this.touch.direction * lineCount * this.lineHeight) + 'px'
                    } else {
                        this.touch.curEl.style.top = this.circumscribe(this.touch.startTop + this.touch.direction * (lineCount - 1) * this.lineHeight) + 'px'
                    }
                } else {
                    // 复位
                    if(this.touch.moveEl !== null) {
                        this.touch.moveEl.style.top = this.circumscribe(this.touch.moveElStartTop) + 'px'
                    }
                    if(curDirection * this.touch.direction === 1) {
                        this.touch.curEl.style.top = this.circumscribe(this.touch.startTop + this.touch.direction * (lineCount - 1) * this.lineHeight) + 'px'
                    } else {
                        this.touch.curEl.style.top = this.circumscribe(this.touch.startTop + this.touch.direction * lineCount * this.lineHeight) + 'px'
                    }
                }
                setTimeout(() => {
                    changeOpacity(this.touch.curEl, 1, duration)
                    this.resort()
                    this.touch = {}
                }, duration)
            },
            // 根据index计算被动移动元素
            calculateMoveEl(type) {
                const touch = this[type]
                // getElementById比较消耗性能, 这里只有当被动移动元素变化时，才重新计算
                if(!touch.isFirstMove && touch.moveElIndex === touch.preMoveElIndex) {
                    // 被动移动元素没变
                    touch.moveEl = touch.preMoveEl
                    touch.moveElStartTop = touch.preMoveElStartTop
                } else {
                    // 被动移动元素
                    touch.moveEl = this.getElementByIndex(touch.moveElIndex)
                    if(touch.moveEl) {
                        touch.moveElStartTop = parseInt(touch.moveEl.style.top)
                        // 首次执行touchmove函数，记录
                        touch.preMoveElStartTop = touch.moveElStartTop
                        touch.preMoveElIndex = touch.moveElIndex
                        touch.preMoveEl = touch.moveEl
                    }
                }
            },
            circumscribe(top) {
                return Math.min(Math.max(0, top), this.maxTop)
            },
            // 计算元素是否接近边缘
            approaching(el) {
                const bounding = el.getBoundingClientRect()
                const topLimit = 200
                const bottomLimit = 200
                return {
                    top: bounding.bottom - this.listTop < topLimit,
                    bottom: this.listBottom - bounding.bottom < bottomLimit
                }
            },
            // scroll组件自动滚动到底了
            scrollEnd() {
                this.scrolling = false
            },
            // 停止自动滚动
            stopAutoScroll() {
                this.scrolling = false
                this.clearTimer()
                this.$refs.scroll.stop()
                // 停止自动滚动时，需要从auto中继承一些数据到touch
                this.touch.preMoveElStartTop = this.auto.moveElStartTop
                this.touch.preMoveElIndex = this.auto.moveElIndex
                this.touch.preMoveEl = this.auto.moveEl
                // 停止时，计算自动滚动距离，touchmove的totalDiff要包含这个
                this.touch.autoScrollDistance = this.auto.startScrollY - this.scrollY
                this.auto = {}
            },
            clearTimer() {
                clearInterval(this.timer)
                this.timer = null
            },
            // 排序, 根据位置给line设置index，并保存到id中
            resort() {
                const lines = document.getElementsByClassName('sort-list-line')
                for(let i=0; i< lines.length; i++) {
                    const line = lines[i]
                    // 由于上面touchend计算的top值可能有小数，非整数，因此这里如果只用top值，会得到或大或小的index
                    // 所以用(top+bottom)/2，即行的中点，配合Math.floor向下取整来计算index
                    // 当前排序下，实际的从上到下的顺序，记录到元素的id中
                    const bounding = line.getBoundingClientRect()
                    const index = Math.floor(((bounding.top + bounding.bottom) / 2 - this.scrollY - this.listTop) / this.lineHeight)
                    line.setAttribute('id', index)
                }
                this.firstElement = this.getElementByIndex(0)
                this.lastElement = this.getElementByIndex(this.content.length - 1)
            },
            getElementByIndex(index) {
                return (index >= 0 && index <= this.content.length -1) ? document.getElementById(index) : null
            },
            getElementByY(pageY) {
                return document.elementFromPoint(0, pageY)
            },
            // 获取元素首次排列时的top值
            getDefaultTop(el) {
                const index = el.getAttribute('data-def-index')
                return index * this.lineHeight
            },
            // 记录勾选项
            check(id, status) {
                if(status) {
                    if(!this.checkList.find(i => i === id)) {
                        this.checkList.push(id)
                    }
                } else {
                    this.checkList = this.checkList.filter(i => i !== id)
                }
                this.$emit('check', this.checkList.length)
            },
            // 全选/取消全选
            toggleCheckAll() {
                const status = this.checkList.length < this.content.length
                this.$refs.liner.forEach(liner => {
                    liner.manualCheck(status)
                })
            },
            // 删除
            doDelete() {
                if(this.checkList.length == 0) {
                    return
                }
                this.lineMoved = true
                // 记录被删除的项id
                this.deletedList = this.deletedList.concat(this.checkList)
                // 被删除的元素的top值数组
                const deleteElTops = []
                this.checkList.forEach(itemId => {
                    // 获取被删元素的top值，并从content数组中删除该项
                    const index = this.content.findIndex(i => i.id == itemId)
                    const el = this.$refs[itemId][0]
                    const elTop = parseInt(el.style.top)
                    const top = Math.round(elTop / this.lineHeight) * this.lineHeight
                    deleteElTops.push(top)
                    this.content.splice(index, 1)
                })
                // 记录多少行被删除了
                this.deletedLineCount = this.deletedLineCount + this.checkList.length
                // 按top值排序
                deleteElTops.sort(function(a, b) {
                    return a - b
                })
                this.$nextTick(() => {
                    let pos = 0
                    const len = deleteElTops.length
                    let totalContinueCount = 0
                    while(pos < len) {
                        let continueCount = 1
                        const cur = deleteElTops[pos]
                        // 找到有多少个top值是连续的(被删掉的行是连着的)
                        while(pos + continueCount < len && cur + this.lineHeight == deleteElTops[pos + continueCount]) {
                            continueCount++
                        }
                        // 需要调整top值的留存元素的起始top值
                        const startTop = cur + continueCount * this.lineHeight
                        const endIndex = pos + continueCount
                        // 这里用list.length，保证取一定足够大的endTop
                        const endTop = endIndex < len ? deleteElTops[pos + continueCount] - this.lineHeight : this.lineHeight * this.list.length
                        // 这个是要积累的, 比如第一次循环，区间内的行向上移动一行距离，在第二次循环中，就要算上之前移动造成的空缺
                        totalContinueCount = totalContinueCount + continueCount
                        // 将top值在[startTop, endTop]区间的行，向上移动totalContinueCount * lineHeight的距离
                        this.liftEl(startTop, endTop, totalContinueCount)
                        // 移动位置，执行下次循环
                        pos = pos + continueCount
                    }
                    // 更新高度信息
                    this.setHeight()
                    this.resort()
                    // 清空全局变量
                    this.checkList = []
                })
            },
            // 将top值在[startTop, endTop]区间的行，向上移动totalContinueCount * lineHeight的距离
            liftEl(startTop, endTop, count) {
                const lines = document.getElementsByClassName('sort-list-line')
                for(let i=0; i< lines.length; i++) {
                    const line = lines[i]
                    // grossTop有可能是59.8,60.4这种非正好是60的倍数
                    const grossTop = parseInt(line.style.top)
                    // round凑整
                    const roundTop = this.getRound(grossTop)
                    if(roundTop >= startTop && roundTop <= endTop) {
                        line.style.top = roundTop - this.lineHeight * count + 'px'
                    }
                }
            },
            getRound(gross) {
                return Math.round(gross / this.lineHeight) * this.lineHeight
            },
            // 生成排序后的list
            getSortedList() {
                if(!this.lineMoved) {
                    // 返回null，没有行进行重新排列, 外部无需做更改
                    return null
                }
                const sortedList = []
                const len = this.list.length - this.deletedLineCount
                for(let i=0; i< len; i++) {
                    const line = this.getElementByIndex(i)
                    const itemId = parseInt(line.getAttribute('data-item-id'))
                    const item = this.content.find(i => i.id === itemId)
                    sortedList.push(item)
                }
                return sortedList
            },
            // 获取被删除的项的列表
            getDeletedList() {
                return this.deletedList.map(itemId => {
                    return this.list.find(i => i.id === itemId)
                })
            },
            // 给line首次排列定位
            arrange() {
                const lines = document.getElementsByClassName('sort-list-line')
                for(let i=0; i< lines.length; i++) {
                    const line = lines[i]
                    line.style.top = this.lineHeight * i + 'px'
                }
            },
            // 设置高度
            setHeight() {
                this.totalHeight = this.lineHeight * this.content.length
                // line是绝对定位脱离文档流，需要手动给ul设置高度
                this.$refs.wrapper.style.height = this.totalHeight + 'px'
                // scroll到底时的值(负数)
                this.maxScrollY = this.$refs.scroll.$el.offsetHeight - this.totalHeight
                // line的最大top值
                this.maxTop = this.totalHeight - this.lineHeight
            },
            back() {
                this.$emit('back')
            }
        },
        created() {
            this.deletedLineCount = 0
            this.deletedList = []
            this.touch = {}
            this.auto = {}
        },
        mounted() {
            // 行高
            this.lineHeight = document.getElementsByClassName('sort-list-line')[0].offsetHeight
            const bounding = this.$el.getBoundingClientRect()
            // sortlist外边顶部高度
            this.listTop = bounding.top
            this.listBottom = bounding.bottom
            // 设置高度
            this.setHeight()
            // 给line首次排列定位
            this.arrange()
            this.resort()
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
    .sortlist
        position: absolute
        left: 0
        top: 0
        right: 0
        bottom: 0
        background: $color-background
        .scroll
            position: absolute
            left: 0
            top: 0
            right: 0
            bottom: 0
            .sort-list-line
                position: absolute
                left: 0
                right: 0
                height: 60px
</style>