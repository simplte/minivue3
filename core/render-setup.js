let currentEffect;
class Dep {
    constructor() {
        this.effectArr = new Set()
    }
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
export function effectWatch(effect) {
    currentEffect = effect;
    effect()
    currentEffect = null;
}
const targetMap = new Map();
export function reactive(raw) {
    const _reciveMap = function(target, key) {
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
        return dep;
    }
    return new Proxy(raw, {
        get(target, key) {
            const dep = _reciveMap(target, key);
            dep.depend();
            return Reflect.get(target, key)
        },
        set(target, key, val) {
            const dep = _reciveMap(target, key);
            let res = Reflect.set(target, key, val);
            dep.notice();
            return res
        }
    })
}

