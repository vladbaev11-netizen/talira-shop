export default function ShippingSchedule() {
  const schedules = [
    {
      id: 1,
      name: 'Нова Пошта',
      icon: '📦',
      color: '#e53935',
      weekdays: 'Пн-Пт до 16:00',
      weekend: 'Сб-Вс до 14:00'
    },
    {
      id: 2,
      name: 'Укрпошта',
      icon: '📮',
      color: '#ffa726',
      weekdays: 'Пн-Пт до 16:00',
      weekend: 'Сб-Вс до 14:00'
    }
  ];

  return (
    <div className="shipping-schedule">
      <div className="widget-header">
        <div className="icon">📅</div>
        <h3 className="widget-title">Графік відправлень</h3>
      </div>

      <div className="schedule-list">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="schedule-item">
            <div className="schedule-header">
              <span className="schedule-icon" style={{ color: schedule.color }}>
                {schedule.icon}
              </span>
              <h4 className="schedule-name">{schedule.name}</h4>
            </div>
            <div className="schedule-times">
              <div className="time-row">
                <span className="day-label">Пн-Пт</span>
                <span className="time-value">{schedule.weekdays.split(' ').slice(-2).join(' ')}</span>
              </div>
              <div className="time-row">
                <span className="day-label">Сб-Вс</span>
                <span className="time-value">{schedule.weekend.split(' ').slice(-2).join(' ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .shipping-schedule {
          background: #ffffff;
          border: 1px solid var(--line, #e0d4ba);
          border-radius: 8px;
          padding: 24px;
        }

        .widget-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .icon {
          font-size: 24px;
          color: var(--gold-deep, #a07d3d);
        }

        .widget-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          margin: 0;
          text-transform: uppercase;
        }

        .schedule-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .schedule-item {
          padding: 16px;
          background: var(--bg, #f5f1e8);
          border-radius: 8px;
          border: 1px solid var(--line, #e0d4ba);
        }

        .schedule-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .schedule-icon {
          font-size: 20px;
        }

        .schedule-name {
          font-family: var(--font-sans);
          font-size: 16px;
          font-weight: 600;
          color: var(--text-dark, #1a1612);
          margin: 0;
        }

        .schedule-times {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-left: 30px;
        }

        .time-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-sans);
          font-size: 14px;
        }

        .day-label {
          color: var(--text-dim, #8a7a6a);
        }

        .time-value {
          color: var(--text-dark, #1a1612);
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .shipping-schedule {
            padding: 20px;
          }

          .widget-title {
            font-size: 20px;
          }

          .schedule-item {
            padding: 14px;
          }
        }
      `}</style>
    </div>
  );
}
