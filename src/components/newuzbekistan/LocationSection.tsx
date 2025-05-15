
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, School, ShoppingBag, LandPlot, Bus, TreeDeciduous, Building } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox token - you should replace this with your own token in production
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1hcHAiLCJhIjoiY2x3Y204ajJ0MHE5bDJpbzM3ajBrNThrcyJ9.i3QekR-CMw-c2Yy3KKat2w';

const LocationSection: React.FC = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [mapLoaded, setMapLoaded] = useState(false);

  // Янги Узбекистан coordinates
  const LOCATION_COORDINATES = [69.229707, 41.328528];

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: LOCATION_COORDINATES,
      zoom: 14,
      pitch: 40,
      bearing: 20,
      attributionControl: false
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Add marker for the main location
    const marker = new mapboxgl.Marker({
      color: "#3b82f6",
      scale: 1.2
    })
      .setLngLat(LOCATION_COORDINATES)
      .addTo(map);

    // Create popup content
    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
      <div class="font-medium">ЖК "Янги Узбекистан"</div>
      <div class="text-xs text-gray-600">Ташкент</div>
    `;

    // Create and add popup
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 25,
      className: 'custom-popup'
    })
      .setDOMContent(popupContent)
      .setLngLat(LOCATION_COORDINATES);

    marker.setPopup(popup);
    popup.addTo(map);

    // Add surrounding points of interest
    const pointsOfInterest = [
      {
        name: "Ташкентский хлопчатобумажный комбинат",
        coordinates: [69.235, 41.330],
        icon: Building,
        color: "#f59e0b"
      },
      {
        name: "Школа №210",
        coordinates: [69.226, 41.332],
        icon: School,
        color: "#10b981"
      },
      {
        name: "Парк",
        coordinates: [69.232, 41.324],
        icon: TreeDeciduous,
        color: "#22c55e"
      },
      {
        name: "Автобусная остановка",
        coordinates: [69.230, 41.326],
        icon: Bus,
        color: "#6366f1"
      },
      {
        name: "Рынок",
        coordinates: [69.224, 41.330],
        icon: ShoppingBag,
        color: "#ec4899"
      }
    ];

    pointsOfInterest.forEach(poi => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'poi-marker';
      el.style.backgroundColor = poi.color;
      
      // Create and add the marker
      new mapboxgl.Marker({ element: el })
        .setLngLat(poi.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 20 })
            .setHTML(`<div class="font-medium">${poi.name}</div>`)
        )
        .addTo(map);
    });

    map.on('load', () => {
      // Add 3D building layer
      if (map.getLayer('3d-buildings')) {
        map.setLayerZoomRange('3d-buildings', 15, 22);
      } else {
        map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        });
      }

      // Add custom styling for water
      if (!map.getLayer('water-surface')) {
        map.addLayer({
          id: 'water-surface',
          type: 'fill',
          source: 'composite',
          'source-layer': 'water',
          paint: {
            'fill-color': '#0077b6',
            'fill-opacity': 0.8
          }
        });
      }

      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add custom CSS for map markers
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .poi-marker {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
      }
      .mapboxgl-popup-content {
        padding: 8px 10px;
        background: rgba(255,255,255,0.9);
        backdrop-filter: blur(5px);
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.2);
      }
      .custom-popup .mapboxgl-popup-content {
        border-left: 4px solid #3b82f6;
      }
      .mapboxgl-popup-close-button {
        font-size: 16px;
        padding: 0 6px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const amenities = [
    {
      icon: <School className="h-6 w-6 text-primary" />,
      title: "Образование",
      items: ["Школа №210 – 5 минут", "Детский сад – 10 минут", "Международная школа – 20 минут"]
    },
    {
      icon: <ShoppingBag className="h-6 w-6 text-primary" />,
      title: "Магазины",
      items: ["Рынок «Чорсу» – 15 минут", "Торговый центр – 10 минут", "Супермаркет – 5 минут"]
    },
    {
      icon: <LandPlot className="h-6 w-6 text-primary" />,
      title: "Отдых",
      items: ["Парк – 5 минут", "Стадион – 15 минут", "Спортивный комплекс – 10 минут"]
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Транспорт",
      items: ["Автобусная остановка – 2 минуты", "Станция метро – 15 минут", "Выезд на кольцевую дорогу – 10 минут"]
    }
  ];

  return (
    <section
      id="location"
      ref={sectionRef}
      className="py-16 md:py-24 bg-gradient-to-b from-[#0c0c0c] to-[#111111]"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Расположение
          </h2>
          
          <p className="text-xl text-primary">
            Удобное расположение в центре Ташкента
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-slate-800/40 rounded-xl overflow-hidden border border-slate-700/30 h-[500px] relative"
            >
              {/* Map container */}
              <div ref={mapContainerRef} className="w-full h-full"></div>
              
              {/* Loading overlay */}
              {!mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                </div>
              )}
              
              {/* Map attribution */}
              <div className="absolute bottom-1 right-1 text-xs text-white/50 bg-black/30 px-2 py-1 rounded">
                © <a href="https://www.mapbox.com/about/maps/" target="_blank" rel="noopener noreferrer" className="hover:text-white/80">Mapbox</a> | © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-white/80">OpenStreetMap</a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 bg-slate-800/40 rounded-xl p-6 border border-slate-700/30"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" /> Адрес
              </h3>
              <p className="text-slate-300">ул. Шота Руставели, 166, Ташкент, Узбекистан</p>
              <div className="mt-4 text-slate-400">
                <p>Жилой комплекс "Янги Узбекистан" расположен в центральной части Ташкента, в Яшнабадском районе. Это современный комплекс с развитой инфраструктурой, прекрасной транспортной доступностью и всем необходимым для комфортной жизни.</p>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            {amenities.map((amenity, index) => (
              <motion.div
                key={amenity.title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/30"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-slate-700/50 p-3 rounded-full mr-4">
                    {amenity.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{amenity.title}</h4>
                    <ul className="space-y-2">
                      {amenity.items.map((item, idx) => (
                        <li key={idx} className="flex items-start text-slate-300">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-primary/10 p-5 rounded-xl border border-primary/20"
            >
              <h4 className="flex items-center text-lg font-bold text-white mb-3">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Преимущества расположения
              </h4>
              <p className="text-slate-300">
                Жилой комплекс "Янги Узбекистан" расположен в одном из самых удобных и престижных районов города, с отличной транспортной доступностью и развитой инфраструктурой. Рядом находятся школы, детские сады, магазины и рестораны.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
