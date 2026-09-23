const {
  useState,
  useMemo,
  useEffect,
  useRef
} = React;
const SUPABASE_URL = "https://bompuuzsjhpspxrhewyz.supabase.co";
const SUPABASE_KEY = "sb_publishable_WQIm73yEsXh8ecXctPqXXw_APerSrkS";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
function SearchIcon({
  size = 14,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    style: style
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  }));
}
function ChevronDownIcon({
  size = 14,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    style: style
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }));
}
function ExternalLinkIcon({
  size = 12,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    style: style
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "15 3 21 3 21 9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "14",
    x2: "21",
    y2: "3"
  }));
}
function XIcon({
  size = 13,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    style: style
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
}
const TIER_ORDER = ["Prime Window", "Live Window", "Late Window", "Closed", "Unscoped"];
const TIER_STYLE = {
  "Prime Window": {
    bar: "#C1592E",
    text: "#E9987A",
    label: "Prime Window — active pursuit"
  },
  "Live Window": {
    bar: "#B08D57",
    text: "#D9BE8C",
    label: "Live Window — warm pipeline"
  },
  "Late Window": {
    bar: "#4F7C90",
    text: "#9CC3D4",
    label: "Late Window — watching"
  },
  "Closed": {
    bar: "#4B4E53",
    text: "#9A9DA2",
    label: "Closed — closed or stale"
  },
  "Unscoped": {
    bar: "#7A6F8A",
    text: "#B8AEC7",
    label: "Unscoped — not enough info yet"
  }
};
function useCounts(items) {
  return useMemo(() => {
    const counts = {
      "Prime Window": 0,
      "Live Window": 0,
      "Late Window": 0,
      "Closed": 0,
      "Unscoped": 0
    };
    items.forEach(i => {
      if (counts[i.tier] !== undefined) counts[i.tier] += 1;
    });
    return counts;
  }, [items]);
}
function useCommodityBreakdown(items) {
  return useMemo(() => {
    const counts = {};
    items.forEach(i => {
      counts[i.commodity] = (counts[i.commodity] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [items]);
}
function useStateBreakdown(items) {
  return useMemo(() => {
    const counts = {};
    items.forEach(i => {
      if (!i.state) return;
      counts[i.state] = (counts[i.state] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [items]);
}
// Every opportunity-type tag currently in use, fixed defaults plus anything
// a user has typed in as a custom tag — so a custom tag one person adds
// becomes a real filter/toggle option for everyone else too.
function useAllOpportunityTypes(items) {
  return useMemo(() => {
    const seen = new Set(OPPORTUNITY_TYPES);
    items.forEach(i => {
      (i.opportunityTypes || []).forEach(t => {
        if (t && t.trim()) seen.add(t.trim());
      });
    });
    return Array.from(seen);
  }, [items]);
}
const COMMODITY_COLORS = ["#C1592E", "#B08D57", "#4F7C90", "#6B8F6B", "#8B6BAE", "#71767D"];
const STATE_COLORS = ["#4F7C90", "#C1592E", "#6B8F6B", "#B08D57", "#8B6BAE", "#71767D", "#D9BE8C", "#9CC3D4"];
function uniqueSorted(items, key) {
  return Array.from(new Set(items.map(i => i[key]).filter(Boolean))).sort();
}
function buildEmailDraft(item, senderName) {
  const opener = item.trigger ? `I saw the recent update on ${item.name} — ${item.trigger.toLowerCase()}.` : `I've been following ${item.name} and wanted to reach out.`;
  const middle = item.pathToWin ? ` ${item.pathToWin}` : ` We work with ${item.commodity.toLowerCase()} developers on early-stage NPI scope and design delivery, and thought it was worth connecting given where the project is at.`;
  const stageLine = item.stage && item.stage !== "Unclear" ? ` Given you're at the ${item.stage} stage,` : "";
  return `Hi,

${opener}${middle}${stageLine} I'd welcome a short call to introduce our team and hear more about your scope and timeline.

Would you have 15 minutes in the next couple of weeks?

Best regards,
${senderName || "[Your name]"}`;
}
function buildLinkedInDraft(item, senderName) {
  const base = `Hi — I noticed ${item.name}`;
  const context = item.trigger ? ` (${item.trigger.slice(0, 60)})` : "";
  return `${base}${context} and wanted to connect. I work on NPI and engineering delivery for mining projects in ${item.state}.`.slice(0, 300);
}
// A rough starter draft for outreach_queue rows whose contact was found
// manually (via the "Needs a contact"/"Needs a different contact"
// replacement form) rather than through the n8n queue builder's LLM
// drafting step -- those rows previously reached "Ready to review" with an
// empty draft_message and nothing ever filled it (2026-09-23, per Greg:
// "when it moves to ready for review, it no longer provides the outreach
// message for review"). Same 300-char LinkedIn connection-note limit used
// elsewhere in this app. Always editable afterwards in the normal textarea
// -- this is a starting point, not a final draft.
function buildOutreachQueueDraft(row) {
  const stageLine = row.stage ? ` at the ${row.stage} stage` : "";
  return `Hi — I noticed ${row.opportunity_name}${stageLine} and wanted to connect. I work on NPI and engineering delivery for mining and resources projects.`.slice(0, 300);
}
const GENERIC_CONTACT_PATTERNS = /\b(team|study|development|manager|group|department|tbd|unknown|n\/a|none|unclear|contact|committee|panel|commission|solutions|enquiries|council|authority|estate|program|programme)\b/i;
function extractPersonName(contact) {
  return (contact || "").split("(")[0].trim();
}
function isRealPersonName(contact) {
  const base = extractPersonName(contact);
  if (!base) return false;
  if (GENERIC_CONTACT_PATTERNS.test(base)) return false;
  const words = base.split(/\s+/);
  if (words.length < 2 || words.length > 4) return false;
  return true;
}
function linkedInSearchUrl(item) {
  const name = item.outreachContactName || (isRealPersonName(item.contact) ? extractPersonName(item.contact) : "");
  const company = item.company || item.name;
  const q = name ? `${name} ${company}` : `${company} Project Director OR Study Manager OR General Manager OR Procurement Manager`;
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}`;
}
function hasUsableContact(item) {
  return !!item.outreachContactName || isRealPersonName(item.contact);
}
function displayContactName(item) {
  return item.outreachContactName || item.contact || null;
}
function formatShortDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function formatAddedDate(createdAt) {
  const formatted = formatShortDate(createdAt);
  return formatted ? `Added ${formatted}` : "Added date unknown";
}
function formatUpdatedDate(updatedAt) {
  const formatted = formatShortDate(updatedAt);
  return formatted ? `Updated ${formatted}` : "Updated date unknown";
}
function daysAgo(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (24 * 60 * 60 * 1000));
}
function relativeDayLabel(dateStr, verb) {
  const days = daysAgo(dateStr);
  if (days === null) return null;
  if (days <= 0) return `${verb} today`;
  if (days === 1) return `${verb} yesterday`;
  return `${verb} ${days}d ago`;
}
// Shared "best placed to chase" scoring (formula from 2026-09-18; pulled into
// one place 2026-09-23). Owner Accessibility + NPI Potential combined is the
// primary key (easy-to-reach AND real engineering scope ranks top),
// multiplied up so it always dominates BD Score as the tie-break. Used by
// the main Pipeline view (effectiveItems, below), BD Report, and the
// Outreach Queue so all three agree on one order -- this formula used to be
// copy-pasted three times and had already drifted out of sync once (see the
// 2026-09-22 ranking-fix digest).
function chaseScoreFromParts(npiPotential, ownerAccessibility, bdScore) {
  const npiSub = {
    High: 20,
    Medium: 10,
    Low: 0
  }[npiPotential] ?? 5;
  const accessSub = {
    High: 10,
    Medium: 5,
    Low: 0
  }[ownerAccessibility] ?? 3;
  return (npiSub + accessSub) * 1000 + (Number(bdScore) || 0);
}
// Fetches npi_potential/owner_accessibility/bd_score for a set of item_ids
// and returns a { item_id: chaseScore } map, using the shared formula above.
// BD Report and the Outreach Queue both need this to rank outreach_queue
// rows against the same "best placed to chase" order as the main Pipeline
// view.
async function fetchChaseScoreByItemId(itemIds) {
  if (!itemIds || !itemIds.length) return {};
  const {
    data,
    error
  } = await supabaseClient.from("opportunities").select("item_id, npi_potential, owner_accessibility, bd_score").in("item_id", itemIds);
  if (error || !data) return {};
  const byItem = {};
  for (const o of data) {
    byItem[o.item_id] = chaseScoreFromParts(o.npi_potential, o.owner_accessibility, o.bd_score);
  }
  return byItem;
}
function companyLinkedInSearchUrl(item) {
  const company = item.company || item.name;
  return `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(company)}`;
}
function companyWebsiteSearchUrl(item) {
  const company = item.company || item.name;
  return `https://www.google.com/search?q=${encodeURIComponent(`${company} official website`)}`;
}
function StrataBar({
  counts,
  total
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      width: "100%",
      height: "34px",
      borderRadius: "3px",
      overflow: "hidden",
      background: "#20242A",
      border: "1px solid #2C3138"
    }
  }, TIER_ORDER.map(tier => {
    const pct = total ? counts[tier] / total * 100 : 0;
    return /*#__PURE__*/React.createElement("div", {
      key: tier,
      title: `${tier}: ${counts[tier]}`,
      style: {
        width: mounted ? `${pct}%` : "0%",
        background: TIER_STYLE[tier].bar,
        transition: "width 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        borderRight: "1px solid rgba(20,23,27,0.5)"
      }
    });
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "22px",
      marginTop: "14px"
    }
  }, TIER_ORDER.map(tier => /*#__PURE__*/React.createElement("div", {
    key: tier,
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "9px",
      height: "9px",
      borderRadius: "2px",
      background: TIER_STYLE[tier].bar,
      display: "inline-block",
      marginRight: "2px"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'IBM Plex Mono', monospace",
      color: "#EDE9E1",
      fontSize: "15px"
    }
  }, counts[tier]), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8B9198",
      fontSize: "13px"
    }
  }, TIER_STYLE[tier].label)))));
}
function CommodityStrip({
  breakdown,
  total,
  colors,
  activeValue,
  onSelect
}) {
  const max = breakdown.length ? breakdown[0][1] : 1;
  const palette = colors || COMMODITY_COLORS;
  const clickable = typeof onSelect === "function";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "22px",
      display: "flex",
      flexWrap: "wrap",
      gap: "18px 28px"
    }
  }, breakdown.map(([name, count], idx) => {
    const active = activeValue === name;
    return /*#__PURE__*/React.createElement("div", {
      key: name,
      onClick: clickable ? () => onSelect(active ? "" : name) : undefined,
      title: clickable ? `Filter to ${name}` : undefined,
      style: {
        minWidth: "90px",
        cursor: clickable ? "pointer" : "default",
        padding: clickable ? "4px 6px" : 0,
        margin: clickable ? "-4px -6px" : 0,
        borderRadius: "4px",
        border: active ? "1px solid #C1592E" : "1px solid transparent",
        background: active ? "rgba(193,89,46,0.08)" : "transparent"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "5px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: active ? "#E9987A" : "#9A9DA2",
        fontSize: "12px"
      }
    }, name), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#5E6268",
        fontSize: "12px",
        fontFamily: "'IBM Plex Mono', monospace"
      }
    }, count)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: "90px",
        height: "4px",
        background: "#20242A",
        borderRadius: "2px",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${count / max * 100}%`,
        height: "100%",
        background: palette[idx % palette.length],
        borderRadius: "2px"
      }
    })));
  }));
}
function MiniRow({
  item
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 14px",
      borderTop: "1px solid #23272D"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#EDE9E1",
      fontSize: "13.5px",
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12px",
      marginTop: "2px"
    }
  }, item.company || "Company unknown", " · ", item.commodity, " · ", item.state)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', monospace",
      color: item.score >= 35 ? "#E9987A" : "#B7BBC1",
      fontSize: "13.5px",
      flexShrink: 0,
      marginLeft: "12px"
    }
  }, item.score));
}
function ReviewSection({
  title,
  description,
  items,
  emptyText
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "36px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 4px 0"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "12px"
    }
  }, description), items.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "13px",
      padding: "14px 0"
    }
  }, emptyText) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      overflow: "hidden"
    }
  }, items.map((item, idx) => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    style: {
      borderTop: idx === 0 ? "none" : undefined
    }
  }, /*#__PURE__*/React.createElement(MiniRow, {
    item: item
  })))));
}
// Ingest-refresh trigger (2026-09-21, per Greg): fires the same daily
// MINEDEX/EPA WA/Mining.com scrape + scoring pass the Schedule Trigger runs,
// on demand. Webhook is wired to the exact same 3 downstream nodes the
// Schedule Trigger fans out to in n8n, so this is not a separate/lesser
// path - it's the real ingest run, just triggered manually instead of by
// the clock. New opportunities land in `opportunities` automatically on
// their own daily schedule already; this is for "check right now" rather
// than a requirement to see new ones at all.
const INGEST_REFRESH_WEBHOOK_URL = "https://newcomb.app.n8n.cloud/webhook/ingest-refresh";
const INGEST_REFRESH_KEY = "U8mSNyORLVXt3l-edDAfV57ls46LMB6y";
// Monday-start week boundary, same convention outreach_queue.batch_week
// already uses elsewhere in this app -- keeps "which week is this" answered
// consistently across features.
function mondayOf(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + diff);
}
// New-opportunities-per-week chart (2026-09-23, per Greg, replacing the old
// "Pipeline over time" daily tier-count chart when Week in Focus was
// removed): "a chart that shows new opps totaled each week." Buckets
// directly from live opportunity data (createdAt), not from
// pipeline_snapshots -- that table only tracks a daily running total, which
// can't distinguish "genuinely new this week" from net changes (removals,
// corrections), so it's the wrong source for this question. Also carries
// the manual ingest-refresh trigger the old chart had, since nothing else
// in the app exposes it.
function NewOpportunitiesTrend({
  items,
  canEdit
}) {
  const [refreshStatus, setRefreshStatus] = useState("idle");
  const triggerRefresh = async () => {
    setRefreshStatus("starting");
    try {
      const resp = await fetch(INGEST_REFRESH_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "x-refresh-key": INGEST_REFRESH_KEY
        }
      });
      if (!resp.ok) throw new Error("bad status " + resp.status);
      setRefreshStatus("started");
    } catch (e) {
      setRefreshStatus("error");
    }
  };
  const refreshLabel = refreshStatus === "starting" ? "Starting…" : refreshStatus === "started" ? "Started — check back in ~30-60 min" : refreshStatus === "error" ? "Couldn't start, try again" : "Refresh opportunities now";
  const refreshDisabled = refreshStatus === "starting" || refreshStatus === "started";
  const refreshButton = canEdit && /*#__PURE__*/React.createElement("button", {
    onClick: triggerRefresh,
    disabled: refreshDisabled,
    style: {
      background: "none",
      border: "1px solid #C1592E",
      color: refreshStatus === "started" ? "#7C9A5B" : refreshStatus === "starting" ? "#5E6268" : "#C1592E",
      borderRadius: "4px",
      fontSize: "12px",
      padding: "5px 10px",
      cursor: refreshDisabled ? "default" : "pointer"
    }
  }, refreshLabel);
  const WEEKS = 10;
  const thisMonday = mondayOf(new Date());
  const buckets = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    buckets.push({
      weekStart: new Date(thisMonday.getFullYear(), thisMonday.getMonth(), thisMonday.getDate() - i * 7),
      count: 0
    });
  }
  (items || []).forEach(item => {
    if (!item.createdAt) return;
    const d = new Date(item.createdAt);
    if (isNaN(d.getTime())) return;
    const wk = mondayOf(d).getTime();
    const bucket = buckets.find(b => b.weekStart.getTime() === wk);
    if (bucket) bucket.count++;
  });
  const max = Math.max(...buckets.map(b => b.count), 1);
  const weekLabel = d => d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "36px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "4px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: 0
    }
  }, "New opportunities per week"), refreshButton), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "14px"
    }
  }, "New opportunities landing in the pipeline, by week (Monday to Sunday). Ingested automatically once a day from MINEDEX, EPA WA and Mining.com — \"Refresh opportunities now\" runs that same pass on demand rather than waiting for the clock."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: "6px",
      height: "70px"
    }
  }, buckets.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.weekStart.toISOString(),
    title: `Week of ${weekLabel(b.weekStart)}: ${b.count} new`,
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
      height: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: "28px",
      height: `${b.count / max * 100}%`,
      background: "#4F7C90",
      borderRadius: "2px 2px 0 0",
      minHeight: "2px"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "6px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11px"
    }
  }, weekLabel(buckets[0].weekStart)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11px"
    }
  }, weekLabel(buckets[buckets.length - 1].weekStart))));
}
// BD Report (2026-09-21, per Greg): a status report on outreach itself —
// who's been contacted, who's connected, who's replied, who said yes to a
// meeting, who's still pending, who's queued to go out next. Reads straight
// from outreach_queue; each row already carries its own
// opportunity_name/company/contact fields so no join against `opportunities`
// is needed, same as the Outreach Queue tab. As of 2026-09-23 this page also
// carries the "New opportunities per week" chart and "New this week" list
// (moved here from the removed "Week in Focus" tab, per Greg) -- those two
// read `items` directly rather than outreach_queue.
function ReportStat({
  label,
  value,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: "110px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "24px",
      color: color || "#EDE9E1"
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12px",
      marginTop: "2px"
    }
  }, label));
}
function MeetingDateForm({
  onSave
}) {
  const [date, setDate] = useState("");
  const [saved, setSaved] = useState(false);
  if (saved) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#7C9A5B",
        fontSize: "11.5px"
      }
    }, "Meeting booked ✓");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: date,
    onChange: e => setDate(e.target.value),
    style: {
      background: "#1B1E23",
      border: "1px solid #23272D",
      color: "#EDE9E1",
      fontSize: "11.5px",
      borderRadius: "3px",
      padding: "2px 5px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    disabled: !date,
    onClick: () => {
      onSave(date);
      setSaved(true);
    },
    style: {
      background: "none",
      border: "1px solid #7C9A5B",
      color: date ? "#7C9A5B" : "#3A3D42",
      borderRadius: "3px",
      fontSize: "11px",
      padding: "2px 8px",
      cursor: date ? "pointer" : "default"
    }
  }, "Meeting booked"));
}
// Email-verification gate (2026-09-21, per Greg): LinkedIn sometimes refuses
// a connection request unless the sender supplies an email it can match to
// the contact. Separate from whether the contact is even the right person
// (that's contact_rejected/"Not the right contact") - this is purely about
// unblocking a send to a contact Greg already wants to reach.
function EmailBlockControl({
  row,
  canEdit,
  onToggle,
  onSaveEmail
}) {
  const [email, setEmail] = useState(row.contact_email || "");
  const [saved, setSaved] = useState(false);
  if (!row.needs_email) {
    return canEdit ? /*#__PURE__*/React.createElement("button", {
      onClick: () => onToggle(row, true),
      style: {
        background: "none",
        border: "none",
        color: "#5E6268",
        fontSize: "11px",
        cursor: "pointer",
        padding: 0,
        marginTop: "6px",
        textDecoration: "underline"
      }
    }, "Flag as needing an email to connect") : null;
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      padding: "8px 10px",
      background: "#241D16",
      border: "1px solid #4A3A1F",
      borderRadius: "3px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#D8A657",
      fontSize: "11.5px",
      fontWeight: 600,
      marginBottom: "6px"
    }
  }, "⚠ Needs an email to connect on LinkedIn"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "email@company.com",
    value: email,
    disabled: !canEdit,
    onChange: e => {
      setEmail(e.target.value);
      setSaved(false);
    },
    style: {
      flex: "1 1 180px",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12px",
      padding: "5px 8px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    disabled: !canEdit || !email.trim(),
    onClick: () => {
      onSaveEmail(row, email.trim());
      setSaved(true);
    },
    style: {
      background: "#2E4B3B",
      border: "1px solid #3F6350",
      color: "#C9E8D4",
      borderRadius: "3px",
      fontSize: "11.5px",
      padding: "5px 10px",
      cursor: canEdit ? "pointer" : "default"
    }
  }, saved ? "Saved ✓" : "Save email"), canEdit && /*#__PURE__*/React.createElement("button", {
    onClick: () => onToggle(row, false),
    style: {
      background: "none",
      border: "none",
      color: "#71767D",
      fontSize: "11px",
      cursor: "pointer",
      textDecoration: "underline"
    }
  }, "Mark resolved")));
}
// Surfaces unacknowledged n8n production-workflow failures (Outreach Queue
// Builder / main ingest pipeline) so a silent error can't hide again --
// built 2026-09-22 after the "nothing lined up for outreach" incident, where
// 3 real refill runs failed silently on depleted n8n Gateway LLM credits and
// there was no way to know except the queue never filling. Rows land in
// Supabase workflow_errors via the shared "BD Platform Error Notifier" n8n
// workflow, wired as the errorWorkflow on both production workflows.
function WorkflowErrorBanner({
  errors,
  canEdit,
  onAcknowledge
}) {
  if (!errors || errors.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "20px",
      border: "1px solid #5C2A2A",
      background: "#241616",
      borderRadius: "4px",
      overflow: "hidden"
    }
  }, errors.map((err, i) => /*#__PURE__*/React.createElement("div", {
    key: err.id,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "12px",
      padding: "10px 14px",
      borderTop: i === 0 ? "none" : "1px solid #3A2020"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "1 1 auto",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#E9987A",
      fontSize: "12.5px",
      fontWeight: 600
    }
  }, `⚠ ${err.workflow_name || "Workflow"} failed`, err.node_name ? ` — ${err.node_name}` : "", err.occurred_at ? ` · ${new Date(err.occurred_at).toLocaleString()}` : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#C9A9A0",
      fontSize: "11.5px",
      marginTop: "3px",
      fontFamily: "'IBM Plex Mono', monospace",
      wordBreak: "break-word"
    }
  }, err.error_message)), canEdit ? /*#__PURE__*/React.createElement("button", {
    onClick: () => onAcknowledge(err.id),
    style: {
      background: "none",
      border: "1px solid #5C2A2A",
      color: "#E9987A",
      borderRadius: "3px",
      fontSize: "11px",
      padding: "4px 10px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      flexShrink: 0
    }
  }, "Dismiss") : null)));
}
// Manual "I already know who the right contact is" replacement, alongside
// the live find-someone-else trigger for when Greg doesn't (2026-09-21).
function ReplacementContactForm({
  row,
  canEdit,
  onSave
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [saved, setSaved] = useState(false);
  if (saved) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#7C9A5B",
        fontSize: "11.5px"
      }
    }, "Replacement saved — back in Ready to review ✓");
  }
  const inputStyle = {
    background: "#1D2126",
    border: "1px solid #2C3138",
    borderRadius: "3px",
    color: "#EDE9E1",
    fontSize: "12px",
    padding: "5px 8px",
    flex: "1 1 140px"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "New contact name",
    value: name,
    disabled: !canEdit,
    onChange: e => setName(e.target.value),
    style: inputStyle
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Role (optional)",
    value: role,
    disabled: !canEdit,
    onChange: e => setRole(e.target.value),
    style: inputStyle
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "LinkedIn profile URL (optional)",
    value: linkedin,
    disabled: !canEdit,
    onChange: e => setLinkedin(e.target.value),
    style: Object.assign({}, inputStyle, {
      flex: "1 1 auto"
    })
  }), /*#__PURE__*/React.createElement("button", {
    disabled: !canEdit || !name.trim(),
    onClick: () => {
      onSave(row, name.trim(), role.trim(), linkedin.trim());
      setSaved(true);
    },
    style: {
      alignSelf: "flex-start",
      background: "#2E4B3B",
      border: "1px solid #3F6350",
      color: "#C9E8D4",
      borderRadius: "3px",
      fontSize: "12px",
      padding: "5px 12px",
      cursor: canEdit ? "pointer" : "default"
    }
  }, "Save replacement"));
}
// Fixed list rather than free text so skips are actually aggregable later
// (2026-09-23, per Greg: skip reasons "should have a feedback loop which
// feeds into how we score and chase certain projects" -- e.g. if
// NPI-High-scored opportunities keep getting skipped as "not real
// engineering scope", that's a signal the classifier needs recalibrating).
// This only captures the category + an optional note today; nothing reads
// it back into scoring yet -- that's a separate, deliberately-deferred
// piece of work since it needs its own design (see the project brief).
const SKIP_REASON_CATEGORIES = ["Not real engineering/NPI scope", "Too small / early stage", "Wrong location or commodity focus", "Owner not accessible / no realistic entry point", "Competitor or incumbent already engaged", "Other"];
function SkipWithReasonControl({
  row,
  canEdit,
  onConfirm
}) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  if (done) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#5E6268",
        fontSize: "11.5px"
      }
    }, "Skipped ✓");
  }
  if (!open) {
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => setOpen(true),
      disabled: !canEdit,
      style: {
        background: "none",
        border: "none",
        color: "#5E6268",
        cursor: canEdit ? "pointer" : "default",
        fontSize: "12.5px"
      }
    }, "Skip");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      maxWidth: "420px"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: category,
    disabled: !canEdit,
    onChange: e => setCategory(e.target.value),
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: category ? "#EDE9E1" : "#71767D",
      fontSize: "12px",
      padding: "5px 8px"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Why are you skipping this one?"), SKIP_REASON_CATEGORIES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c
  }, c))), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: "Add a note (optional)",
    value: note,
    disabled: !canEdit,
    onChange: e => setNote(e.target.value),
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12px",
      padding: "5px 8px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    disabled: !canEdit || !category,
    onClick: () => {
      onConfirm(row, category, note.trim());
      setDone(true);
    },
    style: {
      background: "none",
      border: "1px solid #5C2A2A",
      color: "#E9987A",
      borderRadius: "3px",
      fontSize: "12px",
      padding: "5px 12px",
      cursor: canEdit && category ? "pointer" : "default"
    }
  }, "Confirm skip"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(false),
    style: {
      background: "none",
      border: "none",
      color: "#5E6268",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "Cancel")));
}
function ReportContactRow({
  row,
  onOpenItem,
  flag,
  canEdit,
  actionsFn
}) {
  const timeLabel = relativeDayLabel(outreachLastActivity(row), "Updated");
  const action = canEdit && actionsFn ? actionsFn(row) : null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "12px",
      padding: "12px 14px",
      borderTop: "1px solid #23272D"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => onOpenItem(row.item_id),
    style: {
      color: "#9CC3D4",
      cursor: "pointer",
      fontSize: "13.5px",
      fontWeight: 500
    }
  }, row.opportunity_name || "Unknown opportunity"), flag && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#D8A657",
      fontSize: "10.5px",
      border: "1px solid #D8A657",
      borderRadius: "3px",
      padding: "1px 5px"
    }
  }, flag), row.meeting_date && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#7C9A5B",
      fontSize: "10.5px",
      border: "1px solid #7C9A5B",
      borderRadius: "3px",
      padding: "1px 5px"
    }
  }, "Meeting: ", formatShortDate(row.meeting_date)), row.status === "ready_to_send" && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#C1592E",
      fontSize: "10.5px",
      border: "1px solid #C1592E",
      borderRadius: "3px",
      padding: "1px 5px"
    }
  }, "Ready to send")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12px",
      marginTop: "3px"
    }
  }, row.company || "Company unknown"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#9A9DA2",
      fontSize: "12.5px",
      marginTop: "4px"
    }
  }, row.contact_name || "Unnamed contact", row.contact_role ? ` · ${row.contact_role}` : "", row.contact_linkedin_url && /*#__PURE__*/React.createElement("a", {
    href: row.contact_linkedin_url,
    target: "_blank",
    rel: "noreferrer",
    onClick: e => e.stopPropagation(),
    style: {
      color: "#7A93B0",
      marginLeft: "8px",
      fontSize: "12px"
    }
  }, "LinkedIn ↗")), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px"
    }
  }, action)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11.5px",
      flexShrink: 0,
      whiteSpace: "nowrap",
      fontFamily: "'IBM Plex Mono', monospace"
    }
  }, timeLabel || ""));
}
function ReportSection({
  title,
  description,
  rows,
  emptyText,
  onOpenItem,
  accentColor,
  flagFn,
  canEdit,
  actionsFn
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "36px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: accentColor || "#EDE9E1",
      margin: "0 0 4px 0"
    }
  }, title, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "14px",
      fontWeight: 400,
      marginLeft: "8px"
    }
  }, rows.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "12px"
    }
  }, description), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "13px",
      padding: "14px 0"
    }
  }, emptyText) : /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      overflow: "hidden"
    }
  }, rows.map(r => /*#__PURE__*/React.createElement(ReportContactRow, {
    key: r.id,
    row: r,
    onOpenItem: onOpenItem,
    flag: flagFn ? flagFn(r) : null,
    canEdit: canEdit,
    actionsFn: actionsFn
  }))));
}
function NextUpSection({
  rows,
  onOpenItem,
  onTrigger,
  triggerStatus,
  onStartOutreach,
  startOutreachStatus,
  startOutreachCount,
  readyToSendCount,
  openInClaudeUrl,
  canEdit,
  actionsFn
}) {
  const btnLabel = triggerStatus === "starting" ? "Starting…" : triggerStatus === "started" ? "Started — check back in ~30-60 min" : triggerStatus === "error" ? "Couldn't start, try again" : "Find more candidates";
  const startLabel = startOutreachStatus === "flagging" ? "Flagging…" : startOutreachStatus === "flagged" ? `Flagged ${startOutreachCount} for sending ✓` : startOutreachStatus === "error" ? "Couldn't flag, try again" : startOutreachStatus === "none" ? "Nothing ready to flag" : "Start outreach";
  const startDisabled = startOutreachStatus === "flagging" || startOutreachStatus === "flagged" || startOutreachStatus === "none";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "36px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "4px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#C1592E",
      margin: 0
    }
  }, "Next up this week", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "14px",
      fontWeight: 400,
      marginLeft: "8px"
    }
  }, rows.length)), canEdit && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onStartOutreach,
    disabled: startDisabled,
    style: {
      background: "none",
      border: "1px solid #6B8F6B",
      color: startOutreachStatus === "flagged" ? "#7C9A5B" : startOutreachStatus === "flagging" || startOutreachStatus === "none" ? "#5E6268" : "#6B8F6B",
      borderRadius: "4px",
      fontSize: "12px",
      padding: "5px 10px",
      cursor: startDisabled ? "default" : "pointer"
    }
  }, startLabel), /*#__PURE__*/React.createElement("button", {
    onClick: onTrigger,
    disabled: triggerStatus === "starting" || triggerStatus === "started",
    style: {
      background: "none",
      border: "1px solid #C1592E",
      color: triggerStatus === "started" ? "#7C9A5B" : triggerStatus === "starting" ? "#5E6268" : "#C1592E",
      borderRadius: "4px",
      fontSize: "12px",
      padding: "5px 10px",
      cursor: triggerStatus === "starting" || triggerStatus === "started" ? "default" : "pointer"
    }
  }, btnLabel), readyToSendCount > 0 && /*#__PURE__*/React.createElement("a", {
    href: openInClaudeUrl,
    style: {
      background: "none",
      border: "1px solid #9CC3D4",
      color: "#9CC3D4",
      borderRadius: "4px",
      fontSize: "12px",
      padding: "5px 10px",
      textDecoration: "none",
      display: "inline-block"
    }
  }, `Open in Claude to send (${readyToSendCount}) ↗`))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "12px"
    }
  }, "Top of the queue by chase priority (easiest to reach + best engineering fit first), across everything not yet sent — found, queued, and approved. \"Start outreach\" flags the ones below with a usable LinkedIn profile as ready — nothing gets sent by itself (LinkedIn has no send API); \"Open in Claude to send\" opens a Claude chat (desktop app required) with the request pre-filled, so you just review and hit send there and I'll do the live LinkedIn pass with you. \"Find more candidates\" runs a fresh pass over the board for new fits (drafts only — new ones land in \"Found, awaiting your review\" below); it usually takes 30-60 minutes."), rows.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "13px",
      padding: "14px 0"
    }
  }, "Nothing queued right now.") : /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      overflow: "hidden"
    }
  }, rows.map(r => /*#__PURE__*/React.createElement(ReportContactRow, {
    key: r.id,
    row: r,
    onOpenItem: onOpenItem,
    canEdit: canEdit,
    actionsFn: actionsFn
  }))));
}
// Webhook that fires the "Outreach Queue Builder" n8n workflow (added
// 2026-09-21, per Greg explicitly choosing this over the alternatives when
// asked). Gated by a shared-secret header the webhook checks via its own
// onlyRunIf option (wrong/missing key -> silent 200, no execution, no
// OpenAI/Monday cost) -- not real secrecy since this file is public, but
// stops the URL being trivially hammered if found. CORS is locked to this
// dashboard's real origin on the n8n side. A full run is a 30-60 minute LLM
// triage pass over the whole board, so this fires-and-forgets (webhook
// responds immediately) rather than waiting for completion.
const OUTREACH_REFILL_WEBHOOK_URL = "https://newcomb.app.n8n.cloud/webhook/outreach-refill";
const OUTREACH_REFILL_KEY = "GY9ur4YbV2c4jt9WibHIDBGGKEXt_-8r";
function BdReportPage({
  items,
  onOpenItem,
  canEdit
}) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  const [chaseByItem, setChaseByItem] = useState({});
  const [triggerStatus, setTriggerStatus] = useState("idle");
  const [startOutreachStatus, setStartOutreachStatus] = useState("idle");
  const [startOutreachCount, setStartOutreachCount] = useState(0);
  useEffect(() => {
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("outreach_queue").select("*").order("queued_at", {
        ascending: false
      });
      if (error) {
        setError("Couldn't load the BD report.");
        return;
      }
      // scope_relevant === false rows were queued then ruled out as not a real
      // fit - noise for this report, not a live part of the pipeline.
      const scoped = (data || []).filter(r => r.scope_relevant !== false);
      setRows(scoped);
      // Same "best placed to chase" ranking as the Outreach Queue tab / main
      // Pipeline view (Owner Accessibility + NPI Potential combined, BD score
      // as tie-break) so "Next up this week" agrees with the numbers Greg
      // already trusts elsewhere rather than inventing a new order.
      const itemIds = Array.from(new Set(scoped.map(r => r.item_id).filter(Boolean)));
      if (itemIds.length) {
        setChaseByItem(await fetchChaseScoreByItemId(itemIds));
      }
    }
    load();
  }, []);
  const updateRow = async (id, patch) => {
    setRows(prev => prev ? prev.map(r => r.id === id ? {
      ...r,
      ...patch
    } : r) : prev);
    await supabaseClient.from("outreach_queue").update(patch).eq("id", id);
  };
  const markConnected = row => updateRow(row.id, {
    status: "connected"
  });
  const markMeetingBooked = (row, dateStr) => updateRow(row.id, {
    status: "meeting_booked",
    meeting_date: dateStr
  });
  // Manual override for "Next up this week" (2026-09-23, per Greg: a row
  // stayed stuck showing "Ready to send" after he'd already reached out
  // outside the normal flow -- already connected with the contact, so he
  // sent a message via LinkedIn chat rather than a connect request). Same
  // target status/timestamp the Outreach tab's equivalent override uses:
  // message_sent, which is "awaiting a reply" rather than "awaiting a
  // connection accept" -- the state this situation actually describes.
  const markAlreadySent = row => updateRow(row.id, {
    status: "message_sent",
    message_sent_at: row.message_sent_at || new Date().toISOString()
  });
  const nextUpActions = row => /*#__PURE__*/React.createElement("button", {
    onClick: () => markAlreadySent(row),
    style: {
      background: "none",
      border: "1px solid #4F7C90",
      color: "#9CC3D4",
      borderRadius: "3px",
      fontSize: "11px",
      padding: "2px 8px",
      cursor: "pointer"
    }
  }, "Already reached out");
  const triggerRefill = async () => {
    setTriggerStatus("starting");
    try {
      const resp = await fetch(OUTREACH_REFILL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "x-outreach-key": OUTREACH_REFILL_KEY
        }
      });
      if (!resp.ok) throw new Error("bad status " + resp.status);
      setTriggerStatus("started");
    } catch (e) {
      setTriggerStatus("error");
    }
  };
  if (error) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#C1592E",
        fontSize: "14px"
      }
    }, error);
  }
  if (rows === null) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#71767D",
        fontSize: "14px"
      }
    }, "Loading report…");
  }
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  // "New this week" (moved here from the removed Week in Focus tab, per
  // Greg, 2026-09-23) - reads straight from `items` (opportunities), not
  // outreach_queue, since these are brand-new project records that may not
  // have an outreach_queue row yet at all.
  const newThisWeek = (items || []).filter(i => i.createdAt && new Date(i.createdAt) >= weekAgo);
  const meetingBooked = rows.filter(r => r.status === "meeting_booked").sort((a, b) => new Date(outreachLastActivity(b) || 0) - new Date(outreachLastActivity(a) || 0));
  const replied = rows.filter(r => r.status === "replied").sort((a, b) => new Date(outreachLastActivity(b) || 0) - new Date(outreachLastActivity(a) || 0));
  // Oldest activity first - these are the ones due a follow-up touch soonest.
  const connected = rows.filter(r => r.status === "connected").sort((a, b) => new Date(outreachLastActivity(a) || 0) - new Date(outreachLastActivity(b) || 0));
  const pending = rows.filter(r => ["connect_sent", "message_sent"].includes(r.status)).sort((a, b) => new Date(outreachLastActivity(b) || 0) - new Date(outreachLastActivity(a) || 0));
  const queued = rows.filter(r => ["approved", "ready_to_send"].includes(r.status)).sort((a, b) => new Date(outreachLastActivity(b) || 0) - new Date(outreachLastActivity(a) || 0));
  const awaitingReview = rows.filter(r => ["pending_review", "needs_profile"].includes(r.status)).sort((a, b) => new Date(outreachLastActivity(b) || 0) - new Date(outreachLastActivity(a) || 0));
  const needsContactReport = rows.filter(r => r.status === "needs_contact").sort((a, b) => new Date(outreachLastActivity(b) || 0) - new Date(outreachLastActivity(a) || 0));
  const declined = rows.filter(r => r.status === "declined");
  const sentThisWeek = rows.filter(r => r.connect_sent_at && new Date(r.connect_sent_at) >= weekAgo).length;
  const queuedThisWeek = rows.filter(r => r.queued_at && new Date(r.queued_at) >= weekAgo).length;
  const flagStaleConnection = r => daysAgo(outreachLastActivity(r)) >= 14 ? "Follow up" : null;
  // "Next up this week" - everything not yet sent (found, queued, approved),
  // ranked by chase priority rather than split by status, so this answers
  // "who are we targeting next" as one prioritized list. Capped at 15 (middle
  // of the 10-20 range Greg asked for).
  const nextUpPool = rows.filter(r => ["approved", "ready_to_send", "pending_review", "needs_profile"].includes(r.status) && !r.contact_rejected);
  const nextUp = [...nextUpPool].sort((a, b) => {
    const ca = chaseByItem[a.item_id] ?? -1;
    const cb = chaseByItem[b.item_id] ?? -1;
    if (cb !== ca) return cb - ca;
    return new Date(b.queued_at || 0) - new Date(a.queued_at || 0);
  }).slice(0, 15);
  const pendingActions = row => /*#__PURE__*/React.createElement("button", {
    onClick: () => markConnected(row),
    style: {
      background: "none",
      border: "1px solid #6B8F6B",
      color: "#6B8F6B",
      borderRadius: "3px",
      fontSize: "11px",
      padding: "2px 8px",
      cursor: "pointer"
    }
  }, "Mark connected");
  const meetingActions = row => /*#__PURE__*/React.createElement(MeetingDateForm, {
    onSave: dateStr => markMeetingBooked(row, dateStr)
  });
  // "Start outreach" (2026-09-21, per Greg): flags the sendable rows in
  // "Next up this week" so the actual send happens in a live session with
  // him watching, rather than pretending a button can make LinkedIn
  // connection requests fire by itself (there's no API for that, and
  // scripting it directly would risk his account). Only flags rows that
  // genuinely have a usable profile to send to (excludes needs_profile);
  // reuses the outreach_queue.status = 'ready_to_send' value that already
  // existed in the schema rather than inventing new state, and prepared_at
  // as the flagged-at timestamp (same field the Outreach tab already uses
  // for "prepared"). A future session should check for ready_to_send rows
  // at the start of any outreach-related work on this project - that is
  // Greg's signal he wants a live sending pass.
  const startOutreach = async () => {
    const eligible = nextUp.filter(r => ["approved", "pending_review"].includes(r.status) && r.contact_linkedin_url);
    if (!eligible.length) {
      setStartOutreachStatus("none");
      return;
    }
    setStartOutreachStatus("flagging");
    try {
      const now = new Date().toISOString();
      await Promise.all(eligible.map(r => updateRow(r.id, {
        status: "ready_to_send",
        prepared_at: now
      })));
      setStartOutreachCount(eligible.length);
      setStartOutreachStatus("flagged");
    } catch (e) {
      setStartOutreachStatus("error");
    }
  };
  // Persisted count, not tied to this session's own button click - so the
  // "Open in Claude" link shows up correctly even on a page reload, or if a
  // batch was flagged in an earlier visit. Uses the real ready_to_send rows
  // in `rows`, not the ephemeral startOutreachCount above.
  const readyToSendCount = rows.filter(r => r.status === "ready_to_send").length;
  // claude:// deep link (per Anthropic's documented desktop-app URL scheme,
  // 2026-09-21) opens Claude Desktop with a new chat, prompt pre-filled -
  // Greg still reviews and clicks send himself there, this just saves him
  // retyping the request. Works only with the Claude desktop app installed;
  // if it's not, the link just does nothing when clicked, so the button
  // itself (Start outreach) plus telling me directly in any chat remains
  // the reliable fallback either way.
  const OPEN_IN_CLAUDE_PROMPT = "Start the outreach batch for the Mining BD Platform project: query Supabase outreach_queue for status = 'ready_to_send' rows, then go through each one live via Claude in Chrome - open the contact's LinkedIn profile, show me the drafted connection note (respecting LinkedIn's 300-character limit) before sending, and only click Connect after I confirm. If a row has needs_email = true, LinkedIn will likely ask for an email to verify the contact before it lets the request send - use that row's contact_email if it's filled in, otherwise skip that row and tell me you need an email for it rather than guessing one. After each real send, update that row to status = 'connect_sent' with connect_sent_at set to now.";
  const openInClaudeUrl = "claude://claude.ai/new?q=" + encodeURIComponent(OPEN_IN_CLAUDE_PROMPT);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#9A9DA2",
      fontSize: "13.5px",
      marginBottom: "28px",
      lineHeight: 1.6
    }
  }, `This week: ${sentThisWeek} connection request${sentThisWeek === 1 ? "" : "s"} sent, ${queuedThisWeek} new contact${queuedThisWeek === 1 ? "" : "s"} queued. `, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268"
    }
  }, "Status only reflects what's been confirmed - LinkedIn doesn't report acceptances or replies back automatically, so \"Connected\"/\"Replied\" show what's been checked and recorded, not necessarily everything that's happened."), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268"
    }
  }, "Project data (new opportunities, stage changes) syncs automatically every day around midnight (Perth time). New outreach candidates only get found when \"Find more candidates\" below is run - not on a fixed schedule.")), /*#__PURE__*/React.createElement(NewOpportunitiesTrend, {
    items: items,
    canEdit: canEdit
  }), /*#__PURE__*/React.createElement(ReviewSection, {
    title: "New this week",
    description: "Opportunities added to the board in the last 7 days.",
    items: newThisWeek,
    emptyText: "Nothing new landed this week."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "28px",
      marginBottom: "36px",
      padding: "18px 20px",
      border: "1px solid #23272D",
      borderRadius: "4px"
    }
  }, /*#__PURE__*/React.createElement(ReportStat, {
    label: "Meetings booked",
    value: meetingBooked.length,
    color: "#7C9A5B"
  }), /*#__PURE__*/React.createElement(ReportStat, {
    label: "Replied",
    value: replied.length,
    color: "#4F7C90"
  }), /*#__PURE__*/React.createElement(ReportStat, {
    label: "Connected",
    value: connected.length,
    color: "#6B8F6B"
  }), /*#__PURE__*/React.createElement(ReportStat, {
    label: "Pending accept",
    value: pending.length,
    color: "#8B9BAE"
  }), /*#__PURE__*/React.createElement(ReportStat, {
    label: "Queued to send",
    value: queued.length,
    color: "#D8C889"
  }), /*#__PURE__*/React.createElement(ReportStat, {
    label: "Awaiting review",
    value: awaitingReview.length,
    color: "#9CC3D4"
  }), /*#__PURE__*/React.createElement(ReportStat, {
    label: "Needs a contact",
    value: needsContactReport.length,
    color: "#C79A6B"
  })), /*#__PURE__*/React.createElement(NextUpSection, {
    rows: nextUp,
    onOpenItem: onOpenItem,
    onTrigger: triggerRefill,
    triggerStatus: triggerStatus,
    onStartOutreach: startOutreach,
    startOutreachStatus: startOutreachStatus,
    startOutreachCount: startOutreachCount,
    readyToSendCount: readyToSendCount,
    openInClaudeUrl: openInClaudeUrl,
    canEdit: canEdit,
    actionsFn: nextUpActions
  }), /*#__PURE__*/React.createElement(ReportSection, {
    title: "Meetings booked",
    accentColor: "#7C9A5B",
    description: "Said yes to a meeting - the priority list.",
    rows: meetingBooked,
    emptyText: "None yet.",
    onOpenItem: onOpenItem
  }), /*#__PURE__*/React.createElement(ReportSection, {
    title: "Replied — in conversation",
    accentColor: "#4F7C90",
    description: "Connected and replied. Follow up to move these toward a meeting.",
    rows: replied,
    emptyText: "No replies yet.",
    onOpenItem: onOpenItem,
    canEdit: canEdit,
    actionsFn: meetingActions
  }), /*#__PURE__*/React.createElement(ReportSection, {
    title: "Connected — track for later",
    accentColor: "#6B8F6B",
    description: "Accepted the connection but no reply yet. Oldest first - these are due a follow-up touch.",
    rows: connected,
    emptyText: "No accepted connections recorded yet.",
    onOpenItem: onOpenItem,
    flagFn: flagStaleConnection,
    canEdit: canEdit,
    actionsFn: meetingActions
  }), /*#__PURE__*/React.createElement(ReportSection, {
    title: "Pending — awaiting response",
    accentColor: "#8B9BAE",
    description: "Connection request sent, not yet accepted or declined.",
    rows: pending,
    emptyText: "Nothing sent and waiting right now.",
    onOpenItem: onOpenItem,
    canEdit: canEdit,
    actionsFn: pendingActions
  }), /*#__PURE__*/React.createElement(ReportSection, {
    title: "Queued to reach out",
    accentColor: "#D8C889",
    description: "Contact found and approved - next in line to be sent. Outreach happens live rather than on a fixed schedule, so this is effectively \"who's coming up.\" A \"Ready to send\" tag means it's been flagged via \"Start outreach\" above and is waiting on a live sending pass.",
    rows: queued,
    emptyText: "Nothing queued right now.",
    onOpenItem: onOpenItem
  }), /*#__PURE__*/React.createElement(ReportSection, {
    title: "Found, awaiting your review",
    accentColor: "#9CC3D4",
    description: "Contacts found but not yet approved or skipped.",
    rows: awaitingReview,
    emptyText: "Nothing waiting on review.",
    onOpenItem: onOpenItem
  }), /*#__PURE__*/React.createElement(ReportSection, {
    title: "Found, needs a contact",
    accentColor: "#C79A6B",
    description: "Genuinely fresh opportunities, but monday only has a generic team/company contact - find a named person on the Outreach tab before outreach can be drafted.",
    rows: needsContactReport,
    emptyText: "Nothing waiting on a contact right now.",
    onOpenItem: onOpenItem
  }), declined.length > 0 && /*#__PURE__*/React.createElement(ReportSection, {
    title: "Declined",
    accentColor: "#71767D",
    description: "Said no, or the request was declined.",
    rows: declined,
    emptyText: "",
    onOpenItem: onOpenItem
  }));
}
const TIER_MARKER_COLORS = {
  "Prime Window": "#E9987A",
  "Live Window": "#C1592E",
  "Late Window": "#4F7C90",
  "Closed": "#5E6268",
  "Unscoped": "#7A6F8A"
};
function MapView({
  items,
  onOpenItem
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const geoItems = useMemo(() => items.filter(i => i.latitude != null && i.longitude != null && !isNaN(i.latitude) && !isNaN(i.longitude)), [items]);
  useEffect(() => {
    window.__mapOpenItem = id => onOpenItem(id);
    return () => {
      delete window.__mapOpenItem;
    };
  }, [onOpenItem]);
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !window.L) return;
    const map = window.L.map(mapRef.current, {
      zoomControl: true
    }).setView([-25.5, 122], 5);
    window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
      maxZoom: 19
    }).addTo(map);
    mapInstanceRef.current = map;
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.L) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    geoItems.forEach(item => {
      const color = TIER_MARKER_COLORS[item.tier] || TIER_MARKER_COLORS["Unscoped"];
      const approx = !!item.coordinatesApproximate;
      const marker = window.L.circleMarker([item.latitude, item.longitude], {
        radius: approx ? 6 : 8,
        fillColor: color,
        color: approx ? color : "#14171B",
        weight: approx ? 1 : 2,
        opacity: approx ? 0.7 : 1,
        fillOpacity: approx ? 0.35 : 0.85,
        dashArray: approx ? "2,2" : null
      }).addTo(map);
      const safeName = String(item.name || "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
      const popupHtml = `
        <div style="font-family: 'IBM Plex Sans', sans-serif; min-width: 190px;">
          <div style="font-weight: 600; color: #14171B; margin-bottom: 2px;">${item.name || "Untitled"}</div>
          <div style="color: #5E6268; font-size: 12px; margin-bottom: 6px;">${item.company || "Company unknown"}</div>
          <div style="font-size: 12px; color: #14171B; margin-bottom: 8px;">${item.tier} &middot; Score ${item.score} &middot; ${item.commodity}</div>
          ${approx ? '<div style="font-size: 11px; color: #999; margin-bottom: 8px;">Approximate location (region centroid)</div>' : ""}
          <button onclick="window.__mapOpenItem && window.__mapOpenItem('${item.id}')" style="background:#14171B;color:#EDE9E1;border:none;border-radius:3px;padding:5px 10px;font-size:12px;cursor:pointer;">Open in Pipeline</button>
        </div>
      `;
      marker.bindPopup(popupHtml);
      markersRef.current.push(marker);
    });
    if (geoItems.length > 0) {
      const bounds = window.L.latLngBounds(geoItems.map(i => [i.latitude, i.longitude]));
      map.fitBounds(bounds.pad(0.2));
    }
  }, [geoItems]);
  const preciseCount = geoItems.filter(i => !i.coordinatesApproximate).length;
  const approxCount = geoItems.length - preciseCount;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "14px",
      flexWrap: "wrap",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#8B9198",
      fontSize: "13px"
    }
  }, "Showing ", geoItems.length, " of ", items.length, " opportunities with known coordinates (", preciseCount, " precise, ", approxCount, " approximate)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "16px",
      fontSize: "12px",
      color: "#8B9198",
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "5px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      background: "#C1592E",
      display: "inline-block"
    }
  }), " Precise (MINEDEX / EPA)"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "5px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "10px",
      height: "10px",
      borderRadius: "50%",
      border: "1px dashed #C1592E",
      display: "inline-block"
    }
  }), " Approximate (region centroid)"))), /*#__PURE__*/React.createElement("div", {
    ref: mapRef,
    style: {
      width: "100%",
      height: "560px",
      borderRadius: "8px",
      overflow: "hidden",
      border: "1px solid #23272D"
    }
  }));
}
function CommentsLog({
  items,
  onOpenItem
}) {
  const [comments, setComments] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("comments").select("*").order("created_at", {
        ascending: false
      });
      if (error) setError("Couldn't load comments.");else setComments(data);
    }
    load();
  }, []);
  if (error) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#C1592E",
      fontSize: "13px"
    }
  }, error);
  if (comments === null) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "13px"
    }
  }, "Loading…");
  const itemsById = {};
  items.forEach(i => {
    itemsById[i.id] = i;
  });
  if (comments.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#5E6268",
        fontSize: "13px",
        padding: "20px 0"
      }
    }, "No comments yet — comment on an opportunity to see it here.");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      overflow: "hidden"
    }
  }, comments.map((c, idx) => {
    const item = itemsById[c.item_id];
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      style: {
        padding: "12px 16px",
        borderTop: idx === 0 ? "none" : "1px solid #23272D"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#C7CAD0",
        fontSize: "13.5px"
      }
    }, c.text), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "4px",
        fontSize: "12px",
        color: "#71767D"
      }
    }, item ? /*#__PURE__*/React.createElement("span", {
      onClick: () => onOpenItem(item.id),
      style: {
        color: "#9CC3D4",
        cursor: "pointer"
      }
    }, item.name) : /*#__PURE__*/React.createElement("span", null, "Unknown opportunity"), " · ", c.author, " · ", new Date(c.created_at).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short"
    })));
  }));
}
const OUTREACH_PIPELINE_STATUS = {
  connect_sent: {
    label: "Connect sent",
    color: "#8B9BAE",
    rank: 0
  },
  message_sent: {
    label: "Message sent",
    color: "#8B9BAE",
    rank: 0
  },
  connected: {
    label: "Connected",
    color: "#6B8F6B",
    rank: 1
  },
  replied: {
    label: "Replied",
    color: "#4F7C90",
    rank: 2
  },
  meeting_booked: {
    label: "Meeting booked",
    color: "#7C9A5B",
    rank: 3
  },
  declined: {
    label: "Declined",
    color: "#C1592E",
    rank: 4
  }
};
const OUTREACH_STATUS_META = {
  pending_review: {
    label: "Ready to review",
    color: "#9CC3D4"
  },
  needs_contact: {
    label: "Needs a contact",
    color: "#C79A6B"
  },
  needs_profile: {
    label: "Needs a profile",
    color: "#E9987A"
  },
  approved: {
    label: "Approved, not prepared",
    color: "#C7CAD0"
  },
  ready_to_send: {
    label: "Ready to send",
    color: "#D8C889"
  },
  skipped_by_user: {
    label: "Skipped",
    color: "#5E6268"
  },
  connect_sent: OUTREACH_PIPELINE_STATUS.connect_sent,
  message_sent: OUTREACH_PIPELINE_STATUS.message_sent,
  connected: OUTREACH_PIPELINE_STATUS.connected,
  replied: OUTREACH_PIPELINE_STATUS.replied,
  meeting_booked: OUTREACH_PIPELINE_STATUS.meeting_booked,
  declined: OUTREACH_PIPELINE_STATUS.declined
};
function outreachLastActivity(row) {
  return row.message_sent_at || row.connect_sent_at || row.prepared_at || row.reviewed_at || row.queued_at || null;
}
// Lead warmth (2026-09-18, per Greg): a simple, always-visible temperature
// reading on a contact, separate from the granular outreach_queue status
// above. Cold and Luke Warm are derived automatically from the LinkedIn
// signal already on file (see deriveWarmth below); Warm ("talking in
// person") and Hot ("bidding/tendering") describe real-world engagement
// this system has no way to observe on its own, so those two are always a
// manual call, set from the dropdown in the main pipeline row. A manual
// pick at any level is stored as an override (overrides table, field
// "lead_warmth") and always wins over the computed default, the same
// pattern already used for Tier/Funding/Stage/Position below.
const WARMTH_ORDER = ["cold", "luke_warm", "warm", "hot"];
const WARMTH_META = {
  cold: {
    label: "Cold",
    color: "#5E6268",
    description: "Cold — no contact yet"
  },
  luke_warm: {
    label: "Luke warm",
    color: "#7A93B0",
    description: "Luke warm — LinkedIn request accepted"
  },
  warm: {
    label: "Warm",
    color: "#D8A657",
    description: "Warm — talking in person"
  },
  hot: {
    label: "Hot",
    color: "#C1592E",
    description: "Hot — bidding / tendering"
  }
};
// Outreach statuses that count as an accepted LinkedIn connection - the
// automatic floor for "Luke warm". Everything before this (sent, pending,
// not yet contacted) reads as Cold until a person confirms the next step.
const WARMTH_LUKE_WARM_STATUSES = ["connected", "replied", "meeting_booked"];
function deriveWarmth(item) {
  return WARMTH_LUKE_WARM_STATUSES.includes(item.outreachStatus) ? "luke_warm" : "cold";
}
function outreachBadgeMeta(item) {
  if (item.outreachStatus && OUTREACH_STATUS_META[item.outreachStatus]) {
    return OUTREACH_STATUS_META[item.outreachStatus];
  }
  if (hasUsableContact(item)) {
    return {
      label: "Contact on file",
      color: "#6B8F6B"
    };
  }
  return {
    label: "No contact",
    color: "#5E6268"
  };
}
function OutreachStatusChip({
  item
}) {
  const meta = outreachBadgeMeta(item);
  return /*#__PURE__*/React.createElement("span", {
    title: hasUsableContact(item) ? `Contact on file: ${displayContactName(item)}` : "No point of contact on file — see Reach out",
    style: {
      display: "inline-block",
      maxWidth: "100%",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      border: `1px solid ${meta.color}`,
      color: meta.color,
      fontSize: "10.5px",
      borderRadius: "3px",
      padding: "2px 6px",
      fontFamily: "'IBM Plex Sans', sans-serif"
    }
  }, meta.label);
}
function WarmthBadge({
  itemId,
  warmth,
  algoWarmth,
  onChange,
  disabled
}) {
  const meta = WARMTH_META[warmth] || WARMTH_META.cold;
  return /*#__PURE__*/React.createElement("select", {
    value: warmth,
    disabled: disabled,
    title: meta.description,
    onClick: e => e.stopPropagation(),
    onChange: e => {
      e.stopPropagation();
      onChange(itemId, e.target.value, algoWarmth);
    },
    style: {
      appearance: "none",
      background: "transparent",
      border: `1px solid ${meta.color}`,
      color: meta.color,
      fontSize: "11px",
      borderRadius: "3px",
      padding: "2px 6px",
      cursor: disabled ? "default" : "pointer",
      fontFamily: "'IBM Plex Sans', sans-serif",
      opacity: disabled ? 0.6 : 1
    }
  }, WARMTH_ORDER.map(w => /*#__PURE__*/React.createElement("option", {
    key: w,
    value: w,
    style: {
      background: "#1D2126",
      color: "#EDE9E1"
    }
  }, WARMTH_META[w].label)));
}
function OutreachQueue({
  canEdit,
  onOpenItem,
  onBidStatusChange
}) {
  const [rows, setRows] = useState(null);
  const [chaseByItem, setChaseByItem] = useState({});
  const [error, setError] = useState(null);
  useEffect(() => {
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("outreach_queue").select("*").order("queued_at", {
        ascending: false
      });
      if (error) {
        setError("Couldn't load the outreach queue.");
        return;
      }
      setRows(data || []);
      // Same "best placed to chase" ranking as the Pipeline view (Owner
      // Accessibility + NPI Potential combined, BD score as tie-break) so the
      // review queue itself works top-to-bottom in chaseability order, not
      // just newest-queued-first. See effectiveItems in the main app for the
      // canonical version of this formula (2026-09-18).
      const itemIds = Array.from(new Set((data || []).map(r => r.item_id).filter(Boolean)));
      if (itemIds.length) {
        setChaseByItem(await fetchChaseScoreByItemId(itemIds));
      }
    }
    load();
  }, []);
  const byChaseThenQueued = (a, b) => {
    const ca = chaseByItem[a.item_id] ?? -1;
    const cb = chaseByItem[b.item_id] ?? -1;
    if (cb !== ca) return cb - ca;
    return new Date(b.queued_at) - new Date(a.queued_at);
  };
  const updateRow = async (id, patch) => {
    setRows(prev => prev ? prev.map(r => r.id === id ? {
      ...r,
      ...patch
    } : r) : prev);
    await supabaseClient.from("outreach_queue").update(patch).eq("id", id);
  };
  const approve = row => updateRow(row.id, {
    status: "approved",
    reviewed_at: new Date().toISOString()
  });
  // Reason capture (2026-09-23, per Greg): skip used to record nothing
  // beyond the status flip, so there was no way to tell later *why* an
  // opportunity was passed on -- and no way to notice a pattern (e.g. a lot
  // of "not real engineering scope" skips on projects the algo scored
  // NPI-High). category is a fixed list so it's actually aggregable; note is
  // optional free text on top. Applies to every Skip action in this queue,
  // not just "Needs a contact" -- most skips happen from "Ready to review",
  // so limiting reason capture to one bucket would defeat the point.
  const skipWithReason = (row, category, note) => {
    updateRow(row.id, {
      status: "skipped_by_user",
      reviewed_at: new Date().toISOString(),
      skip_reason_category: category || null,
      skip_reason: note || null,
      // needsNewContact below is keyed on contact_rejected, not status -- a
      // skip from that bucket without clearing this would leave the row
      // stuck showing "Skipped" but never actually leaving the "Needs a
      // different contact" section. Harmless to always clear it here since
      // skipped_by_user is a terminal state either way.
      contact_rejected: false
    });
    if (onBidStatusChange) onBidStatusChange(row.item_id, "Passed");
  };
  const markSent = row => {
    updateRow(row.id, {
      status: "connect_sent",
      connect_sent_at: new Date().toISOString()
    });
  };
  const setPipelineStatus = (row, newStatus) => {
    const patch = {
      status: newStatus
    };
    if (newStatus === "message_sent" && !row.message_sent_at) patch.message_sent_at = new Date().toISOString();
    updateRow(row.id, patch);
  };
  const saveOutcomeNote = (row, value) => {
    if (value === (row.last_outcome_note || "")) return;
    updateRow(row.id, {
      last_outcome_note: value
    });
  };
  const saveDraft = (row, value) => {
    if (value === row.draft_message) return;
    updateRow(row.id, {
      draft_message: value
    });
  };
  // Local, instant starter draft (2026-09-23, per Greg: rows that get a
  // contact via the manual replacement form used to reach "Ready to review"
  // with no draft at all, since only the n8n queue builder's LLM step ever
  // wrote one). No network round-trip, always available as a fallback even
  // if Greg doesn't want to fire off a live research session just to get a
  // starting point -- still fully editable afterwards.
  const quickDraft = row => updateRow(row.id, {
    draft_message: buildOutreachQueueDraft(row)
  });
  // Contact reassignment + email-gate (2026-09-21, per Greg): flagging a
  // contact as wrong pulls it out of the normal review/send flow (back to
  // needs_profile, distinguished by contact_rejected so it doesn't get
  // confused with "no LinkedIn URL yet") into its own section with a manual
  // replace form and a live find-someone-else trigger. needs_email/
  // contact_email are separate from contact_rejected - LinkedIn's
  // email-verification gate has nothing to do with whether the contact is
  // the right person.
  const notRightContact = row => {
    updateRow(row.id, {
      contact_rejected: true,
      status: "needs_profile",
      prep_note: (row.prep_note ? row.prep_note + " " : "") + `[${new Date().toISOString().split("T")[0]}] Flagged by Greg as the wrong contact.`
    });
  };
  const saveReplacementContact = (row, name, role, linkedin) => {
    updateRow(row.id, {
      contact_name: name,
      contact_role: role || null,
      contact_linkedin_url: linkedin || null,
      contact_rejected: false,
      status: "pending_review",
      reviewed_at: null,
      // Give it a starter draft right away rather than leaving Ready to
      // review empty (2026-09-23) -- only backfills if there's nothing
      // there yet, so a real draft from the "wrong contact" flow (still
      // relevant to the same opportunity, just possibly stale) isn't
      // clobbered.
      draft_message: row.draft_message || buildOutreachQueueDraft(row)
    });
  };
  const toggleNeedsEmail = (row, value) => updateRow(row.id, {
    needs_email: value
  });
  const saveContactEmail = (row, email) => updateRow(row.id, {
    contact_email: email
  });
  const findDifferentContactUrl = row => {
    const prompt = `Find a better BD contact for the Mining BD Platform project. Opportunity: "${row.opportunity_name}" at ${row.company || "an unknown company"} (outreach_queue id ${row.id}, item_id ${row.item_id}). The previously queued contact, ${row.contact_name || "unknown"}${row.contact_role ? ` (${row.contact_role})` : ""}, was flagged by Greg as not the right person to reach out to for this specific project. Research live via Claude in Chrome (LinkedIn, the company's website, recent news) to find a more suitable contact - ideally someone in business development, project delivery, or a technical/commercial decision-making role for this project, not just the most senior person at the parent company. Tell me who you found and why before updating anything, and confirm with me if you're not confident it's a genuinely better fit. Once confirmed, update outreach_queue row id ${row.id} in Supabase: set contact_name, contact_role, contact_linkedin_url to the new contact, contact_rejected to false, status to 'pending_review', and draft_message to a short personalized LinkedIn connection note for this specific person and opportunity (under 300 characters, no generic filler).`;
    return "claude://claude.ai/new?q=" + encodeURIComponent(prompt);
  };
  // needs_contact rows never had an individual at all (monday only shows a
  // generic team/company name, in row.contact_name) - same live-research
  // ask as findDifferentContactUrl, worded for "find one" rather than
  // "replace this one".
  const findContactUrl = row => {
    const prompt = `Find a BD contact for the Mining BD Platform project. Opportunity: "${row.opportunity_name}" at ${row.company || "an unknown company"} (outreach_queue id ${row.id}, item_id ${row.item_id}). Monday.com only has a generic contact on file for this one: "${row.contact_name || "unknown"}" - no named individual yet. Research live via Claude in Chrome (LinkedIn, the company's website, recent news) to find a specific person to reach out to - ideally someone in business development, project delivery, or a technical/commercial decision-making role for this project. Tell me who you found and why before updating anything, and confirm with me if you're not confident. Once confirmed, update outreach_queue row id ${row.id} in Supabase: set contact_name, contact_role, contact_linkedin_url to the new contact, contact_is_individual to true, status to 'pending_review', and draft_message to a short personalized LinkedIn connection note for this specific person and opportunity (under 300 characters, no generic filler).`;
    return "claude://claude.ai/new?q=" + encodeURIComponent(prompt);
  };
  if (error) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#C1592E",
      fontSize: "13px"
    }
  }, error);
  if (rows === null) return /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "13px"
    }
  }, "Loading…");
  const pendingReview = rows.filter(r => r.status === "pending_review").sort(byChaseThenQueued);
  // "needs_contact" (2026-09-22, per Greg): fresh opportunities where monday
  // only has a generic team/company contact, not a named individual - these
  // used to just get silently dropped by the Outreach Queue Builder rather
  // than surfacing anywhere. Reuses the exact same replacement-contact form
  // and live-research link already built for "not the right contact" below,
  // since the actual task (find a named person, save it) is identical.
  const needsContact = rows.filter(r => r.status === "needs_contact").sort(byChaseThenQueued);
  const needsProfile = rows.filter(r => r.status === "needs_profile" && !r.contact_rejected).sort(byChaseThenQueued);
  const needsNewContact = rows.filter(r => r.contact_rejected).sort(byChaseThenQueued);
  const readyToSend = rows.filter(r => r.status === "ready_to_send");
  const pipeline = rows.filter(r => Object.prototype.hasOwnProperty.call(OUTREACH_PIPELINE_STATUS, r.status)).sort((a, b) => OUTREACH_PIPELINE_STATUS[a.status].rank - OUTREACH_PIPELINE_STATUS[b.status].rank);
  const actioned = rows.filter(r => !["pending_review", "needs_profile", "needs_contact", "ready_to_send"].includes(r.status) && !Object.prototype.hasOwnProperty.call(OUTREACH_PIPELINE_STATUS, r.status));
  const cardActions = row => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: "8px",
      marginTop: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => approve(row),
    disabled: !canEdit,
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: canEdit ? "#EDE9E1" : "#5E6268",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 14px",
      cursor: canEdit ? "pointer" : "default"
    }
  }, "Approve"), /*#__PURE__*/React.createElement(SkipWithReasonControl, {
    row: row,
    canEdit: canEdit,
    onConfirm: skipWithReason
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => notRightContact(row),
    disabled: !canEdit,
    style: {
      background: "none",
      border: "none",
      color: "#E9987A",
      cursor: canEdit ? "pointer" : "default",
      fontSize: "12.5px"
    }
  }, "Not the right contact"));
  const sentActions = row => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "12px",
      marginTop: "10px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => markSent(row),
    disabled: !canEdit,
    style: {
      background: "#2E4B3B",
      border: "1px solid #3F6350",
      color: canEdit ? "#C9E8D4" : "#5E6268",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 14px",
      cursor: canEdit ? "pointer" : "default"
    }
  }, "Mark as sent"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#71767D",
      fontSize: "11.5px"
    }
  }, "Pre-filled in your LinkedIn tab — open it, review, click Send there, then mark it here."), /*#__PURE__*/React.createElement("button", {
    // Override for when "Mark as sent" doesn't fit: a LinkedIn connect
    // request was never needed because the contact was already connected,
    // so the outreach actually happened as a direct message instead
    // (2026-09-23, per Greg: "I was already connected with him so i sent
    // the message via chat not connect... theres nothing to send at this
    // stage"). Skips straight to message_sent (awaiting a reply) rather
    // than connect_sent (awaiting a connection accept), which is the
    // status this case actually describes -- reuses setPipelineStatus,
    // the same status-change path the "Sent — tracking replies" dropdown
    // already uses.
    onClick: () => setPipelineStatus(row, "message_sent"),
    disabled: !canEdit,
    style: {
      background: "none",
      border: "1px solid #4F7C90",
      color: canEdit ? "#9CC3D4" : "#5E6268",
      borderRadius: "3px",
      fontSize: "12px",
      padding: "5px 12px",
      cursor: canEdit ? "pointer" : "default"
    }
  }, "Already connected — sent a message"), /*#__PURE__*/React.createElement("button", {
    onClick: () => notRightContact(row),
    disabled: !canEdit,
    style: {
      background: "none",
      border: "none",
      color: "#E9987A",
      cursor: canEdit ? "pointer" : "default",
      fontSize: "12.5px"
    }
  }, "Not the right contact"));
  // Rows sitting at "sent, no confirmed outcome yet" — these are the ones a
  // status-check pass actually needs to look at on LinkedIn. Rows already at
  // connected/replied/meeting_booked/declined are resolved and don't need
  // re-checking. Computed live from `rows`, not tied to a button click, so
  // it's correct on page load even if flagged by an earlier session (2026-09-21).
  const awaitingOutcome = pipeline.filter(r => r.status === "connect_sent" || r.status === "message_sent");
  const CHECK_STATUS_PROMPT = "Check outreach status for the Mining BD Platform project: query Supabase outreach_queue for status in ('connect_sent','message_sent'), then for each one live via Claude in Chrome, check LinkedIn for that contact's real current state — are you now connected (1st degree / no longer shows \"Pending\" in My Network > Invitations), and has the contact replied to your message. Update each row in Supabase: set status to 'connected' if the connection is now accepted but there's no reply yet, 'replied' if they've messaged back, or leave the row as-is if it's genuinely still pending. Skip anything ambiguous rather than guessing, and give me a short summary of what changed at the end.";
  const checkStatusUrl = "claude://claude.ai/new?q=" + encodeURIComponent(CHECK_STATUS_PROMPT);
  const renderPipelineCard = row => {
    const meta = OUTREACH_PIPELINE_STATUS[row.status] || {
      label: row.status,
      color: "#71767D"
    };
    const sentDate = row.message_sent_at || row.connect_sent_at;
    return /*#__PURE__*/React.createElement("div", {
      key: row.id,
      style: {
        border: "1px solid #23272D",
        borderRadius: "4px",
        background: "#181B20",
        padding: "14px 16px",
        marginBottom: "10px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: "6px"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      onClick: () => onOpenItem(row.item_id),
      style: {
        color: "#9CC3D4",
        cursor: "pointer",
        fontSize: "14px"
      }
    }, row.opportunity_name), row.company && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#71767D",
        fontSize: "13px"
      }
    }, " — ", row.company)), sentDate && /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#71767D",
        fontSize: "12px"
      }
    }, "Sent ", new Date(sentDate).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: "8px",
        fontSize: "12.5px",
        color: "#C7CAD0"
      }
    }, row.contact_name || "Unnamed contact", row.contact_role ? ` (${row.contact_role})` : "", row.contact_linkedin_url ? /*#__PURE__*/React.createElement("a", {
      href: row.contact_linkedin_url,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: "#9CC3D4",
        fontSize: "12.5px",
        marginLeft: "8px",
        textDecoration: "none"
      }
    }, "LinkedIn profile ↗") : null), row.draft_message && /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#8B9198",
        fontSize: "12px",
        fontStyle: "italic",
        marginTop: "8px",
        borderLeft: "2px solid #2C3138",
        paddingLeft: "10px"
      }
    }, "“", row.draft_message, "”"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "10px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        color: meta.color,
        fontSize: "12px",
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
        background: meta.color,
        display: "inline-block"
      }
    }), meta.label), /*#__PURE__*/React.createElement("select", {
      value: row.status,
      disabled: !canEdit,
      onChange: e => setPipelineStatus(row, e.target.value),
      style: {
        background: "#1D2126",
        border: "1px solid #2C3138",
        color: "#EDE9E1",
        borderRadius: "3px",
        fontSize: "12px",
        padding: "4px 8px"
      }
    }, Object.keys(OUTREACH_PIPELINE_STATUS).map(key => /*#__PURE__*/React.createElement("option", {
      key: key,
      value: key
    }, OUTREACH_PIPELINE_STATUS[key].label)))), /*#__PURE__*/React.createElement("input", {
      type: "text",
      defaultValue: row.last_outcome_note || "",
      disabled: !canEdit,
      placeholder: "Add a note — e.g. replied, wants a call next week",
      onBlur: e => saveOutcomeNote(row, e.target.value),
      style: {
        width: "100%",
        background: "#1D2126",
        border: "1px solid #2C3138",
        borderRadius: "3px",
        color: "#EDE9E1",
        fontSize: "12.5px",
        padding: "7px 10px",
        marginTop: "10px",
        boxSizing: "border-box",
        fontFamily: "inherit",
        opacity: canEdit ? 1 : 0.6
      }
    }));
  };
  const renderCard = (row, actions) => /*#__PURE__*/React.createElement("div", {
    key: row.id,
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      background: "#181B20",
      padding: "14px 16px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    onClick: () => onOpenItem(row.item_id),
    style: {
      color: "#9CC3D4",
      cursor: "pointer",
      fontSize: "14px"
    }
  }, row.opportunity_name), row.company && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#71767D",
      fontSize: "13px"
    }
  }, " — ", row.company)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12px"
    }
  }, [row.stage, row.priority_tier].filter(Boolean).join(" · "))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      fontSize: "12.5px",
      color: "#C7CAD0"
    }
  }, row.contact_name || "Unnamed contact", row.contact_role ? ` (${row.contact_role})` : "", row.contact_linkedin_url ? /*#__PURE__*/React.createElement("a", {
    href: row.contact_linkedin_url,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12.5px",
      marginLeft: "8px",
      textDecoration: "none"
    }
  }, "LinkedIn profile ↗") : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px",
      marginLeft: "8px"
    }
  }, "No LinkedIn profile yet")), /*#__PURE__*/React.createElement(EmailBlockControl, {
    row: row,
    canEdit: canEdit,
    onToggle: toggleNeedsEmail,
    onSaveEmail: saveContactEmail
  }), !row.draft_message && canEdit && /*#__PURE__*/React.createElement("button", {
    onClick: () => quickDraft(row),
    style: {
      display: "block",
      marginTop: "10px",
      background: "none",
      border: "1px solid #2C3138",
      color: "#9CC3D4",
      borderRadius: "3px",
      fontSize: "12px",
      padding: "5px 10px",
      cursor: "pointer"
    }
  }, "Draft a message"), /*#__PURE__*/React.createElement("textarea", {
    // Keyed on whether a draft exists so clicking "Draft a message" (which
    // updates row.draft_message in state but this textarea is uncontrolled
    // via defaultValue) forces a remount and actually shows the new text,
    // rather than silently keeping the stale empty DOM node.
    key: row.id + (row.draft_message ? "-draft" : "-empty"),
    defaultValue: row.draft_message || "",
    disabled: !canEdit,
    onBlur: e => saveDraft(row, e.target.value),
    style: {
      width: "100%",
      minHeight: "70px",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "13px",
      padding: "8px 10px",
      marginTop: "10px",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "inherit",
      lineHeight: 1.5,
      opacity: canEdit ? 1 : 0.6
    }
  }), row.classification_reason && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "11.5px",
      fontStyle: "italic",
      marginTop: "6px"
    }
  }, "Why this is fresh: ", row.classification_reason), row.scope_relevant === false && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#E9987A",
      fontSize: "11.5px",
      marginTop: "6px",
      fontWeight: 600
    }
  }, "⚠ Not clearly NPI/Infrastructure scope", row.scope_note ? ` — ${row.scope_note}` : ""), row.scope_relevant == null && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "11.5px",
      marginTop: "6px",
      fontStyle: "italic"
    }
  }, "Scope relevance not yet checked"), actions(row));
  const renderNeedsNewContactCard = row => /*#__PURE__*/React.createElement("div", {
    key: row.id,
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      background: "#181B20",
      padding: "14px 16px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    onClick: () => onOpenItem(row.item_id),
    style: {
      color: "#9CC3D4",
      cursor: "pointer",
      fontSize: "14px"
    }
  }, row.opportunity_name), row.company && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#71767D",
      fontSize: "13px"
    }
  }, " — ", row.company))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      fontSize: "12.5px",
      color: "#71767D",
      textDecoration: "line-through"
    }
  }, "Previously: ", row.contact_name || "Unnamed contact", row.contact_role ? ` (${row.contact_role})` : ""), /*#__PURE__*/React.createElement(ReplacementContactForm, {
    row: row,
    canEdit: canEdit,
    onSave: saveReplacementContact
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: "10px",
      marginTop: "10px"
    }
  }, canEdit && /*#__PURE__*/React.createElement("a", {
    href: findDifferentContactUrl(row),
    style: {
      display: "inline-block",
      background: "none",
      border: "1px solid #9CC3D4",
      color: "#9CC3D4",
      borderRadius: "4px",
      fontSize: "12px",
      padding: "5px 10px",
      textDecoration: "none"
    }
  }, "Find a different contact ↗"), /*#__PURE__*/React.createElement(SkipWithReasonControl, {
    row: row,
    canEdit: canEdit,
    onConfirm: skipWithReason
  })));
  const renderNeedsContactCard = row => /*#__PURE__*/React.createElement("div", {
    key: row.id,
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      background: "#181B20",
      padding: "14px 16px",
      marginBottom: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      flexWrap: "wrap",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    onClick: () => onOpenItem(row.item_id),
    style: {
      color: "#9CC3D4",
      cursor: "pointer",
      fontSize: "14px"
    }
  }, row.opportunity_name), row.company && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#71767D",
      fontSize: "13px"
    }
  }, " — ", row.company))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px",
      fontSize: "12.5px",
      color: "#71767D"
    }
  }, "Monday shows: ", row.contact_name || "no contact on file"), row.classification_reason && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "11.5px",
      fontStyle: "italic",
      marginTop: "6px"
    }
  }, row.classification_reason), /*#__PURE__*/React.createElement(ReplacementContactForm, {
    row: row,
    canEdit: canEdit,
    onSave: saveReplacementContact
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-start",
      gap: "10px",
      marginTop: "10px"
    }
  }, canEdit && /*#__PURE__*/React.createElement("a", {
    href: findContactUrl(row),
    style: {
      display: "inline-block",
      background: "none",
      border: "1px solid #9CC3D4",
      color: "#9CC3D4",
      borderRadius: "4px",
      fontSize: "12px",
      padding: "5px 10px",
      textDecoration: "none"
    }
  }, "Find a contact ↗"), /*#__PURE__*/React.createElement(SkipWithReasonControl, {
    row: row,
    canEdit: canEdit,
    onConfirm: skipWithReason
  })));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "20px"
    }
  }, `${pendingReview.length} ready to review · ${needsContact.length} need a contact found · ${needsProfile.length} waiting on a LinkedIn profile · ${needsNewContact.length} need a different contact · ${readyToSend.length} ready to send · ${pipeline.length} sent, tracking replies`), pendingReview.length === 0 && needsContact.length === 0 && needsProfile.length === 0 && needsNewContact.length === 0 && readyToSend.length === 0 && pipeline.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "13px",
      padding: "20px 0"
    }
  }, "Nothing queued yet."), pendingReview.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "32px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 12px 0"
    }
  }, "Ready to review"), pendingReview.map(row => renderCard(row, cardActions))), needsContact.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "32px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 4px 0"
    }
  }, "Needs a contact"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px",
      fontStyle: "italic",
      marginBottom: "12px"
    }
  }, "Genuinely fresh opportunity, but monday has no named individual on file yet - either a generic team/company contact, or nothing at all. Find a named person before outreach can be drafted."), needsContact.map(renderNeedsContactCard)), needsProfile.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "32px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 4px 0"
    }
  }, "Needs a LinkedIn profile"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px",
      fontStyle: "italic",
      marginBottom: "12px"
    }
  }, "These have a named contact but no LinkedIn profile URL yet — profile lookup is a manual/browser step, not automated."), needsProfile.map(row => renderCard(row, cardActions))), needsNewContact.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "32px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 4px 0"
    }
  }, "Needs a different contact"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px",
      fontStyle: "italic",
      marginBottom: "12px"
    }
  }, "Flagged as the wrong person for this project. Type in a replacement if you already know one, or \"Find a different contact\" to have me research it live."), needsNewContact.map(renderNeedsNewContactCard)), readyToSend.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "32px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 4px 0"
    }
  }, "Ready to send"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px",
      fontStyle: "italic",
      marginBottom: "12px"
    }
  }, "Connection note is pre-filled and waiting in your LinkedIn tab. Open it, review, click Send there, then mark it as sent here so the record stays accurate."), readyToSend.map(row => renderCard(row, sentActions))), pipeline.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "4px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: 0
    }
  }, "Sent — tracking replies"), canEdit && awaitingOutcome.length > 0 && /*#__PURE__*/React.createElement("a", {
    href: checkStatusUrl,
    style: {
      background: "none",
      border: "1px solid #9CC3D4",
      color: "#9CC3D4",
      borderRadius: "4px",
      fontSize: "12px",
      padding: "5px 10px",
      textDecoration: "none",
      display: "inline-block"
    }
  }, `Check outreach status (${awaitingOutcome.length}) ↗`)), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px",
      fontStyle: "italic",
      marginBottom: "12px"
    }
  }, "Everyone you've reached out to. Update the status yourself as things move, or use \"Check outreach status\" to open a live Claude session that checks LinkedIn for the ", awaitingOutcome.length, " still-pending rows and updates them for you — LinkedIn doesn't push status changes to us on its own."), pipeline.map(renderPipelineCard)), rows.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "8px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 12px 0"
    }
  }, "All contacts"), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12.5px"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, ["Opportunity", "Contact", "Status", "Last activity"].map(h => /*#__PURE__*/React.createElement("th", {
    key: h,
    style: {
      textAlign: "left",
      padding: "8px 14px",
      color: "#71767D",
      fontWeight: 600,
      fontSize: "11.5px",
      textTransform: "uppercase",
      letterSpacing: "0.03em",
      borderBottom: "1px solid #23272D",
      background: "#14171B",
      position: "sticky",
      top: 0
    }
  }, h)))), /*#__PURE__*/React.createElement("tbody", null, [...rows].sort((a, b) => new Date(outreachLastActivity(b) || 0) - new Date(outreachLastActivity(a) || 0)).map((row, idx) => {
    const meta = OUTREACH_STATUS_META[row.status] || {
      label: row.status,
      color: "#71767D"
    };
    const activity = outreachLastActivity(row);
    return /*#__PURE__*/React.createElement("tr", {
      key: row.id,
      style: {
        borderTop: idx === 0 ? "none" : "1px solid #23272D"
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px 14px",
        color: "#C7CAD0"
      }
    }, /*#__PURE__*/React.createElement("span", {
      onClick: () => onOpenItem(row.item_id),
      style: {
        color: "#9CC3D4",
        cursor: "pointer"
      }
    }, row.opportunity_name), row.company && /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#71767D"
      }
    }, " — ", row.company)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px 14px",
        color: "#C7CAD0",
        whiteSpace: "nowrap"
      }
    }, row.contact_name || "—", row.contact_role ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#71767D"
      }
    }, ` (${row.contact_role})`) : null), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px 14px",
        whiteSpace: "nowrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        color: meta.color,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: meta.color,
        display: "inline-block"
      }
    }), meta.label)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "8px 14px",
        color: "#71767D",
        whiteSpace: "nowrap"
      }
    }, activity ? new Date(activity).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short"
    }) : "—"));
  }))))));
}
const OPPORTUNITY_TYPES = ["Process Plant", "NPI", "Village & Camp", "General"];
// Pursuit status: this is the primary way opportunities are grouped on the board.
// "Needs Review" is the default for anything with no status set yet.
const STATUS_ORDER = ["Needs Review", "Investigating", "Chasing", "Passed"];
const BID_STATUS_STYLE = {
  "Needs Review": {
    color: "#4B4E53",
    bar: "#4B4E53",
    label: "Needs Review — not yet triaged"
  },
  "Investigating": {
    color: "#4F7C90",
    bar: "#4F7C90",
    label: "Investigating — still qualifying"
  },
  "Chasing": {
    color: "#6B8F6B",
    bar: "#6B8F6B",
    label: "Chasing — active pursuit"
  },
  "Passed": {
    color: "#71767D",
    bar: "#71767D",
    label: "Passed — not pursuing"
  }
};
// Legacy values previously stored in Supabase's bid_status table (and any
// browser tab caching the old labels) map onto the new status names so
// nothing silently falls back to "unclassified" during/after the rename.
const LEGACY_STATUS_MAP = {
  "Active Bid": "Chasing",
  "Dead Bid": "Passed",
  "Watching": "Investigating",
  "Unclassified": "Needs Review"
};
function normalizeBidStatus(raw) {
  if (!raw) return "Needs Review";
  if (BID_STATUS_STYLE[raw]) return raw;
  return LEGACY_STATUS_MAP[raw] || "Needs Review";
}
function BidStatusBadge({
  itemId,
  status,
  onChange,
  disabled
}) {
  const current = normalizeBidStatus(status);
  const style = BID_STATUS_STYLE[current] || BID_STATUS_STYLE["Needs Review"];
  return /*#__PURE__*/React.createElement("select", {
    value: current,
    disabled: disabled,
    onClick: e => e.stopPropagation(),
    onChange: e => {
      e.stopPropagation();
      onChange(itemId, e.target.value);
    },
    style: {
      appearance: "none",
      background: "transparent",
      border: `1px solid ${style.color}`,
      color: style.color,
      fontSize: "11px",
      borderRadius: "3px",
      padding: "2px 8px",
      cursor: disabled ? "default" : "pointer",
      fontFamily: "'IBM Plex Sans', sans-serif",
      opacity: disabled ? 0.6 : 1
    }
  }, Object.keys(BID_STATUS_STYLE).map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s,
    style: {
      background: "#1D2126",
      color: "#EDE9E1"
    }
  }, s)));
}
function SignInControl({
  session
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const sendLink = async () => {
    if (!email.trim()) return;
    setSending(true);
    setError(null);
    const {
      error
    } = await supabaseClient.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.href.split("#")[0].split("?")[0]
      }
    });
    setSending(false);
    if (error) setError("Couldn't send link. Check the email and try again.");else setSent(true);
  };
  const signOut = async () => {
    await supabaseClient.auth.signOut();
  };
  if (session) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "12.5px"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#71767D"
      }
    }, session.user.email), /*#__PURE__*/React.createElement("button", {
      onClick: signOut,
      style: {
        background: "transparent",
        border: "1px solid #2C3138",
        color: "#9A9DA2",
        borderRadius: "3px",
        padding: "4px 10px",
        cursor: "pointer",
        fontSize: "12px"
      }
    }, "Sign out"));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, !open ? /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(true),
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: "#9A9DA2",
      borderRadius: "3px",
      padding: "5px 12px",
      cursor: "pointer",
      fontSize: "12.5px"
    }
  }, "Sign in to edit") : sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px"
    }
  }, "Check your email for a sign-in link.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@company.com",
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "5px 10px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: sendLink,
    disabled: sending,
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: "#EDE9E1",
      borderRadius: "3px",
      padding: "5px 12px",
      cursor: "pointer",
      fontSize: "12.5px"
    }
  }, sending ? "Sending…" : "Send link"), error && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#C1592E",
      fontSize: "12px"
    }
  }, error)));
}
function Chip({
  children,
  active,
  onClick
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      padding: "6px 12px",
      borderRadius: "3px",
      border: active ? "1px solid #C1592E" : "1px solid #2C3138",
      background: active ? "rgba(193,89,46,0.12)" : "transparent",
      color: active ? "#E9987A" : "#9A9DA2",
      fontSize: "13px",
      fontFamily: "'IBM Plex Sans', sans-serif",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "border-color 150ms, color 150ms, background 150ms"
    }
  }, children);
}
function Select({
  value,
  onChange,
  options,
  placeholder
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange(e.target.value),
    style: {
      appearance: "none",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: value ? "#EDE9E1" : "#71767D",
      fontSize: "13px",
      fontFamily: "'IBM Plex Sans', sans-serif",
      padding: "8px 30px 8px 12px",
      cursor: "pointer",
      minWidth: "140px"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, placeholder), options.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o))), /*#__PURE__*/React.createElement(ChevronDownIcon, {
    size: 14,
    style: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#71767D",
      pointerEvents: "none"
    }
  }));
}
function TaskList({
  itemId,
  canEdit
}) {
  const [tasks, setTasks] = useState(null);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("tasks").select("*").eq("item_id", itemId).order("due_date", {
        ascending: true
      });
      if (!cancelled) setTasks(error ? [] : data);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);
  const addTask = async () => {
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    const {
      data,
      error
    } = await supabaseClient.from("tasks").insert({
      item_id: itemId,
      text: text.trim(),
      due_date: dueDate || null,
      done: false
    }).select();
    if (error) {
      setError("Couldn't save task. Try again.");
    } else {
      setTasks([...(tasks || []), data[0]].sort((a, b) => (a.due_date || "9999").localeCompare(b.due_date || "9999")));
      setText("");
      setDueDate("");
    }
    setSaving(false);
  };
  const toggleDone = async task => {
    const nextDone = !task.done;
    setTasks(tasks.map(t => t.id === task.id ? {
      ...t,
      done: nextDone
    } : t));
    await supabaseClient.from("tasks").update({
      done: nextDone
    }).eq("id", task.id);
  };
  const todayStr = new Date().toISOString().split("T")[0];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "8px"
    }
  }, "Tasks"), tasks === null ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px"
    }
  }, "Loading…") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      marginBottom: "10px"
    }
  }, tasks.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px"
    }
  }, "No tasks yet."), tasks.map(t => {
    const overdue = t.due_date && t.due_date < todayStr && !t.done;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        display: "flex",
        gap: "8px",
        alignItems: "flex-start",
        fontSize: "13px"
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: !!t.done,
      disabled: !canEdit,
      onChange: () => toggleDone(t),
      style: {
        marginTop: "3px",
        cursor: canEdit ? "pointer" : "default",
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        opacity: t.done ? 0.5 : 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#C7CAD0",
        textDecoration: t.done ? "line-through" : "none"
      }
    }, t.text), t.due_date && /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: "8px",
        fontSize: "11.5px",
        color: overdue ? "#E9987A" : "#5E6268"
      }
    }, overdue ? "overdue " : "due ", new Date(t.due_date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short"
    }))));
  })), canEdit && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "New task",
    style: {
      flex: 1,
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "6px 10px"
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: dueDate,
    onChange: e => setDueDate(e.target.value),
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "6px 8px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "6px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#C1592E",
      fontSize: "12px"
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: addTask,
    disabled: saving || !text.trim(),
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: text.trim() ? "#EDE9E1" : "#5E6268",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 14px",
      cursor: text.trim() ? "pointer" : "default"
    }
  }, saving ? "Saving…" : "Add task"))));
}
function ContactList({
  itemId,
  company,
  canEdit
}) {
  const [contacts, setContacts] = useState(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("contacts").select("*").eq("item_id", itemId).order("created_at", {
        ascending: true
      });
      if (!cancelled) setContacts(error ? [] : data);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);
  const addContact = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    const {
      data,
      error
    } = await supabaseClient.from("contacts").insert({
      item_id: itemId,
      name: name.trim(),
      role: role.trim() || null,
      email: email.trim() || null
    }).select();
    if (error) {
      setError("Couldn't save contact. Try again.");
    } else {
      setContacts([...(contacts || []), data[0]]);
      setName("");
      setRole("");
      setEmail("");
    }
    setSaving(false);
  };
  const removeContact = async id => {
    setContacts(contacts.filter(c => c.id !== id));
    await supabaseClient.from("contacts").delete().eq("id", id);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "8px"
    }
  }, "Contacts"), contacts === null ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px"
    }
  }, "Loading…") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "10px"
    }
  }, contacts.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px"
    }
  }, "No additional contacts yet."), contacts.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      fontSize: "13px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#EDE9E1"
    }
  }, c.name, c.role ? ` — ${c.role}` : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      marginTop: "2px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(c.name + " " + (company || ""))}`,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12px",
      textDecoration: "none"
    }
  }, "LinkedIn"), c.email && /*#__PURE__*/React.createElement("a", {
    href: `mailto:${c.email}`,
    style: {
      color: "#9CC3D4",
      fontSize: "12px",
      textDecoration: "none"
    }
  }, c.email))), canEdit && /*#__PURE__*/React.createElement("button", {
    onClick: () => removeContact(c.id),
    style: {
      background: "none",
      border: "none",
      color: "#5E6268",
      cursor: "pointer",
      fontSize: "12px"
    }
  }, "Remove")))), canEdit && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Name",
    style: {
      flex: "1 1 120px",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "6px 10px"
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: role,
    onChange: e => setRole(e.target.value),
    placeholder: "Role",
    style: {
      flex: "1 1 100px",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "6px 10px"
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "Email (optional)",
    style: {
      flex: "1 1 140px",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "6px 10px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "6px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#C1592E",
      fontSize: "12px"
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: addContact,
    disabled: saving || !name.trim(),
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: name.trim() ? "#EDE9E1" : "#5E6268",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 14px",
      cursor: name.trim() ? "pointer" : "default"
    }
  }, saving ? "Saving…" : "Add contact"))));
}
function HistoryLog({
  itemId,
  onUndo,
  canEdit
}) {
  const [history, setHistory] = useState(null);
  const load = async () => {
    const {
      data,
      error
    } = await supabaseClient.from("override_history").select("*").eq("item_id", itemId).order("changed_at", {
      ascending: false
    }).limit(10);
    setHistory(error ? [] : data);
  };
  useEffect(() => {
    load();
  }, [itemId]);
  const undo = async entry => {
    await onUndo(entry.field, entry.old_value);
    load();
  };
  if (history === null) return null;
  if (history.length === 0) return null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "8px"
    }
  }, "History"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, history.map(h => /*#__PURE__*/React.createElement("div", {
    key: h.id,
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "12.5px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#8B9198"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#C7CAD0"
    }
  }, h.field), ": ", h.old_value || "—", " → ", h.new_value || "—", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11px"
    }
  }, " ", "by ", h.changed_by, ", ", new Date(h.changed_at).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short"
  }))), canEdit && /*#__PURE__*/React.createElement("button", {
    onClick: () => undo(h),
    style: {
      background: "none",
      border: "none",
      color: "#9CC3D4",
      cursor: "pointer",
      fontSize: "12px",
      flexShrink: 0,
      marginLeft: "10px"
    }
  }, "Undo")))));
}
function CommentThread({
  itemId,
  commenterName,
  setCommenterName,
  canEdit
}) {
  const [comments, setComments] = useState(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const loadComments = async () => {
    const {
      data,
      error
    } = await supabaseClient.from("comments").select("*").eq("item_id", itemId).order("created_at", {
      ascending: true
    });
    setComments(error ? [] : data);
  };
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("comments").select("*").eq("item_id", itemId).order("created_at", {
        ascending: true
      });
      if (!cancelled) setComments(error ? [] : data);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [itemId]);
  const addComment = async () => {
    if (!text.trim()) return;
    setSaving(true);
    setError(null);
    const {
      data,
      error
    } = await supabaseClient.from("comments").insert({
      item_id: itemId,
      author: commenterName || "Anonymous",
      text: text.trim(),
      resolved: false
    }).select();
    if (error) {
      setError("Couldn't save comment. Try again.");
    } else {
      setComments([...(comments || []), data[0]]);
      setText("");
    }
    setSaving(false);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "8px"
    }
  }, "Comments"), comments === null ? /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px"
    }
  }, "Loading…") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginBottom: "10px"
    }
  }, comments.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px"
    }
  }, "No comments yet."), comments.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      fontSize: "13px",
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#9CC3D4"
    }
  }, c.author), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11.5px"
    }
  }, new Date(c.created_at).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#C7CAD0"
    }
  }, c.text)))), canEdit && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
    value: commenterName,
    onChange: e => setCommenterName(e.target.value),
    placeholder: "Your name",
    style: {
      width: "100%",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "6px 10px",
      boxSizing: "border-box",
      marginBottom: "6px"
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Add a comment or action item",
    rows: 2,
    style: {
      width: "100%",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "13px",
      padding: "8px 10px",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "inherit"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "6px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#C1592E",
      fontSize: "12px"
    }
  }, error), /*#__PURE__*/React.createElement("button", {
    onClick: addComment,
    disabled: saving || !text.trim(),
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: text.trim() ? "#EDE9E1" : "#5E6268",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 14px",
      cursor: text.trim() ? "pointer" : "default"
    }
  }, saving ? "Saving…" : "Add comment"))));
}
function OutreachDrafter({
  item,
  senderName
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("email");
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const generate = selectedMode => {
    setOpen(true);
    setMode(selectedMode);
    setCopied(false);
    setDraft(selectedMode === "email" ? buildEmailDraft(item, senderName) : buildLinkedInDraft(item, senderName));
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => generate("email"),
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: "#9CC3D4",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 12px",
      cursor: "pointer"
    }
  }, "Draft email"), /*#__PURE__*/React.createElement("button", {
    onClick: () => generate("linkedin"),
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: "#9CC3D4",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 12px",
      cursor: "pointer"
    }
  }, "Draft LinkedIn note")), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "10px"
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: draft,
    onChange: e => setDraft(e.target.value),
    rows: mode === "email" ? 7 : 3,
    style: {
      width: "100%",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "13px",
      padding: "10px",
      boxSizing: "border-box",
      resize: "vertical",
      fontFamily: "inherit",
      lineHeight: 1.5
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    style: {
      marginTop: "6px",
      background: "transparent",
      border: "1px solid #2C3138",
      color: "#EDE9E1",
      borderRadius: "3px",
      fontSize: "12.5px",
      padding: "6px 14px",
      cursor: "pointer"
    }
  }, copied ? "Copied" : "Copy")));
}
function OpportunityTypeControl({
  item,
  canEdit,
  onChange,
  allTypes
}) {
  const [adding, setAdding] = useState(false);
  const [newTag, setNewTag] = useState("");
  const current = item.opportunityTypes || [];
  const types = allTypes && allTypes.length ? allTypes : OPPORTUNITY_TYPES;
  const toggle = type => {
    const next = current.includes(type) ? current.filter(t => t !== type) : [...current, type];
    onChange(item.id, next, item.algoOpportunityTypes);
  };
  const addCustomTag = () => {
    const tag = newTag.trim();
    if (tag && !current.includes(tag)) {
      onChange(item.id, [...current, tag], item.algoOpportunityTypes);
    }
    setNewTag("");
    setAdding(false);
  };
  const isOverridden = JSON.stringify([...current].sort()) !== JSON.stringify([...(item.algoOpportunityTypes || [])].sort());
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "4px"
    }
  }, "Opportunity Type"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "6px",
      flexWrap: "wrap",
      marginBottom: "4px",
      alignItems: "center"
    }
  }, types.map(type => {
    const selected = current.includes(type);
    return /*#__PURE__*/React.createElement("button", {
      key: type,
      disabled: !canEdit,
      onClick: e => {
        e.stopPropagation();
        toggle(type);
      },
      style: {
        background: selected ? "rgba(79,124,144,0.15)" : "transparent",
        border: selected ? "1px solid #4F7C90" : "1px solid #2C3138",
        color: selected ? "#9CC3D4" : "#71767D",
        borderRadius: "3px",
        fontSize: "12px",
        padding: "4px 10px",
        cursor: canEdit ? "pointer" : "default",
        opacity: canEdit ? 1 : 0.6
      }
    }, type);
  }), canEdit && (adding ? /*#__PURE__*/React.createElement("span", {
    onClick: e => e.stopPropagation(),
    style: {
      display: "inline-flex",
      gap: "4px"
    }
  }, /*#__PURE__*/React.createElement("input", {
    autoFocus: true,
    value: newTag,
    placeholder: "New tag",
    onChange: e => setNewTag(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") addCustomTag();
      if (e.key === "Escape") {
        setNewTag("");
        setAdding(false);
      }
    },
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12px",
      padding: "3px 8px",
      width: "110px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: addCustomTag,
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: "#9CC3D4",
      borderRadius: "3px",
      fontSize: "12px",
      padding: "3px 8px",
      cursor: "pointer"
    }
  }, "Add")) : /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setAdding(true);
    },
    style: {
      background: "transparent",
      border: "1px dashed #2C3138",
      color: "#5E6268",
      borderRadius: "3px",
      fontSize: "12px",
      padding: "4px 10px",
      cursor: "pointer"
    }
  }, "+ New tag"))), isOverridden ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#71767D",
      fontSize: "11.5px"
    }
  }, "overridden — algorithm says ", (item.algoOpportunityTypes || []).join(", ") || "None", " ", /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onChange(item.id, item.algoOpportunityTypes || [], item.algoOpportunityTypes);
    },
    style: {
      color: "#9CC3D4",
      cursor: "pointer"
    }
  }, "(reset)")) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11.5px"
    }
  }, "from algorithm"));
}
function Detail({
  label,
  value
}) {
  if (!value) return null;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "4px"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#C7CAD0",
      fontSize: "13px",
      lineHeight: 1.5
    }
  }, value));
}
function Row({
  item,
  isOpen,
  onToggle,
  commenterName,
  setCommenterName,
  bidStatus,
  onBidStatusChange,
  onTierOverride,
  onClearTierOverride,
  onFundingChange,
  onEngagementChange,
  onStageOverride,
  onOpportunityTypesChange,
  allOpportunityTypes,
  onWarmthChange,
  canEdit,
  onUndo
}) {
  const style = TIER_STYLE[item.tier] || TIER_STYLE["Unscoped"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: `3px solid ${style.bar}`,
      background: isOpen ? "#20242A" : "transparent",
      transition: "background 150ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    className: "bd-row bd-row-grid"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#EDE9E1",
      fontSize: "14.5px",
      fontFamily: "'IBM Plex Sans', sans-serif",
      fontWeight: 500,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px",
      marginTop: "2px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.company || "Company unknown", " · ", formatAddedDate(item.createdAt), item.updatedAt ? ` · ${formatUpdatedDate(item.updatedAt)}` : null)), /*#__PURE__*/React.createElement("div", {
    className: "bd-col-hide",
    style: {
      color: "#B7BBC1",
      fontSize: "13px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.commodity), /*#__PURE__*/React.createElement("div", {
    className: "bd-col-hide",
    style: {
      color: "#8B9198",
      fontSize: "13px"
    }
  }, item.state), /*#__PURE__*/React.createElement("div", {
    className: "bd-col-hide",
    style: {
      color: "#8B9198",
      fontSize: "12.5px"
    }
  }, item.stage), /*#__PURE__*/React.createElement("div", {
    className: "bd-col-hide",
    style: {
      color: "#8B9198",
      fontSize: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.source), /*#__PURE__*/React.createElement("div", {
    className: "bd-col-hide",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(OutreachStatusChip, {
    item: item
  })), /*#__PURE__*/React.createElement("div", {
    className: "bd-col-hide"
  }, /*#__PURE__*/React.createElement(WarmthBadge, {
    itemId: item.id,
    warmth: item.warmth,
    algoWarmth: item.algoWarmth,
    onChange: onWarmthChange,
    disabled: !canEdit
  })), /*#__PURE__*/React.createElement("div", {
    className: "bd-col-hide"
  }, /*#__PURE__*/React.createElement(BidStatusBadge, {
    itemId: item.id,
    status: bidStatus,
    onChange: onBidStatusChange,
    disabled: !canEdit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'IBM Plex Mono', monospace",
      color: item.score >= 35 ? "#E9987A" : "#B7BBC1",
      fontSize: "14px",
      textAlign: "right"
    }
  }, item.score)), isOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 18px 20px 18px",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "16px",
      borderTop: "1px solid #2C3138",
      marginTop: "-1px",
      paddingTop: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "4px"
    }
  }, "Tier"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: item.tier,
    disabled: !canEdit,
    onClick: e => e.stopPropagation(),
    onChange: e => {
      e.stopPropagation();
      onTierOverride(item.id, e.target.value, item.algoTier);
    },
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "4px 8px",
      opacity: canEdit ? 1 : 0.6
    }
  }, TIER_ORDER.map(t => /*#__PURE__*/React.createElement("option", {
    key: t,
    value: t
  }, t))), item.tier !== item.algoTier ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#71767D",
      fontSize: "11.5px"
    }
  }, "overridden — algorithm says ", item.algoTier, " ", /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onClearTierOverride(item.id);
    },
    style: {
      color: "#9CC3D4",
      cursor: "pointer"
    }
  }, "(reset)")) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11.5px"
    }
  }, "from algorithm"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "4px"
    }
  }, "Stage"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("input", {
    list: "stage-suggestions",
    defaultValue: item.stage,
    disabled: !canEdit,
    onClick: e => e.stopPropagation(),
    onBlur: e => {
      if (e.target.value.trim() && e.target.value !== item.stage) onStageOverride(item.id, e.target.value.trim(), item.algoStage);
    },
    onKeyDown: e => {
      if (e.key === "Enter") e.target.blur();
    },
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "4px 8px",
      opacity: canEdit ? 1 : 0.6,
      width: "160px"
    }
  }), /*#__PURE__*/React.createElement("datalist", {
    id: "stage-suggestions"
  }, ["Scoping", "PFS", "DFS", "Detailed Design", "FEED", "Approvals", "ECI", "Dual ECI", "EPC", "EPCM", "Construction", "Commissioning", "Care and Maintenance", "Development", "Unclear"].map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }))), item.stage !== item.algoStage ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#71767D",
      fontSize: "11.5px"
    }
  }, "overridden — algorithm says ", item.algoStage, " ", /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onStageOverride(item.id, item.algoStage, item.algoStage);
    },
    style: {
      color: "#9CC3D4",
      cursor: "pointer"
    }
  }, "(reset)")) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11.5px"
    }
  }, "from algorithm"))), /*#__PURE__*/React.createElement(OpportunityTypeControl, {
    item: item,
    canEdit: canEdit,
    onChange: onOpportunityTypesChange,
    allTypes: allOpportunityTypes
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Trigger event",
    value: item.trigger
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Next action",
    value: item.nextAction
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Path to win",
    value: item.pathToWin
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "4px"
    }
  }, "Key contact"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: displayContactName(item) ? "#EDE9E1" : "#5E6268",
      fontSize: "13px",
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "8px"
    }
  }, displayContactName(item) || "—", item.outreachContactRole ? /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8B9198",
      fontSize: "12px"
    }
  }, `(${item.outreachContactRole})`) : null, item.outreachLinkedIn && /*#__PURE__*/React.createElement("a", {
    href: item.outreachLinkedIn,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12px",
      textDecoration: "none"
    }
  }, "LinkedIn ↗"), item.outreachStatus && /*#__PURE__*/React.createElement("span", {
    style: {
      color: (OUTREACH_STATUS_META[item.outreachStatus] || {}).color || "#8B9198",
      fontSize: "11px",
      border: "1px solid currentColor",
      borderRadius: "3px",
      padding: "1px 6px"
    }
  }, (OUTREACH_STATUS_META[item.outreachStatus] || {}).label || item.outreachStatus))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "4px"
    }
  }, "Funding status"), /*#__PURE__*/React.createElement("select", {
    value: item.funding || "",
    disabled: !canEdit,
    onClick: e => e.stopPropagation(),
    onChange: e => {
      e.stopPropagation();
      onFundingChange(item.id, e.target.value, item.algoFunding);
    },
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "4px 8px",
      opacity: canEdit ? 1 : 0.6
    }
  }, ["", "Funded", "Raising", "Unfunded", "Unclear"].map(f => /*#__PURE__*/React.createElement("option", {
    key: f,
    value: f
  }, f || "—")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "4px"
    }
  }, "Position"), /*#__PURE__*/React.createElement("select", {
    value: item.dbmv || "",
    disabled: !canEdit,
    onClick: e => e.stopPropagation(),
    onChange: e => {
      e.stopPropagation();
      onEngagementChange(item.id, e.target.value, item.algoDbmv);
    },
    style: {
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "12.5px",
      padding: "4px 8px",
      opacity: canEdit ? 1 : 0.6
    }
  }, ["Cold", "Warm", "Active"].map(s => /*#__PURE__*/React.createElement("option", {
    key: s,
    value: s
  }, s)))), /*#__PURE__*/React.createElement(Detail, {
    label: "Last reviewed",
    value: item.lastReviewed
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Date added",
    value: formatShortDate(item.createdAt) || "Unknown"
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Last updated",
    value: formatShortDate(item.updatedAt) || "Unknown"
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Notes",
    value: item.notes
  }), item.sourceUrl && item.sourceUrl.includes("http") && /*#__PURE__*/React.createElement("a", {
    href: item.sourceUrl.match(/https?:\/\/\S+/)?.[0] || "#",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12.5px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
      textDecoration: "none",
      alignSelf: "start"
    }
  }, "Open source ", /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    size: 12
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      borderTop: "1px solid #2C3138",
      paddingTop: "16px",
      marginTop: "4px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "11px",
      marginBottom: "8px"
    }
  }, "Reach out"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "14px",
      marginBottom: "12px"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: linkedInSearchUrl(item),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12.5px",
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      textDecoration: "none"
    }
  }, hasUsableContact(item) ? `Find ${displayContactName(item)} on LinkedIn` : "Find contacts on LinkedIn", " ", /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    size: 12
  })), !hasUsableContact(item) && /*#__PURE__*/React.createElement("a", {
    href: companyLinkedInSearchUrl(item),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12.5px",
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      textDecoration: "none"
    }
  }, "Company LinkedIn page ", /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    size: 12
  })), !hasUsableContact(item) && /*#__PURE__*/React.createElement("a", {
    href: companyWebsiteSearchUrl(item),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12.5px",
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      textDecoration: "none"
    }
  }, "Company website ", /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    size: 12
  }))), /*#__PURE__*/React.createElement(OutreachDrafter, {
    item: item,
    senderName: commenterName
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      borderTop: "1px solid #2C3138",
      paddingTop: "16px"
    }
  }, /*#__PURE__*/React.createElement(ContactList, {
    itemId: item.id,
    company: item.company || item.name,
    canEdit: canEdit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      borderTop: "1px solid #2C3138",
      paddingTop: "16px"
    }
  }, /*#__PURE__*/React.createElement(TaskList, {
    itemId: item.id,
    canEdit: canEdit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      borderTop: "1px solid #2C3138",
      paddingTop: "16px"
    }
  }, /*#__PURE__*/React.createElement(CommentThread, {
    itemId: item.id,
    commenterName: commenterName,
    setCommenterName: setCommenterName,
    canEdit: canEdit
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      borderTop: "1px solid #2C3138",
      paddingTop: "16px"
    }
  }, /*#__PURE__*/React.createElement(HistoryLog, {
    itemId: item.id,
    canEdit: canEdit,
    onUndo: (field, oldValue) => onUndo(item, field, oldValue)
  }))));
}
function Dashboard() {
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  // Separate from generatedAt (which is "when this page loaded", used only as
  // the calendar-day key for the client-side pipeline_snapshots upsert below
  // -- not a real freshness signal). lastDataChangeAt is the real answer to
  // "when did the underlying project data actually last change": the max
  // opportunities.updated_at from the n8n sync job itself. Added 2026-09-21
  // per Greg asking when the page updates -- see BdReportPage/header for
  // where this is shown, and the brief for the verified sync schedule
  // (n8n Schedule Trigger fires daily ~00:00 AWST + an extra pass Monday
  // ~06:00 AWST; confirmed via real execution history, not inferred).
  const [lastDataChangeAt, setLastDataChangeAt] = useState(null);
  const [search, setSearch] = useState("");
  const [commodity, setCommodity] = useState("");
  const [state, setState] = useState("");
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [tierFilter, setTierFilter] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [commenterName, setCommenterNameState] = useState("");
  const [view, setView] = useState("pipeline");
  const [session, setSession] = useState(null);
  const canEdit = !!session;
  useEffect(() => {
    supabaseClient.auth.getSession().then(({
      data
    }) => setSession(data.session));
    const {
      data: listener
    } = supabaseClient.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);
  const [workflowErrors, setWorkflowErrors] = useState([]);
  useEffect(() => {
    async function loadWorkflowErrors() {
      const {
        data,
        error
      } = await supabaseClient.from("workflow_errors").select("*").eq("acknowledged", false).order("occurred_at", {
        ascending: false
      }).limit(10);
      if (!error && data) setWorkflowErrors(data);
    }
    loadWorkflowErrors();
  }, []);
  const acknowledgeWorkflowError = async id => {
    setWorkflowErrors(prev => prev.filter(e => e.id !== id));
    await supabaseClient.from("workflow_errors").update({
      acknowledged: true
    }).eq("id", id);
  };
  const [bidStatusMap, setBidStatusMap] = useState({});
  const [commentsIndex, setCommentsIndex] = useState({});
  useEffect(() => {
    async function loadAllCommentsForSearch() {
      const {
        data,
        error
      } = await supabaseClient.from("comments").select("item_id, text");
      if (!error && data) {
        const idx = {};
        data.forEach(c => {
          idx[c.item_id] = (idx[c.item_id] ? idx[c.item_id] + " " : "") + c.text;
        });
        setCommentsIndex(idx);
      }
    }
    loadAllCommentsForSearch();
  }, []);
  const [bidStatusFilter, setBidStatusFilter] = useState("");
  const [warmthFilter, setWarmthFilter] = useState("");
  const [sortMode, setSortMode] = useState("score");
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState("");
  const [tierOverrideMap, setTierOverrideMap] = useState({});
  const [fundingOverrideMap, setFundingOverrideMap] = useState({});
  const [engagementOverrideMap, setEngagementOverrideMap] = useState({});
  const [stageOverrideMap, setStageOverrideMap] = useState({});
  const [opportunityTypeOverrideMap, setOpportunityTypeOverrideMap] = useState({});
  const [warmthOverrideMap, setWarmthOverrideMap] = useState({});
  useEffect(() => {
    // One consolidated "overrides" table (item_id, field, value jsonb) backs all seven
    // override kinds below - a single row per (item, field) instead of seven separate
    // tables. Loaded once here and fanned out into the same seven maps the rest of this
    // component already expects, so nothing downstream needs to change.
    async function loadAllOverrides() {
      const {
        data,
        error
      } = await supabaseClient.from("overrides").select("*");
      if (!error && data) {
        const bid = {},
          tier = {},
          funding = {},
          engagement = {},
          stage = {},
          type = {},
          warmth = {};
        data.forEach(r => {
          if (r.field === "bid_status") bid[r.item_id] = r.value;else if (r.field === "tier") tier[r.item_id] = r.value;else if (r.field === "funding_status") funding[r.item_id] = r.value;else if (r.field === "engagement_stage") engagement[r.item_id] = r.value;else if (r.field === "stage") stage[r.item_id] = r.value;else if (r.field === "opportunity_type") type[r.item_id] = r.value;else if (r.field === "lead_warmth") warmth[r.item_id] = r.value;
        });
        setBidStatusMap(bid);
        setTierOverrideMap(tier);
        setFundingOverrideMap(funding);
        setEngagementOverrideMap(engagement);
        setStageOverrideMap(stage);
        setOpportunityTypeOverrideMap(type);
        setWarmthOverrideMap(warmth);
      }
    }
    loadAllOverrides();
  }, []);
  const logHistory = async (itemId, field, oldValue, newValue) => {
    await supabaseClient.from("override_history").insert({
      item_id: itemId,
      field,
      old_value: oldValue != null ? String(oldValue) : null,
      new_value: newValue != null ? String(newValue) : null,
      changed_by: commenterName || "Anonymous"
    });
  };
  const upsertOverride = async (itemId, field, value) => {
    await supabaseClient.from("overrides").upsert({
      item_id: itemId,
      field,
      value,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "item_id,field"
    });
  };
  const setBidStatus = async (itemId, status) => {
    const oldValue = normalizeBidStatus(bidStatusMap[itemId]);
    setBidStatusMap(prev => ({
      ...prev,
      [itemId]: status
    }));
    await upsertOverride(itemId, "bid_status", status);
    logHistory(itemId, "Bid Status", oldValue, status);
    if (status === "Chasing") {
      setEngagementStage(itemId, "Active");
    }
  };
  const setTierOverride = async (itemId, tier, algoTier) => {
    const oldValue = tierOverrideMap[itemId] || algoTier;
    setTierOverrideMap(prev => ({
      ...prev,
      [itemId]: tier
    }));
    await upsertOverride(itemId, "tier", tier);
    logHistory(itemId, "Tier", oldValue, tier);
  };
  const clearTierOverride = async itemId => {
    setTierOverrideMap(prev => {
      const next = {
        ...prev
      };
      delete next[itemId];
      return next;
    });
    await supabaseClient.from("overrides").delete().eq("item_id", itemId).eq("field", "tier");
  };
  const setOpportunityTypes = async (itemId, types, algoTypes) => {
    const oldValue = opportunityTypeOverrideMap[itemId] !== undefined ? opportunityTypeOverrideMap[itemId] : algoTypes;
    setOpportunityTypeOverrideMap(prev => ({
      ...prev,
      [itemId]: types
    }));
    await upsertOverride(itemId, "opportunity_type", types);
    logHistory(itemId, "Opportunity Type", (oldValue || []).join(", ") || "None", types.join(", ") || "None");
  };
  const setStageOverride = async (itemId, stage, algoStage) => {
    const oldValue = stageOverrideMap[itemId] !== undefined ? stageOverrideMap[itemId] : algoStage;
    setStageOverrideMap(prev => ({
      ...prev,
      [itemId]: stage
    }));
    await upsertOverride(itemId, "stage", stage);
    logHistory(itemId, "Stage", oldValue, stage);
  };
  const setFundingStatus = async (itemId, status, algoFunding) => {
    const oldValue = fundingOverrideMap[itemId] !== undefined ? fundingOverrideMap[itemId] : algoFunding;
    setFundingOverrideMap(prev => ({
      ...prev,
      [itemId]: status
    }));
    await upsertOverride(itemId, "funding_status", status);
    logHistory(itemId, "Funding Status", oldValue, status);
  };
  const setEngagementStage = async (itemId, stage, algoDbmv) => {
    const oldValue = engagementOverrideMap[itemId] || algoDbmv;
    setEngagementOverrideMap(prev => ({
      ...prev,
      [itemId]: stage
    }));
    await upsertOverride(itemId, "engagement_stage", stage);
    logHistory(itemId, "Position", oldValue, stage);
  };
  const setWarmthOverride = async (itemId, warmth, algoWarmth) => {
    const oldValue = warmthOverrideMap[itemId] || algoWarmth;
    setWarmthOverrideMap(prev => ({
      ...prev,
      [itemId]: warmth
    }));
    await upsertOverride(itemId, "lead_warmth", warmth);
    logHistory(itemId, "Lead Warmth", oldValue, warmth);
  };
  useEffect(() => {
    const saved = localStorage.getItem("commenter-name");
    if (saved) setCommenterNameState(saved);
  }, []);
  const setCommenterName = name => {
    setCommenterNameState(name);
    localStorage.setItem("commenter-name", name);
  };
  useEffect(() => {
    // Base item list is read live from Supabase (public.opportunities) rather
    // than the old twice-daily static data.json snapshot exported from the
    // Monday board. Monday is now a view-only mirror; nothing here depends on
    // it, so an item removed from the Monday board no longer makes it
    // disappear from the dashboard (see brief, 2026-09-10 session).
    async function loadItems() {
      try {
        const [oppResult, outreachResult] = await Promise.all([supabaseClient.from("opportunities").select("item_id, name, company, commodity, state, stage, priority_tier, engagement_stage, funding_status, opportunity_types, bd_score, bd_rank, npi_potential, owner_accessibility, source_ref, source_url, first_seen_at, last_reviewed_at, notes_short, latitude, longitude, raw, updated_at").limit(2000), supabaseClient.from("outreach_queue").select("item_id, contact_name, contact_role, contact_linkedin_url, status, queued_at, prepared_at, connect_sent_at, message_sent_at, reviewed_at")]);
        const {
          data,
          error
        } = oppResult;
        if (error) throw new Error(error.message);
        // Best outreach_queue row per opportunity — used as the feedback loop
        // for "who's the contact" / "have we reached out" (see brief, 2026-09-15
        // session: this is the current, human-reviewed record, more reliable
        // than the raw Monday "Key Contact" text field synced into `raw`, which
        // only updates on the next Monday->Supabase pipeline run). Most-advanced
        // status wins when a project has more than one queue row (e.g. an old
        // skipped row plus a newer real one).
        const OUTREACH_RANK = ["meeting_booked", "replied", "connected", "message_sent", "connect_sent", "ready_to_send", "approved", "needs_profile", "pending_review", "declined", "skipped_by_user"];
        const outreachByItem = {};
        if (!outreachResult.error) {
          for (const row of outreachResult.data || []) {
            const existing = outreachByItem[row.item_id];
            if (!existing) {
              outreachByItem[row.item_id] = row;
              continue;
            }
            const existingRank = OUTREACH_RANK.indexOf(existing.status);
            const rowRank = OUTREACH_RANK.indexOf(row.status);
            const existingBetter = existingRank === -1 ? false : rowRank === -1 ? true : existingRank <= rowRank;
            if (!existingBetter) outreachByItem[row.item_id] = row;
          }
        }
        const mapped = (data || []).map(row => {
          const outreach = outreachByItem[row.item_id] || null;
          return {
            id: row.item_id,
            name: row.name,
            company: row.company,
            commodity: row.commodity,
            state: row.state,
            stage: row.stage,
            tier: row.priority_tier,
            dbmv: row.engagement_stage,
            funding: row.funding_status,
            opportunityTypes: row.opportunity_types || [],
            score: row.bd_score != null ? Number(row.bd_score) : 0,
            rank: row.bd_rank != null ? Number(row.bd_rank) : null,
            npiPotential: row.npi_potential || null,
            ownerAccessibility: row.owner_accessibility || null,
            // Display the true data provenance (MINEDEX, EPA WA, Business News,
            // Mining.com.au, etc.) rather than which internal ingestion batch
            // wrote the row (MONDAY_LEGACY / N8N_LIVE_PIPELINE) - that internal
            // tag isn't meaningful to Greg and was never meant to be user-facing.
            source: row.source_ref || null,
            sourceUrl: row.source_url,
            createdAt: row.first_seen_at,
            lastReviewed: row.last_reviewed_at,
            notes: row.notes_short,
            latitude: row.latitude != null ? Number(row.latitude) : null,
            longitude: row.longitude != null ? Number(row.longitude) : null,
            coordinatesApproximate: !!(row.raw && row.raw.coordinates_approximate),
            contact: row.raw && row.raw.key_contact || null,
            trigger: row.raw && row.raw.trigger_event || null,
            pathToWin: row.raw && row.raw.path_to_win || null,
            nextAction: row.raw && row.raw.next_action || null,
            outreachContactName: outreach ? outreach.contact_name : null,
            outreachContactRole: outreach ? outreach.contact_role : null,
            outreachLinkedIn: outreach ? outreach.contact_linkedin_url : null,
            outreachStatus: outreach ? outreach.status : null
          };
        });
        setItems(mapped);
        setGeneratedAt(new Date().toISOString());
        const changeTimes = (data || []).map(r => r.updated_at ? new Date(r.updated_at).getTime() : 0).filter(t => t > 0);
        if (changeTimes.length) setLastDataChangeAt(new Date(Math.max(...changeTimes)).toISOString());
      } catch (e) {
        setLoadError(e.message);
      }
    }
    loadItems();
  }, []);
  useEffect(() => {
    if (!items || !generatedAt) return;
    async function recordSnapshot() {
      const dateStr = generatedAt.split("T")[0];
      const primeWindow = items.filter(i => i.tier === "Prime Window").length;
      const liveWindow = items.filter(i => i.tier === "Live Window").length;
      const lateWindow = items.filter(i => i.tier === "Late Window").length;
      const closed = items.filter(i => i.tier === "Closed").length;
      const unscoped = items.filter(i => i.tier === "Unscoped").length;
      const avgScore = items.length ? items.reduce((s, i) => s + i.score, 0) / items.length : 0;
      // pipeline_snapshots keeps its original 4 tier-count columns (its schema is
      // out of scope for this change), so the 5 new tiers map onto them as closely
      // as possible: Closed and Unscoped both roll into archive_count since neither
      // is an open pursuit.
      await supabaseClient.from("pipeline_snapshots").upsert({
        snapshot_date: dateStr,
        tier1_count: primeWindow,
        tier2_count: liveWindow,
        monitor_count: lateWindow,
        archive_count: closed + unscoped,
        total_count: items.length,
        avg_score: avgScore
      }, {
        onConflict: "snapshot_date",
        ignoreDuplicates: true
      });
    }
    recordSnapshot();
  }, [items, generatedAt]);
  const effectiveItems = useMemo(() => {
    return (items || []).map(i => {
      const effectiveDbmv = engagementOverrideMap[i.id] || i.dbmv;
      // "Best placed to chase" ranking (2026-09-18): chaseability is Owner
      // Accessibility + NPI Potential combined, per Greg — easy-to-reach AND
      // has real engineering scope ranks top. Sub-scores reuse the exact
      // weights already live in the production BD Score formula (n8n
      // `Recalculate Score` node: npiScore High/Medium/Low = 20/10/0,
      // accessScore High/Medium/Low = 10/5/0) so this sort agrees with the
      // numbers Greg already trusts on the board, rather than inventing a
      // new scale. That combined figure (0-30) is the primary sort key,
      // multiplied up so it always dominates; BD Score itself (which folds
      // in stage/funding/geo/relationship) is the tie-break within a tier,
      // replacing the old recency+relationship formula that had nothing to
      // do with chaseability and produced flat ties for same-day, same-score
      // opportunities.
      const chaseScore = chaseScoreFromParts(i.npiPotential, i.ownerAccessibility, i.score);
      const algoWarmth = deriveWarmth(i);
      return {
        ...i,
        algoTier: i.tier,
        tier: tierOverrideMap[i.id] || i.tier,
        algoFunding: i.funding,
        funding: fundingOverrideMap[i.id] !== undefined ? fundingOverrideMap[i.id] : i.funding,
        algoDbmv: i.dbmv,
        dbmv: effectiveDbmv,
        algoStage: i.stage,
        stage: stageOverrideMap[i.id] || i.stage,
        algoOpportunityTypes: i.opportunityTypes || [],
        opportunityTypes: opportunityTypeOverrideMap[i.id] !== undefined ? opportunityTypeOverrideMap[i.id] : i.opportunityTypes || [],
        algoWarmth,
        warmth: warmthOverrideMap[i.id] || algoWarmth,
        chaseScore
      };
    });
  }, [items, tierOverrideMap, fundingOverrideMap, engagementOverrideMap, stageOverrideMap, opportunityTypeOverrideMap, warmthOverrideMap]);
  const counts = useCounts(effectiveItems);
  const commodityBreakdown = useCommodityBreakdown(effectiveItems);
  const stateBreakdown = useStateBreakdown(effectiveItems);
  const allOpportunityTypes = useAllOpportunityTypes(effectiveItems);
  const commodities = useMemo(() => uniqueSorted(effectiveItems, "commodity"), [effectiveItems]);
  const states = useMemo(() => uniqueSorted(effectiveItems, "state"), [effectiveItems]);
  const stages = useMemo(() => uniqueSorted(effectiveItems, "stage"), [effectiveItems]);
  const sources = useMemo(() => uniqueSorted(effectiveItems, "source"), [effectiveItems]);
  const filtered = useMemo(() => {
    if (!items) return [];
    const q = search.trim().toLowerCase();
    return effectiveItems.filter(i => {
      if (tierFilter && i.tier !== tierFilter) return false;
      if (commodity && i.commodity !== commodity) return false;
      if (state && i.state !== state) return false;
      if (stage && i.stage !== stage) return false;
      if (source && i.source !== source) return false;
      if (bidStatusFilter && normalizeBidStatus(bidStatusMap[i.id]) !== bidStatusFilter) return false;
      if (opportunityTypeFilter && !(i.opportunityTypes || []).includes(opportunityTypeFilter)) return false;
      if (warmthFilter && ((WARMTH_META[i.warmth] || {}).label || i.warmth) !== warmthFilter) return false;
      if (q) {
        const hay = `${i.name} ${i.company} ${i.notes || ""} ${i.trigger || ""} ${i.pathToWin || ""} ${i.nextAction || ""} ${i.contact || ""} ${commentsIndex[i.id] || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, effectiveItems, search, commodity, state, stage, source, tierFilter, bidStatusFilter, bidStatusMap, commentsIndex, opportunityTypeFilter, warmthFilter]);
  const grouped = useMemo(() => {
    const g = {};
    STATUS_ORDER.forEach(s => {
      g[s] = [];
    });
    filtered.forEach(i => {
      const s = normalizeBidStatus(bidStatusMap[i.id]);
      g[s].push(i);
    });
    const comparator = sortMode === "date" ? (a, b) => new Date(b.createdAt) - new Date(a.createdAt) : sortMode === "chase" ? (a, b) => b.chaseScore - a.chaseScore : (a, b) => a.rank - b.rank;
    Object.values(g).forEach(arr => arr.sort(comparator));
    return g;
  }, [filtered, bidStatusMap, sortMode]);
  const anyFilterActive = search || commodity || state || stage || source || tierFilter || bidStatusFilter || opportunityTypeFilter || warmthFilter;
  const clearAll = () => {
    setSearch("");
    setCommodity("");
    setState("");
    setStage("");
    setSource("");
    setTierFilter(null);
    setBidStatusFilter("");
    setOpportunityTypeFilter("");
    setWarmthFilter("");
  };
  const exportCsv = () => {
    const columns = [{
      label: "Project",
      get: i => i.name
    }, {
      label: "Company",
      get: i => i.company
    }, {
      label: "Commodity",
      get: i => i.commodity
    }, {
      label: "State",
      get: i => i.state
    }, {
      label: "Stage",
      get: i => i.stage
    }, {
      label: "Tier",
      get: i => i.tier
    }, {
      label: "Opportunity Type",
      get: i => (i.opportunityTypes || []).join("; ")
    }, {
      label: "Pursuit Status",
      get: i => normalizeBidStatus(bidStatusMap[i.id])
    }, {
      label: "Outreach Status",
      get: i => outreachBadgeMeta(i).label
    }, {
      label: "Lead Warmth",
      get: i => (WARMTH_META[i.warmth] || {}).label || i.warmth
    }, {
      label: "Added",
      get: i => i.createdAt
    }, {
      label: "Funding Status",
      get: i => i.funding
    }, {
      label: "Position",
      get: i => i.dbmv
    }, {
      label: "BD Score",
      get: i => i.score
    }, {
      label: "BD Rank",
      get: i => i.rank
    }, {
      label: "Source",
      get: i => i.source
    }, {
      label: "Source URL",
      get: i => i.sourceUrl
    }, {
      label: "Key Contact",
      get: i => i.contact
    }, {
      label: "Trigger Event",
      get: i => i.trigger
    }, {
      label: "Path to Win",
      get: i => i.pathToWin
    }, {
      label: "Next Action",
      get: i => i.nextAction
    }, {
      label: "Last Reviewed",
      get: i => i.lastReviewed
    }, {
      label: "Notes",
      get: i => i.notes
    }, {
      label: "Latitude",
      get: i => i.latitude
    }, {
      label: "Longitude",
      get: i => i.longitude
    }];
    const escapeCell = value => {
      const str = value === null || value === undefined ? "" : String(value);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };
    const header = columns.map(c => escapeCell(c.label)).join(",");
    const rows = filtered.map(item => columns.map(c => escapeCell(c.get(item))).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const dateStr = new Date().toISOString().split("T")[0];
    link.download = `mining-bd-pipeline-${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  // Clicking a project from BD Report / Outreach / Comments used to just
  // switch to the Pipeline tab and set openId, but a leftover search/filter
  // from earlier Pipeline browsing could hide the item entirely (it's still
  // "open" internally, just nothing on screen to show for it), and even with
  // no filter active there was no scroll -- landing back at the top of a
  // 650+ row list is indistinguishable from "did nothing" (2026-09-23, per
  // Greg: "takes you back to the pipeline but not to that project itself...
  // you have to search for that job"). Clearing filters guarantees the item
  // is actually in the rendered list; the scroll effect below (keyed off
  // openId) then brings it into view once it's on screen.
  const openItemFromActions = itemId => {
    clearAll();
    setView("pipeline");
    setOpenId(itemId);
  };
  // Scrolls the just-opened item's row into view once it's actually on the
  // page. Runs after clearAll()+setOpenId() above commit (filters clearing
  // and openId changing land in the same render), and also covers directly
  // expanding a row by clicking it in the list itself.
  useEffect(() => {
    if (view !== "pipeline" || openId == null) return;
    const el = document.getElementById(`pipeline-item-${openId}`);
    if (el) el.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }, [view, openId, filtered]);
  const handleUndo = (item, field, oldValue) => {
    if (field === "Tier") setTierOverride(item.id, oldValue, item.algoTier);else if (field === "Bid Status") setBidStatus(item.id, oldValue);else if (field === "Funding Status") setFundingStatus(item.id, oldValue, item.algoFunding);else if (field === "Position") setEngagementStage(item.id, oldValue, item.algoDbmv);else if (field === "Stage") setStageOverride(item.id, oldValue, item.algoStage);else if (field === "Lead Warmth") setWarmthOverride(item.id, oldValue, item.algoWarmth);else if (field === "Opportunity Type") {
      const restored = oldValue === "None" || !oldValue ? [] : oldValue.split(", ");
      setOpportunityTypes(item.id, restored, item.algoOpportunityTypes);
    }
  };
  if (loadError) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#14171B",
        minHeight: "100vh",
        color: "#E9987A",
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: "60px 20px",
        textAlign: "center"
      }
    }, "Couldn't load the dashboard data (", loadError, "). Check the Supabase connection.");
  }
  if (!items) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#14171B",
        minHeight: "100vh",
        color: "#8B9198",
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: "60px 20px",
        textAlign: "center"
      }
    }, "Loading pipeline…");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#14171B",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Cg fill='none' stroke='%23FFFFFF' stroke-width='1' opacity='0.025'%3E%3Cpath d='M0,80 Q100,40 200,80 T400,80'/%3E%3Cpath d='M0,140 Q100,100 200,140 T400,140'/%3E%3Cpath d='M0,200 Q100,160 200,200 T400,200'/%3E%3Cpath d='M0,260 Q100,220 200,260 T400,260'/%3E%3Cpath d='M0,320 Q100,280 200,320 T400,320'/%3E%3C/g%3E%3C/svg%3E")`,
      minHeight: "100vh",
      fontFamily: "'IBM Plex Sans', sans-serif",
      padding: "40px 20px 80px"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .bd-row:hover { background: rgba(255,255,255,0.02); }
        select option { background: #1D2126; }

        .bd-row-grid {
          display: grid;
          grid-template-columns: minmax(0,1.9fr) minmax(0,1.2fr) 110px 64px 120px 96px 84px 100px 60px;
          gap: 14px;
          align-items: center;
          padding: 13px 18px 13px 15px;
          cursor: pointer;
        }

        @media (max-width: 640px) {
          .bd-row-grid {
            grid-template-columns: minmax(0,1fr) 56px;
            gap: 10px;
            padding: 12px 14px;
          }
          .bd-col-hide { display: none; }
          .bd-top-nav { flex-wrap: wrap; row-gap: 10px; }
        }
      `), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1040px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(WorkflowErrorBanner, {
    errors: workflowErrors,
    canEdit: canEdit,
    onAcknowledge: acknowledgeWorkflowError
  }), /*#__PURE__*/React.createElement("div", {
    className: "bd-top-nav",
    style: {
      display: "flex",
      gap: "18px",
      marginBottom: "24px",
      borderBottom: "1px solid #23272D",
      paddingBottom: "12px",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "18px",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("pipeline"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      color: view === "pipeline" ? "#EDE9E1" : "#71767D",
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: view === "pipeline" ? "2px solid #C1592E" : "2px solid transparent",
      paddingBottom: "12px",
      marginBottom: "-13px"
    }
  }, "Pipeline"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("comments"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      color: view === "comments" ? "#EDE9E1" : "#71767D",
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: view === "comments" ? "2px solid #C1592E" : "2px solid transparent",
      paddingBottom: "12px",
      marginBottom: "-13px"
    }
  }, "Comments"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("map"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      color: view === "map" ? "#EDE9E1" : "#71767D",
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: view === "map" ? "2px solid #C1592E" : "2px solid transparent",
      paddingBottom: "12px",
      marginBottom: "-13px"
    }
  }, "Map"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("outreach"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      color: view === "outreach" ? "#EDE9E1" : "#71767D",
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: view === "outreach" ? "2px solid #C1592E" : "2px solid transparent",
      paddingBottom: "12px",
      marginBottom: "-13px"
    }
  }, "Outreach"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView("report"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      color: view === "report" ? "#EDE9E1" : "#71767D",
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: view === "report" ? "2px solid #C1592E" : "2px solid transparent",
      paddingBottom: "12px",
      marginBottom: "-13px"
    }
  }, "BD Report")), /*#__PURE__*/React.createElement(SignInControl, {
    session: session
  })), view === "report" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "28px",
      color: "#EDE9E1",
      margin: "0 0 28px 0"
    }
  }, "BD Report"), /*#__PURE__*/React.createElement(BdReportPage, {
    items: effectiveItems,
    onOpenItem: openItemFromActions,
    canEdit: canEdit
  })) : view === "comments" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "28px",
      color: "#EDE9E1",
      margin: "0 0 28px 0"
    }
  }, "Comments"), /*#__PURE__*/React.createElement(CommentsLog, {
    items: effectiveItems,
    onOpenItem: openItemFromActions
  })) : view === "map" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "28px",
      color: "#EDE9E1",
      margin: "0 0 28px 0"
    }
  }, "Map"), /*#__PURE__*/React.createElement(MapView, {
    items: effectiveItems,
    onOpenItem: openItemFromActions
  })) : view === "outreach" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "28px",
      color: "#EDE9E1",
      margin: "0 0 28px 0"
    }
  }, "Outreach Queue"), /*#__PURE__*/React.createElement(OutreachQueue, {
    canEdit: canEdit,
    onOpenItem: openItemFromActions,
    onBidStatusChange: setBidStatus
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "wrap",
      gap: "10px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "6px"
    }
  }, "Mining business development pipeline"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "34px",
      color: "#EDE9E1",
      margin: 0,
      letterSpacing: "-0.01em"
    }
  }, effectiveItems.length, " opportunities in the pipeline")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px",
      textAlign: "right"
    }
  }, "Data last changed", /*#__PURE__*/React.createElement("br", null), lastDataChangeAt ? new Date(lastDataChangeAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "unknown", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "11px"
    }
  }, "Syncs daily, ~midnight AWST"))), /*#__PURE__*/React.createElement(StrataBar, {
    counts: counts,
    total: items.length
  }), /*#__PURE__*/React.createElement(CommodityStrip, {
    breakdown: commodityBreakdown,
    total: items.length,
    activeValue: commodity,
    onSelect: setCommodity
  }), /*#__PURE__*/React.createElement(CommodityStrip, {
    breakdown: stateBreakdown,
    total: items.length,
    colors: STATE_COLORS,
    activeValue: state,
    onSelect: setState
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      marginTop: "34px",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "1 1 200px",
      minWidth: "180px"
    }
  }, /*#__PURE__*/React.createElement(SearchIcon, {
    size: 14,
    style: {
      position: "absolute",
      left: "11px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#71767D"
    }
  }), /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "Search project, company, notes, comments...",
    style: {
      width: "100%",
      background: "#1D2126",
      border: "1px solid #2C3138",
      borderRadius: "3px",
      color: "#EDE9E1",
      fontSize: "13px",
      padding: "8px 12px 8px 32px",
      boxSizing: "border-box"
    }
  })), /*#__PURE__*/React.createElement(Select, {
    value: commodity,
    onChange: setCommodity,
    options: commodities,
    placeholder: "Any commodity"
  }), /*#__PURE__*/React.createElement(Select, {
    value: state,
    onChange: setState,
    options: states,
    placeholder: "Any state"
  }), /*#__PURE__*/React.createElement(Select, {
    value: stage,
    onChange: setStage,
    options: stages,
    placeholder: "Any stage"
  }), /*#__PURE__*/React.createElement(Select, {
    value: source,
    onChange: setSource,
    options: sources,
    placeholder: "Any source"
  }), /*#__PURE__*/React.createElement(Select, {
    value: bidStatusFilter,
    onChange: setBidStatusFilter,
    options: Object.keys(BID_STATUS_STYLE),
    placeholder: "Any bid status"
  }), /*#__PURE__*/React.createElement(Select, {
    value: opportunityTypeFilter,
    onChange: setOpportunityTypeFilter,
    options: allOpportunityTypes,
    placeholder: "Any opportunity type"
  }), /*#__PURE__*/React.createElement(Select, {
    value: warmthFilter,
    onChange: setWarmthFilter,
    options: WARMTH_ORDER.map(w => WARMTH_META[w].label),
    placeholder: "Any warmth"
  }), anyFilterActive && /*#__PURE__*/React.createElement("button", {
    onClick: clearAll,
    style: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
      background: "transparent",
      border: "none",
      color: "#71767D",
      fontSize: "13px",
      cursor: "pointer",
      padding: "8px 4px"
    }
  }, /*#__PURE__*/React.createElement(XIcon, {
    size: 13
  }), " Clear"), /*#__PURE__*/React.createElement("button", {
    onClick: exportCsv,
    style: {
      background: "transparent",
      border: "1px solid #2C3138",
      color: "#9A9DA2",
      borderRadius: "3px",
      fontSize: "13px",
      padding: "8px 14px",
      cursor: "pointer",
      whiteSpace: "nowrap"
    }
  }, "Export CSV")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "16px",
      marginTop: "14px",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      flexWrap: "wrap"
    }
  }, TIER_ORDER.map(tier => /*#__PURE__*/React.createElement(Chip, {
    key: tier,
    active: tierFilter === tier,
    onClick: () => setTierFilter(tierFilter === tier ? null : tier)
  }, tier, " (", counts[tier], ")"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "4px",
      alignItems: "center",
      color: "#71767D",
      fontSize: "12px"
    }
  }, "Sort:", /*#__PURE__*/React.createElement(Chip, {
    active: sortMode === "score",
    onClick: () => setSortMode("score")
  }, "BD Score"), /*#__PURE__*/React.createElement(Chip, {
    active: sortMode === "date",
    onClick: () => setSortMode("date")
  }, "Newest added"), /*#__PURE__*/React.createElement(Chip, {
    active: sortMode === "chase",
    onClick: () => setSortMode("chase")
  }, "Best placed to chase"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "36px"
    }
  }, STATUS_ORDER.map(statusKey => {
    const rows = grouped[statusKey];
    if (!rows.length) return null;
    const style = BID_STATUS_STYLE[statusKey];
    return /*#__PURE__*/React.createElement("div", {
      key: statusKey,
      style: {
        marginBottom: "34px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: "10px",
        marginBottom: "10px"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "'Fraunces', serif",
        fontWeight: 600,
        fontSize: "19px",
        color: style.color,
        margin: 0
      }
    }, statusKey), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#5E6268",
        fontSize: "13px"
      }
    }, rows.length)), /*#__PURE__*/React.createElement("div", {
      style: {
        border: "1px solid #23272D",
        borderRadius: "4px",
        overflow: "hidden"
      }
    }, rows.map((item, idx) => /*#__PURE__*/React.createElement("div", {
      key: item.id,
      id: `pipeline-item-${item.id}`,
      style: {
        borderTop: idx === 0 ? "none" : "1px solid #23272D"
      }
    }, /*#__PURE__*/React.createElement(Row, {
      item: item,
      isOpen: openId === item.id,
      onToggle: () => setOpenId(openId === item.id ? null : item.id),
      commenterName: commenterName,
      setCommenterName: setCommenterName,
      bidStatus: bidStatusMap[item.id],
      onBidStatusChange: setBidStatus,
      onTierOverride: setTierOverride,
      onClearTierOverride: clearTierOverride,
      onFundingChange: setFundingStatus,
      onEngagementChange: setEngagementStage,
      onStageOverride: setStageOverride,
      onOpportunityTypesChange: setOpportunityTypes,
      allOpportunityTypes: allOpportunityTypes,
      onWarmthChange: setWarmthOverride,
      canEdit: canEdit,
      onUndo: handleUndo
    })))));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "14px",
      padding: "40px 0",
      textAlign: "center"
    }
  }, "No opportunities match these filters.")))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(Dashboard, null));
