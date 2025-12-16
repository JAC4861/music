export interface IconBtnSize {
  btn: number;   // 按钮宽高
  icon: number;  // 图标宽高
}

export const ICON_BTN_LEFT: IconBtnSize = { btn: 34, icon: 16 };
export const ICON_BTN_RIGHT: IconBtnSize = { btn: 34, icon: 16 };
export const ICON_BTN_BEGIN: IconBtnSize = { btn: 44, icon: 18 };
export const ICON_BTN_END: IconBtnSize = { btn: 44, icon: 18 };

@Builder
export function IconButtonImg(
  iconRes: Resource,
  enabled: boolean,
  action: () => void,
  size: IconBtnSize,
  bgColor: number,
  radius: number = -1
) {
  Button() {
    Image(iconRes)
      .width(size.icon)
      .height(size.icon)
      .objectFit(ImageFit.Contain);
  }
  .enabled(enabled)
  .width(size.btn)
  .height(size.btn)
  .borderRadius(radius > 0 ? radius : Math.floor(size.btn / 2))
  .backgroundColor(bgColor)
  .onClick(action);
}

// ====== 四种按钮：你只要改资源名即可 ======

// 左按钮（例如：上一首）
@Builder
export function PlayerBtnLeft(
  enabled: boolean,
  action: () => void,
  // 默认资源名：你改成你的 media 名称即可
  iconRes: Resource = $r('app.media.left'),
  // 可覆盖尺寸/背景色/圆角
  size: IconBtnSize = ICON_BTN_LEFT,
  bgColor: number = 0xEEF2FF,
  radius: number = -1
) {
  IconButtonImg(iconRes, enabled, action, size, bgColor, radius);
}

// 右按钮（例如：下一首）
@Builder
export function PlayerBtnRight(
  enabled: boolean,
  action: () => void,
  iconRes: Resource = $r('app.media.right'),
  size: IconBtnSize = ICON_BTN_RIGHT,
  bgColor: number = 0xEEF2FF,
  radius: number = -1
) {
  IconButtonImg(iconRes, enabled, action, size, bgColor, radius);
}

// Begin 按钮（例如：播放）
@Builder
export function PlayerBtnBegin(
  enabled: boolean,
  action: () => void,
  iconRes: Resource = $r('app.media.bofang'),
  size: IconBtnSize = ICON_BTN_BEGIN,
  bgColor: number = 0x2955FF,
  radius: number = -1
) {
  IconButtonImg(iconRes, enabled, action, size, bgColor, radius);
}

// End 按钮（例如：暂停）
@Builder
export function PlayerBtnEnd(
  enabled: boolean,
  action: () => void,
  iconRes: Resource = $r('app.media.guanbi'),
  size: IconBtnSize = ICON_BTN_END,
  bgColor: number = 0x2955FF,
  radius: number = -1
) {
  IconButtonImg(iconRes, enabled, action, size, bgColor, radius);
}