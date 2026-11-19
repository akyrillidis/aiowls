# _archive (not published: Jekyll skips folders that start with "_")

Archived 2026-10-07 to clean the site folder. Restore with `git mv _archive/<path> <original path>`.

- `theme-leftovers/`: files from the jekyll-theme-minimal template that the AI-OWLS site never used: `docs/` (CODE_OF_CONDUCT, CONTRIBUTING, SUPPORT; they were being published as orphan pages), `script/` (theme dev scripts), `jekyll-theme-minimal.gemspec`, `another-page.md` (theme demo page, published but unlinked).
- `unused-assets/`: images no page references: `QLSP_*.png` (five figures for a QLSP post that was never published; reuse them if that post is written), `ParallelDeflationDiagram.pdf` (pages use the `.png`), `measuring_relaxation_thumbnail.svg`.
- `unused-assets/ctac_*.png` (archived 2026-11-19): the four figures of the first version of `can_we_train_a_computer.html` (corner plot, key-overlap matrices, score curves, per-network K_off bars). Their key measurement used token+position inputs the heads do not receive; the corrected post uses `assets/img/ctac_score_curves.png` and `ctac_corner_real.png` from the L4DC paper.

Untracked scratch (font-test pages, three unused AIR images) moved outside the repo to `~/Claude-Code/_archive/aiowls-untracked-2026-10-07/`.
