import {effectWatch} from './core/render-setup.js'
import {mountedElement, diff} from './renderer/index.js'
export function createApp(component) {
    return {
        mount(container) {
            let context = component.setup();
            let init = false;
            let preSubTree = null;
            effectWatch(() => {
                if(!init) {
                    init = true;
                    container.innerHTML = ""
                    let subTree  = component.render(context);
                    mountedElement(subTree, container)
                     preSubTree = subTree;
                }else {
                    let newSubTree=  component.render(context)
                    diff(preSubTree, newSubTree);
                    preSubTree = newSubTree;
                }
                
            })
        }
    }
}