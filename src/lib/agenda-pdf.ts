import type { Appointment } from "./data/types";
import { formatDate, formatTimeRange } from "./format";

/**
 * Maakt een PDF van de agenda zonder externe bibliotheek. De PDF gebruikt de
 * standaardlettertypen Helvetica en Helvetica-Bold (WinAnsi-codering), die elke
 * PDF-lezer kent.
 */

const PAGE_WIDTH = 595.28; // A4 in punten
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;

const COLUMN_DATE = MARGIN;
const COLUMN_TIME = MARGIN + 150;
const COLUMN_TITLE = MARGIN + 220;
const TITLE_WIDTH = PAGE_WIDTH - MARGIN - COLUMN_TITLE;

/** Merkkleuren (RGB 0–1). */
const VIOLET = "0.357 0.216 0.667";
const NAVY = "0.106 0.141 0.255";
const MUTED = "0.42 0.44 0.52";
const LINE = "0.86 0.85 0.91";

type Font = "F1" | "F2";

/** Zet tekst om naar WinAnsi (één byte per teken) en escapet haakjes en backslashes. */
function encode(value: string): string {
  let out = "";
  for (const char of value.normalize("NFC")) {
    const code = char.codePointAt(0) ?? 63;
    let byte: number;
    if (code === 0x2013) byte = 0x96; // –
    else if (code === 0x2014) byte = 0x97; // —
    else if (code === 0x20ac) byte = 0x80; // €
    else if (code === 0x2018 || code === 0x2019) byte = 0x27;
    else if (code === 0x201c || code === 0x201d) byte = 0x22;
    else if (code === 0x2026) byte = 0x85; // …
    else if (code === 0x0a || code === 0x0d || code === 0x09) byte = 0x20;
    else if (code >= 0x20 && code <= 0x7e) byte = code;
    else if (code >= 0xa0 && code <= 0xff) byte = code;
    else byte = 0x3f; // ?
    const c = String.fromCharCode(byte);
    out += c === "(" || c === ")" || c === "\\" ? `\\${c}` : c;
  }
  return out;
}

/** Grove breedteschatting voor Helvetica; ruim genoeg om af te breken zonder uit te lopen. */
function textWidth(value: string, size: number, font: Font): number {
  return value.length * size * (font === "F2" ? 0.56 : 0.52);
}

