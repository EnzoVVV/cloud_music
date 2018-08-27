<template>
    <div class="tab">
        <!-- 不配置路由，点击router-link后url也会跳转到to对应的，只是不加载对应的组件了 -->
        <!-- router-link的tag: 将router-link渲染为tag对应的element -->
        <router-link v-for='item in content' :key='item.to' :to='item.to' class="tab-item" tag='div'>
            <p class='tab-link'>
                <IconSvg v-if='item.icon' :icon-class='item.icon' class='tab-icon'></IconSvg>
                <span v-else-if='item.text' class='tab-text'>{{item.text}}</span>
            </p>
        </router-link>
    </div>
</template>
<script>
    export default {
        name: 'Tabs',
        props: {
            content: {
                type: Array,
                default: () => []
            }
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
                color: $color-text-l
                .tab-icon
                    width: 25px !important 
                    height: 25px !important 
            &.router-link-active
                .tab-text
                    border-bottom: 2px solid $color-text-l
</style>
