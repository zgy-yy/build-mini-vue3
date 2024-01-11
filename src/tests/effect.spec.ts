import {reactive} from "../reactivity/reactive";
import {effect} from "../reactivity/effect";

describe("effect", () => {
    it("happy path", () => {
        const data = reactive({
            ok: true,
            text: 'hello'
        })

        let res = "";

        function foo() {
            data.ok ? data.text : '90'
            console.log('1')
        }

        effect(foo)
        data.ok = false
        data.ok = false
        data.ok = false
        data.text = "hh"
    })
})