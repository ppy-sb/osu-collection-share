export default function ({ i18n, $dayjs }) {
  const locale = i18n.locales.find(l => l.code === i18n.locale)
  $dayjs.locale(locale.dayjs)
  i18n.beforeLanguageSwitch = (oldLocale, newLocale) => {
    const locale = i18n.locales.find(l => l.code === newLocale)
    $dayjs.locale(locale.dayjs)
  }
}
