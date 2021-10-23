export type PrependParameters<
  TFunction extends (...args: any) => any,
  TParameters extends [...args: any]
> = (
  ...args: [...TParameters, ...Parameters<TFunction>]
) => ReturnType<TFunction>;
