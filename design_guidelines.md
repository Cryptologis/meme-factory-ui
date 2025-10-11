# Solana Token Trading Platform - Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from leading Solana DeFi platforms (Jupiter, Raydium, Phantom) and modern crypto exchanges. Focus on trustworthy professionalism combined with the energetic, tech-forward aesthetic that crypto users expect.

## Core Design Elements

### A. Color Palette
**Dark Mode Primary** (industry standard for crypto platforms):
- Background: 220 15% 8% (deep navy-black)
- Surface: 220 15% 12% (elevated cards)
- Surface Elevated: 220 15% 16% (modals, dropdowns)
- Border: 220 15% 20% (subtle dividers)

**Brand Colors**:
- Primary: 270 100% 65% (Solana purple gradient base)
- Primary Accent: 190 100% 60% (cyan-teal, Solana's signature gradient end)
- Success: 142 76% 45% (transaction success, buy actions)
- Danger: 0 84% 60% (alerts, sell actions)
- Warning: 38 92% 50% (pending states)

**Text Colors**:
- Primary Text: 0 0% 98%
- Secondary Text: 220 10% 65%
- Muted Text: 220 10% 45%

### B. Typography
**Font Stack**: 
- **Primary**: 'Inter' from Google Fonts - clean, modern, excellent for data display
- **Mono**: 'JetBrains Mono' - for wallet addresses, token amounts, transaction hashes

**Type Scale**:
- Display: 3rem/4rem (48px/64px) font-bold - Hero headlines
- Headline: 2rem/2.5rem (32px/40px) font-semibold - Section headers
- Title: 1.5rem/2rem (24px/32px) font-semibold - Card headers
- Body: 1rem/1.5rem (16px/24px) font-normal - Primary content
- Small: 0.875rem/1.25rem (14px/20px) - Secondary info
- Micro: 0.75rem/1rem (12px/16px) - Labels, captions

### C. Layout System
**Spacing Primitives**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** for consistent rhythm
- Component padding: p-6 or p-8
- Section spacing: py-12 or py-16
- Card gaps: gap-4 or gap-6
- Icon spacing: mr-2 or ml-2

**Container Strategy**:
- Max width: max-w-7xl for main content
- Trading interface: max-w-6xl centered
- Marketplace grid: full width with inner constraints

### D. Component Library

**Navigation**:
- Fixed top navbar with glassmorphism effect (backdrop-blur-xl bg-surface/80)
- Wallet connection button prominently placed top-right with connection status indicator
- Logo left, main nav center (Marketplace, Create Token, Portfolio, Transactions)
- Balance display integrated into navbar for connected wallets

**Trading Components**:
- **Token Cards**: Elevated surface with hover lift effect, displaying token symbol, name, price, 24h change with color coding, liquidity, and quick buy/sell CTAs
- **Trading Panel**: Split design - Token info left, trading form right with buy/sell tabs using primary/danger color coding
- **Order Book**: Compact table design with price levels, amounts, and visual depth bars
- **Price Chart**: Integrated lightweight chart (dark theme) showing 1h/24h/7d intervals

**Token Creation Form**:
- Multi-step wizard with progress indicator
- Input fields with clear labels and validation states
- Metadata preview card showing how token will appear
- Transaction fee estimate prominently displayed
- Confirm modal with all parameters before submission

**Wallet Integration**:
- Connection modal showcasing Phantom and Solflare with brand icons
- Disconnected state: prominent "Connect Wallet" CTA
- Connected state: Avatar with truncated address (0x1234...5678), balance, network indicator (Devnet badge)

**Transaction Feedback**:
- Toast notifications for transaction states (pending, success, failed)
- Transaction history cards with status badges, timestamps, Solana explorer links
- Loading states with animated Solana logo or progress indicators

**Data Display**:
- Token balance cards with large numbers, 24h P&L color-coded
- Market stats dashboard with key metrics (Total Volume, Active Tokens, etc.)
- Real-time price updates with subtle animation on change

### E. Visual Enhancements

**Gradients**: Use Solana's signature gradient sparingly for CTAs and accents
- Primary gradient: `bg-gradient-to-r from-purple-500 to-cyan-400`
- Apply to primary CTAs, token creation button, feature highlights

**Glassmorphism**: For navbar, modals, and elevated panels
- `backdrop-blur-xl bg-surface/80 border border-border/50`

**Micro-interactions**:
- Hover states: Subtle lift (translate-y-[-2px]) with shadow increase
- Button press: Scale-95 for tactile feedback
- Toggle animations for buy/sell tabs
- Number counter animations for balance updates

**Icons**: Use Heroicons via CDN for UI icons (wallet, chart, arrow-swap, etc.)

## Images

**Hero Section**:
- **Primary Hero Image**: Abstract Solana-themed visualization - blockchain network nodes, purple-cyan gradient overlay, tech-forward aesthetic (1920x800px minimum)
- Position: Full-width background with dark gradient overlay (from-transparent to-background)
- Content: Overlay "Create, Trade, and Manage Solana Tokens" headline with wallet connection CTA

**Marketplace Grid**:
- Token placeholder images with gradient backgrounds if no custom token image provided
- Use abstract geometric patterns in brand colors for default token avatars

**Empty States**:
- Illustration for "No tokens created yet" - friendly, encouraging users to create their first token
- "Wallet not connected" state with visual prompt to connect

**Key Principle**: Images should reinforce the professional, tech-forward crypto aesthetic without overwhelming the data-dense trading interface. Use imagery strategically in hero and empty states, keeping the marketplace and trading areas focused on information clarity.