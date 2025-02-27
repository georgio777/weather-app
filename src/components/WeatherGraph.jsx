import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from 'chart.js';
import PropTypes from 'prop-types'; 

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

function WeatherGraph({ forecast }) {
  const data = {
    labels: forecast.map((day) => new Date(day.dt * 1000).toLocaleDateString()),
    datasets: [
      {
        label: 'Температура (°C)',
        data: forecast.map((day) => day.main.temp),
        borderColor: '#007bff',
        fill: false,
      },
    ],
  };

  return <Line data={data} />;
}

// Добавляем валидацию пропсов
WeatherGraph.propTypes = {
  forecast: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number.isRequired,
      main: PropTypes.shape({
        temp: PropTypes.number.isRequired,
      }).isRequired,
      weather: PropTypes.arrayOf(
        PropTypes.shape({
          description: PropTypes.string.isRequired,
        })
      ).isRequired,
      dt_txt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default WeatherGraph;