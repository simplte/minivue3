import {effectWatch} from './core/render-setup.js'

export function createApp(component) {
    return {
        mount(container) {
            let context = component.setup();
            effectWatch(() => {
                container.innerHTML = ""
                let element = component.render(context);
                container.append(element);
            })
        }
    }
}