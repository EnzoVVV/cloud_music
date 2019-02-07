<template>
    <img :src='path' :style='computedStyle'/>
</template>
<script>
    export default {
        name: 'IconImg',
        components: {

        },
        props: {
            imgName: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: 'png'
            },
            size: {
                type: String,
                default: '25px'
            }
        },
        data() {
            return {
                active: false
            }
        },
        computed: {
            path() {
                const fullName = this.active ? `${this.imgName}-active` : this.imgName
                return `static/images/${fullName}.${this.type}`
            },
            computedStyle() {
                return {
                    width: this.size,
                    height: this.size
                }
            }

        },
        watch: {

        },
        methods: {
            activate() {
                this.active = true
            },
            mute() {
                this.active = false
            }
        },
        created() {

        },
        mounted() {

        }
    }
</script>