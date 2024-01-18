import {reactive} from "../reactivity/reactive";
import {effect} from "../reactivity/effect";

describe("effect", () => {
    it("happy path", () => {
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
})