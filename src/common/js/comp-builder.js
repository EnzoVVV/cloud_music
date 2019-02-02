import Vue from 'vue'
import store from '../../store'
import PopupManager from 'common/js/popup-manager'

const comment = () => import('components/comment/comment')
const homepage = () => import('components/homepage/homepage')
const discdetail = () => import('components/disc-detail/disc-detail')
const albumdetail = () => import('components/album-detail/album-detail')
const singerdetail = () => import('components/singer-detail/singer-detail')

const message = () => import('base/message/message')

Vue.component('comment', comment)
Vue.component('homepage', homepage)
Vue.component('discdetail', discdetail)
Vue.component('albumdetail', albumdetail)
Vue.component('singerdetail', singerdetail)

Vue.component('message', message)

/*
    comp-builder约束
    1. 组件全局注册
    2. 必须在组件mounted钩子下， emit mountedCalled事件
    3. 返回时事件名是back
*/

/*
    comp-builder为了解决两个问题
    1. 无限次创建同一组件的实例
    2. 每次创建组件实例，都设置一个高于其他组件的zIndex
*/


const builder = function(name, props, manage = true) {
    const sharedData = {
        flag: false
    }
    const _props = props || {}
    Object.assign(_props, sharedData)

    const div = document.createElement('div')
    document.body.appendChild(div)
    const options = {
        // 设置el后, new Vue会自动执行$mount()
        el: div,
        data: _props,
        // TODO, 这里的components下，必须用本js文件函数外import的，不能在函数中动态import，不能用变量，why？？
        // components: { comp },
        render: function(h) {
            // 如果render写成 render: h => {}则this是undefined
            if(this.flag) {
                return h(name, {
                    ref: 'child',
                    props: _props,
                    on: {
                        mountedCalled: this.handleMounted,
                        back: this.tearDown
                    }
                })
            }
            return h('span')
        },
        methods: {
            tearDown() {
                // 设v-if为false, 终结组件实例
                this.flag = false
                if(manage) {
                    PopupManager.popComp()
                }
                // 在transition动画结束后终结wrapper实例
                setTimeout(() => {
                    this.terminate()
                }, 1000)
            },
            terminate() {
                this.$destroy()
                // $destroy()是终结实例的所有连结, 并不能删除dom结构, 需要手动删除dom结构
                // $destroy()执行后，依然能获取到this.$el, this.$data等vnode数据
                let el = this.$el
                el.parentNode.removeChild(el)
            },
            handleMounted() {
                this.$refs.child.$el.style.zIndex = PopupManager.nextZIndex()
                if(manage) {
                    PopupManager.addComp(name)
                }
            }
        },
        mounted() {
            // 父组件mounted时子组件还没mounted
            // wrapper mounted后再将v-if置为true，否则组件的transition动画触发不了
            this.flag = true
        }
    }
    if(manage) {
        options.store = store
    }
    // 为了传递props，必须将组件包裹在父组件(wrapper组件)中
    let instance = new Vue(options).$children[0]

    return instance
}

export default builder
