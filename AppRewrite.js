import {effectWatch} from './coreRewrite/render.js';
export default function App(component) {
    return {
        mounted(container) {
            let context = component.setup();
            effectWatch(() => {
                container.innerHTML = '';
                let el = component.render(context);
                container.append(el);
            })
        }
    } 
  }