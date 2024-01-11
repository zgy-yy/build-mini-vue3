import {track, trigger} from "./effect";

export function reactive<T extends Object, P extends keyof T>(raw: T) {

    return new Proxy(raw, {
        get(target: T, key: string | symbol, receiver: unknown) {//unknown 在使用时会强制类型检查
            if (Reflect.has(target, key)) {
                const res = Reflect.get(target, key, receiver)
                // TODO 收集依赖
                track(target, key)
                return res
            }
            return undefined

        },
        set(target: T, key: string | symbol, newValue: T[P], receiver: unknown): boolean {
            const res = Reflect.set(target, key, newValue, receiver)
            // TODO 触发依赖
            trigger(target, key)
            return res
        }
    })
}