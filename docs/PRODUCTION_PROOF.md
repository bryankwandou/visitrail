# Production Proof - Friday, July 24, 2026

## Public deployments

- Product: https://visitrail.vercel.app
- Repository: https://github.com/bryankwandou/visitrail

## Production acceptance

All public routes returned HTTP 200: `/`, `/app`, `/agent`, `/proofs`, `/visits`, `/notes`, `/matching`, `/reviews`, and `/family`.

The production Groq agent used `openai/gpt-oss-120b`, selected `verify_visit`, routed execution through `evaluateVisitBillability`, and returned `flagged_unverified` with `billable: false` for weak GPS and short-duration evidence.

## Solana devnet proof

- Cluster: devnet
- Signer: `DSWBYzBpf9ej2oA4PTSJhh8JS5cfqkmVsGuK9PkWF3iW`
- Transaction: `vkw3F3cw1VoYLfqz6a6nheqGkQk9eGZQYZoSfj15GJunGwPb8hkhHLEHXgFM63aiA3HmDtqWw3EKxUotcsxCwX4`
- Explorer: https://explorer.solana.com/tx/vkw3F3cw1VoYLfqz6a6nheqGkQk9eGZQYZoSfj15GJunGwPb8hkhHLEHXgFM63aiA3HmDtqWw3EKxUotcsxCwX4?cluster=devnet

The on-chain Memo contains only a VisitRail version prefix and SHA-256 hash. It excludes client names, service addresses, care-note text, and health details.

## Browser wallet

The `/proofs` route detects Phantom or Solflare, requests explicit connection, prepares the transaction client-side, asks the wallet to sign, confirms the signature against devnet, and provides an Explorer link. VisitRail never receives the browser wallet private key.

## Wallet ownership hardening

On Friday, July 24, 2026, VisitRail added an HMAC-protected five-minute challenge and Ed25519 signature verification. Automated acceptance produced HTTP 200 for a valid signature and HTTP 401 after message tampering. Connected-wallet proof signing stays disabled until ownership verification succeeds.

