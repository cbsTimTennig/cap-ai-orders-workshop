namespace workshop;

entity Orders {
  key orderNo : Integer;
  customer    : String(100);
  amount      : Decimal(15, 2);
  currency    : String(3) default 'EUR';
  // NEW | PENDING_APPROVAL | APPROVED | CANCELLED
  status      : String(20) default 'NEW';
  createdAt   : Timestamp @cds.on.insert: $now;
}
