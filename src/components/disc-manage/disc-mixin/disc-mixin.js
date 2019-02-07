import minilist from 'base/mini-list/mini-list'
const sort = () => import('components/sort/sort')
export const discMixin = {
    components: {
        minilist,
        sort
    },
    data() {
        return {
            sortFlag: false
        }
    },
    methods: {
        hide() {
            this.$emit('hide')
        },
        showSort() {
            this.$refs.minilist.$el.style.display = 'none'
            this.sortFlag = true
        }
    }
}