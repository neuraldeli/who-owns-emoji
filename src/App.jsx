import React, { useMemo, useState, useEffect } from 'react'

const EMOJIS = [
  { id: 'grin', ch: '😀', label: 'grinning', hue: 'from-yellow-100 to-amber-100' },
  { id: 'heart', ch: '❤️', label: 'heart', hue: 'from-rose-100 to-pink-100' },
  { id: 'sob', ch: '😭', label: 'sob', hue: 'from-sky-100 to-blue-100' },
  { id: 'hearts', ch: '😍', label: 'hearts', hue: 'from-rose-100 to-fuchsia-100' },
  { id: 'frog', ch: '🐸', label: 'frog', hue: 'from-lime-100 to-green-100' },
  { id: 'poo', ch: '💩', label: 'poo', hue: 'from-amber-100 to-orange-100' },
  { id: 'pray', ch: '🙏', label: 'pray', hue: 'from-slate-100 to-zinc-100' },
  { id: 'sunglasses', ch: '😎', label: 'cool', hue: 'from-yellow-100 to-emerald-100' },
  { id: 'party', ch: '🥳', label: 'party', hue: 'from-purple-100 to-indigo-100' },
  { id: 'skull', ch: '💀', label: 'skull', hue: 'from-stone-100 to-gray-100' },
  { id: 'fire', ch: '🔥', label: 'fire', hue: 'from-orange-100 to-red-100' },
  { id: 'rocket', ch: '🚀', label: 'rocket', hue: 'from-cyan-100 to-sky-100' },
]

function mkPrice(min = 0.05, max = 2.5) {
  const p = Math.random() * (max - min) + min
  return Number(p.toFixed(3))
}

function short(addr) {
  return addr ? addr.slice(0, 4) + '…' + addr.slice(-4) : ''
}

function randomOwner() {
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  let s = ''
  for (let i = 0; i < 44; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)]
  return s
}

