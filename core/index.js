import { reactive, effectWatch } from './render-setup.js';
import { h } from './h.js';
export default {
	render(context) {
		// let div = document.createElement('div')
		// div.innerText = context.state.count;
		// 使用vnode处理
		return h(
			'div',
			{
				id: 'bqc' + context.state.count,
				class: 'bqc'
			},
			[
				h(
					'p',
					{
						id: 'wq',
						class: 'wq'
					},
					[
						h(
							'h1',
							{
								id: 'bd',
								class: 'bd'
							},
							String(context.state.count)
						)
					]
				),
				h(
					'p',
					{
						id: 'wq1',
						class: 'wq1'
					},
					[
						h(
							'h1',
							{
								id: 'bd1',
								class: 'bd1'
							},
							String(context.state.count)
						)
					]
				)
			]
		);
	},
	setup() {
		const state = reactive({
			count: 1
		});
		window.state = state;
		return {
			state
		};
	}
};
