import { h } from "../../lib/guide-mini-vue.esm.js";

window.self ='a'
export const App = {
    render() {
        window.self = this
        return h('div', {style:'color:"red"'}, [h('p', null, 'a-'+this.msg), h('p', null, 'b')])
    },
    setup() {
        return {
            msg: 'mini-vue3'
        }
    }
}