export interface IconBtnSize {
    btn: number; // 按钮宽高
    icon: number; // 图标宽高
}
export const ICON_BTN_LEFT: IconBtnSize = { btn: 34, icon: 16 };
export const ICON_BTN_RIGHT: IconBtnSize = { btn: 34, icon: 16 };
export const ICON_BTN_BEGIN: IconBtnSize = { btn: 44, icon: 18 };
export const ICON_BTN_END: IconBtnSize = { btn: 44, icon: 18 };
export function IconButtonImg(iconRes: Resource, enabled: boolean, action: () => void, size: IconBtnSize, bgColor: number, radius: number = -1, parent = null) {
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Button.createWithChild();
        Button.enabled(enabled);
        Button.width(size.btn);
        Button.height(size.btn);
        Button.borderRadius(radius > 0 ? radius : Math.floor(size.btn / 2));
        Button.backgroundColor(bgColor);
        Button.onClick(action);
    }, Button);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender) => {
        Image.create(iconRes);
        Image.width(size.icon);
        Image.height(size.icon);
        Image.objectFit(ImageFit.Contain);
    }, Image);
    Button.pop();
}
// ====== 四种按钮：你只要改资源名即可 ======
// 左按钮（例如：上一首）
export function PlayerBtnLeft(enabled: boolean, action: () => void, 
// 默认资源名：你改成你的 media 名称即可
iconRes: Resource = { "id": 16777232, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, 
// 可覆盖尺寸/背景色/圆角
size: IconBtnSize = ICON_BTN_LEFT, bgColor: number = 0xEEF2FF, radius: number = -1, parent = null) {
    IconButtonImg.bind(this)(iconRes, enabled, action, size, bgColor, radius);
}
// 右按钮（例如：下一首）
export function PlayerBtnRight(enabled: boolean, action: () => void, iconRes: Resource = { "id": 16777235, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, size: IconBtnSize = ICON_BTN_RIGHT, bgColor: number = 0xEEF2FF, radius: number = -1, parent = null) {
    IconButtonImg.bind(this)(iconRes, enabled, action, size, bgColor, radius);
}
// Begin 按钮（例如：播放）
export function PlayerBtnBegin(enabled: boolean, action: () => void, iconRes: Resource = { "id": 16777228, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, size: IconBtnSize = ICON_BTN_BEGIN, bgColor: number = 0x2955FF, radius: number = -1, parent = null) {
    IconButtonImg.bind(this)(iconRes, enabled, action, size, bgColor, radius);
}
// End 按钮（例如：暂停）
export function PlayerBtnEnd(enabled: boolean, action: () => void, iconRes: Resource = { "id": 16777241, "type": 20000, params: [], "bundleName": "com.example.music_classs", "moduleName": "entry" }, size: IconBtnSize = ICON_BTN_END, bgColor: number = 0x2955FF, radius: number = -1, parent = null) {
    IconButtonImg.bind(this)(iconRes, enabled, action, size, bgColor, radius);
}
