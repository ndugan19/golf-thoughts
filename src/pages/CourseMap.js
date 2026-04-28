import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CategoryBadge from '../components/CategoryBadge';
import { formatDateShort } from '../utils';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
});

function createGolfIcon(count) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;cursor:pointer;">
        <div style="width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#8B4513;border:2px solid #f5ead8;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);font-size:16px;">⛳</span>
        </div>
        ${count > 1 ? `<div style="position:absolute;top:-6px;right:-6px;background:#1a1208;color:#f5ead8;border-radius:50%;width:18px;height:18px;font-size:10px;display:flex;align-items:center;justify-content:center;font-family:Geist Mono;font-weight:bold;">${count}</div>` : ''}
      </div>
    `,
    iconSize:    [36, 36],
    iconAnchor:  [18, 36],
    popupAnchor: [0, -36],
  });
}

export default function CourseMap({ thoughts }) {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courseGroups = useMemo(() => {
    const groups = {};
    thoughts.forEach(t => {
      if (!t.course || t.latitude == null || t.longitude == null) return;
      const key = t.course.toLowerCase().trim();
      if (!groups[key]) {
        groups[key] = {
          name: t.course,
          longitude: t.longitude,
          latitude: t.latitude,
          thoughts: [],
        };
      }
      groups[key].thoughts.push(t);
    });
    return Object.values(groups);
  }, [thoughts]);

  const thoughtsWithoutCourse = thoughts.filter(
    t => !t.course || t.course.trim() === ''
  );
  const thoughtsWithCourse = thoughts.filter(
    t => t.course && t.course.trim() !== ''
  );

  const center = useMemo(() => {
    if (courseGroups.length === 0) return [39, -98];
    const avgLat = courseGroups.reduce((s, g) => s + g.latitude,  0) / courseGroups.length;
    const avgLng = courseGroups.reduce((s, g) => s + g.longitude, 0) / courseGroups.length;
    return [avgLat, avgLng];
  }, [courseGroups]);

  return (
    <div style={{ padding: '28px 16px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        borderBottom: '2px solid #1a1208',
        marginBottom: 24,
        paddingBottom: 8,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
      }}>
        <div style={{
          fontSize: 22,
          fontWeight: 'bold',
          fontStyle: 'italic',
          fontFamily: 'Geist Mono',
        }}>
          Thoughts Mapped
        </div>
        <div style={{
          fontSize: 11,
          color: '#a89878',
          fontFamily: 'Geist Mono',
          fontStyle: 'italic',
        }}>
          {courseGroups.length} course{courseGroups.length !== 1 ? 's' : ''} · {thoughtsWithCourse.length} thought{thoughtsWithCourse.length !== 1 ? 's' : ''} mapped
        </div>
      </div>

      {courseGroups.length === 0 ? (
        <div style={{
          border: '1px dashed #c8b88a',
          padding: '40px 24px',
          textAlign: 'center',
          color: '#8b7355',
          fontStyle: 'italic',
          fontSize: 15,
          lineHeight: 1.8,
          fontFamily: 'Geist Mono',
        }}>
          No courses mapped yet.
          <br />
          <span style={{ fontSize: 13 }}>
            When you log a thought with a course name it will appear as a pin on this map.
          </span>
        </div>
      ) : (
        <>
          {/* Map — taller on desktop, shorter on mobile via CSS */}
          <div style={{
            border: '2px solid #c8b88a',
            overflow: 'hidden',
            marginBottom: 28,
          }}>
            <MapContainer
              center={center}
              zoom={courseGroups.length === 1 ? 12 : 4}
              style={{ width: '100%', height: 300 }}   // overridden to 220px on mobile via CSS
              scrollWheelZoom={true}
              className="course-map-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {courseGroups.map((group, i) => (
                <Marker
                  key={i}
                  position={[group.latitude, group.longitude]}
                  icon={createGolfIcon(group.thoughts.length)}
                  eventHandlers={{ click: () => setSelectedCourse(group) }}
                >
                  <Popup maxWidth={280}>   {/* narrower on mobile */}
                    <div style={{ fontFamily: 'Geist Mono', maxHeight: 240, overflowY: 'auto' }}>
                      <div style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        fontStyle: 'italic',
                        color: '#1a1208',
                        marginBottom: 10,
                        borderBottom: '1px solid #d4c49a',
                        paddingBottom: 6,
                      }}>
                        {group.name}
                        <span style={{ fontSize: 10, color: '#a89878', fontWeight: 'normal', marginLeft: 8 }}>
                          {group.thoughts.length} thought{group.thoughts.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {group.thoughts.map((t, i) => (
                        <div key={t.id} style={{
                          marginBottom: i < group.thoughts.length - 1 ? 10 : 0,
                          paddingBottom: i < group.thoughts.length - 1 ? 10 : 0,
                          borderBottom: i < group.thoughts.length - 1 ? '1px solid #e8dbb8' : 'none',
                        }}>
                          <p style={{
                            margin: '0 0 5px',
                            fontSize: 12,
                            fontStyle: 'italic',
                            color: '#1a1208',
                            lineHeight: 1.5,
                          }}>
                            "{t.text}"
                          </p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                            {t.categories.map(cat => (
                              <CategoryBadge key={cat} category={cat} />
                            ))}
                            <span style={{ fontSize: 9, color: '#a89878' }}>
                              {formatDateShort(t.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Course cards grid */}
          <div style={{ borderTop: '2px solid #1a1208', paddingTop: 20 }}>
            <div style={{
              fontSize: 16,
              fontWeight: 'bold',
              fontStyle: 'italic',
              fontFamily: 'Geist Mono',
              marginBottom: 16,
            }}>
              Courses Recorded
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',  // collapses to 1 col on small screens
              gap: 16,
            }}>
              {courseGroups.map((group, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedCourse(group)}
                  style={{
                    background: '#ede3c8',
                    border: selectedCourse?.name === group.name
                      ? '1px solid #1a1208'
                      : '1px solid #d4c49a',
                    padding: '16px 18px',
                    cursor: 'pointer',
                    transition: 'border 0.15s',
                  }}
                >
                  <div style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    fontFamily: 'Geist Mono',
                    marginBottom: 6,
                    color: '#1a1208',
                  }}>
                    ⛳ {group.name}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: '#a89878',
                    fontFamily: 'Geist Mono',
                    marginBottom: 8,
                  }}>
                    {group.thoughts.length} thought{group.thoughts.length !== 1 ? 's' : ''} logged
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {[...new Set(group.thoughts.flatMap(t => t.categories))].map(cat => (
                      <CategoryBadge key={cat} category={cat} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {thoughtsWithoutCourse.length > 0 && (
        <div style={{
          marginTop: 28,
          padding: '14px 18px',
          background: '#ede3c8',
          border: '1px dashed #c8b88a',
          fontSize: 12,
          fontFamily: 'Geist Mono',
          color: '#8b7355',
          fontStyle: 'italic',
          boxSizing: 'border-box',
        }}>
          {thoughtsWithoutCourse.length} thought{thoughtsWithoutCourse.length !== 1 ? 's' : ''} logged without a course — add a course when logging to see them on the map.
        </div>
      )}
    </div>
  );
}