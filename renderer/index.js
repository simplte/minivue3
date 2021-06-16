export function diff(n1, n2) {
	// 1:tag
	if (n1.tag !== n2.tag) {
		n1.el.replaceWith(document.createElement(n2.tag));
	} else {
		// 2:props
		// 这个点没有理解
		let el = (n2.el = n1.el);
		const { props: oldProps } = n1;
		const { props: newProps } = n2;
		if (newProps && oldProps) {
			Object.keys(newProps).forEach((key) => {
				let newVal = newProps[key];
				let oldVal = oldProps[key];
				if (newVal !== oldVal) {
					n1.el.setAttribute(key, newVal);
				}
			});
		}
		if (oldProps) {
			Object.keys(oldProps).forEach((key) => {
				let newVal = newProps[key];
				if (!newVal) {
					n1.el.removeAttribute(key);
				}
			});
		}
		// 3:children
		// 1：newChild => string,  oldChild => array/string
		// 2:newchild => array , oldchild => array/string
		let { children: oldChildren } = n1;
		let { children: newChildren } = n2;
		let length = Math.min(oldChildren.length, newChildren.length);
		if (typeof newChildren == 'string') {
			if (typeof oldChildren == 'string') {
				if (newChildren !== oldChildren) {
					el.textContent = newChildren;
				}
			} else if (Array.isArray(oldChildren)) {
				el.textContent = newChildren;
			}
		} else if (Array.isArray(newChildren)) {
			if(typeof oldChildren == 'string') {
				el.innerText = ""
				mountedElement(n2, el);
			}else if(Array.isArray(oldChildren)) {
				// 1:处理公共节点
				for (let index = 0; index < length; index++) {
					diff(oldChildren[index], newChildren[index]);
				}
				// 2:新节点长,创建新节点
				if (newChildren.length > length) {
					for (let index = length; index < newChildren.length; index++) {
						mountedElement(newChildren[index]);
					}
				}
				// 3：老节点长，删除旧节点
				if (oldChildren.length > length) {
					for (let index = length; index < oldChildren.length; index++) {
						const oldVnode = oldChildren[index];
						oldVnode.el.parent.remove(oldVnode.el);
					}
				}
			}
			
		}
	}
}

export function mountedElement(vnode, container) {
	const { tag, props, children } = vnode;
	// 1:vnode => dom
	let el = (vnode.el = document.createElement(tag));

	// 2：props中属性的添加到dom上
	if (props) {
		for (const key in props) {
			const val = props[key];
			el.setAttribute(key, val);
		}
	}
	// 3：子节点的处理
	if (typeof children == 'string') {
		let textNode = document.createTextNode(children);
		el.append(textNode);
	} else if (Array.isArray(children)) {
		children.forEach((child) => {
			// 递归处理子节点类型
			mountedElement(child, el);
		});
	}
	container.append(el);
}
