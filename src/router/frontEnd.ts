import { store } from '/@/store';
import { Session } from '/@/utils/storage';
import { NextLoading } from '/@/utils/loading';
import { setAddRoute, setFilterMenuAndCacheTagsViewRoutes } from '/@/router/index';

// 引入views下的所有.vue文件
const modules = import.meta.glob('../views/**/**.vue');

/**
 * 前端控制路由：初始化方法，防止刷新时路由丢失
 * @method  NextLoading 界面 loading 动画开始执行
 * @method store.dispatch('userInfos/setUserInfos') 触发初始化用户信息
 * @method setAddRoute 添加动态路由
 * @method setFilterMenuAndCacheTagsViewRoutes 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
 */
export async function initFrontEndControlRoutes() {
	// 界面 loading 动画开始执行
	if (window.nextLoading === undefined) NextLoading.start();
	// 无 token 停止执行下一步
	if (!Session.get('token')) return false;
	// 触发初始化用户信息
	store.dispatch('userInfos/setUserInfos');
	// 添加动态路由
	await setAddRoute();
	// 设置递归过滤有权限的路由到 vuex routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
	setFilterMenuAndCacheTagsViewRoutes();
}


/**
 * 后端路由component转换
 * @param routes 返回的路由表数组
 * @returns 返回处理后的 component
 */
const layoutPath = [
	'/pages/evalute',
	'/pages/evaluate-statistics',
	'/pages/my-waitdeal',
	'/pages/system-manage',
	'/pages/statistical-analysis',
	'/pages/plat/'
];
export function backEndComponent(routes: any) {
	if (!routes) return;
	return routes.map((item: any) => {
		if (layoutPath.includes(item.component)) {
			item.component = () => import('/@/layout/routerView/parent.vue');
		} else {
			item.component = dynamicImport(modules, item.component);
		}
		item.children && backEndComponent(item.children);
		return item;
	})
}

export function transformMenuToRoutes(menu: any) {
	const menuArr = [] as any;
	menu.map((item: any) => {
		const obj = {
			path: item.url,
			name: item.url.split('/')[item.url.split('/').length - 1],
			component: item.url,
			children: [],
			meta: {
				title: item.title,
				isLink: '',
				isHide: false,
				isKeepAlive: true,
				isIframe: false,
				roles: ['admin'],
				icon: item.icon
			}
		};
		if (item.children && item.children.length > 0) {
			obj.children = transformMenuToRoutes(item.children);
		}
		menuArr.push(obj)
	});
	return menuArr;
}

/**
 * 后端路由component转换函数
 * @param dynamicViewModules 获取目录下的.vue文件
 * @param component 当前要处理项 component
 * @returns 返回处理成函数后的 component
 */
export function dynamicImport(dynamicViewModules: Record<string, Function>, component: string) {
	component = component.replace('/pages/', '')
	const keys = Object.keys(dynamicViewModules);
	const matchKeys = keys.filter((key => {
		const k = key.replace(/..\/views|../, '');
		return k.startsWith(`${component}`) || k.startsWith(`/${component}`)
	}));
	if (matchKeys?.length) {
		const matchKey = matchKeys[0];
		return dynamicViewModules[matchKey];
	}
	return false;
}
