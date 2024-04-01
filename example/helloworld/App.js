import { h } from "../../lib/guide-mini-vue.esm.js";


const Foo = {
    setup(props) {
        console.log('props', props)
    },

    render() {
        return h('div', {}, 'Foo: ' + this.props.count)
    }
}


window.self = 'a'
export const App = {
    render() {
        window.self = this
        return h('div', {
            onClick() {
                console.log('ehllo');
            }
        }, [h('p', null, 'a-' + this.msg), h(Foo, {count:11}, 'b')])
    },
    setup() {
        return {
            msg: 'mini-vue3'
        }
    }
}


