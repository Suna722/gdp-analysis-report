// ===== GDP Growth Rate Data (2015Q1 - 2025Q4) =====
// Source: Cabinet Office, National Accounts (QE, 2nd Preliminary)
// Values are real GDP growth rate quarter-on-quarter (%)

const gdpData = {
  labels: [
    "2015Q1","2015Q2","2015Q3","2015Q4",
    "2016Q1","2016Q2","2016Q3","2016Q4",
    "2017Q1","2017Q2","2017Q3","2017Q4",
    "2018Q1","2018Q2","2018Q3","2018Q4",
    "2019Q1","2019Q2","2019Q3","2019Q4",
    "2020Q1","2020Q2","2020Q3","2020Q4",
    "2021Q1","2021Q2","2021Q3","2021Q4",
    "2022Q1","2022Q2","2022Q3","2022Q4",
    "2023Q1","2023Q2","2023Q3","2023Q4",
    "2024Q1","2024Q2","2024Q3","2024Q4",
    "2025Q1","2025Q2","2025Q3","2025Q4"
  ],
  values: [
    1.6, -0.1, 0.5, -0.2,
    0.8, 0.4, 0.2, 0.4,
    0.5, 0.8, 0.5, 0.1,
    -0.2, 0.6, -0.5, 0.5,
    0.6, 0.5, 0.0, -1.6,
    -0.5, -7.5, 5.0, 2.6,
    -0.9, 0.6, -0.6, 1.2,
    -0.1, 1.2, -0.3, 0.2,
    0.8, 1.0, -0.7, 0.0,
    -0.4, 0.7, 0.4, 0.3,
    0.5, 0.4, -0.7, 0.3
  ]
};

// ===== Contribution Data for 2025 Q4 =====
const contribData = {
  labels: ["民間消費", "民間設備投資", "政府支出", "外需（純輸出）"],
  values: [0.2, 0.2, 0.1, 0.0],
  colors: [
    "rgba(129, 140, 248, 0.85)",
    "rgba(52, 211, 153, 0.85)",
    "rgba(251, 191, 36, 0.85)",
    "rgba(96, 165, 250, 0.85)"
  ],
  borderColors: [
    "rgba(129, 140, 248, 1)",
    "rgba(52, 211, 153, 1)",
    "rgba(251, 191, 36, 1)",
    "rgba(96, 165, 250, 1)"
  ]
};

// ===== Chart.js Global Config =====
Chart.defaults.color = "#94a3b8";
Chart.defaults.borderColor = "rgba(255,255,255,0.06)";
Chart.defaults.font.family = "'Inter', 'Noto Sans JP', sans-serif";

// ===== GDP Growth Rate Line Chart =====
function createGDPChart() {
  const ctx = document.getElementById("gdpChart").getContext("2d");

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(129, 140, 248, 0.25)");
  gradient.addColorStop(1, "rgba(129, 140, 248, 0.0)");

  // Color each point based on positive/negative
  const pointColors = gdpData.values.map(v =>
    v >= 0 ? "rgba(52, 211, 153, 1)" : "rgba(251, 113, 133, 1)"
  );

  new Chart(ctx, {
    type: "line",
    data: {
      labels: gdpData.labels,
      datasets: [{
        label: "実質GDP成長率（前期比 %）",
        data: gdpData.values,
        borderColor: "rgba(129, 140, 248, 1)",
        backgroundColor: gradient,
        borderWidth: 2.5,
        pointBackgroundColor: pointColors,
        pointBorderColor: pointColors,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBorderWidth: 3,
        pointHoverBorderColor: "#fff",
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index"
      },
      plugins: {
        legend: {
          display: true,
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
            font: { size: 13, weight: "500" }
          }
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#f1f5f9",
          bodyColor: "#cbd5e1",
          borderColor: "rgba(99,102,241,0.3)",
          borderWidth: 1,
          padding: 14,
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            title: function(items) {
              const label = items[0].label;
              const year = label.substring(0, 4);
              const q = label.substring(4);
              const qMap = { Q1: "1-3月期", Q2: "4-6月期", Q3: "7-9月期", Q4: "10-12月期" };
              return `${year}年 ${qMap[q] || q}`;
            },
            label: function(item) {
              const val = item.parsed.y;
              const sign = val >= 0 ? "+" : "";
              return `実質GDP成長率: ${sign}${val.toFixed(1)}%`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxRotation: 45,
            autoSkip: true,
            maxTicksLimit: 12,
            font: { size: 11 },
            callback: function(value, index) {
              const label = this.getLabelForValue(value);
              if (label.endsWith("Q1")) return label.substring(0, 4);
              return "";
            }
          }
        },
        y: {
          grid: {
            color: "rgba(255,255,255,0.04)",
          },
          ticks: {
            font: { size: 12 },
            callback: function(value) { return value + "%"; }
          },
          suggestedMin: -8,
          suggestedMax: 6,
        }
      }
    }
  });
}

// ===== Contribution Horizontal Bar Chart =====
function createContribChart() {
  const ctx = document.getElementById("contribChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: contribData.labels,
      datasets: [{
        label: "寄与度（%ポイント）",
        data: contribData.values,
        backgroundColor: contribData.colors,
        borderColor: contribData.borderColors,
        borderWidth: 1.5,
        borderRadius: 8,
        barThickness: 36,
      }]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#f1f5f9",
          bodyColor: "#cbd5e1",
          borderColor: "rgba(99,102,241,0.3)",
          borderWidth: 1,
          padding: 14,
          cornerRadius: 10,
          callbacks: {
            label: function(item) {
              const val = item.parsed.x;
              const sign = val >= 0 ? "+" : "";
              return `寄与度: ${sign}${val.toFixed(1)}%pt`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: "rgba(255,255,255,0.04)" },
          ticks: {
            font: { size: 12 },
            callback: function(value) { return value + "%pt"; }
          },
          suggestedMin: -0.1,
          suggestedMax: 0.3,
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 13, weight: "600" } }
        }
      }
    }
  });
}

// ===== Chart container height =====
function setChartHeight() {
  const gdpWrapper = document.querySelector("#gdp-chart .chart-wrapper");
  const contribWrapper = document.querySelector("#contribution .chart-wrapper");
  if (gdpWrapper) gdpWrapper.style.height = "420px";
  if (contribWrapper) contribWrapper.style.height = "280px";
}

// ===== Scroll Fade-In Animation =====
function initScrollAnimation() {
  const elements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger animation
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => observer.observe(el));
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  setChartHeight();
  createGDPChart();
  createContribChart();
  initScrollAnimation();
});
