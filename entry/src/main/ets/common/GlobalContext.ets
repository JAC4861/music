// entry/src/main/ets/common/GlobalContext.ets
import { common } from '@kit.AbilityKit';

export class GlobalContext {
  private static instance: GlobalContext = new GlobalContext();
  private ctx?: common.UIAbilityContext;

  private constructor() {}

  static getInstance(): GlobalContext {
    return GlobalContext.instance;
  }

  setContext(context: common.UIAbilityContext): void {
    this.ctx = context;
  }

  getContext(): common.UIAbilityContext {
    if (!this.ctx) {
      throw new Error('UIAbilityContext not set in GlobalContext');
    }
    return this.ctx;
  }
}
