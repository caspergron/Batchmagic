import incoming_products from '../../assets/Logo/sidebar/incoming_products.svg';
import incoming_products_selected from '../../assets/Logo/sidebar/incoming_products_selected.svg';
import batches from '../../assets/Logo/sidebar/batches.svg';
import batches_selected from '../../assets/Logo/sidebar/batches_selected.svg';
import suppliers from '../../assets/Logo/sidebar/suppliers.svg';
import suppliers_selected from '../../assets/Logo/sidebar/suppliers_selected.svg';
import customers from '../../assets/Logo/sidebar/customers.svg';
import customers_selected from '../../assets/Logo/sidebar/customers_selected.svg';
import outgoing_shipments from '../../assets/Logo/sidebar/outgoing_shipments.svg';
import outgoing_shipments_selected from '../../assets/Logo/sidebar/outgoing_shipments_selected.svg';
import mix_recipes from '../../assets/Logo/sidebar/mix_recipes.svg';
import stock from '../../assets/Logo/sidebar/stock_black.svg';
import stock_selected from '../../assets/Logo/sidebar/stock_selected.svg';
import shopping_bag from '../../assets/Logo/sidebar/product_black.svg';
import shopping_bag_selected from '../../assets/Logo/sidebar/shopping_bag_selected.svg';
import mix_recipes_selected from '../../assets/Logo/sidebar/mix_recipes_selected.svg';

export const sidebarMenu = [
  {
    title: 'Incoming Products',
    icon: incoming_products,
    iconSelected: incoming_products_selected,
    link: '/dashboard/product',
    submenu: [
      {
        title: 'Products',
        link: '/dashboard/product',
        icon: shopping_bag,
        iconSelected: shopping_bag_selected,
        parentLink: '/dashboard/product',
      },
      {
        title: 'Product Stocks',
        link: '/dashboard/product/stock',
        icon: stock,
        iconSelected: stock_selected,
        parentLink: '/dashboard/product',
      },
    ],
  },
  {
    title: 'Batches',
    icon: batches,
    iconSelected: batches_selected,
    link: '/dashboard/outgoing-batch',
  },
  {
    title: 'Suppliers',
    icon: suppliers,
    iconSelected: suppliers_selected,
    link: '/dashboard/supplier',
  },
  {
    title: 'Customers',
    icon: customers,
    iconSelected: customers_selected,
    link: '/dashboard/customers',
  },
  {
    title: 'Outgoing Orders',
    icon: outgoing_shipments,
    iconSelected: outgoing_shipments_selected,
    link: '/dashboard/orders',
  },
  {
    title: 'Mix Recipes',
    icon: mix_recipes,
    iconSelected: mix_recipes_selected,
    link: '/dashboard/mix-recipes',
  },
];
