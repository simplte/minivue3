let currentEffect;
class Dep {
    constructor(val) {
        // this._value = val;
        this.effectArr = new Set()
    }
    // get value() {
    //     this.depend()
    //     return this._value;
    // }
    // set value(val) {
    //     this._value = val;
    //     this.notice();
    // }
    notice() {
        this.effectArr.forEach(effect => {
            effect();
        });
    }
    depend () {
        if(currentEffect) {
            this.effectArr.add(currentEffect)
        }

    }
}
function effectWatch(effect) {
    currentEffect = effect;
    effect()
    currentEffect = null;
}
// b的值依赖于value, 当value发生改变时需要触发注册，执行对应动作
// let dep = new Dep(10)
// let b = 0;
// effectWatch(() => {
//     b = dep.value + 10;
//     console.log(b);
// })
// dep.value = 1;
const targetMap = new Map();
function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            let depMap = targetMap.get(target);
            if(!depMap) {
                depMap = new Map();
                targetMap.set(target, depMap)
            }
            let dep = depMap.get(key);
            if(!dep){
                dep = new Dep();
                depMap.set(key, dep)
            }
            dep.depend();
            return Reflect.get(target, key)
        },
        set(target, key, val) {
            let depMap = targetMap.get(target);
            if(!depMap) {
                depMap = new Map();
                targetMap.set(target, depMap);
            }
            let dep = depMap.get(key);
            if(!dep) {
                dep = new Dep();
                depMap.set(key, dep)
            }
            let res = Reflect.set(target, key, val);
            dep.notice();
            return res
        }
    })
}
// 1: 通过reactive 对对象设置响应式
const user = reactive({
    age: 1
})
let double ;
// 2：通过effectWatch 将当前函数赋值给全局变量
effectWatch(() => {
    console.log("--------reactive------")
    // 3：对象取值时触发get方法，get方法会对使用的key age 通过map的形式 将age 对应一个Dep实例，
    // Dep实例有观察者模式，然后触发实例的depend 方法，拿到全局变量中的回调，从而完成对当前key值得数据监听
    double = user.age;
    console.log(double)
})
// 4：对象赋值时，触发set方法，
// 因为之前get方法已经对当前的key age绑定了事件监听，
// 所以，这时对user对象的key  age赋值后，
// 通过notice() 进行订阅发布，执行之前绑定的回调（effectWatch中的箭头函数）
// double依赖于user.age  user.age 已经被重新赋值，这时double拿到的值就是处理过后的数据了
// 从而完成  double对user.age的数据依赖
user.age = 2;
user.age = 4;

// 5:扩展,double  现在是一个数字, 也可以是一个html视图,  只需要依赖的user.age 发生变化,
// html 的内容对应修改,这样就完成了数据更新,数据也发生变化

/**
 * 个人理解,几个方法的关系:
 *  1: effectWatch  起到纽带作用
 *      1:  让被依赖变量(user.age)改变后获取到需要发布执行的函数（notice 触发的effect函数）
 *      2:  建立依赖变量（double）和被依赖变量（user.age） 的依赖关系（double = user.age）
 *  2：Dep 收集变量的依赖关系,执行具体的目标函数
 *      1：给需要被监听的变量（user.age）添加上发布订阅方法
 *  3：reactive：设置被依赖对象中的key为响应式
 *      1：将对象的每个key设置为响应式
 *      2：被依赖对象的key被获取时 设置监听
 *      3：被依赖对象的key改变时 发布当前key的监听
 * */ 