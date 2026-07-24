# VisitRail

**Live production:** https://visitrail.vercel.app

VisitRail is an evidence-first operating layer for home care agencies. It verifies visit evidence, keeps AI drafting grounded, makes staffing recommendations explainable, and exposes only finalized updates to families.

## Live product surfaces

- `/` - product landing page with GSAP motion
- `/app` - interactive command center and EVV simulations
- `/agent` - live Groq tool-routing agent
- `/proofs` - browser wallet and real Solana devnet proof lab
- `/visits` - visit operations and evidence-state board
- `/notes` - grounded note review queue
- `/matching` - continuity-aware caregiver ranking
- `/reviews` - coordinator exception review queue
- `/family` - finalized-only family experience

## API contracts

- `POST /api/agent/run` - Groq plan selection followed by deterministic tool execution
- `POST /api/evv/check-in` - device GPS proximity validation
- `POST /api/evv/check-out` - deterministic visit billability decision
- `POST /api/care-notes/draft` - evidence-grounded, review-required care note
- `POST /api/matching` - explainable caregiver ranking
- `POST /api/proofs/prepare` - canonical SHA-256 evidence digest
- `POST /api/proofs/anchor` - real Solana devnet Memo transaction
- `POST /api/wallet/challenge` - expiring HMAC-protected ownership challenge
- `POST /api/wallet/verify` - Ed25519 wallet signature verification
- `GET /api/devnet/status` - live Solana devnet RPC health

## Run locally

```bash
npm install
copy .env.example .env.local
npm run dev
```

Required live credentials:

- `GROQ_API_KEY`
- `SOLANA_PRIVATE_KEY` for the funded server demo signer
- `SOLANA_RPC_URL=https://api.devnet.solana.com`
- `NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com`

## Validate

```bash
npm run lint
npm run type-check
npm test
npm run build
```

The current acceptance suite covers valid and rejected EVV evidence, privileged exception review, grounded note drafting, explainable matching, stable privacy-safe hashes, and AI tool authority boundaries.

## Database

Apply `supabase/migrations/202607240001_visitrail_foundation.sql` to Supabase. It provides PostGIS-backed evidence, tenant-aware RLS, finalized-only family note access, immutable audit events, and a server-side billing transition guard.

## Security boundaries

- AI selects and explains tools but cannot authorize billing.
- Manual duration entry cannot satisfy EVV.
- Flagged visits require Coordinator/Admin review.
- Unconfirmed tasks never appear as completed.
- Browser wallet signing is explicit; private keys never reach VisitRail.
- Connected wallets must prove ownership with an expiring signed challenge before transaction signing is enabled.
- On-chain Memo proofs contain hashes only, never names, addresses, notes, or health data.
- The funded demo signer rejects anonymous calls and requires a short-lived verified wallet session.
