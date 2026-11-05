# Hit the Center Line — a normal-distribution data collection game

Students stop a moving slider as close as they can to a red center line.
Each round records how far off they were, **in pixels**:
**positive = right of the line, negative = left**. Many rounds from a whole
class should give a roughly normal, bell-shaped distribution centered near 0.

- Single file: `index.html` (no build step, works on any Chromebook browser)
- Controls: **Space** (or Enter, or tap/click the screen)
- Default: 2 practice rounds (not recorded) + 30 recorded rounds
- The slider moves at a constant speed (700 px/s) so every part of the track is equally fast
- Each round starts from a random end after a random short pause, so students can't memorize a rhythm
- The track is a fixed 600 px wide on every device so everyone's pixels mean the same thing

## Settings

Edit the `CONFIG` block at the top of the `<script>` in `index.html`, or override in the link:

| Link parameter | Default | Meaning |
|---|---|---|
| `rounds` | 30 | recorded rounds per student |
| `practice` | 2 | warm-up rounds (not recorded) |
| `speed` | 700 | slider speed, pixels per second (higher = harder, wider spread) |
| `width` | 600 | track width in pixels |

Example: `.../index.html?rounds=10&practice=0`

## Connect to a Google Sheet (≈3 minutes, no Firebase needed)

1. Create a new Google Sheet. Menu **Extensions → Apps Script**.
2. Delete what's in `Code.gs` and paste in [`google-apps-script/Code.gs`](google-apps-script/Code.gs). Click **Save**.
3. Click **Deploy → New deployment**, gear icon → **Web app**.
   - *Execute as:* **Me**
   - *Who has access:* **Anyone** (students won't see or edit your sheet — the script only appends rows)
   - Click **Deploy**, approve the permissions prompt.
4. Copy the **Web app URL** (ends in `/exec`) and paste it into `SHEET_URL` in `index.html`.

Every round is written as a row in a tab named **Data**:
`Name, Period, Round, Distance (px), Side`.
Share the Sheet with students as **Viewer** (or have them File → Make a copy) for analysis.

If a save fails (e.g. Wi-Fi drop), the game retries, and the results screen offers
"Try again" plus a CSV download as a backup.

> If you later edit `Code.gs`, use **Deploy → Manage deployments → Edit → New version**
> so the same URL keeps working.

## Hosting for students (GitHub Pages)

Repo **Settings → Pages → Build and deployment → Deploy from a branch**, pick the branch and `/ (root)`.
Students then open `https://<your-username>.github.io/<repo-name>/`.
