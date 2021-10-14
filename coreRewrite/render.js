let watchCb = null;
class Dep {
    constructor() {
        this.watchArr = new Set()
    }
    on() {
        if(watchCb) {
            this.watchArr.add(watchCb)
        }
    }
    notice() {
        this.watchArr.forEach(x => {
            x()
        })
    }
}
 function effectWatch(cb) {
    watchCb = cb;
    cb()
    watchCb = null;
}
let watchVal = new Map();
 function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            let rawObj = watchVal.get(target);

            if(!rawObj){
                rawObj = new Map();
                watchVal.set(target, rawObj);
            }
            let rawKeyDep = rawObj.get(key);
            if(!rawKeyDep) {
                rawKeyDep = new Dep();
                rawObj.set(key, rawKeyDep)
            }
            rawKeyDep.on();
            return Reflect.get(target, key);
            
        },
        set(target, key, val) {
            let rawObj = watchVal.get(target);
            if(!rawObj) {
                rawObj = new Map();
                watchVal.set(target, rawObj)
            }
            let rawKeyDep = rawObj.get(key);
            if(!rawKeyDep) {
                rawKeyDep = new Dep();
                rawObj.set(key, rawKeyDep)
            }
            let res =  Reflect.set(target, key, val);
            rawKeyDep.notice();
            return res;
        }
    })
}
let testVal = reactive({
    num:1
})
console.log(testVal)
let baseNum = 0;
effectWatch(()=> {
    console.log('1111111111111')
    baseNum = testVal.num;
    console.log(baseNum);
})
testVal.num = 2;
testVal.num = 9;
testVal.num = 10;
