export const set_language = (picker: any, locales: any) => {
  const range_picker = picker._options.rangePicker;
  const language = picker._options.language;

  if (!range_picker) {
    let vanilla_instance = picker.getDatepickerInstance();
    Object.assign(vanilla_instance.constructor.locales, locales);
    vanilla_instance.setOptions({ language });
  } else {
    for (let vanilla_instance of picker._datepickerInstance.datepickers) {
      Object.assign(vanilla_instance.constructor.locales, locales);
      vanilla_instance.setOptions({ language });
    }
  }
};
