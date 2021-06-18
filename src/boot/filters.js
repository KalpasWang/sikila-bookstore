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
      return '$0';
    }
    return `$${n}`;
  });

  Vue.filter('currencyRMB', (value) => {
    const n = +value;
    if (Number.isNaN(n)) {
      return '￥0';
    }
    return `￥${n}`;
  });

  Vue.filter('date', (timestamp) => {
    const date = new Date(+timestamp * 1000);
    return date.toLocaleDateString();
  });
};
