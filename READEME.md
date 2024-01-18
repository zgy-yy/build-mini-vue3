# 响应式系统
## 4.4分支切换与cleanup
```ts
effect(() => {
    document.body.innerText = obj.ok ? obj.text : 'not'
})
```
 每次执行effect函数，都会再一次触发依赖收集，所以在执行前，先把收集的依赖集合清空
 ，这样会引起无限循环，因为在执行副作用函数时会调用cleanup进行清除，但是执行副作用函数，又会收集
 所以就会无限调用，解决办法构造另一个Set集合去便利
 ## 4.5嵌套的effect
activateEffect 存储当前的副作用函数，嵌套的effect会覆盖它，所以构造一个effectStack栈
```ts
effect(() => {
    obj.foo = obj.foo + 1
})
```
会无限调用，引起栈溢出，原因执行obj.foo 会触发收集依赖，track,赋值是又会触发trigger
但是该函数未执行完，就会无限调用
