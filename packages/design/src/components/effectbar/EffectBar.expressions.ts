/** Datastar-Ausdruck: Restzeit als mm:ss bzw. hh:mm:ss, abhängig vom lokalen Signal $_now. */
export const remainingTextExpr = (expiresAt: number): string =>
  `((s) => { const p = (n) => String(n).padStart(2, '0'); const h = Math.floor(s / 3600); ` +
  `return (h ? p(h) + ':' : '') + p(Math.floor(s % 3600 / 60)) + ':' + p(s % 60); })` +
  `(Math.max(0, Math.ceil((${expiresAt} - $_now) / 1000)))`;

export const nowSignals = '{_now: Date.now()}';
export const nowTick = '$_now = Date.now()';
