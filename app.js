const {
  useState,
  useMemo,
  useEffect
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
const TIER_ORDER = ["Tier 1", "Tier 2", "Monitor", "Archive"];
const TIER_STYLE = {
  "Tier 1": {
    bar: "#C1592E",
    text: "#E9987A",
    label: "Tier 1 — active pursuit"
  },
  "Tier 2": {
    bar: "#B08D57",
    text: "#D9BE8C",
    label: "Tier 2 — warm pipeline"
  },
  "Monitor": {
    bar: "#4F7C90",
    text: "#9CC3D4",
    label: "Monitor — watching"
  },
  "Archive": {
    bar: "#4B4E53",
    text: "#9A9DA2",
    label: "Archive — closed or stale"
  }
};
function useCounts(items) {
  return useMemo(() => {
    const counts = {
      "Tier 1": 0,
      "Tier 2": 0,
      "Monitor": 0,
      "Archive": 0
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
const COMMODITY_COLORS = ["#C1592E", "#B08D57", "#4F7C90", "#6B8F6B", "#8B6BAE", "#71767D"];
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
  const name = isRealPersonName(item.contact) ? extractPersonName(item.contact) : "";
  const company = item.company || item.name;
  const q = name ? `${name} ${company}` : `${company} Project Director OR Study Manager OR General Manager OR Procurement Manager`;
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(q)}`;
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
  total
}) {
  const max = breakdown.length ? breakdown[0][1] : 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "22px",
      display: "flex",
      flexWrap: "wrap",
      gap: "18px 28px"
    }
  }, breakdown.map(([name, count], idx) => /*#__PURE__*/React.createElement("div", {
    key: name,
    style: {
      minWidth: "90px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "5px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#9A9DA2",
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
      background: COMMODITY_COLORS[idx % COMMODITY_COLORS.length],
      borderRadius: "2px"
    }
  })))));
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
function CommentThread({
  itemId,
  commenterName,
  setCommenterName
}) {
  const [comments, setComments] = useState(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
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
      text: text.trim()
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
  }, c.text)))), /*#__PURE__*/React.createElement("input", {
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
    placeholder: "Add a comment",
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
  }, saving ? "Saving…" : "Add comment")));
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
  setCommenterName
}) {
  const style = TIER_STYLE[item.tier] || TIER_STYLE["Monitor"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderLeft: `3px solid ${style.bar}`,
      background: isOpen ? "#20242A" : "transparent",
      transition: "background 150ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onToggle,
    style: {
      display: "grid",
      gridTemplateColumns: "minmax(0,2.2fr) minmax(0,1.4fr) 110px 64px 120px 60px",
      gap: "14px",
      alignItems: "center",
      padding: "13px 18px 13px 15px",
      cursor: "pointer"
    },
    className: "bd-row"
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
  }, item.company || "Company unknown")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#B7BBC1",
      fontSize: "13px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.commodity), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#8B9198",
      fontSize: "13px"
    }
  }, item.state), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#8B9198",
      fontSize: "12.5px"
    }
  }, item.stage), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#8B9198",
      fontSize: "12px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, item.source), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement(Detail, {
    label: "Trigger event",
    value: item.trigger
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Next action",
    value: item.nextAction
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Path to win",
    value: item.pathToWin
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Key contact",
    value: item.contact
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Funding status",
    value: item.funding
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "DBMV position",
    value: item.dbmv
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Last reviewed",
    value: item.lastReviewed
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
  }, "Reach out"), /*#__PURE__*/React.createElement("a", {
    href: linkedInSearchUrl(item),
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: "#9CC3D4",
      fontSize: "12.5px",
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      textDecoration: "none",
      marginBottom: "12px"
    }
  }, isRealPersonName(item.contact) ? `Find ${extractPersonName(item.contact)} on LinkedIn` : "Find contacts on LinkedIn", " ", /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    size: 12
  })), /*#__PURE__*/React.createElement(OutreachDrafter, {
    item: item,
    senderName: commenterName
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: "1 / -1",
      borderTop: "1px solid #2C3138",
      paddingTop: "16px"
    }
  }, /*#__PURE__*/React.createElement(CommentThread, {
    itemId: item.id,
    commenterName: commenterName,
    setCommenterName: setCommenterName
  }))));
}
function Dashboard() {
  const [items, setItems] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [search, setSearch] = useState("");
  const [commodity, setCommodity] = useState("");
  const [state, setState] = useState("");
  const [stage, setStage] = useState("");
  const [source, setSource] = useState("");
  const [tierFilter, setTierFilter] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [commenterName, setCommenterNameState] = useState("");
  useEffect(() => {
    const saved = localStorage.getItem("commenter-name");
    if (saved) setCommenterNameState(saved);
  }, []);
  const setCommenterName = name => {
    setCommenterNameState(name);
    localStorage.setItem("commenter-name", name);
  };
  useEffect(() => {
    fetch("./data.json").then(r => {
      if (!r.ok) throw new Error("Failed to load data");
      return r.json();
    }).then(payload => {
      setItems(payload.items || payload);
      setGeneratedAt(payload.generatedAt || null);
    }).catch(e => setLoadError(e.message));
  }, []);
  const counts = useCounts(items || []);
  const commodityBreakdown = useCommodityBreakdown(items || []);
  const commodities = useMemo(() => uniqueSorted(items || [], "commodity"), [items]);
  const states = useMemo(() => uniqueSorted(items || [], "state"), [items]);
  const stages = useMemo(() => uniqueSorted(items || [], "stage"), [items]);
  const sources = useMemo(() => uniqueSorted(items || [], "source"), [items]);
  const filtered = useMemo(() => {
    if (!items) return [];
    const q = search.trim().toLowerCase();
    return items.filter(i => {
      if (tierFilter && i.tier !== tierFilter) return false;
      if (commodity && i.commodity !== commodity) return false;
      if (state && i.state !== state) return false;
      if (stage && i.stage !== stage) return false;
      if (source && i.source !== source) return false;
      if (q) {
        const hay = `${i.name} ${i.company}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, search, commodity, state, stage, source, tierFilter]);
  const grouped = useMemo(() => {
    const g = {
      "Tier 1": [],
      "Tier 2": [],
      "Monitor": [],
      "Archive": []
    };
    filtered.forEach(i => {
      if (g[i.tier]) g[i.tier].push(i);
    });
    Object.values(g).forEach(arr => arr.sort((a, b) => a.rank - b.rank));
    return g;
  }, [filtered]);
  const anyFilterActive = search || commodity || state || stage || source || tierFilter;
  const clearAll = () => {
    setSearch("");
    setCommodity("");
    setState("");
    setStage("");
    setSource("");
    setTierFilter(null);
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
    }, "Couldn't load the dashboard data (", loadError, "). Check that data.json is present alongside this page.");
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
        @media (max-width: 720px) {
          .bd-hide-mobile { display: none !important; }
        }
      `), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "1040px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "18px",
      marginBottom: "24px",
      borderBottom: "1px solid #23272D",
      paddingBottom: "12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#EDE9E1",
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: "2px solid #C1592E",
      paddingBottom: "12px",
      marginBottom: "-13px"
    }
  }, "Pipeline"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4B4E53",
      fontSize: "13px"
    },
    title: "Not yet built"
  }, "Weekly review"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4B4E53",
      fontSize: "13px"
    },
    title: "Not yet built"
  }, "Staging boards")), /*#__PURE__*/React.createElement("div", {
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
  }, items.length, " opportunities in the pipeline")), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#5E6268",
      fontSize: "12.5px",
      textAlign: "right"
    }
  }, "Last updated", /*#__PURE__*/React.createElement("br", null), generatedAt ? new Date(generatedAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "unknown")), /*#__PURE__*/React.createElement(StrataBar, {
    counts: counts,
    total: items.length
  }), /*#__PURE__*/React.createElement(CommodityStrip, {
    breakdown: commodityBreakdown,
    total: items.length
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
    placeholder: "Search project or company",
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
  }), " Clear")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "8px",
      marginTop: "14px"
    }
  }, TIER_ORDER.map(tier => /*#__PURE__*/React.createElement(Chip, {
    key: tier,
    active: tierFilter === tier,
    onClick: () => setTierFilter(tierFilter === tier ? null : tier)
  }, tier, " (", counts[tier], ")"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "36px"
    }
  }, TIER_ORDER.map(tier => {
    const rows = grouped[tier];
    if (!rows.length) return null;
    const style = TIER_STYLE[tier];
    return /*#__PURE__*/React.createElement("div", {
      key: tier,
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
        color: style.text,
        margin: 0
      }
    }, tier), /*#__PURE__*/React.createElement("span", {
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
      style: {
        borderTop: idx === 0 ? "none" : "1px solid #23272D"
      }
    }, /*#__PURE__*/React.createElement(Row, {
      item: item,
      isOpen: openId === item.id,
      onToggle: () => setOpenId(openId === item.id ? null : item.id),
      commenterName: commenterName,
      setCommenterName: setCommenterName
    })))));
  }), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "14px",
      padding: "40px 0",
      textAlign: "center"
    }
  }, "No opportunities match these filters."))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(Dashboard, null));