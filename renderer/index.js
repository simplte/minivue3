export default function mountedElement(vnode, container) {
	const { tag, props, children } = vnode;
	// 1:vnode => dom
	let el = document.createElement(tag);

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
