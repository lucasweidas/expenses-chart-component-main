import '../scss/main.scss';
import { Chart } from 'chart.js/auto';
import data from '../json/data.json';

function titleTooltip() {
  return '';
}

function labelTooltip({ raw }) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(raw);
}

function getHslColor(cssPropertyName) {
  return htmlStyles.getPropertyValue(cssPropertyName);
}

function transparentizeHslColor(hslColor, alpha) {
  return hslColor.replace(/\)/, `, ${alpha})`);
}

function getChartValues() {
  return {
    fontFamily: htmlStyles.getPropertyValue('--font-dm-sans'),
    fontSize: htmlStyles.getPropertyValue('--font-size-chart'),
    layoutPaddingTop: htmlStyles.getPropertyValue('--layout-padding-top'),
    borderRadius: htmlStyles.getPropertyValue('--chart-border-radius'),
  };
}

const myChart = document.querySelector('#myChart');
const days = data.map(({ day }) => day);
const amounts = data.map(({ amount }) => amount);
const today = new Date().getDay();
const htmlStyles = getComputedStyle(document.documentElement);
const mediumScreenSize = 600;
const chartValue = getChartValues();

const hslColor = {
  softRed: getHslColor('--color-soft-red'),
  cyan: getHslColor('--color-cyan'),
  darkBrown: getHslColor('--color-dark-brown'),
  mediumBrown: getHslColor('--color-medium-brown'),
};

const backgroundColors = days.reduce((colors, _, index) => {
  colors.push(index === today ? hslColor.cyan : hslColor.softRed);
  return colors;
}, []);

const chart = new Chart(myChart, {
  type: 'bar',
  data: {
    labels: days,
    datasets: [
      {
        data: amounts,
        borderRadius: chartValue.borderRadius,
        borderSkipped: false,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors.map(color => transparentizeHslColor(color, 0.6)),
      },
    ],
  },
  options: {
    layout: {
      padding: {
        top: chartValue.layoutPaddingTop,
        bottom: 0,
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        border: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          drawOnChartArea: false,
          drawTicks: false,
        },
        ticks: {
          font: {
            family: chartValue.fontFamily,
            size: chartValue.fontSize,
            lineHeight: 2,
          },
          color: hslColor.mediumBrown,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        caretSize: 0,
        caretPadding: 6,
        yAlign: 'bottom',
        xAlign: 'center',
        padding: 8,
        cornerRadius: chartValue.borderRadius,
        bodyFont: {
          family: chartValue.fontFamily,
          size: chartValue.fontSize,
          weight: 'bold',
        },
        backgroundColor: hslColor.darkBrown,
        callbacks: {
          title: titleTooltip,
          label: labelTooltip,
        },
        displayColors: false,
      },
    },
  },
});

window.matchMedia(`(min-width: ${mediumScreenSize}px)`).onchange = () => {
  const { fontSize, layoutPaddingTop, borderRadius } = getChartValues();

  chart.options.scales.x.ticks.font.size = fontSize;
  chart.options.plugins.tooltip.bodyFont.size = fontSize;
  chart.options.layout.padding.top = layoutPaddingTop;
  chart.data.datasets[0].borderRadius = borderRadius;
  chart.options.plugins.tooltip.cornerRadius = borderRadius;
};
