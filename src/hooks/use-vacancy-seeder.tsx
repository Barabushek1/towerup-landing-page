
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { needsSeedingCheck } from '@/utils/cache-utils';

interface Vacancy {
  title: string;
  location: string;
  salary_range: string;
  description: string;
  requirements?: string;
  benefits?: string;
  is_active: boolean;
  image_url?: string;
  employment_type?: string;
  remote_status?: string;
}

export function useVacancySeeder(initialRun = true) {
  useEffect(() => {
    // Skip if not initial run or already checked in this session
    if (!initialRun || !needsSeedingCheck('vacancies')) return;

    const seedVacanciesIfNeeded = async () => {
      try {
        console.log("Checking if vacancies need to be seeded...");
        
        // Check if we have any vacancies already
        const { count, error } = await supabase
          .from('vacancies')
          .select('*', { count: 'exact', head: true });
          
        if (error) {
          console.error("Error checking vacancies:", error);
          return;
        }
        
        if ((count || 0) > 0) {
          console.log(`Found ${count} existing vacancies, no need to seed.`);
          return;
        }
        
        console.log("No vacancies found. Seeding initial vacancies...");
        
        // Define example vacancies matching the ones currently hardcoded in the Vacancies.tsx
        const vacancies: Vacancy[] = [
          {
            title: "Главный инженер проекта",
            location: "Ташкент",
            salary_range: "от 15 000 000 сум",
            is_active: true,
            description: "Мы ищем опытного главного инженера проекта для руководства нашими строительными проектами. Основные обязанности включают планирование проектов, управление командой инженеров, контроль качества и соблюдение сроков.",
            requirements: "• Высшее техническое образование\n• Опыт работы в строительстве от 5 лет\n• Знание строительных норм и правил\n• Навыки управления проектами\n• Опыт руководства командой",
            benefits: "• Конкурентная заработная плата\n• Возможности карьерного роста\n• Работа с передовыми технологиями\n• Дружный коллектив\n• Медицинская страховка",
            employment_type: "Полная занятость",
            remote_status: "Офис"
          },
          {
            title: "Архитектор",
            location: "Ташкент",
            salary_range: "от 12 000 000 сум",
            is_active: true,
            description: "Требуется креативный архитектор для разработки проектов жилых и коммерческих зданий. Вы будете работать в команде профессионалов, создавая инновационные и функциональные дизайны.",
            requirements: "• Высшее образование в области архитектуры\n• Опыт работы от 3 лет\n• Владение AutoCAD, Revit, 3D Max\n• Портфолио реализованных проектов\n• Знание современных тенденций в архитектуре",
            benefits: "• Гибкий график работы\n• Творческая среда\n• Участие в интересных проектах\n• Профессиональное развитие",
            employment_type: "Полная занятость",
            remote_status: "Офис"
          },
          {
            title: "Прораб",
            location: "Ташкент",
            salary_range: "от 10 000 000 сум",
            is_active: true,
            description: "Мы ищем опытного прораба для контроля строительных работ на объектах. Вы будете отвечать за организацию работы бригад, контроль качества и соблюдение графика строительства.",
            requirements: "• Высшее строительное образование\n• Опыт работы прорабом от 3 лет\n• Знание технологий строительства\n• Умение читать чертежи\n• Навыки управления персоналом",
            benefits: "• Стабильная занятость\n• Корпоративный транспорт\n• Премии за успешное завершение проектов",
            employment_type: "Полная занятость",
            remote_status: "Офис"
          },
          {
            title: "Инженер-конструктор",
            location: "Дистанционно",
            salary_range: "от 9 000 000 сум",
            is_active: true,
            description: "Требуется инженер-конструктор для разработки строительных конструкций. Возможна удаленная работа с периодическими встречами в офисе.",
            requirements: "• Высшее техническое образование\n• Опыт расчета строительных конструкций\n• Владение специализированным ПО\n• Знание нормативной документации",
            benefits: "• Удаленный формат работы\n• Гибкий график\n• Оплата профессионального обучения",
            employment_type: "Полная занятость",
            remote_status: "Удаленно"
          },
          {
            title: "Специалист по закупкам",
            location: "Ташкент",
            salary_range: "от 8 500 000 сум",
            is_active: true,
            description: "Мы ищем специалиста по закупкам строительных материалов и оборудования. Вы будете отвечать за поиск поставщиков, проведение тендеров и контроль поставок.",
            requirements: "• Опыт в закупках от 2 лет\n• Знание рынка строительных материалов\n• Навыки ведения переговоров\n• Внимательность к деталям",
            benefits: "• Стабильная заработная плата\n• Корпоративное обучение\n• Дружный коллектив",
            employment_type: "Полная занятость",
            remote_status: "Офис"
          },
          {
            title: "Бухгалтер",
            location: "Ташкент",
            salary_range: "от 8 000 000 сум",
            is_active: true,
            description: "Требуется бухгалтер для ведения учета в строительной компании. Основные обязанности включают учет материальных ценностей, расчет заработной платы, подготовку отчетности.",
            requirements: "• Высшее экономическое образование\n• Опыт работы бухгалтером от 2 лет\n• Знание 1С\n• Внимательность, ответственность",
            benefits: "• Официальное трудоустройство\n• Стабильная заработная плата\n• Возможности профессионального роста",
            employment_type: "Полная занятость",
            remote_status: "Офис"
          }
        ];
        
        // Insert all vacancies
        const { error: insertError } = await supabase
          .from('vacancies')
          .insert(vacancies);
          
        if (insertError) {
          console.error("Error seeding vacancies:", insertError);
        } else {
          console.log("Successfully seeded vacancies:", vacancies.length);
        }
      } catch (err) {
        console.error("Unexpected error during vacancy seeding:", err);
      }
    };
    
    seedVacanciesIfNeeded();
  }, [initialRun]);
}