function wrap(value: string, maxWidth: number, size: number, font: Font): string[] {
  const lines: string[] = [];
  for (const paragraph of value.split(/\r?\n/)) {
    let line = "";
    for (const word of paragraph.split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && textWidth(candidate, size, font) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }
  return lines.length > 0 ? lines : [""];
}

class Page {
  readonly ops: string[] = [];

  text(x: number, y: number, value: string, size: number, font: Font = "F1", color = NAVY) {
    this.ops.push(
      `BT /${font} ${size} Tf ${color} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (${encode(value)}) Tj ET`,
    );
  }

  rect(x: number, y: number, width: number, height: number, color: string) {
    this.ops.push(`${color} rg ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re f`);
  }

  line(y: number, color = LINE) {
    this.ops.push(`${color} RG 0.6 w ${MARGIN} ${y.toFixed(2)} m ${PAGE_WIDTH - MARGIN} ${y.toFixed(2)} l S`);
  }
}

function formatLongDate(isoDate: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}

export function buildAgendaPdf(appointments: Appointment[], today: string): Buffer {
  const pages: Page[] = [];
  let page: Page;
  let y: number;

  const startPage = (first: boolean) => {
    page = new Page();
    pages.push(page);
    if (first) {
      page.rect(0, PAGE_HEIGHT - 100, PAGE_WIDTH, 100, VIOLET);
      page.text(MARGIN, PAGE_HEIGHT - 55, "Agenda Soos in Kamperland", 22, "F2", "1 1 1");
      page.text(MARGIN, PAGE_HEIGHT - 76, `Afspraken en vergaderingen vanaf ${formatDate(today)}`, 11, "F1", "0.93 0.91 0.98");
      y = PAGE_HEIGHT - 135;
    } else {
      y = PAGE_HEIGHT - MARGIN;
    }
    page.text(COLUMN_DATE, y, "DATUM", 8, "F2", MUTED);
    page.text(COLUMN_TIME, y, "TIJD", 8, "F2", MUTED);
    page.text(COLUMN_TITLE, y, "AFSPRAAK", 8, "F2", MUTED);
    y -= 8;
    page.line(y, VIOLET);
    y -= 22;
  };

  startPage(true);

  if (appointments.length === 0) {
    page!.text(MARGIN, y!, "Er zijn geen geplande afspraken.", 12, "F1", MUTED);
  }

  let previousDate = "";
  for (const item of appointments) {
    const titleLines = wrap(item.title, TITLE_WIDTH, 11, "F2");
    const detailLines = [
      ...(item.location ? wrap(`Locatie: ${item.location}`, TITLE_WIDTH, 9, "F1") : []),
      ...(item.notes ? wrap(item.notes, TITLE_WIDTH, 9, "F1") : []),
    ];
    const height = titleLines.length * 14 + detailLines.length * 12 + 14;

    if (y! - height < MARGIN) startPage(false);

    if (item.date !== previousDate) {
      const [datePart, ...rest] = formatLongDate(item.date).split(" ");
      page!.text(COLUMN_DATE, y!, datePart, 10, "F2", VIOLET);
      page!.text(COLUMN_DATE, y! - 12, rest.join(" "), 9, "F1", NAVY);
      previousDate = item.date;
    }
    page!.text(COLUMN_TIME, y!, formatTimeRange(item.startTime, item.endTime) ?? "", 10, "F1", NAVY);

    let lineY = y!;
    for (const line of titleLines) {
      page!.text(COLUMN_TITLE, lineY, line, 11, "F2", NAVY);
      lineY -= 14;
    }
    for (const line of detailLines) {
      page!.text(COLUMN_TITLE, lineY + 2, line, 9, "F1", MUTED);
      lineY -= 12;
    }

    // Minimaal zo hoog als de datumkolom (twee regels).
    const rowBottom = Math.min(lineY, y! - 26) - 2;
    page!.line(rowBottom);
    y = rowBottom - 20;
  }

  // Voettekst met paginanummer op elke pagina.
  pages.forEach((p, index) => {
    p.text(MARGIN, 28, "Soos in Kamperland — interne agenda", 8, "F1", MUTED);
    const label = `Pagina ${index + 1} van ${pages.length}`;
    p.text(PAGE_WIDTH - MARGIN - textWidth(label, 8, "F1"), 28, label, 8, "F1", MUTED);
  });

  return serialize(pages);
}

/** Bouwt het PDF-bestand: kop, objecten, kruisverwijzingstabel en afsluiting. */
function serialize(pages: Page[]): Buffer {
  const objects: string[] = [];
  const add = (body: string) => objects.push(body);

  // 1 = catalogus, 2 = paginaboom, 3/4 = lettertypen, daarna per pagina (pagina, inhoud).
  const pageObjectNumbers = pages.map((_, i) => 5 + i * 2);
  add("<< /Type /Catalog /Pages 2 0 R >>");
  add(`<< /Type /Pages /Kids [${pageObjectNumbers.map((n) => `${n} 0 R`).join(" ")}] /Count ${pages.length} >>`);
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

  pages.forEach((p, i) => {
    const content = p.ops.join("\n");
    add(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
        `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + i * 2} 0 R >>`,
    );
    add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`);
  });

  let output = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(output.length);
    output += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = output.length;
  output += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) output += `${String(offset).padStart(10, "0")} 00000 n \n`;
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  // Elk teken is één byte (WinAnsi), dus latin1 geeft exact de juiste bytes.
  return Buffer.from(output, "latin1");
}