export default function App() {
  const [q, setQ] = useState('')
  const [sortKey, setSortKey] = useState('trending')
  const [items, setItems] = useState(() =>
    EMOJIS.map((e) => ({
      ...e,
      owner: Math.random() < 0.45 ? randomOwner() : null,
      price: mkPrice(),
      steals: Math.floor(Math.random() * 8),
      trending: Math.random() < 0.4,
    }))
  )
  const [active, setActive] = useState(null)

  const filtered = useMemo(() => {
    let out = items.filter((i) => i.label.includes(q.toLowerCase()) || i.ch.includes(q))
    switch (sortKey) {
      case 'price':
        out.sort((a, b) => a.price - b.price)
        break
      case 'new':
        out.sort((a, b) => (a.owner ? 1 : 0) - (b.owner ? 1 : 0))
        break
      case 'steals':
        out.sort((a, b) => b.steals - a.steals)
        break
      default:
        out.sort((a, b) => Number(b.trending) - Number(a.trending))
    }
    return out
  }, [items, q, sortKey])

  function onSteal(id) {
    setItems((xs) =>
      xs.map((x) =>
        x.id === id
          ? {
              ...x,
              owner: randomOwner(),
              price: Number((x.price * 1.2).toFixed(3)),
              steals: x.steals + 1,
              trending: true,
            }
          : x
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-zinc-800">
      <div className="mx-auto max-w-5xl px-4 pb-16">
        <Header />
        <Hero />
        <Toolbar q={q} setQ={setQ} sortKey={sortKey} setSortKey={setSortKey} />

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((it) => (
            <EmojiCard key={it.id} it={it} onOpen={() => setActive(it)} onSteal={() => onSteal(it.id)} />
          ))}
        </div>

        <Footer />
      </div>

      {active && <Details it={active} onClose={() => setActive(null)} onSteal={() => onSteal(active.id)} />}
    </div>
  )
}

function Header() {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-4 bg-gradient-to-b from-amber-50/80 to-white/60 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-400 shadow-inner grid place-items-center">
            <span className="text-2xl">😊</span>
          </div>
          <div className="leading-tight">
            <div className="font-extrabold tracking-tight text-xl text-zinc-900">who owns the emoji</div>
            <div className="text-xs text-zinc-500">claim · steal · flex</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
            demo mode
          </span>
          <button className="rounded-xl px-3 py-2 text-sm font-semibold bg-zinc-900 text-white shadow hover:opacity-90">
            connect wallet
          </button>
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <div className="mt-6 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-50 p-5 md:p-7 shadow-sm border border-amber-200/40">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900">own an emoji on-chain*</h1>
          <p className="text-sm md:text-base text-zinc-600 mt-2">
            buy any emoji. the next person who steals it pays +20% and you get a cut. totally not a game, promise.
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">*legally you own vibes, not unicode. relax.</p>
        </div>
        <div className="grid grid-cols-6 gap-2 text-2xl md:text-3xl">
          {'😀❤️😭😍🐸💩🙏😎🥳💀🔥🚀'.split('').map((e, i) => (
            <span key={i} className="grid place-items-center h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-white shadow-inner border border-white/60">
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Toolbar({ q, setQ, sortKey, setSortKey }) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="search emoji or name"
          className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 pl-11 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">🔍</span>
      </div>
      <div className="flex items-center gap-2">
        <SortTab label="trending" active={sortKey === 'trending'} onClick={() => setSortKey('trending')} />
        <SortTab label="price" active={sortKey === 'price'} onClick={() => setSortKey('price')} />
        <SortTab label="steals" active={sortKey === 'steals'} onClick={() => setSortKey('steals')} />
        <SortTab label="new" active={sortKey === 'new'} onClick={() => setSortKey('new')} />
      </div>
    </div>
  )
}

function SortTab({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        'rounded-xl border px-3 py-2 text-sm transition shadow-sm ' +
        (active ? 'bg-zinc-900 border-zinc-900 text-white' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50')
      }
    >
      {label}
    </button>
  )
}

function EmojiCard({ it, onOpen, onSteal }) {
  return (
    <div
      className="group rounded-3xl bg-gradient-to-br from-white to-zinc-50 p-3 border border-zinc-200 shadow-sm hover:shadow transition cursor-pointer"
      onClick={onOpen}
    >
      <div className={`rounded-2xl bg-gradient-to-br ${it.hue} p-4 shadow-inner grid place-items-center text-5xl h-28`}>
        <span className="drop-shadow-sm">{it.ch}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="font-semibold text-zinc-900">{it.label}</div>
          <div className="text-xs text-zinc-500">
            {it.owner ? <span>owned by <b className="font-semibold">{short(it.owner)}</b></span> : <span className="italic text-amber-600">unclaimed</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-zinc-900">{it.price} SOL</div>
          <div className="text-[10px] text-zinc-500">{it.steals} steals</div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={(e) => { e.stopPropagation(); onSteal(); }}
          className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold px-3 py-2 shadow hover:opacity-90"
        >
          {it.owner ? 'steal' : 'claim'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          className="rounded-xl bg-white border border-zinc-200 text-sm px-3 py-2"
        >
          details
        </button>
      </div>
    </div>
  )
}

function Details({ it, onClose, onSteal }) {
  useEffect(() => {
    function esc(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-black/30 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-5 md:p-6 shadow-2xl border border-zinc-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`h-16 w-16 rounded-2xl grid place-items-center text-5xl bg-gradient-to-br ${it.hue} shadow-inner`}>{it.ch}</div>
            <div>
              <div className="text-lg font-extrabold text-zinc-900">{it.label}</div>
              <div className="text-xs text-zinc-500">{it.owner ? `owned by ${short(it.owner)}` : 'unclaimed'}</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl px-3 py-2 text-sm bg-zinc-100 hover:bg-zinc-200">esc</button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="price" value={`${it.price} SOL`} />
          <Stat label="steals" value={it.steals} />
          <Stat label="royalty to prior" value="50% (demo)" />
        </div>

        <div className="mt-4 rounded-2xl bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-700">
          demo mode: this isn’t on-chain yet. click steal/claim to simulate the flow; price bumps +20% each time.
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button onClick={onSteal} className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-sm font-semibold px-4 py-3 shadow hover:opacity-90">
            {it.owner ? 'steal now' : 'claim now'}
          </button>
          <button onClick={onClose} className="rounded-xl px-4 py-3 text-sm border border-zinc-200">close</button>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white border border-zinc-200 p-3 text-center">
      <div className="text-[11px] uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="text-lg font-bold text-zinc-900">{value}</div>
    </div>
  )
}
