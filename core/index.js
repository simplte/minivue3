import {reactive, effectWatch} from "./render-setup.js";

const app =  {
    render(context) {
        effectWatch(() => {
            document.body.innerHTML = ""
            let div = document.createElement('div')
            div.innerText = context.state.count;
            document.body.appendChild(div);
        })
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
app.render(app.setup());