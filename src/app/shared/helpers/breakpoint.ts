class BreakpointHelper {
  static get_breakpoint_value = (breakpoint: 'sm' | 'md' | 'lg' | 'xl'): number | null => {
    const breakpoint_identifiers = {
      sm: '--breakpoint-sm',
      md: '--breakpoint-md',
      lg: '--breakpoint-lg',
      xl: '--breakpoint-xl',
    };

    const breakpoint_identifier = breakpoint_identifiers[breakpoint];

    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(breakpoint_identifier)
      .trim();

    if (!value) return null;

    if (value.endsWith('px')) {
      return Number.parseFloat(value);
    }

    if (value.endsWith('rem')) {
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

      return Number.isNaN(rootFontSize) ? null : Number.parseFloat(value) * rootFontSize;
    }

    return null;
  };

  static compare_breakpoint = async (breakpont: number, fn: Function) => {
    if (breakpont !== null && window.innerWidth <= breakpont) {
      await fn();
      return;
    }
  };
}

export default BreakpointHelper;
