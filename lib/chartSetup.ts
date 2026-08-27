import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
)

ChartJS.defaults.font.family = 'var(--font-barlow), Barlow, sans-serif'
ChartJS.defaults.font.size = 15
ChartJS.defaults.font.weight = 500
ChartJS.defaults.color = '#717171'
ChartJS.defaults.plugins.legend.labels.usePointStyle = true
ChartJS.defaults.plugins.legend.labels.pointStyle = 'rectRounded'
ChartJS.defaults.plugins.legend.labels.padding = 18
ChartJS.defaults.plugins.legend.labels.font = {
  family: 'var(--font-barlow-condensed), "Barlow Condensed", sans-serif',
  size: 15,
  weight: 700,
}
