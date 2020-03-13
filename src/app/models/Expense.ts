export class Expense {
  public id: string;
  public amount: {
    value: string;
    currency: Currency;
  };
  public date: Date;
  public merchant: string;
  public receipts: string[];
  public comment: string;
  public category: string;
  public user: {
    first: string;
    last: string;
    email: string;
  };
  index: number;
  isOpen?: boolean; // used for toggling the expense accordions
}

export type Currency = 'DKK' | 'GBP' | 'EUR';

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
