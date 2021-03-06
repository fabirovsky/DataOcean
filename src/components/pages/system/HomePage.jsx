/* global $, Chart */

import React, { useEffect, useState } from 'react';
import {
  Briefcase, Calendar, Database, File, RefreshCcw, User,
} from 'react-feather';
import ReportBox from 'components/pages/dashboard/ReportBox';
import Api from 'api';
import moment from 'moment';
import PieChartLegendItem from 'components/pages/dashboard/PieChartLegendItem';
import PieChartLegend from 'components/pages/dashboard/PieChartLegend';


const HomePage = () => {
  const [registersCount, setRegistersCount] = useState('');
  const [usersCount, setUsersCount] = useState('');
  const [fopCount, setFopCount] = useState('');
  const [companyCount, setCompanyCount] = useState('');
  const [apiUsageData, setApiUsageData] = useState({});
  const [topKvedData, setTopKvedData] = useState([]);

  const initApiUsageChart = () => {
    const labels = apiUsageData.days.map((el) => moment(el.timestamp).format('DD.MM'));
    const data = apiUsageData.days.map((el) => el.count);
    if ($('#api-usage-chart').length) {
      const ctx = $('#api-usage-chart')[0].getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'API Запити',
              data,
              borderWidth: 2,
              borderColor: '#3160D8',
              backgroundColor: 'transparent',
              pointBorderColor: 'transparent',
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            xAxes: [{
              ticks: {
                fontSize: '12',
                fontColor: '#777777',
              },
              gridLines: {
                display: false,
              },
            }],
            yAxes: [{
              ticks: {
                fontSize: '12',
                fontColor: '#777777',
                // callback(value) {
                //   return `$${value}`;
                // },
              },
              gridLines: {
                color: '#D8D8D8',
                zeroLineColor: '#D8D8D8',
                borderDash: [2, 2],
                zeroLineBorderDash: [2, 2],
                drawBorder: false,
              },
            }],
          },
        },
      });
    }
  };

  const initTopKvedPie = () => {
    const labels = topKvedData.map((el) => el.kved.code);
    const data = topKvedData.map((el) => el.count_kved);

    if ($('#report-pie-chart').length) {
      const ctx = $('#report-pie-chart')[0].getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: [
              '#FF8B26', '#FFC533', '#285FD3', '#003c5c', '#33477a',
              '#6a4d8d', '#6a4d8d', '#d54e82', '#f85c66', '#ff7c41',
            ],
            hoverBackgroundColor: ['#FF8B26', '#FFC533', '#285FD3'],
            borderWidth: 2,
            borderColor: '#fff',
          }],
        },
        options: {
          legend: {
            display: false,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (topKvedData.length) {
      initTopKvedPie();
    }
  }, [topKvedData]);

  useEffect(() => {
    if (Object.keys(apiUsageData).length) {
      initApiUsageChart();
    }
  }, [apiUsageData]);

  const initCharts = () => {
    if ($('#report-donut-chart').length) {
      const ctx = $('#report-donut-chart')[0].getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [
            'Дочірнє підприємство', 'Закрите акціонерне товариство',
            'Інші організаційно-правові форми', 'товариство з обмеженою відповідальністю',
            'Виробничий кооператив', 'Державна організація (установа, заклад)',
            'Приватне підприємство', 'Релігійна організація',
          ],
          datasets: [{
            data: [
              120, 101, 321, 86, 84, 230, 150, 96,
            ],
            backgroundColor: [
              '#FF8B26', '#FFC533', '#285FD3', '#285FD3',
              '#33477a', '#d54e82', '#f85c66', '#003c5c',
            ],
            hoverBackgroundColor: ['#FF8B26', '#FFC533', '#285FD3'],
            borderWidth: 5,
            borderColor: '#fff',
          }],
        },
        options: {
          legend: {
            display: false,
          },
          cutoutPercentage: 60,
        },
      });
    }
  };

  const fetchData = () => {
    Api.get('register/')
      .then((resp) => {
        setRegistersCount(resp.data.count);
      });
    Api.get('users/')
      .then((resp) => {
        setUsersCount(resp.data.count);
      });
    Api.get('stats/registered-companies/')
      .then((resp) => {
        setCompanyCount(resp.data.company_count);
      });
    Api.get('stats/registered-fops/')
      .then((resp) => {
        setFopCount(resp.data.company_count);
      });
    Api.get('stats/api-usage/me/')
      .then((resp) => {
        setApiUsageData(resp.data);
      });
    Api.get('stats/top-kved/')
      .then((resp) => {
        setTopKvedData(resp.data.filter((el) => el.kved.code !== 'not_valid'));
      });
  };

  useEffect(() => {
    fetchData();
    initCharts();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xxl:col-span-12 grid grid-cols-12 gap-6">
          <div className="col-span-12 mt-8">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Загальний звіт
              </h2>
              <a href="#" className="ml-auto flex text-theme-1 dark:text-theme-10">
                <RefreshCcw className="w-4 h-4 mr-3" /> Оновити
              </a>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <ReportBox
                  label="Кількість підприємств"
                  value={companyCount.toLocaleString()}
                  subText="18%"
                  subTextDirection="up"
                  icon={<File className="report-box__icon text-theme-10" />}
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <ReportBox
                  label="Кількість ФОП"
                  value={fopCount.toLocaleString()}
                  subText="16%"
                  subTextDirection="up"
                  icon={<Briefcase className="report-box__icon text-theme-11" />}
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <ReportBox
                  label="Всього наборів даних"
                  value={registersCount.toLocaleString()}
                  subText="+5"
                  subTextDirection="up"
                  icon={<Database className="report-box__icon text-theme-12" />}
                />
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <ReportBox
                  label="Кількість користувачів"
                  value={usersCount.toLocaleString()}
                  subText="+7"
                  subTextDirection="up"
                  icon={<User className="report-box__icon text-theme-9" />}
                />
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 mt-8">
            <div className="intro-y block sm:flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Використання API
              </h2>
              <div className="sm:ml-auto mt-3 sm:mt-0 relative text-gray-700">
                <Calendar className="w-4 h-4 z-10 absolute my-auto inset-y-0 ml-3 left-0" />
                <input type="text" data-daterange="true" className="datepicker input w-full sm:w-56 box pl-10" />
              </div>
            </div>
            <div className="intro-y box p-5 mt-12 sm:mt-5">
              <div className="flex flex-col xl:flex-row xl:items-center">
                <div className="flex">
                  <div>
                    <div className="text-theme-20 text-lg xl:text-xl font-bold">
                      {apiUsageData.current_month || 0}
                    </div>
                    <div className="text-gray-600">Цей місяць</div>
                  </div>
                  <div className="w-px h-12 border border-r border-dashed border-gray-300 mx-4 xl:mx-6" />
                  <div>
                    <div className="text-gray-600 text-lg xl:text-xl font-medium">
                      {apiUsageData.prev_month || 0}
                    </div>
                    <div className="text-gray-600">Попередній місяць</div>
                  </div>
                </div>
              </div>
              <div> {/* className="report-chart"> */}
                <canvas id="api-usage-chart" height="160" className="mt-6" />
              </div>
            </div>
          </div>


          <div className="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                ТОП КВЕДів
              </h2>
              <a href="#" className="ml-auto text-theme-1 truncate">Всі</a>
            </div>
            <div className="intro-y box p-5 mt-5">
              <canvas className="mt-3" id="report-pie-chart" height="280" />
              <PieChartLegend
                items={topKvedData.map((el) => ({
                  label: el.kved.code,
                  value: el.count_kved,
                }))}
              />
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3 mt-8">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">
                Типи компаній
              </h2>
              <a href="#" className="ml-auto text-theme-1 truncate">Всі</a>
            </div>
            <div className="intro-y box p-5 mt-5">
              <canvas className="mt-3" id="report-donut-chart" height="280" />
              <div className="mt-8">
                <PieChartLegendItem
                  bgColor="#FF8B26"
                  label="Інші організаційно-правові форми"
                  value="30%"
                />
                <PieChartLegendItem
                  mt
                  bgColor="#FFC533"
                  label="Державна організація (установа, заклад)"
                  value="26%"
                />
                <PieChartLegendItem
                  mt
                  bgColor="#285FD3"
                  label="Приватне підприємство"
                  value="20%"
                />
              </div>
            </div>
          </div>
          {/*<UnusedSections />*/}
        </div>
        {/*<Transactions />*/}
      </div>
    </div>
  );
};

// HomePage.propTypes = {};

export default HomePage;
