import {effectWatch} from './core/render-setup.js'
import mountedElement from './renderer/index.js'
export function createApp(component) {
    return {
        mount(container) {
            let context = component.setup();
            effectWatch(() => {
                container.innerHTML = ""
                let vnode = component.render(context);
                 mountedElement(vnode, container)
            })
        }
    }
}