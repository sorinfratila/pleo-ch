export interface Expense {
  id: string;
  amount: {
    value: string;
    currency: string;
  };
  date: Date;
  merchant: string;
  receipts: any[];
  comment: string;
  category: string;
  user: {
    first: string;
    last: string;
    email: string;
  };
  index: number;
  isOpen?: boolean; // used for toggling the expense accordions
}

// Example of Expense structure
// {
//   "id": "5b996064dfd5b783915112f5",
//   "amount": {
//       "value": "1854.99",
//       "currency": "EUR"
//   },
//   "date": "2018-09-10T02:11:29.184Z",
//   "merchant": "KAGE",
//   "receipts": [],
//   "comment": "someComment",
//   "category": "",
//   "user": {
//       "first": "Vickie",
//       "last": "Lee",
//       "email": "vickie.lee@pleo.io"
//   },
//   "index": 0
// },
