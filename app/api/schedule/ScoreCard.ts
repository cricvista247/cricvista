import { GetHtml } from "@/lib/utils";

export type ScoreEntry = { team: string; run: string };
export type ScoreCardResult = {
  matchName: string | null;
  score: ScoreEntry[];
  result: string | null;
} | null;

export const ScoreCard = async (url: string): Promise<ScoreCardResult> => {
  try {
    if (!url) return null;

    const $ = await GetHtml(url);
    if (!$) return null;

    // --- MATCH NAME ---
    const matchNameRaw = $("h1").first().text() || "";
    const matchName = matchNameRaw.trim().replace(/\s+/g, " ") || null;

    // container for miniscore areas
    const container = $(
      "#miniscore-branding-container, #sticky-mscore, #sticky-mcomplete"
    ).first();

    // ---------------- RESULT / SESSION INFO ----------------
    const quickSelectors = [
      ".text-cbTxtLive",
      ".text-cbLive",
      ".text-cbTextLink",
      "#sticky-mscore .text-cbLive",
      "#sticky-mscore .text-cbTxtLive",
      "#sticky-mcomplete .text-cbTextLink",
    ];

    const candidatesSet = new Set<string>();
    const addCandidate = (t?: string | null) => {
      if (!t) return;
      const s = (t || "").replace(/\s+/g, " ").trim();
      if (!s) return;
      if (s.length > 200) return;
      candidatesSet.add(s);
    };

    // add quick selectors safely
    quickSelectors.forEach((sel) => {
      try {
        addCandidate($(sel).first().text());
      } catch {
        /* ignore selector errors */
      }
    });

    // scan container children for short result-like texts
    try {
      container.find("*").each((_, el) => {
        const txt = ($(el).text() || "").replace(/\s+/g, " ").trim();
        if (!txt) return;
        if (txt.length > 160) return;
        addCandidate(txt);
      });
    } catch {
      /* ignore DOM traversal errors */
    }

    addCandidate($(".bg-cbGrnCyn .text-cbTxtLive").first().text());
    addCandidate(container.find(".text-cbTxtLive").first().text());
    addCandidate(container.find(".text-cbTextLink").first().text());

    // body-wide fallback matches (ke defensive with length)
    const rawBody = ($("body").text() || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 20000);
    const bodyMatches = rawBody.match(
      /(Day\s*\d+\s*[:\-–][^\.]{1,120}|[A-Z][a-z]+ (?:need|needs|require|requires|required) [0-9]+ runs|[A-Za-z ]{1,30} (?:need|needs|required|require) [0-9]+|[A-Za-z ]{1,30} (?:won by|lost by|lead by|trail by|lead the match by|lead by))/gi
    );
    if (bodyMatches) bodyMatches.forEach((m) => addCandidate(m));

    const candidates = Array.from(candidatesSet)
      .map((s) => s.trim())
      .filter(Boolean);

    const priorityScore = (s: string) => {
      const lower = s.toLowerCase();
      if (/\bneed\s+[0-9]+\s+runs\b/i.test(lower)) return 100;
      if (/\breq[:\s]/i.test(s)) return 95;
      if (/\bwon by\b/i.test(lower)) return 90;
      if (/\blead by\b/i.test(lower)) return 85;
      if (/\btrail by\b/i.test(lower)) return 85;
      if (/\binnings\b/i.test(lower) && /\bwon by/i.test(lower)) return 92;
      if (/\bstumps\b/i.test(lower)) return 80;
      if (/\bday\s*\d+\b/i.test(lower)) return 80;
      if (/\bsession\b/i.test(lower)) return 70;
      if (/\btargets?\b/i.test(lower)) return 60;
      if (/\bpartnership\b/i.test(lower)) return 40;
      if (/\bcrr\b/i.test(lower) || /\bsreq\b/i.test(lower)) return 30;
      if (lower.length < 40) return 20;
      return 10;
    };

    let bestResult: string | null = null;
    if (candidates.length) {
      candidates.sort((a, b) => {
        const pa = priorityScore(a);
        const pb = priorityScore(b);
        if (pa !== pb) return pb - pa;
        return a.length - b.length;
      });
      bestResult = candidates[0];
    }

    if (!bestResult) {
      const stickyText =
        $("#sticky-mscore, #miniscore-branding-container").text() || "";
      const m = stickyText.match(
        /([A-Za-z ]{2,40}\s+(?:need|needs)\s+[0-9]+(?:\s*runs)?)/i
      );
      if (m) bestResult = m[1].trim();
    }

    const result = bestResult ? bestResult.replace(/\s+/g, " ").trim() : null;

    // ---------------- SCORE extraction ----------------
    const scoreCandidates: ScoreEntry[] = [];
    const normText = (t?: string) =>
      (t || "").toString().trim().replace(/\s+/g, " ");
    const normalizeRunText = (raw?: string) => {
      if (!raw) return "";
      return raw
        .toString()
        .replace(/\s*&\s*/g, " & ")
        .replace(/\band\b/gi, "&")
        .replace(/\s+/g, " ")
        .trim();
    };

    const runPattern =
      /^(?:[0-9]+(?:[\/\-\u2013][0-9]+)?(?:\s*\([0-9.]+\))?(?:\s*[dD])?)(?:\s*(?:&|\band\b)\s*[0-9]+(?:[\/\-\u2013][0-9]+)?(?:\s*\([0-9.]+\))?(?:\s*[dD])?)*$/i;

    const excludeSet = new Set([
      "CRR",
      "SR",
      "OVS",
      "OVERS",
      "P'SHIP",
      "PSHIP",
      "PARTNERSHIP",
      "LAST",
      "TOSS",
      "KEY",
      "RECENT",
    ]);

    // Primary strategy: look for short uppercase team tokens in the container
    try {
      (container.length ? container : $("body")).find("*").each((_, el) => {
        try {
          const $el = $(el);
          const text = normText($el.text());
          if (!text) return;
          if (/^[A-Z]{2,4}$/.test(text)) {
            const team = text.toUpperCase();
            if (scoreCandidates.some((s) => s.team === team)) return;

            let run: string | null = null;
            const parent = $el.parent();
            if (parent && parent.length) {
              const children = parent.children().toArray();
              let idx = -1;
              for (let k = 0; k < children.length; k++) {
                if (normText($(children[k]).text()) === team) {
                  idx = k;
                  break;
                }
              }
              if (idx === -1) {
                for (let k = 0; k < children.length; k++) {
                  if (normText($(children[k]).text()).includes(team)) {
                    idx = k;
                    break;
                  }
                }
              }
              if (idx >= 0) {
                const parts: string[] = [];
                for (let p = idx + 1; p < children.length; p++) {
                  const part = normText($(children[p]).text());
                  if (!part) continue;
                  if (/^[A-Z]{2,6}$/.test(part) && !/^[0-9]/.test(part)) break;
                  parts.push(part);
                }
                const joined = normalizeRunText(parts.join(" "));
                if (joined && runPattern.test(joined)) run = joined;
                else {
                  const numericParts: string[] = [];
                  for (let p = idx + 1; p < children.length; p++) {
                    const part = normText($(children[p]).text());
                    if (!part) continue;
                    if (/[0-9\&\(\)\/\-dD]/.test(part)) numericParts.push(part);
                    else break;
                  }
                  const combo = normalizeRunText(numericParts.join(" "));
                  if (combo && runPattern.test(combo)) run = combo;
                }
              }
            }

            if (!run) {
              let next = $el.next();
              const collected: string[] = [];
              for (
                let j = 0;
                j < 10 && next && next.length;
                j++, next = next.next()
              ) {
                const nt = normText(next.text());
                if (!nt) continue;
                if (/^[A-Z]{2,6}$/.test(nt) && !/^[0-9]/.test(nt)) break;
                collected.push(nt);
              }
              const candidate = normalizeRunText(collected.join(" "));
              if (candidate && runPattern.test(candidate)) run = candidate;
            }

            if (!run) {
              const big = normalizeRunText(
                normText(
                  (container.length ? container.text() : $("body").text()) || ""
                )
              );
              const rx = new RegExp(
                `${team.replace(
                  /[-/\\^$*+?.()|[\\]{}]/g,
                  "\\\\$&"
                )}[^A-Z0-9\\n]{0,10}([0-9][0-9\\s\\/\\-\\&\\(\\)\\.dD]+)`,
                "i"
              );
              const m = big.match(rx);
              if (m) {
                const candidate = normalizeRunText(m[1]);
                if (candidate && runPattern.test(candidate)) run = candidate;
              }
            }

            if (run && !excludeSet.has(team) && runPattern.test(run)) {
              scoreCandidates.push({ team, run });
            }
          }
        } catch {
          /* ignore per-element parse errors */
        }
      });
    } catch {
      /* ignore traversal errors */
    }

    // fallback scan if needed (global text search)
    if (scoreCandidates.length < 2) {
      try {
        const big = normalizeRunText(
          normText(
            (container.length ? container.text() : $("body").text()) || ""
          )
        );
        const multiRe = new RegExp(
          `([A-Z]{2,4})[^\\d\\n\\r]{0,8}([0-9][0-9\\s\\/\\-\\&\\(\\)\\.dD]+)`,
          "gi"
        );
        let gm;
        let guard = 0;
        while ((gm = multiRe.exec(big)) !== null && guard++ < 8) {
          const team = (gm[1] || "").toUpperCase();
          const runRaw = normalizeRunText(gm[2] || "");
          if (
            team &&
            !scoreCandidates.some((s) => s.team === team) &&
            /^[A-Z]{2,4}$/.test(team) &&
            runPattern.test(runRaw) &&
            !excludeSet.has(team)
          ) {
            scoreCandidates.push({ team, run: runRaw });
          }
          if (scoreCandidates.length >= 4) break;
        }
      } catch {
        /* ignore */
      }
    }

    const finalScore = scoreCandidates.slice(0, 2);

    return {
      matchName,
      score: finalScore,
      result,
    };
  } catch (error) {
    console.error(
      "ScoreCard unexpected error:",
      (error as any)?.message || error
    );
    return null;
  }
};
