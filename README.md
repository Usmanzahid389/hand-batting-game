# Hand Betting Game

A web-based Mahjong tile betting game built. Predict whether the **next** hand’s total will be higher or lower than the current hand, while dragon and wind tile values shift over time.

<img width="1790" height="719" alt="image" src="https://github.com/user-attachments/assets/6dd6535c-3864-47bc-af63-c868a85d5372" />
<img width="996" height="858" alt="image" src="https://github.com/user-attachments/assets/d264e6f5-fdb7-4956-9b98-5fda04551c46" />


## Setup

```bash
npm install
npm run dev    # http://localhost:5173
npm test       # domain unit tests
npm run build  # production build
```

## How to play

1. **New Game** from the landing page.
2. Review the current hand and its total.
3. Click **Bet Higher** or **Bet Lower** for the next hand.
4. Score increases by the next hand’s total when your bet is correct.
5. Dragon and wind values (shown on tiles) change after wins and losses.
6. The game ends when any dragon/wind value hits **0** or **10**, or the draw pile is exhausted for the **3rd** time.

## Architecture

Pure game logic lives under `src/domain/` with no React imports. UI and Zustand state are separate so rules can be extended onsite without rewiring components.

```
src/
  domain/       # tiles, deck, engine, scoring, game-over rules
  store/        # Zustand session + view routing
  features/     # landing, game, gameOver screens
  components/   # Tile, HandDisplay, PileBadge, HistoryList
  lib/          # localStorage leaderboard
```

### Extension hooks

- `src/domain/gameConfig.ts` — hand size, limits, leaderboard size
- `src/domain/gameEngine.ts` — betting, reshuffle, dealing
- `src/components/Tile.tsx` — tile presentation

## Documented assumptions

The assessment PDF leaves some rules implicit. This implementation uses the following defaults (also reflected in tests):

| Topic | Rule |
|-------|------|
| Betting | Hi-lo: bet whether hand **B** total is higher or lower than hand **A** |
| Tie | Equal totals → **push** (no score change, no dragon/wind adjustment) |
| Scoring | Correct bet → `score += B.total` (using values **before** kind adjustment) |
| Hand size | 5 tiles |
| Dragon/wind values | One value per **tile kind** (e.g. all Red Dragons share a value), starting at **5** |
| Adjustment | Each dragon/wind **kind** in hand B changes by ±1 on loss/win |
| Discard | Hand A goes to discard pile; hand B becomes current |
| Reshuffle | When draw pile is empty: increment exhaustion counter; if &lt; 3, merge fresh 136-tile deck + discard and shuffle; if 3 → game over |
| Leaderboard | Top 5 in `localStorage`; optional 3-letter initials on game over |

## AI usage

- **Handwritten:** Domain logic (`src/domain/`), unit tests, game rules and state machine design.
- **AI-assisted:** Project scaffolding, UI layout/CSS, README structure, and wiring boilerplate.

### Manual QA

- [ ] New game deals 5 tiles; total matches displayed values
- [ ] Score only increases on correct bets
- [ ] Dragon/wind badges change after win/loss (not push)
- [ ] Draw/discard counts stay consistent through reshuffles
- [ ] Game ends at dragon/wind value 0 or 10
- [ ] Game ends on 3rd draw-pile exhaustion
- [ ] Leaderboard keeps top 5 after refresh
- [ ] Exit returns to landing without saving partial games

