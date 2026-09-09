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
function hasUsableContact(item) {
  return isRealPersonName(item.contact);
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
function PipelineTrend() {
  const [snapshots, setSnapshots] = useState(null);
  useEffect(() => {
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("pipeline_snapshots").select("*").order("snapshot_date", {
        ascending: true
      }).limit(12);
      setSnapshots(error ? [] : data);
    }
    load();
  }, []);
  if (snapshots === null) return null;
  if (snapshots.length < 2) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#5E6268",
        fontSize: "13px",
        marginBottom: "32px"
      }
    }, "Pipeline trend will build up here as this page gets opened after each weekly refresh.");
  }
  const max = Math.max(...snapshots.map(s => s.total_count || 0), 1);
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
  }, "Pipeline over time"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "14px"
    }
  }, "Total tracked opportunities at each weekly snapshot."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: "6px",
      height: "70px"
    }
  }, snapshots.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    title: `${s.snapshot_date}: ${s.total_count} total`,
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
      height: `${(s.total_count || 0) / max * 100}%`,
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
  }, new Date(snapshots[0].snapshot_date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5E6268",
      fontSize: "11px"
    }
  }, new Date(snapshots[snapshots.length - 1].snapshot_date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short"
  }))));
}
function FocusPage({
  items,
  onOpenItem,
  bidStatusMap
}) {
  const [tasks, setTasks] = useState(null);
  useEffect(() => {
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("tasks").select("*").order("due_date", {
        ascending: true
      });
      setTasks(error ? [] : data);
    }
    load();
  }, []);
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().split("T")[0];
  const in7Str = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const isDeadBid = i => normalizeBidStatus(bidStatusMap[i.id]) === "Passed";
  const itemsById = {};
  items.forEach(i => {
    itemsById[i.id] = i;
  });
  const newThisWeek = items.filter(i => new Date(i.createdAt) >= weekAgo).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const focus = items.filter(i => (i.tier === "Prime Window" || i.tier === "Live Window") && !isDeadBid(i)).sort((a, b) => b.chaseScore - a.chaseScore);
  const stale = items.filter(i => (i.tier === "Prime Window" || i.tier === "Live Window") && (!i.lastReviewed || new Date(i.lastReviewed) < thirtyDaysAgo) && !isDeadBid(i)).sort((a, b) => b.score - a.score).slice(0, 12);
  const overdueTasks = tasks ? tasks.filter(t => !t.done && t.due_date && t.due_date < todayStr) : [];
  const dueThisWeekTasks = tasks ? tasks.filter(t => !t.done && t.due_date && t.due_date >= todayStr && t.due_date <= in7Str) : [];
  const itemsWithNoTasks = tasks ? items.filter(i => !tasks.some(t => t.item_id === i.id)).length : 0;
  const TaskRow = ({
    task
  }) => {
    const item = itemsById[task.item_id];
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
        fontSize: "13.5px"
      }
    }, task.text), /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#71767D",
        fontSize: "12px",
        marginTop: "2px"
      }
    }, item ? /*#__PURE__*/React.createElement("span", {
      onClick: () => onOpenItem(item.id),
      style: {
        color: "#9CC3D4",
        cursor: "pointer"
      }
    }, item.name) : "Unknown opportunity")), /*#__PURE__*/React.createElement("div", {
      style: {
        color: "#E9987A",
        fontSize: "12px",
        flexShrink: 0,
        marginLeft: "12px"
      }
    }, new Date(task.due_date).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short"
    })));
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PipelineTrend, null), tasks !== null && (overdueTasks.length > 0 || dueThisWeekTasks.length > 0) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "36px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#E9987A",
      margin: "0 0 4px 0"
    }
  }, "Tasks due"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "12px"
    }
  }, "Overdue and due-this-week tasks across the whole pipeline."), /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #23272D",
      borderRadius: "4px",
      overflow: "hidden"
    }
  }, overdueTasks.map(t => /*#__PURE__*/React.createElement(TaskRow, {
    key: t.id,
    task: t
  })), dueThisWeekTasks.map(t => /*#__PURE__*/React.createElement(TaskRow, {
    key: t.id,
    task: t
  })))), /*#__PURE__*/React.createElement(ReviewSection, {
    title: "New this week",
    description: "Opportunities added to the board in the last 7 days.",
    items: newThisWeek,
    emptyText: "Nothing new landed this week."
  }), /*#__PURE__*/React.createElement(ReviewSection, {
    title: "Best placed to chase now",
    description: "Prime Window and Live Window opportunities ranked by how recently they were added, whether you've already got a relationship started, and BD score as a tie-break.",
    items: focus,
    emptyText: "No clear focus candidates right now."
  }), /*#__PURE__*/React.createElement(ReviewSection, {
    title: "Needs a second look",
    description: "Prime Window and Live Window opportunities that haven't been reviewed in 30+ days.",
    items: stale,
    emptyText: "Everything's been reviewed recently."
  }), tasks !== null && itemsWithNoTasks > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid #2C3138",
      borderRadius: "4px",
      padding: "16px 18px",
      color: "#9A9DA2",
      fontSize: "13px",
      lineHeight: 1.6
    }
  }, itemsWithNoTasks, " of ", items.length, " opportunities have no tasks set. Add a task with a due date on an opportunity to have it show up here when it's due."));
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
function OutreachQueue({
  canEdit,
  onOpenItem,
  onBidStatusChange
}) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function load() {
      const {
        data,
        error
      } = await supabaseClient.from("outreach_queue").select("*").order("queued_at", {
        ascending: false
      });
      if (error) setError("Couldn't load the outreach queue.");else setRows(data || []);
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
  const approve = row => updateRow(row.id, {
    status: "approved",
    reviewed_at: new Date().toISOString()
  });
  const skip = row => {
    updateRow(row.id, {
      status: "skipped_by_user",
      reviewed_at: new Date().toISOString()
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
  const pendingReview = rows.filter(r => r.status === "pending_review");
  const needsProfile = rows.filter(r => r.status === "needs_profile");
  const readyToSend = rows.filter(r => r.status === "ready_to_send");
  const pipeline = rows.filter(r => Object.prototype.hasOwnProperty.call(OUTREACH_PIPELINE_STATUS, r.status)).sort((a, b) => OUTREACH_PIPELINE_STATUS[a.status].rank - OUTREACH_PIPELINE_STATUS[b.status].rank);
  const actioned = rows.filter(r => !["pending_review", "needs_profile", "ready_to_send"].includes(r.status) && !Object.prototype.hasOwnProperty.call(OUTREACH_PIPELINE_STATUS, r.status));
  const cardActions = row => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
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
  }, "Approve"), /*#__PURE__*/React.createElement("button", {
    onClick: () => skip(row),
    disabled: !canEdit,
    style: {
      background: "none",
      border: "none",
      color: "#5E6268",
      cursor: canEdit ? "pointer" : "default",
      fontSize: "12.5px"
    }
  }, "Skip"));
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
  }, "Pre-filled in your LinkedIn tab — open it, review, click Send there, then mark it here."));
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
  }, "No LinkedIn profile yet")), /*#__PURE__*/React.createElement("textarea", {
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
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "13px",
      marginBottom: "20px"
    }
  }, `${pendingReview.length} ready to review · ${needsProfile.length} waiting on a LinkedIn profile · ${readyToSend.length} ready to send · ${pipeline.length} in pipeline`), pendingReview.length === 0 && needsProfile.length === 0 && readyToSend.length === 0 && pipeline.length === 0 && /*#__PURE__*/React.createElement("div", {
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
  }, "Ready to review"), pendingReview.map(row => renderCard(row, cardActions))), needsProfile.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }, "These have a named contact but no LinkedIn profile URL yet — profile lookup is a manual/browser step, not automated."), needsProfile.map(row => renderCard(row, cardActions))), readyToSend.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "19px",
      color: "#EDE9E1",
      margin: "0 0 4px 0"
    }
  }, "Pipeline"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: "#71767D",
      fontSize: "12.5px",
      fontStyle: "italic",
      marginBottom: "12px"
    }
  }, "Everyone you've reached out to. Update the status yourself as things move — LinkedIn doesn't tell us."), pipeline.map(renderPipelineCard)), rows.length > 0 && /*#__PURE__*/React.createElement("div", {
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
  }, item.company || "Company unknown", " · ", formatAddedDate(item.createdAt), item.updatedAt ? ` · ${formatUpdatedDate(item.updatedAt)}` : null, !hasUsableContact(item) && /*#__PURE__*/React.createElement("span", {
    title: "No point of contact on file — see Reach out below",
    style: {
      color: "#B08D57",
      marginLeft: "6px"
    }
  }, "● no contact"))), /*#__PURE__*/React.createElement("div", {
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
  }), /*#__PURE__*/React.createElement(Detail, {
    label: "Key contact",
    value: item.contact
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
  }, isRealPersonName(item.contact) ? `Find ${extractPersonName(item.contact)} on LinkedIn` : "Find contacts on LinkedIn", " ", /*#__PURE__*/React.createElement(ExternalLinkIcon, {
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
  const [sortMode, setSortMode] = useState("score");
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState("");
  useEffect(() => {
    async function loadBidStatus() {
      const {
        data,
        error
      } = await supabaseClient.from("bid_status").select("*");
      if (!error && data) {
        const map = {};
        data.forEach(r => {
          map[r.item_id] = r.status;
        });
        setBidStatusMap(map);
      }
    }
    loadBidStatus();
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
  const setBidStatus = async (itemId, status) => {
    const oldValue = normalizeBidStatus(bidStatusMap[itemId]);
    setBidStatusMap(prev => ({
      ...prev,
      [itemId]: status
    }));
    await supabaseClient.from("bid_status").upsert({
      item_id: itemId,
      status,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "item_id"
    });
    logHistory(itemId, "Bid Status", oldValue, status);
    if (status === "Chasing") {
      setEngagementStage(itemId, "Active");
    }
  };
  const [tierOverrideMap, setTierOverrideMap] = useState({});
  useEffect(() => {
    async function loadTierOverrides() {
      const {
        data,
        error
      } = await supabaseClient.from("tier_overrides").select("*");
      if (!error && data) {
        const map = {};
        data.forEach(r => {
          map[r.item_id] = r.tier;
        });
        setTierOverrideMap(map);
      }
    }
    loadTierOverrides();
  }, []);
  const setTierOverride = async (itemId, tier, algoTier) => {
    const oldValue = tierOverrideMap[itemId] || algoTier;
    setTierOverrideMap(prev => ({
      ...prev,
      [itemId]: tier
    }));
    await supabaseClient.from("tier_overrides").upsert({
      item_id: itemId,
      tier,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "item_id"
    });
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
    await supabaseClient.from("tier_overrides").delete().eq("item_id", itemId);
  };
  const [fundingOverrideMap, setFundingOverrideMap] = useState({});
  const [engagementOverrideMap, setEngagementOverrideMap] = useState({});
  const [stageOverrideMap, setStageOverrideMap] = useState({});
  const [opportunityTypeOverrideMap, setOpportunityTypeOverrideMap] = useState({});
  useEffect(() => {
    async function loadOverrides() {
      const [fundingRes, engagementRes, stageRes, typeRes] = await Promise.all([supabaseClient.from("funding_status_overrides").select("*"), supabaseClient.from("engagement_overrides").select("*"), supabaseClient.from("stage_overrides").select("*"), supabaseClient.from("opportunity_type_overrides").select("*")]);
      if (!fundingRes.error && fundingRes.data) {
        const map = {};
        fundingRes.data.forEach(r => {
          map[r.item_id] = r.status;
        });
        setFundingOverrideMap(map);
      }
      if (!engagementRes.error && engagementRes.data) {
        const map = {};
        engagementRes.data.forEach(r => {
          map[r.item_id] = r.stage;
        });
        setEngagementOverrideMap(map);
      }
      if (!stageRes.error && stageRes.data) {
        const map = {};
        stageRes.data.forEach(r => {
          map[r.item_id] = r.stage;
        });
        setStageOverrideMap(map);
      }
      if (!typeRes.error && typeRes.data) {
        const map = {};
        typeRes.data.forEach(r => {
          map[r.item_id] = r.types;
        });
        setOpportunityTypeOverrideMap(map);
      }
    }
    loadOverrides();
  }, []);
  const setOpportunityTypes = async (itemId, types, algoTypes) => {
    const oldValue = opportunityTypeOverrideMap[itemId] !== undefined ? opportunityTypeOverrideMap[itemId] : algoTypes;
    setOpportunityTypeOverrideMap(prev => ({
      ...prev,
      [itemId]: types
    }));
    await supabaseClient.from("opportunity_type_overrides").upsert({
      item_id: itemId,
      types,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "item_id"
    });
    logHistory(itemId, "Opportunity Type", (oldValue || []).join(", ") || "None", types.join(", ") || "None");
  };
  const setStageOverride = async (itemId, stage, algoStage) => {
    const oldValue = stageOverrideMap[itemId] !== undefined ? stageOverrideMap[itemId] : algoStage;
    setStageOverrideMap(prev => ({
      ...prev,
      [itemId]: stage
    }));
    await supabaseClient.from("stage_overrides").upsert({
      item_id: itemId,
      stage,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "item_id"
    });
    logHistory(itemId, "Stage", oldValue, stage);
  };
  const setFundingStatus = async (itemId, status, algoFunding) => {
    const oldValue = fundingOverrideMap[itemId] !== undefined ? fundingOverrideMap[itemId] : algoFunding;
    setFundingOverrideMap(prev => ({
      ...prev,
      [itemId]: status
    }));
    await supabaseClient.from("funding_status_overrides").upsert({
      item_id: itemId,
      status,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "item_id"
    });
    logHistory(itemId, "Funding Status", oldValue, status);
  };
  const setEngagementStage = async (itemId, stage, algoDbmv) => {
    const oldValue = engagementOverrideMap[itemId] || algoDbmv;
    setEngagementOverrideMap(prev => ({
      ...prev,
      [itemId]: stage
    }));
    await supabaseClient.from("engagement_overrides").upsert({
      item_id: itemId,
      stage,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "item_id"
    });
    logHistory(itemId, "Position", oldValue, stage);
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
    fetch(`./data.json?t=${Date.now()}`, {
      cache: "no-store"
    }).then(r => {
      if (!r.ok) throw new Error("Failed to load data");
      return r.json();
    }).then(payload => {
      setItems(payload.items || payload);
      setGeneratedAt(payload.generatedAt || null);
    }).catch(e => setLoadError(e.message));
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
    const now = Date.now();
    return (items || []).map(i => {
      const effectiveDbmv = engagementOverrideMap[i.id] || i.dbmv;
      // "Best placed to chase now" ranking: newest opportunities score highest
      // (recencyScore tapers 20 -> 0 over 30 days), a relationship already under
      // way makes it easier to chase (positionBoost), and BD score is only a
      // tie-break given it's currently flat for most of the top tier.
      const daysSinceAdded = i.createdAt ? (now - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24) : Infinity;
      const recencyScore = Math.max(0, 20 - Math.floor(daysSinceAdded * 20 / 30));
      const positionBoost = effectiveDbmv === "Active" ? 15 : effectiveDbmv === "Warm" ? 8 : 0;
      const chaseScore = recencyScore + positionBoost + Math.round((i.score || 0) / 3);
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
        chaseScore
      };
    });
  }, [items, tierOverrideMap, fundingOverrideMap, engagementOverrideMap, stageOverrideMap, opportunityTypeOverrideMap]);
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
      if (q) {
        const hay = `${i.name} ${i.company} ${i.notes || ""} ${i.trigger || ""} ${i.pathToWin || ""} ${i.nextAction || ""} ${i.contact || ""} ${commentsIndex[i.id] || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, effectiveItems, search, commodity, state, stage, source, tierFilter, bidStatusFilter, bidStatusMap, commentsIndex, opportunityTypeFilter]);
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
  const anyFilterActive = search || commodity || state || stage || source || tierFilter || bidStatusFilter || opportunityTypeFilter;
  const clearAll = () => {
    setSearch("");
    setCommodity("");
    setState("");
    setStage("");
    setSource("");
    setTierFilter(null);
    setBidStatusFilter("");
    setOpportunityTypeFilter("");
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
  const openItemFromActions = itemId => {
    setView("pipeline");
    setOpenId(itemId);
  };
  const handleUndo = (item, field, oldValue) => {
    if (field === "Tier") setTierOverride(item.id, oldValue, item.algoTier);else if (field === "Bid Status") setBidStatus(item.id, oldValue);else if (field === "Funding Status") setFundingStatus(item.id, oldValue, item.algoFunding);else if (field === "Position") setEngagementStage(item.id, oldValue, item.algoDbmv);else if (field === "Stage") setStageOverride(item.id, oldValue, item.algoStage);else if (field === "Opportunity Type") {
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

        .bd-row-grid {
          display: grid;
          grid-template-columns: minmax(0,2.2fr) minmax(0,1.4fr) 110px 64px 120px 100px 60px;
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
  }, /*#__PURE__*/React.createElement("div", {
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
    onClick: () => setView("focus"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      color: view === "focus" ? "#EDE9E1" : "#71767D",
      fontSize: "13px",
      fontWeight: 500,
      borderBottom: view === "focus" ? "2px solid #C1592E" : "2px solid transparent",
      paddingBottom: "12px",
      marginBottom: "-13px"
    }
  }, "Week in Focus"), /*#__PURE__*/React.createElement("button", {
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
  }, "Outreach"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#4B4E53",
      fontSize: "13px"
    },
    title: "Not yet built"
  }, "Staging boards")), /*#__PURE__*/React.createElement(SignInControl, {
    session: session
  })), view === "focus" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontFamily: "'Fraunces', serif",
      fontWeight: 600,
      fontSize: "28px",
      color: "#EDE9E1",
      margin: "0 0 28px 0"
    }
  }, "Week in Focus"), /*#__PURE__*/React.createElement(FocusPage, {
    items: effectiveItems,
    onOpenItem: openItemFromActions,
    bidStatusMap: bidStatusMap
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
  }, "Last updated", /*#__PURE__*/React.createElement("br", null), generatedAt ? new Date(generatedAt).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }) : "unknown")), /*#__PURE__*/React.createElement(StrataBar, {
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
