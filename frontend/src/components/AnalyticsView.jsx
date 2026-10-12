import React from 'react';
import { PieChart, TrendingUp, DollarSign, Bed, ShieldCheck } from 'lucide-react';

export default function AnalyticsView({ rooms, residents, payments }) {
  // Compute analytics
  let totalBeds = 0;
  let occupiedBeds = 0;
  const blockStats = {};
  const typeStats = {};

  rooms.forEach(r => {
    totalBeds += r.capacity;
    const occ = r.beds.filter(b => b.residentId).length;
    occupiedBeds += occ;

    // Block stats
    if (!blockStats[r.block]) blockStats[r.block] = { capacity: 0, occupied: 0 };
    blockStats[r.block].capacity += r.capacity;
    blockStats[r.block].occupied += occ;

    // Type stats
    if (!typeStats[r.type]) typeStats[r.type] = { count: 0, capacity: 0, occupied: 0 };
    typeStats[r.type].count += 1;
    typeStats[r.type].capacity += r.capacity;
    typeStats[r.type].occupied += occ;
  });

  const overallOccupancyPct = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const totalMonthlyRevenue = residents.reduce((acc, r) => acc + (r.monthlyRent || 0), 0);
  const paidResidents = residents.filter(r => r.rentStatus === 'Paid').length;
  const rentCollectionPct = residents.length > 0 ? Math.round((paidResidents / residents.length) * 100) : 0;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(20, 18, 16, 0.08)', color: 'var(--color-black)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{overallOccupancyPct}%</div>
            <div className="stat-label">Total Occupancy</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(197, 160, 89, 0.15)', color: '#8c6b2d' }}>
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{rentCollectionPct}%</div>
            <div className="stat-label">Rent Collection Rate</div>
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Block Occupancy Breakdown */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bed size={18} color="var(--accent-gold)" />
            Occupancy by Block
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(blockStats).map(([blockName, stat]) => {
              const pct = stat.capacity > 0 ? Math.round((stat.occupied / stat.capacity) * 100) : 0;
              return (
                <div key={blockName} className="progress-bar-wrap">
                  <div className="progress-info">
                    <span style={{ fontWeight: 700 }}>{blockName}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{stat.occupied} / {stat.capacity} beds ({pct}%)</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${pct}%`, 
                        background: 'linear-gradient(90deg, #141210, #c5a059)' 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Room Type Distribution */}
        <div className="chart-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} color="var(--accent-gold)" />
            Room Type Utilization
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {Object.entries(typeStats).map(([typeName, stat]) => {
              const pct = stat.capacity > 0 ? Math.round((stat.occupied / stat.capacity) * 100) : 0;
              return (
                <div key={typeName} className="progress-bar-wrap">
                  <div className="progress-info">
                    <span style={{ fontWeight: 700 }}>{typeName} ({stat.count} rooms)</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{pct}% Occupied</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${pct}%`, 
                        background: 'linear-gradient(90deg, #c5a059, #dfc182)' 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
