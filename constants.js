export const CONSTANTS = Object.freeze({
  CURRENCY: {
    RUPEE: {
      code: 'RUPEE',
      symbol: '₹',
      title: 'Rupee',
      shortTitle: 'Rs',
      conversionToRupee: 1,
      conversionToDollar: 78,
    },
    DOLLAR: {
      code: 'DOLLAR',
      symbol: '$',
      title: 'Dollar',
      shortTitle: 'D',
      conversionToRupee: 0.02,
      conversionToDollar: 1,
    },
  },
  MONTH_SHORT: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  DAY_SHORT: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  TRANSACTION_TYPE: {
    INCOME: {
      code: 'INCOME',
      title: 'Income',
    },
    SPENDING: {
      code: 'SPENDING',
      title: 'Spendings',
    },
  },
  ROUTES: {
    HOME: 'HOME',
    INTRO: 'INTRO',

    BOOKMARKS: 'BOOKMARKS',
    ADD_LABEL: 'ADD_LABEL',
    EDIT_LABEL: 'EDIT_LABEL',

    ADD_NOTE: 'ADD_NOTE',
    EDIT_NOTE: 'EDIT_NOTE',

    TASK: 'TASK',

    NOTE: 'NOTE',

    FILTER: 'FILTER',
    MY_DAY: 'MY_DAY',
    CALENDAR: 'CALENDAR',
    SEARCH: 'SEARCH',
  },
  BOTTOM_TAB_BAR_ICONS: {
    Transactions: 'receipt-long',
    Statistics: 'analytics',
    Accounts: 'account-box',
    Settings: 'settings',
  },
  COLORS: {
    PRIMARY: '#04D976',
    DARK_FONT: '#3C5C4E',
    LIGHT_FONT: '#D8E4F1',
    SECONDARY_FONT: '#95A8BF',
    ERROR: '#F35265',
    PRIMARY_DARK: '#32694F',
    PRIMARY_LIGHT: '#E6FFE5',
    WHITE: '#fff',
    TRANSPARENT: 'transparent',
    DARK: '#32694F',
    LINK: '#0075FF',
    SECONDARY_YELLOW: '#F9C76B',
    LIGHT: '#E6FFE5',
    LIGHT_100: '#ebebeb',
  },
  NOTE_COLORS: [
    '#e6194b',
    '#3cb44b',
    '#998608',
    '#4363d8',
    '#c15d16',
    '#911eb4',
    '#0d7676',
    '#a72ea1',
    '#607030',
    '#5e3030',
    '#008080',
    '#3e1c54',
    '#9a6324',
    '#5d5b47',
    '#800000',
    '#224e30',
    '#808000',
    '#846749',
    '#000075',
    '#808080',
    '#000000',
  ],
  INITIAL_ACCOUNTS: {
    CASH: {
      title: 'Cash',
      description: 'Cash',
      currency: 'RUPEE',
    },
    CARD: {
      title: 'Card',
      description: 'Card',
      currency: 'RUPEE',
    },
    UPI: {
      title: 'UPI',
      description: 'UPI',
      currency: 'RUPEE',
    },
  },
  INITIAL_TRANSACTION_CATEGORIES: {
    FOOD: {
      title: 'Food',
      icon_string: 'food',
    },
    TRANSPORTATION: {
      title: 'Transportation',
      icon_string: 'train-car',
    },

    HOUSEHOLD: {
      title: 'Household',
      icon_string: 'home',
    },

    HEALTH: {
      title: 'Health',
      icon_string: 'bottle-tonic-plus',
    },
    EDUCATION: {
      title: 'Education',
      icon_string: 'school',
    },
  },
});
