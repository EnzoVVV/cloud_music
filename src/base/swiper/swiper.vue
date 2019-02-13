<template>
    <div class='swiper' ref='swiper'>
        <div v-for='(comp,index) in componentList' :ref='index' :key='comp.name + index' class='container' :style='containerStyle(index)'>
            <component :is='comp.component' v-if='ifload(index)'></component>
			<loading v-else class='loading'></loading>
        </div>
    </div>
</template>
<script>
	import { translate, transform, transitionDuration } from 'common/js/dom.js'
	import { findComponentDownward, findComponentUpward, deepCopy } from 'common/js/tools.js'
    export default {
        name: 'swiper',
        components: {
        },
        props: {
            componentList: {
				type: Array,
				default() {
					return []
				}
			},
            defaultIndex: {
                type: Number,
                default: 0
			},
			height: {
				type: Number
			},
			// 预加载当前index两侧的component
			preloadNearComponents: {
				type: Boolean,
				default: false
			}
        },
        data() {
            return {
                curIndex: this.defaultIndex,
                loadedCompIndex: (new Set()).add(this.defaultIndex),
				touch: {},
				compList: deepCopy(this.componentList),
				maxMoveDistance: 0
            }
        },
        computed: {
            curEl() {
                return this.$refs[this.curIndex][0]
            },
            leftEl() {
                return (this.curIndex - 1 >= 0) ? this.$refs[this.curIndex - 1][0] : ''
            },
            rightEl() {
                return (this.curIndex + 1 <= this.componentList.length-1) ? this.$refs[this.curIndex + 1][0] : ''
            },
            direction() {
				const component = this.compList[this.curIndex]
				// key step如果当前组件内部也包含了swiper时，边界处理
				// 如果内部swiper在最左内部组件时，只允许右滑；如果内部swiper在最右内部组件时，只允许左滑
				if(component.innerSwiper) {
					const innerSwiper = component.innerSwiper
					if(innerSwiper.curIndex == 0) {
						// 只能右滑
						return 'right'
					} else if(innerSwiper.curIndex == innerSwiper.componentList.length -1) {
						// 只能左滑
						return 'left'
					}
				}
				// 可滑动方向，指的是手指滑动的方向。左滑即页面右边有东西。
				if (this.curIndex === 0) {
					// 只能左滑
					return 'left'
				} else if (this.curIndex === this.componentList.length -1) {
					// 只能右滑
					return 'right'
				}
				return 'both'
			}
        },
        methods: {
            touchstart(e) {
				this.touch.initiated = true
				const touch = e.touches[0]
				this.touch.startX = touch.pageX
				this.touch.startY = touch.pageY
				// 外层组件可能需要toush事件信息
				this.$emit('updatetouchstart',e)
			},
			touchmove(e) {
				if(!this.touch.initiated) {
					return
				}
				const curEl = e.currentTarget
				const touch = e.touches[0]
				const deltaX = touch.pageX - this.touch.startX
				const deltaY = touch.pageY - this.touch.startY
				if(Math.abs(deltaY) > Math.abs(deltaX)) {
					// 判断为非横滑
					this.touch = {}
					return
				}
                this.touch.totalDiff = deltaX
                const moveEl = deltaX > 0 ? this.leftEl : this.rightEl
				this.touch.totalDiff = this.touch.totalDiff > 0 && this.direction === 'left' ? 0 : this.touch.totalDiff
				this.touch.totalDiff = this.touch.totalDiff < 0 && this.direction === 'right' ? 0 : this.touch.totalDiff
				translate(curEl, this.touch.totalDiff)
				translate(moveEl, this.touch.totalDiff)
				// 外层组件可能需要toush事件信息
				this.$emit('updatetouchmove', this.touch.totalDiff)
			},
			touchend(e) {
				if(!this.touch.initiated) {
					return
				}
				const curEl = e.currentTarget
				const direction = Math.sign(this.touch.totalDiff)
				const moveEl = direction > 0 ? this.leftEl : this.rightEl
				let moveDistance
				let duration = 200
				// 当滑动距离超过一半就进行完整的滑动
				if (Math.abs(this.touch.totalDiff) > this.maxMoveDistance / 2) {
					moveDistance = direction * this.maxMoveDistance
					this.isDragedSlide = true
					setTimeout(() => {
                        this.reposition(direction)
						this.swipe(this.curIndex - direction,this.curIndex)
					}, duration)
				} else {
					moveDistance = this.touch.totalDiff = 0
				}
				translate(curEl, moveDistance, 0, {
					transitionDuration: duration + 'ms'
				})
				translate(moveEl, moveDistance, 0, {
					transitionDuration: duration + 'ms'
				})
				this.touch = {}
				// 外层组件可能需要toush事件信息
				this.$emit('updatetouchend',moveDistance)
			},
			// 恢复container位置
			// container在不滑动时的位置，靠left值来设定，transform值只控制滑动过程，滑动结束后清除transform信息
            reposition(direction) {
				const moveEl = direction > 0 ? this.leftEl : this.rightEl
				this.curEl.style[transform] = ''
				this.curEl.style[transitionDuration] = '0s'
				this.curEl.style.left = direction * 100 + '%'
				moveEl.style[transform] = ''
				moveEl.style[transitionDuration] = '0s'
				moveEl.style.left = 0
			},
			// 滑动后处理
            swipe(to,from) {
				this.curIndex = to
				if(!this.hasLoaded(this.curIndex)) {
					this.loadedCompIndex.add(this.curIndex)
					// 此时to的动态component开始加载，需要在component created后才能执行enableEventLisenter，因为enableEventLisenter需要获取子组件的data
					// 延后500ms等子组件created, TODO， 如何确保500ms后一定created了? 做成retry呢
					setTimeout(() => {
						this.enableEventLisenter(this.curIndex, true)
					}, 500)
				}
				const outerSwiper = this.findOuterSwiper(this)
				if(outerSwiper) {
					// 如果有外层swiper,发送事件，来调用enableEventLisenter函数动态添加或移除touch事件监听
					// 比如：
					// 初始化时，music组件curIndex是1，是中间的组件，enableEventLisenter函数没有给music组件外层的container添加touch事件监听
					// 当music组件滑动到最左侧时，需要重新调用这个enable函数，给music组件外层的container添加touch事件监听
					// 所以，touchend() -> swipe()函数中，获取外层swiper，触发swipe事件，swiper组件moutned下监听swipe事件，再次调用enableEventLisenter函数
					outerSwiper.$emit('swipe')
				}
			},
			// 滑动到指定index, 被外部调用
			swipeTo(index) {
				if(index == this.curIndex) {
					return
				}
				const target = this.$refs[index][0]
				const direction = index < this.curIndex ? 1 : -1
				const moveDistance = direction * this.maxMoveDistance
				const duration = 200
				translate(this.curEl, moveDistance, 0, {
					transitionDuration: duration + 'ms'
				})
				translate(target, moveDistance, 0, {
					transitionDuration: duration + 'ms'
				})
				setTimeout(() => {
					this.curEl.style[transform] = ''
					this.curEl.style[transitionDuration] = '0s'
					this.curEl.style.left = direction * 100 + '%'
					target.style[transform] = ''
					target.style[transitionDuration] = '0s'
					target.style.left = 0
					this.swipe(index,this.curIndex)
				}, duration)
			},
			findOuterSwiper(component) {
				return findComponentUpward(component,'swiper')
			},
			findInnerSwiper(swipecontainer) {
				// 不能用firstChild, 有可能是#comment，需要用firstElementChild
				const firstChild = swipecontainer.firstElementChild
				if(firstChild) {
					let innerComponent = firstChild.__vue__
					return findComponentDownward(innerComponent,'swiper')
				} 
				return null
			},
			// 内部swiper组件滑动了，外层动态监听事件，为了处理内部swiper处在边界时的情况
			handleInnerSwipe() {
				this.enableEventLisenter(this.curIndex)
			},
			// 动态给swipercontainer添加事件
			enableEventLisenter(index, calculate = false) {
				const swipecontainer = this.$refs[index][0]
				const component = this.compList[index]
				if(calculate && !component.innerSwiper) {
					// 如果calculate为true, 且当前组件的innerSwiper未被计算，则计算innerSwiper
					component.innerSwiper = this.findInnerSwiper(swipecontainer)
				}
				if(component.innerSwiper) {
					// 如果当前swipecontainer里的组件，组件里面还有swiper，就需要特殊处理
					// 得到组件里面的swiper组件，如果内部swiper在最左，则当前swipercontainer监听滑动事件(this.direction为right，只能右滑)，否则不监听滑动事件
					const innerSwiper = component.innerSwiper
					if(innerSwiper.curIndex == 0 && this.curIndex == 0) {
						// 如果当前swiper在最左，内部swiper也在最左，那当前swiper就不能滑动
						// 这个判断不能放到computed direction下，因为，函数调用到this.direction时，才会重新计算当前的direction值，此时已经开始滑动了，晚了
						this.removeTouchEventListener(swipecontainer)
					} else if(innerSwiper.curIndex == innerSwiper.componentList.length -1 && this.curIndex == this.componentList.length - 1) {
						// 如果当前swiper在最右，内部swiper也在最右，那当前swiper就不能滑动
						this.removeTouchEventListener(swipecontainer)
					} else if(innerSwiper.curIndex == 0 || innerSwiper.curIndex == innerSwiper.componentList.length -1) {
						this.addTouchEventListener(swipecontainer)
					} else {
						this.removeTouchEventListener(swipecontainer)
					}
				} else {
					// 没有innerSwiper，正常添加监听
					this.addTouchEventListener(swipecontainer)
				}
			},
			addTouchEventListener(component) {
				component.addEventListener('touchstart',this.touchstart)
				component.addEventListener('touchmove',this.touchmove)
				component.addEventListener('touchend',this.touchend)
			},
			removeTouchEventListener(component) {
				component.removeEventListener('touchstart',this.touchstart)
				component.removeEventListener('touchmove',this.touchmove)
				component.removeEventListener('touchend',this.touchend)
			},
			// 检测component内部是否包含了swiper，如果包含，引用内部swiper免得重复计算
			// getCompList() {
			// 	for(let i=0;i<this.compList.length;i++) {
			// 		const swipecontainer = this.$refs[i][0]
			// 		const innerSwiper = this.findInnerSwiper(swipecontainer)
			// 		if(innerSwiper) {
			// 			this.compList[i].innerSwiper = innerSwiper
			// 		}
			// 	}
			// },
			hasLoaded(index) {
                return this.loadedCompIndex.has(index)
            },
            isNear(index) {
                return Math.abs(index - this.curIndex) <= 1
			},
			// 允许加载已经加载过的组件，或者临近组件
            ifload(index) {
				if(this.preloadNearComponents) {
					return this.hasLoaded(index) || this.isNear(index)
				}
				return this.hasLoaded(index)
			},
			// container初始位置
            containerStyle(index) {
                const direction = Math.sign(index - this.curIndex)
                return {
                    left: direction * 100 + '%'
                }
			}
        },
        created() {

        },
        mounted() {
			this.maxMoveDistance = window.innerWidth
			if(this.height) {
				this.$refs.swiper.style.height = this.height + 'px'
			}
			// if(this.preloadNearComponents) {
			// 	this.getCompList()
			// 	this.enableEventLisenter(this.defaultIndex)
			// } else {
			// 	this.enableEventLisenter(this.defaultIndex, true)
			// }
			// TODO，如果preloadNearComponents为true，此时调用getCompList，还是在video.vue的created之前了呢 ？？？
			this.enableEventLisenter(this.defaultIndex, true)
			this.$on('swipe',this.handleInnerSwipe)
		},
		beforeDestroy() {
			for(let i=0;i<this.componentList.length;i++) {
				const swipecontainer = this.$refs[i][0]
				this.removeTouchEventListener(swipecontainer)
			}
        }
    }
</script>
<style lang='stylus' scoped>
	@import '~common/stylus/variable'
	.swiper 
		position: relative
		width: 100%
		height: 900px
		overflow-x: hidden
		.container
			position: absolute
			height: 100%
			width: 100%
			&.swipe-left-enter, &.swipe-right-leave-to 
				transform: translateX(100%)
			&.swipe-left-enter-active, &.swipe-left-leave-active 
				transition: transform linear 0.2s
			&.swipe-right-enter, &.swipe-left-leave-to 
				transform: translateX(-100%)
			&.swipe-right-enter-active, &.swipe-right-leave-active 
				transition: transform linear 0.2s
		.loading
			position: absolute
			top: 0
			bottom: 0
			left: 0
			right: 0
			display: flex
			justify-content: center
			align-items: center
</style>