import {reactive} from "../reactivity/reactive";
import {effect} from "../reactivity/effect";

describe("effect", () => {
    it('响应式系统', () => {
        const data = reactive({count: 0})

        effect(() => {
            console.log('count', data.count)
        })
        data.count = 2

    })

    it("嵌套的effect和effect栈", () => {
        const obj = reactive({foo: true, bar: true})
        let temp1, temp2
        effect(() => {
            console.log('effect1')
            effect(() => {
                console.log('effect2')
                temp2 = obj.bar
            })
            temp1 = obj.foo
        })

        obj.foo = false
    })
    it("防止无限循环", () => {
        const data = reactive({
            ok: true,
            text: 'hello'
        })
        const obj = reactive({
            foo: 1
        })
        effect(() => {
            obj.foo = obj.foo + 1
        })
    })

    it('调度器', () => {
        const data = {foo: 1, bar: 2}
        const obj = reactive(data)
        let dumy = 0
        effect(() => {
            dumy = obj.foo
        }, {
            scheduler(fn) {
                fn()
            }
        })
        obj.foo++
        console.log('结束了')
        expect(dumy).toBe(2)
    })

    it('lazy', () => {
        const obj = reactive({
            foo: 0
        })
        const fn = effect(() => {
            console.log(obj.foo)
        }, {
            lazy: true
        })
        fn()
    })
})