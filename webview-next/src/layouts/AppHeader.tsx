import { useAppStore } from '@/stores/app'
import '@/layouts/AppHeader.scoped.scss'
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'AppHeader',
    setup() {
        const appStore = useAppStore()
        const onOpenDir = () => {}
        const onPowerOff = () => {}
        return () => (
            <v-app-bar class="app-header" density="compact" flat>
                <v-row no-gutters>
                    <v-col>
                        <v-btn
                            class="skip-native-drag"
                            size="large"
                            onClick={appStore.toggleDrawer}
                        >
                            <v-icon class="ico-menu">fa-solid fa-bars</v-icon>
                        </v-btn>
                        <v-btn class="skip-native-drag" size="large" onClick={onOpenDir}>
                            <v-icon class="ico-folder">fa-solid fa-folder</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col align="right">
                        <v-btn class=" skip-native-drag" size="large" onClick={onPowerOff}>
                            <v-icon class="ico-power-off">fa-solid fa-power-off</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-app-bar>
        )
    }
})
