export const on_scroll = async ({
  element,
  callback,
  options,
  lock_scroll = false,
}: {
  element: HTMLElement;
  callback: (event: Event) => Promise<void>;
  options?: boolean | AddEventListenerOptions;
  lock_scroll?: boolean;
}) => {
  const is_bottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 50;
  console.log(is_bottom);

  if (is_bottom && !lock_scroll) {
    await callback(new Event('scroll'));
  }
};
