<template>
    <transition name="fade">
        <v-card
            v-show="value"
            ref="menu"
            class="app-menu"
            tabindex="0"
            :ripple="false"
            :style="styleAppMenu"
            @focusout.self.prevent="onFocusout"
        >
            <v-row class="bg-theme-g1" no-gutters dense>
                <v-col align="end">
                    <v-btn dark small text @click="onInput(false)">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-divider />
            <v-row no-gutters>
                <v-col>
                    <ul class="fill-width">
                        <li v-for="(item, i) in getItems" :key="`menu-${i}`">
                            <v-btn
                                class="d-flex justify-space-between"
                                text
                                block
                                @click="onClickMenuItem(item)"
                            >
                                <div class="d-flex">
                                    <v-icon
                                        class="ico-app-menu mr-1"
                                        :color="item.color ? item.color : null"
                                        >{{ item.icon }}</v-icon
                                    >
                                    <b class="text-app-menu">{{ item.desc }}</b>
                                </div>
                                <div class="d-flex">
                                    <b
                                        v-if="item.shortcut"
                                        class="text-app-menu"
                                        >({{ item.shortcut }})</b
                                    >
                                </div>
                            </v-btn>
                        </li>
                    </ul>
                </v-col>
            </v-row>
        </v-card>
    </transition>
</template>
<script>
export default {
    name: 'AppMenu',
    props: {
        value: {
            type: [Boolean],
            default: false,
        },
        path: {
            type: [String, null],
            default: null,
        },
        isDir: {
            type: [Boolean, null],
            default: null,
        },
        pageX: {
            type: [Number],
            default: 0,
        },
        pageY: {
            type: [Number],
            default: 0,
        },
    },
    data() {
        const app = this
        return {
            selectedItem: null,
            items: [
                {
                    name: 'add-folder',
                    desc: '새로고침',
                    shortcut: 'R',
                    icon: 'mdi-refresh',
                    color: app.$app.scss('--dark-color'),
                    callback() {
                        app.$store
                            .dispatch('markdown/loadMarkdowns')
                            .catch((e) => console.error(e))
                            .finally(app.hide)
                    },
                },
                {
                    name: 'add-folder',
                    desc: '새 폴더',
                    shortcut: 'N',
                    icon: 'fa-solid fa-folder',
                    color: app.$app.scss('--folder-color'),
                    callback() {
                        const { path } = app
                        app.$store
                            .dispatch('markdown/saveMarkdownDir', {
                                target: path,
                            })
                            .then(({ writed }) =>
                                app.$toast.success(`${writed} 생성되었습니다.`)
                            )
                            .catch((e) => app.$toast.error(e))
                            .finally(app.hide)
                    },
                },
                {
                    name: 'add',
                    desc: '새 문서',
                    shortcut: 'N',
                    icon: 'mdi-file-document-outline',
                    color: app.$app.scss('--dark-color'),
                    callback() {
                        const { path } = app
                        app.$store
                            .dispatch('markdown/saveMarkdown', { target: path })
                            .then(({ writed }) =>
                                app.$toast.success(`${writed} 생성되었습니다.`)
                            )
                            .catch((e) => app.$toast.error(e))
                            .finally(app.hide)
                    },
                },
                {
                    name: 'update-name',
                    desc: '이름 바꾸기',
                    shortcut: 'M',
                    icon: 'mdi-pencil-box-outline',
                    color: app.$app.scss('--dark-color'),
                    callback() {
                        const { path } = app
                        app.$app.setUpdatePath(path)
                        app.hide()
                    },
                },
                {
                    name: 'remove',
                    desc: '삭제',
                    shortcut: 'D',
                    icon: 'mdi-trash-can-outline',
                    color: app.$app.scss('--dark-color'),
                    callback() {
                        const { path } = app
                        app.$store
                            .dispatch('markdown/removeMarkdown', {
                                target: path,
                            })
                            .then(({ removed }) => {
                                app.$toast.success(`${removed} 삭제되었습니다.`)
                                app.$router
                                    .replace({ name: 'dashboard' })
                                    .catch((e) => e)
                                    .finally(app.hide)
                            })
                            .catch((e) => app.$toast.error(e))
                    },
                },
            ],
        }
    },
    watch: {
        value(newValue) {
            if (newValue) {
                this.focus()
            }
        },
    },
    computed: {
        styleAppMenu() {
            return {
                top: this.pageY + 'px',
                left: this.pageX + 'px',
            }
        },
        getItems() {
            return this.items.filter((item) => {
                if (item.name.includes('add') && this.isDir == false) {
                    return false
                }
                if (['remove', 'rename'].includes(item.name) && !this.path) {
                    return false
                }
                return item
            })
        },
    },
    methods: {
        focus() {
            this.$nextTick(() => {
                const el = this.$refs.menu.$el
                if (!(el && el.focus)) {
                    return
                }
                setTimeout(() => el.focus())
            })
        },
        hide() {
            this.clear()
            this.onInput(false)
        },
        clear() {
            this.selectedItem = null
        },
        onInput(value) {
            if (value == false) {
                this.clear()
            }
            this.$emit('input', value)
        },
        onFocusout(event) {
            // 메뉴카드에서 자식요소로 focus 가 옮겨갔을 경우 다시 이전
            if (event.target.contains(event.relatedTarget)) {
                this.focus()
                return
            }
            this.onInput(false)
        },
        onClickMenuItem({ callback = Function } = {}) {
            if (callback) {
                callback()
            }
        },
    },
}
</script>
<style scoped lang="scss">
.app-menu::v-deep {
    position: absolute;
    z-index: 9999;
    width: calc(12px * 18);
    top: 0;
    left: 0;
    .ico-app-menu {
        font-size: 16px;
    }
    .text-app-menu {
        font-size: 14px;
    }
}
.app-menu:before {
    background: transparent !important;
}
</style>
