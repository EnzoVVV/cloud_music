import minilist from 'base/mini-list/mini-list'
import sort from 'components/sort/sort'
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
            this.sortFlag = true
        }
    }
}