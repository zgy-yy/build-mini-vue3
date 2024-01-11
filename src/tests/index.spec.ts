//
// it("init",()=>{
//
//     expect(true).toBe(true)
// })
import {reactive} from "../reactivity/reactive";
import {effect} from "../reactivity/effect";

const data = reactive({
    ok: true,
    text: 'hello'
})

let res = "";

function foo() {
    data.ok = false
    console.log('1')
}

effect(foo)
