export const on_scroll = async ({
  element,
  callback,
  lock_scroll = false,
}: {
  element: HTMLElement;
  callback: (event: Event) => Promise<void>;
  lock_scroll?: boolean;
}) => {
  const is_bottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 50;

  if (is_bottom && !lock_scroll) {
    await callback(new Event('scroll'));
  }
};
