import { ForecastItem } from '../types/weather';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherGraphProps {
  forecast: ForecastItem[];
}

const WeatherGraph: React.FC<WeatherGraphProps> = ({ forecast }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Температура по дням'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Температура (°C)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'День'
        }
      }
    }
  };

  const data = {
    labels: forecast.map(item => 
      new Date(item.dt * 1000).toLocaleDateString('ru-RU', { weekday: 'short' })
    ),
    datasets: [
      {
        label: 'Температура',
        data: forecast.map(item => Math.round(item.main.temp)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="weather-graph">
      <Line options={options} data={data} />
    </div>
  );
};

export default WeatherGraph; 