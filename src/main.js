import {createApp} from 'vue'
import App from './App.vue'

const app = createApp(App)
app.directive('click-outside', {
    bind () {
        this.event = event => this.vm.$emit(this.expression, event)
        this.el.addEventListener('click', this.stopProp)
        document.body.addEventListener('click', this.event)
    },
    unbind() {
        this.el.removeEventListener('click', this.stopProp)
        document.body.removeEventListener('click', this.event)
    },

    stopProp(event) { event.stopPropagation() }
})

app.mount('#app');
