<template>
    <div v-if='recommends.length' style='width: 100%'>
        <slider>
            <div v-for='item in recommends' :key='item.id'>
                <a>
                    <img :src='item.picUrl'></img>
                </a>
            </div>
        </slider>
    </div>
</template>
<script>
    import { getRecommend } from 'api/recommend'
    import { ERR_OK } from 'api/config'
    import slider from 'base/slider/slider'

    export default {
        name: 'recommend',
        components: {
            slider
        },
        props: {

        },
        data() {
            return {
                recommends: []
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            getRecommends() {
                getRecommend().then(res => {
                    if(res.code === ERR_OK) {
                        this.recommends = res.data.slider
                    }
                })
            }

        },
        created() {
            this.getRecommends()
        },
        mounted() {

        }
    }
</script>