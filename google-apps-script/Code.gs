/**
 * Center Line game -> Google Sheet receiver.
 *
 * Setup (about 3 minutes, see README.md for screenshots-free steps):
 *   1. Create a Google Sheet. Extensions > Apps Script.
 *   2. Replace everything in Code.gs with this file. Save.
 *   3. Deploy > New deployment > type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone   (or "Anyone in <your school>" if students are signed in)
 *   4. Copy the web-app URL (ends in /exec) and paste it into SHEET_URL in index.html.
 */

const SHEET_NAME = 'Data';
const HEADERS = ['Timestamp', 'Name', 'Period', 'Session', 'Round', 'Distance (px)',
                 'Abs distance (px)', 'Side', 'Speed (px/s)', 'Track width (px)'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // many students may submit at the same moment
  try {
    const payload = JSON.parse(e.postData.contents);
    const rows = (payload.rows || []).map(r => {
      const d = Math.round(Number(r.distance_px));
      if (!Number.isFinite(d)) throw new Error('bad distance');
      return [
        r.timestamp ? new Date(r.timestamp) : new Date(),
        String(r.name || '').slice(0, 60),
        String(r.period || '').slice(0, 30),
        String(r.session || '').slice(0, 30),
        Number(r.round) || '',
        d,
        Math.abs(d),
        d > 0 ? 'right' : d < 0 ? 'left' : 'center',
        Number(r.speed) || '',
        Number(r.track_width) || '',
      ];
    });
    if (rows.length) {
      const sheet = getSheet_();
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
    }
    return json_({ ok: true, added: rows.length });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visiting the /exec URL in a browser just confirms it's running.
function doGet() {
  return json_({ ok: true, message: 'Center Line receiver is running.' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
