<template>
    <input
        class="md-update-path pa-0 ma-0"
        ref="input"
        :value="printValue"
        :color="$app.scss('--theme-color-1')"
        @input="onInput"
        @keydown.enter="onUpdateName"
        @focusout="onFocusout"
    />
</template>
<script>
import _ from 'lodash'
import { mapActions } from 'vuex'
// 이름바꾸기 입력 컴포넌트
export default {
    name: 'MdUpdatePath',
    props: {
        path: {
            type: [String, null],
            default: null,
        },
    },
    data() {
        return {
            input: null,
        }
    },
    computed: {
        printValue() {
            let name
            try {
                let tmp = this.path.split('/')
                name = _.last(tmp)
                if (name) {
                    tmp = name.split('.')
                    name = _.first(tmp)
                }
            } catch (e) {
                console.error(e)
            }
            return name
        },
    },
    methods: {
        ...mapActions('markdown', ['renameMarkdown']),
        onInput(event) {
            this.input = event.target.value
        },
        async onUpdateName(event) {
            event.preventDefault()
            try {
                const { input, path } = this
                if (!input) {
                    return
                }
                const { renamed } = await this.renameMarkdown({
                    target: path,
                    rename: input,
                })
                const filename = _.last(renamed.split('/'))
                this.$toast.success(`${filename} 으/로 변경되었습니다.`)
                // 현재 작성중인 문서인 경우
                if (this.$route.params.path == path) {
                    this.$router
                        .replace({
                            name: 'markdown-editor',
                            params: { path: renamed },
                        })
                        .catch((e) => e)
                }
            } catch (e) {
                this.$toast.error(e)
            }
            this.clear()
        },
        onFocusout(event) {
            if (this.input) {
                this.onUpdateName(event)
                return
            }
            this.clear()
        },
        focus() {
            this.$nextTick(() => {
                const refInput = this.$refs.input
                if (refInput) {
                    refInput.focus()
                }
            })
        },
        clear() {
            this.input = null
            this.$app.setUpdatePath(null)
        },
    },
    mounted() {
        this.focus()
    },
}
</script>
<style scoped lang="scss">
.md-update-path::v-deep {
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-weight: 700;
    color: var(--update-color);
    border: 2px dotted var(--update-color);
    outline: none;
}
</style>
