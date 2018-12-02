<script>
    import CreatedDiscManage from './components/created-disc-manage'
    import FavoriteDiscManage from './components/favorite-disc-manage'
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
        data() {
            return {
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
                    throw new Error('invalid type')
                    break
            }
            let comp = h(compName, {
                on: {
                    hide: this.hide
                }
            })
            return h('div', {}, [comp])
        },
        computed: {

        },
        watch: {

        },
        methods: {

        },
        created() {

        },
        mounted() {

        }
    }
</script>