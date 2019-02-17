<template>
    <div>
        <div v-if='!circle'>
            <div v-if='!status' @click='toggle'><IconSvg icon-class='checkbox-no'></IconSvg></div>
            <div v-else @click='toggle'><IconSvg icon-class='checkbox-yes'></IconSvg></div>
        </div>
        <div v-else>
            <div v-if='!status' @click='toggle'><IconSvg icon-class='checkbox-circle-no'></IconSvg></div>
            <div v-else @click='toggle'><IconSvg icon-class='checkbox-circle-yes'></IconSvg></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'check',
        props: {
            circle: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                status: false
            }
        },
        methods: {
            toggle() {
                this.status = !this.status
                this.$emit('check', this.status)
            },
            // 手动设定状态
            manual(status) {
                this.status = status
                this.$emit('check', this.status)
            }
        }
    }
</script>
<style lang='stylus' scoped>
    @import '~common/stylus/variable'
</style>