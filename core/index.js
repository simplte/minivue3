import {reactive, effectWatch} from "./render-setup.js";

export default  {
    render(context) {
        let div = document.createElement('div')
        div.innerText = context.state.count;
        return  div;
    },
    setup(){
        const state = reactive({
            count :1
        })
        window.state = state;
        return {
            state
        }
    }
} 