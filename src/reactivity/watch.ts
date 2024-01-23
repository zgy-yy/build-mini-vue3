import {effect} from "./effect";

function traverse(value: any, seen = new Set()) { //递归读取source
    // 如果读取过 或 是null 就返回
    if (typeof value !== 'object' || value == null || seen.has(value))
        return
    seen.add(value)

    for (const k in value) {
        traverse(value[k])
    }
    return value;
}

export default function watch(source: Object | Function, cb: (newValue?: any, oldValue?: any) => void) {

    let getter: Function
    if (typeof source === 'function') {
        getter = source
    } else {
        getter = traverse(source)
    }


    let oldValue: any, newValue: any;

    const effectFn = effect(() => getter(), {
        lazy: true,
        scheduler() {
            newValue = effectFn()
            cb(newValue, oldValue)
            oldValue = newValue
        }
    })
    oldValue = effectFn()
}


