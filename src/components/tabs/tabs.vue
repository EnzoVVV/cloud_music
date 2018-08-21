<template>
    <div class="tabs">
        <!-- 不配置路由，点击router-link后url也会跳转到to对应的，只是不加载对应的组件了 -->
        <router-link v-for='item in content' :key='item.to' :to='item.to' class="tabs-item">
            <icon v-if='item.icon' type='item.icon'></icon>
            <span v-if='item.text'>{{item.text}}</span>
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
<style>
.tabs {
    position: relative;
    text-align: center;
    &-item {
        display: inline-block;
    }
}
</style>
