export default ({ Vue }) => {
  Vue.filter('currency', (value) => {
    const n = +value;
    if (Number.isNaN(n)) {
      return 'NT$0';
    }
    return `NT$${n}`;
  });

  Vue.filter('currencyUS', (value) => {
    const n = +value;
    if (Number.isNaN(n)) {
      return 'US$0';
    }
    return `US$${n}`;
  });

  Vue.filter('currencyRMB', (value) => {
    const n = +value;
    if (Number.isNaN(n)) {
      return 'RMB￥0';
    }
    return `RMB￥${n}`;
  });
};
