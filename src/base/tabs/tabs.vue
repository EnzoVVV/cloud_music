<template>
    <div class="tab">
        <div v-for='(item,index) in content' :key='item.name' class='tab-item' @click='handleClick(index)'>
            <p class='tab-link' ref='tablink'>
                <IconSvg v-if='item.icon' :icon-class='item.icon' class='tab-icon'></IconSvg>
                <span v-else-if='item.text' class='tab-text'>{{item.text}}</span>
            </p>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'Tabs',
        props: {
            content: {
                type: Array,
                default: () => []
            },
            activeStyle: {
                type: Boolean,
                default: true
            },
            defaultIndex: {
                type: Number,
                default: 0
            }
        },
        methods: {
            handleClick(index) {
                this.$emit('click',index)
                this.setActiveStyle(index)
            },
            setActiveStyle(index) {
                if(!this.activeStyle) {
                    return
                }
                for(let i=0;i<this.content.length;i++) {
                    if(i!=index) {
                        this.$refs.tablink[i].style.color = 'rgba(255,255,255,0.6)'
                    } else {
                        this.$refs.tablink[i].style.color = 'rgb(255,255,255)'
                    }
                }
            }
        },
        mounted() {
            this.setActiveStyle(this.defaultIndex)
        }
    }
</script>
<style scoped lang='stylus' rel='stylesheet/stylus'>
    @import '~common/stylus/variable'
    .tab
        display: flex
        flex-direction: row
        height: 44px
        line-height: 44px
        padding: 0 20px
        font-size: $font-size-medium
        .tab-item
            flex: 1
            text-align: center
            .tab-link
                color: $color-text-i
                .tab-icon
                    width: 25px !important 
                    height: 25px !important 
</style>
