import {reactive} from "../reactivity/reactive";
import {computed} from "../reactivity/computed";
import {effect} from "../reactivity/effect";

describe('计算属性', () => {
    it('test', () => {
        const data = {foo: 1, bar: 2}
        const obj = reactive(data)

        const sum = computed(() => obj.bar + obj.foo)

        effect(()=>{
            console.log(sum.value)
        })

        obj.foo++

    })
})