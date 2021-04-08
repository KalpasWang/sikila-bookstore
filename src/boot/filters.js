export default ({ Vue }) => {
  Vue.filter('currency', (value) => {
    const n = +value;
    if (Number.isNaN(n)) {
      return 'NT$0';
    }
    return `NT$${n}`;
  });
};
