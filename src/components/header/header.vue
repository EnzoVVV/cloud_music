<template>
    <Tabs :content='content'>
    </Tabs>
</template>
<script>

    import Tabs from 'components/tabs/tabs'
    export default {
        name: 'Header',
        components: {
            Tabs
        },
        props: {

        },
        data() {
            return {
                content: [
                    {
                        text: '推荐',
                        to: 'recommend'
                    },
                    {
                        text: '朋友',
                        to: 'friend'
                    },
                    {
                        text: '电台',
                        to: 'radio'
                    }
                ]

            }
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