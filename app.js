
    // date default
    const asOf = document.getElementById('asOf');
    const refreshBtn = document.getElementById('refreshBtn');
    const clearBtn = document.getElementById('clearBtn');

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth()+1).padStart(2,'0');
    const dd = String(today.getDate()).padStart(2,'0');
    asOf.value = `${yyyy}-${mm}-${dd}`;

    // tabs
    const rightTitle = document.getElementById('rightTitle');
    document.querySelectorAll('.tab').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
        document.querySelectorAll('.tabpage').forEach(p=>p.classList.remove('active'));
        btn.classList.add('active');
        const id = 'tab-' + btn.dataset.tab;
        document.getElementById(id).classList.add('active');
        rightTitle.textContent = btn.dataset.tab === 'overview' ? 'Overview' : 'Leaderboard';
      });
    });

    refreshBtn.addEventListener("click", async () => {
  const leaderboard = await getLeaderboard(asOf.value);
  renderLeaderboard(leaderboard);
});


    clearBtn.addEventListener('click', () => {
      document.getElementById('selectedUserPill').innerHTML = '<span class="dot"></span> no user selected';
      document.getElementById('usersTbody').innerHTML =
        '<tr><td colspan="2" class="empty">Backend bağlanınca burada kullanıcılar listelenecek</td></tr>';
      document.getElementById('lbTbody').innerHTML =
        '<tr><td colspan="3" class="empty">Backend bağlanınca burada ilk 10 görünecek</td></tr>';

      // reset overview compact stats
      document.getElementById('statToday').textContent = '-';
      document.getElementById('stat7d').textContent = '-';
      document.getElementById('statStreak').textContent = '-';

      document.getElementById('triggeredBox').textContent = '-';
      document.getElementById('selectedBox').textContent = '-';
      document.getElementById('suppressedBox').textContent = '-';
      document.getElementById('badgesRow').innerHTML = '<span class="badge">-</span>';
      document.getElementById('notifList').innerHTML = `
        <div class="item">
          <div>Backend bağlanınca burada bildirimler listelenecek</div>
          <div class="meta">
            <span class="pill"><span class="dot"></span> BiP</span>
            <span>sent_at: -</span>
          </div>
        </div>`;
    });

    document.addEventListener("DOMContentLoaded", () => {

  const usersTbody = document.getElementById("usersTbody");
  const selectedUserPill = document.getElementById("selectedUserPill");

  let selectedUserId = null;

  // === MOCK DATA (yarın fetch ile değişecek) ===
  async function getUsers() {
    return [
      { user_id: "u1", total_points: 820 },
      { user_id: "u2", total_points: 450 },
      { user_id: "u3", total_points: 1200 }
    ];
  }

  // === RENDER USERS ===
  function renderUsers(users) {
    usersTbody.innerHTML = "";

    users.forEach(user => {
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
    document.querySelectorAll(".row-btn").forEach(btn => {
      btn.addEventListener("click", async () => {
        // önce tüm aktifleri kaldır
document.querySelectorAll("#usersTbody tr")
  .forEach(tr => tr.classList.remove("active"));

// bu satırı aktif yap
btn.closest("tr").classList.add("active");

        const detail = await getUserDetail(selectedUserId);
renderUserDetail(detail);
        selectedUserId = btn.dataset.id;
        selectedUserPill.innerHTML =
          `<span class="dot accent"></span> ${selectedUserId}`;
      });
    });
  }

  // === INIT ===
  async function init() {
    const users = await getUsers();
    renderUsers(users);
  }

  async function init() {

  const users = await getUsers();
  renderUsers(users);

  const leaderboard = await getLeaderboard(asOf.value);
  renderLeaderboard(leaderboard);

}

  init();
});

// === USER DETAIL DATA SOURCE ===
async function getUserDetail(userId) {
  return {
    state: {
      today: {
        listen_minutes_today: 45,
        unique_tracks_today: 12,
        playlist_additions_today: 3,
        shares_today: 2
      },
      d7: {
        listen_minutes_7d: 520,
        unique_tracks_7d: 70,
        shares_7d: 8
      },
      streak: 4
    },
    challenges: {
      triggered: ["Günlük Dinleme", "Paylaşım Bonus"],
      selected: "Günlük Dinleme",
      suppressed: ["Paylaşım Bonus"]
    },
    badges: ["Bronz Dinleyici"],
    notifications: [
      {
        message: "Günlük Dinleme görevini tamamladın",
        sent_at: "2026-02-16",
        channel: "BiP"
      }
    ]
  };
}

function renderUserDetail(data) {

  // STATS
  document.getElementById("statToday").textContent =
    `${data.state.today.listen_minutes_today} min`;

  document.getElementById("stat7d").textContent =
    `${data.state.d7.listen_minutes_7d} min`;

  document.getElementById("statStreak").textContent =
    `${data.state.streak} days`;

  // CHALLENGES
  document.getElementById("triggeredBox").textContent =
    data.challenges.triggered.join(", ") || "-";

  document.getElementById("selectedBox").textContent =
    data.challenges.selected || "-";

  document.getElementById("suppressedBox").textContent =
    data.challenges.suppressed.join(", ") || "-";

  // BADGES
  const badgeRow = document.getElementById("badgesRow");
  badgeRow.innerHTML = "";
  data.badges.forEach(b => {
    const span = document.createElement("span");
    span.className = "badge";
    span.textContent = b;
    badgeRow.appendChild(span);
  });

  // NOTIFICATIONS
  const notifList = document.getElementById("notifList");
  notifList.innerHTML = "";
  data.notifications.forEach(n => {
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
}

async function getLeaderboard(asOfDate) {
  return [
    { rank: 1, user_id: "u3", total_points: 1200 },
    { rank: 2, user_id: "u1", total_points: 820 },
    { rank: 3, user_id: "u2", total_points: 450 }
  ];
}

function renderLeaderboard(data) {
  const lbTbody = document.getElementById("lbTbody");
  lbTbody.innerHTML = "";

  data.forEach(row => {
    lbTbody.innerHTML += `
      <tr>
        <td>${row.rank}</td>
        <td>${row.user_id}</td>
        <td>${row.total_points}</td>
      </tr>
    `;
  });
}

