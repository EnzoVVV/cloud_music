<script>
    const CreatedDiscManage = () => import('./components/created-disc-manage')
    const FavoriteDiscManage = () => import('./components/favorite-disc-manage')
    export default {
        name: 'discmanage',
        components: {
            CreatedDiscManage,
            FavoriteDiscManage
        },
        props: {
            // 0是CreatedDiscManage, 1是FavoriteDiscManage
            type: {
                type: Number,
                default: 0
            }
        },
        render(h) {
            let compName = ''
            switch(this.type) {
                case 0:
                    compName = 'CreatedDiscManage'
                    break
                case 1:
                    compName = 'FavoriteDiscManage'
                    break
                default: 
                    compName = null
                    break
            }
            if(compName === null && process.env.NODE_ENV !== 'production') {
                throw new Error('invalid type')
            }
            let comp = h(compName, {
                on: {
                    hide: this.hide
                }
            })
            return h('div', {}, [comp])
        },
        methods: {
            hide() {
                this.$emit('hide')
            }
        }
    }
</script>