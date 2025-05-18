
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Home } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ApartmentUnit {
  id: string;
  floor_number: number;
  area: number;
  room_count: number;
  price_per_sqm: number;
  total_price: number;
  initial_payment_30p: number;
  monthly_payment_8mo_30p: number;
  cadastre_payment_40p: number;
}

interface PriceCalculatorProps {
  className?: string;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ className }) => {
  const { t } = useLanguage();
  const [selectedFloor, setSelectedFloor] = useState<number>(0);
  const [selectedRooms, setSelectedRooms] = useState<number>(0);
  const [apartments, setApartments] = useState<ApartmentUnit[]>([]);
  const [filteredApartments, setFilteredApartments] = useState<ApartmentUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [floors, setFloors] = useState<number[]>([]);
  const [roomOptions, setRoomOptions] = useState<number[]>([]);
  
  // Fetch apartments data from Supabase
  useEffect(() => {
    const fetchApartments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('yangi_uzbekistan_apartment_units')
          .select('*')
          .order('floor_number', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setApartments(data);
          
          // Extract unique floors and room counts
          const uniqueFloors = [...new Set(data.map(apt => apt.floor_number))].sort((a, b) => b - a);
          setFloors(uniqueFloors);
          
          if (uniqueFloors.length > 0) {
            setSelectedFloor(uniqueFloors[0]);
          }
          
          const uniqueRooms = [...new Set(data.map(apt => apt.room_count))].sort((a, b) => a - b);
          setRoomOptions(uniqueRooms);
          
          if (uniqueRooms.length > 0) {
            setSelectedRooms(uniqueRooms[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching apartments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApartments();
  }, []);
  
  // Filter apartments based on selected floor and room count
  useEffect(() => {
    if (selectedFloor && selectedRooms) {
      const filtered = apartments.filter(apt => 
        apt.floor_number === selectedFloor && 
        apt.room_count === selectedRooms
      );
      setFilteredApartments(filtered);
    } else if (selectedFloor) {
      const filtered = apartments.filter(apt => apt.floor_number === selectedFloor);
      setFilteredApartments(filtered);
    } else if (selectedRooms) {
      const filtered = apartments.filter(apt => apt.room_count === selectedRooms);
      setFilteredApartments(filtered);
    } else {
      setFilteredApartments(apartments);
    }
  }, [selectedFloor, selectedRooms, apartments]);

  // Format number with spaces
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ru-RU').format(num);
  };
  
  return (
    <Card className={`overflow-hidden bg-white/5 backdrop-blur-sm border-slate-700/30 ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold text-white">Калькулятор стоимости</h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="w-full sm:w-auto">
              <Label htmlFor="floor-select" className="text-white/70 mb-1 block">Этаж</Label>
              <Select value={selectedFloor.toString()} onValueChange={(value) => setSelectedFloor(Number(value))}>
                <SelectTrigger id="floor-select" className="bg-slate-800/70 border-slate-700/50 text-white">
                  <SelectValue placeholder="Выберите этаж" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Все этажи</SelectItem>
                  {floors.map((floor) => (
                    <SelectItem key={floor} value={floor.toString()}>
                      {floor} этаж
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Label htmlFor="room-select" className="text-white/70 mb-1 block">Комнат</Label>
              <Select value={selectedRooms.toString()} onValueChange={(value) => setSelectedRooms(Number(value))}>
                <SelectTrigger id="room-select" className="bg-slate-800/70 border-slate-700/50 text-white">
                  <SelectValue placeholder="Выберите количество комнат" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Все варианты</SelectItem>
                  {roomOptions.map((rooms) => (
                    <SelectItem key={rooms} value={rooms.toString()}>
                      {rooms}-комнатная
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredApartments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5 border-b border-slate-700/50">
                  <TableHead className="text-white/70">Этаж</TableHead>
                  <TableHead className="text-white/70">Площадь (м²)</TableHead>
                  <TableHead className="text-white/70">Комнат</TableHead>
                  <TableHead className="text-white/70">Цена за м²</TableHead>
                  <TableHead className="text-white/70">Общая цена</TableHead>
                  <TableHead className="text-white/70">Первый взнос</TableHead>
                  <TableHead className="text-white/70">Ежемесячно</TableHead>
                  <TableHead className="text-white/70">Кадастр</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApartments.map((apartment) => (
                  <TableRow key={apartment.id} className="hover:bg-white/5 border-b border-slate-700/50">
                    <TableCell className="text-white font-medium">{apartment.floor_number}</TableCell>
                    <TableCell className="text-white">{apartment.area}</TableCell>
                    <TableCell className="text-white">{apartment.room_count}</TableCell>
                    <TableCell className="text-white">{formatNumber(apartment.price_per_sqm)} сум</TableCell>
                    <TableCell className="text-primary font-medium">{formatNumber(apartment.total_price)} сум</TableCell>
                    <TableCell className="text-white">{formatNumber(apartment.initial_payment_30p)} сум</TableCell>
                    <TableCell className="text-white">{formatNumber(apartment.monthly_payment_8mo_30p)} сум</TableCell>
                    <TableCell className="text-white">{formatNumber(apartment.cadastre_payment_40p)} сум</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-white/70">
            <Home className="mx-auto mb-3 h-10 w-10 text-slate-400/50" />
            <p>Нет доступных квартир с выбранными параметрами.</p>
            <Button 
              variant="outline" 
              className="mt-4 border-slate-700/50 text-white hover:bg-white/10"
              onClick={() => {
                setSelectedFloor(0);
                setSelectedRooms(0);
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-slate-700/50">
          <p className="text-sm text-slate-400">
            Расчет является приблизительным и может отличаться от окончательной стоимости. 
            Для получения точной информации обратитесь к нашим менеджерам по телефону <span className="text-primary">+998 71 123-45-67</span>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceCalculator;
