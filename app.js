document.addEventListener("DOMContentLoaded", () => {
  // ===== Elements =====
  const asOf = document.getElementById("asOf");
  const refreshBtn = document.getElementById("refreshBtn");
  const clearBtn = document.getElementById("clearBtn");
  const usersTbody = document.getElementById("usersTbody");
  const selectedUserPill = document.getElementById("selectedUserPill");
const leaderboardLoading = document.getElementById("leaderboardLoading");
const detailLoading = document.getElementById("detailLoading");

function show(el){ el.classList.remove("hidden"); }
function hide(el){ el.classList.add("hidden"); }

  // ===== State =====
  let selectedUserId = null;

  // ===== Date default =====
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  asOf.value = `${yyyy}-${mm}-${dd}`;

  // ===== Tabs =====
  const rightTitle = document.getElementById("rightTitle");
  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tabpage").forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const id = "tab-" + btn.dataset.tab;
      document.getElementById(id).classList.add("active");

      rightTitle.textContent = btn.dataset.tab === "overview" ? "Genel Bakış" : "Liderlik Tablosu";
    });
  });

  // ===== Mock data sources (later swap to fetch) =====
  async function getUsers() {
    return [
      { user_id: "Kullanıcı1", total_points: 820 },
      { user_id: "Kullanıcı2", total_points: 450 },
      { user_id: "Kullanıcı3", total_points: 1200 },
    ];
  }

  async function getUserDetail(userId) {
    // userId parametresi backend geldiğinde gerçekten kullanılacak
    return {
      state: {
        today: {
          listen_minutes_today: 45,
          unique_tracks_today: 12,
          playlist_additions_today: 3,
          shares_today: 2,
        },
        d7: {
          listen_minutes_7d: 520,
          unique_tracks_7d: 70,
          shares_7d: 8,
        },
        streak: 4,
      },
      challenges: {
        triggered: ["Günlük Dinleme", "Paylaşım Bonus"],
        selected: "Günlük Dinleme",
        suppressed: ["Paylaşım Bonus"],
      },
      badges: ["Bronz Dinleyici"],
      notifications: [
        {
          message: "Günlük Dinleme görevini tamamladın",
          sent_at: "2026-02-16",
          channel: "BiP",
        },
      ],
    };
  }

  async function getLeaderboard(asOfDate) {
    // asOfDate parametresi backend geldiğinde gerçekten kullanılacak
    return [
      { rank: 1, user_id: "Kullanıcı3", total_points: 1200 },
      { rank: 2, user_id: "Kullanıcı1", total_points: 820 },
      { rank: 3, user_id: "Kullanıcı2", total_points: 450 },
    ];
  }

  // ===== Render =====
  function renderUsers(users) {
    usersTbody.innerHTML = "";

    users.forEach((user) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>
          <button class="row-btn" data-id="${user.user_id}">
            ${user.user_id}
          </button>
        </td>
        <td>${user.total_points}</td>
      `;
      usersTbody.appendChild(tr);
    });

    // click handler
    document.querySelectorAll(".row-btn").forEach((btn) => {
     btn.addEventListener("click", async () => {

  document.querySelectorAll("#usersTbody tr")
    .forEach(tr => tr.classList.remove("active"));

  btn.closest("tr").classList.add("active");

  selectedUserId = btn.dataset.id;

  selectedUserPill.innerHTML =
    `<span class="dot accent"></span> ${selectedUserId}`;

  const panelBody = document.querySelector(".main .panel-body");
  panelBody.classList.add("loading");

  show(detailLoading);

  const detail = await getUserDetail(selectedUserId);
  renderUserDetail(detail);

  hide(detailLoading);
  panelBody.classList.remove("loading");

});
    });
  }

  

  function renderUserDetail(data) {
    // STATS
    document.getElementById("statToday").textContent = `${data.state.today.listen_minutes_today} dk`;
    document.getElementById("stat7d").textContent = `${data.state.d7.listen_minutes_7d} dk`;
    document.getElementById("statStreak").textContent = `${data.state.streak} gün`;

    // CHALLENGES
    document.getElementById("triggeredBox").textContent = (data.challenges.triggered || []).join(", ") || "-";
    document.getElementById("selectedBox").textContent = data.challenges.selected || "-";
    document.getElementById("suppressedBox").textContent = (data.challenges.suppressed || []).join(", ") || "-";

    // BADGES
    const badgeRow = document.getElementById("badgesRow");
    badgeRow.innerHTML = "";
    (data.badges || []).forEach((b) => {
      const span = document.createElement("span");
      span.className = "badge";
      span.textContent = b;
      badgeRow.appendChild(span);
    });
    if (!data.badges || data.badges.length === 0) badgeRow.innerHTML = `<span class="badge">-</span>`;

    // NOTIFICATIONS
    const notifList = document.getElementById("notifList");
    notifList.innerHTML = "";
    (data.notifications || []).forEach((n) => {
      notifList.innerHTML += `
        <div class="item">
          <div>${n.message}</div>
          <div class="meta">
            <span class="pill">${n.channel}</span>
            <span>${n.sent_at}</span>
          </div>
        </div>
      `;
    });
    if (!data.notifications || data.notifications.length === 0) {
      notifList.innerHTML = `
        <div class="item">
          <div>Bildirim bulunmuyor</div>
          <div class="meta">
            <span class="pill">-</span>
            <span>-</span>
          </div>
        </div>
      `;
    }
  }

  function renderLeaderboard(data) {
    const lbTbody = document.getElementById("lbTbody");
    lbTbody.innerHTML = "";

   data.forEach((row) => {

  let medal = "";
  if (row.rank === 1) medal = "🥇";
  else if (row.rank === 2) medal = "🥈";
  else if (row.rank === 3) medal = "🥉";

  lbTbody.innerHTML += `
    <tr>
      <td>${medal || row.rank}</td>
      <td>${row.user_id}</td>
      <td>${row.total_points}</td>
    </tr>
  `;
});

  }

  // ===== Refresh + Date change =====
 async function refreshAll() {

  show(leaderboardLoading);

  const leaderboard = await getLeaderboard(asOf.value);
  renderLeaderboard(leaderboard);

  hide(leaderboardLoading);

  if (selectedUserId) {
    show(detailLoading);
    const detail = await getUserDetail(selectedUserId);
    renderUserDetail(detail);
    hide(detailLoading);
  }
}


  refreshBtn.addEventListener("click", refreshAll);
  asOf.addEventListener("change", refreshAll);

  // ===== Clear (selection + right panel only) =====
  clearBtn.addEventListener("click", () => {
    selectedUserId = null;

    document.querySelectorAll("#usersTbody tr").forEach((tr) => tr.classList.remove("active"));

    selectedUserPill.innerHTML = `<span class="dot"></span> Kullanıcı Seçilmedi`;

    document.getElementById("statToday").textContent = "-";
    document.getElementById("stat7d").textContent = "-";
    document.getElementById("statStreak").textContent = "-";

    document.getElementById("triggeredBox").textContent = "-";
    document.getElementById("selectedBox").textContent = "-";
    document.getElementById("suppressedBox").textContent = "-";

    document.getElementById("badgesRow").innerHTML = `<span class="badge">-</span>`;

    document.getElementById("notifList").innerHTML = `
      <div class="item">
        <div>Bildirim bulunmuyor</div>
        <div class="meta">
          <span class="pill">-</span>
          <span>-</span>
        </div>
      </div>
    `;
  });

  // ===== Init =====
  async function init() {
    const users = await getUsers();
    renderUsers(users);

    await refreshAll();
  }

  init();
});
