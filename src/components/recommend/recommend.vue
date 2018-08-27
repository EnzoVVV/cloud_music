<template>
<div>
    <div v-if='recommends.length' style='width: 100%'>
        <slider>
            <div v-for='item in recommends' :key='item.id'>
                <a>
                    <img :src='item.picUrl'></img>
                </a>
            </div>
        </slider>
    </div>
    <discList :discList='discLists' v-if='discLists.length'></discList>
</div>
</template>
<script>
    import { getRecommendList, getBanner } from 'api/recommend'
    import { ERR_OK } from 'api/config'
    import slider from 'base/slider/slider'
    import tabs from 'base/tabs/tabs'
    import discList from 'components/discList/discList'

    export default {
        name: 'recommend',
        components: {
            slider,
            // not used
            tabs,
            discList
        },
        props: {

        },
        data() {
            return {
                recommends: [],
                discLists: []
            }
        },
        computed: {

        },
        watch: {

        },
        methods: {
            getRecommends() {
                getBanner().then(res => {
                    if(res.code === ERR_OK) {
                        this.recommends = res.data.slider
                    }
                })
            },
            getLists() {
                getRecommendList().then( res => {
                    if(res.code === ERR_OK) {
                        this.discLists = res.data
                    }
                })
            }

        },
        created() {
            this.getRecommends()
            this.getLists()
        },
        mounted() {

        }
    }
</script>