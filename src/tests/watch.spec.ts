import {reactive} from "../reactivity/reactive";
import {computed} from "../reactivity/computed";
import {effect} from "../reactivity/effect";
import watch from "../reactivity/watch";


describe('watch', () => {
    it('source test', () => {
        const data = {foo: 1, bar: 2}
        const obj = reactive(data)

        watch(obj, () => {
            console.log(1)
        })

        obj.foo++

    })

    it('function test', () => {
        const data = {foo: 1, bar: 2}
        const obj = reactive(data)

        watch(() => obj.foo, () => {
            console.log(1)
        })
        obj.foo++
    })

    it('新值与旧值 test', () => {
        const data = {foo: 1, bar: 2}
        const obj = reactive(data)

        watch(() => obj.foo, (newValue, oldValue) => {
            console.log(newValue, oldValue)
        })
        obj.foo++

    })
    it('immediate test', () => {
        const data = {foo: 1, bar: 2}
        const obj = reactive(data)

        watch(() => obj.foo, (newValue, oldValue) => {
            console.log(newValue, oldValue)
        }, {
            immediate: true
        })
        // obj.foo++

    })
})