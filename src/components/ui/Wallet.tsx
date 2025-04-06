'use client';

import { useEffect, useState } from 'react';

export const Wallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    const res = await fetch('/api/wallet');
    const data = await res.json();
    setWallet(data);
  };

  const fetchPayouts = async () => {
    const res = await fetch('/api/payouts');
    const data = await res.json();
    setPayouts(data);
  };

  useEffect(() => {
    fetchWallet();
    fetchPayouts();
  }, []);

  const handleWithdraw = async () => {
    if (!amount || isNaN(+amount)) return alert('Enter a valid amount.');
    setLoading(true);

    const res = await fetch('/api/wallet/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: +amount }),
    });

    setLoading(false);

    if (res.ok) {
      alert('Withdrawal requested!');
      setAmount('');
      fetchWallet();
      fetchPayouts();
    } else {
      const err = await res.json();
      alert(err.error || 'Failed to withdraw.');
    }
  };

  if (!wallet) return <p className="text-center mt-10 text-gray-400">Loading wallet...</p>;

  return (
    <div className="max-w-lg mx-auto mt-16 p-6 border rounded-xl shadow-lg dark:border-neutral-700 bg-white dark:bg-neutral-900">
      <h2 className="text-2xl font-bold mb-4">💼 Your Wallet</h2>

      <p className="text-lg mb-4">
        Current Balance:{' '}
        <span className="text-green-500 font-semibold">{wallet.balance} credits</span>
      </p>

      <div className="mb-6">
        <label className="block mb-1 text-sm font-medium">Withdraw Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 rounded-md border dark:bg-neutral-800 dark:text-white"
          placeholder="Minimum 100 credits"
        />
        <button
          onClick={handleWithdraw}
          disabled={loading}
          className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          {loading ? 'Processing...' : 'Request Withdrawal'}
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">📤 Pending Payouts</h3>
      {payouts.length === 0 ? (
        <p className="text-sm text-gray-400">No pending payouts.</p>
      ) : (
        <ul className="text-sm space-y-1">
          {payouts.map((p, i) => (
            <li key={i}>
              {p.amount} credits - {p.status} -{' '}
              {new Date(p.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
