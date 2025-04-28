
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { motion } from 'framer-motion';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  companyLogo?: string;
}

const testimonials: TestimonialProps[] = [
  {
    quote: "Tower Up - это синоним качества и надежности в строительной индустрии Ташкента. Их проект Пушкин превзошел все наши ожидания по комфорту и дизайну.",
    author: "Алексей Смирнов",
    position: "Директор, Инвест Групп",
    companyLogo: "/lovable-uploads/2e9eec02-a548-4df3-8403-4176c16680c9.png"
  },
  {
    quote: "Сотрудничество с Tower Up было исключительно плодотворным. Их профессионализм и внимание к деталям позволили реализовать наш проект в срок и с высочайшим качеством.",
    author: "Елена Каримова",
    position: "Управляющий партнер, Urban Development",
    companyLogo: "/lovable-uploads/5b8a353d-ebd6-43fe-8f54-7bacba7095ff.png"
  },
  {
    quote: "Жилой комплекс Пушкин - настоящий прорыв в жилищном строительстве Ташкента. Tower Up демонстрирует инновационный подход и безупречную реализацию своих проектов.",
    author: "Максим Исламов",
    position: "Главный архитектор, Ташкент Архитектс",
    companyLogo: "/lovable-uploads/79c6d08b-3c0f-498e-a6dd-8e575692ec48.png"
  },
  {
    quote: "Работать с командой Tower Up - одно удовольствие. Их нацеленность на результат и профессиональный подход заслуживают высочайшей оценки.",
    author: "София Рахимова",
    position: "Генеральный директор, Silk Road Investments",
    companyLogo: "/lovable-uploads/2fa6915f-aa2a-42b2-8dea-fa62dd2dcced.png"
  },
];

const TestimonialSliderSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 relative overflow-hidden bg-[#111111]">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111111] -z-10"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl -z-5"></div>
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-primary/10 blur-3xl -z-5"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', 
          backgroundSize: '40px 40px' 
        }}>
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
            <Quote className="mr-2 h-4 w-4" />
            Отзывы клиентов
          </div>
          <h2 className="text-4xl font-bold text-white sm:text-5xl">
            Что о нас говорят
          </h2>
          <p className="mt-6 text-lg text-gray-400 leading-relaxed">
            Узнайте, что думают наши клиенты о сотрудничестве с Tower Up и о качестве реализованных нами проектов
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="relative"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-6">
                  <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                    <Quote className="h-10 w-10 text-primary/30 mb-6" />
                    <p className="text-lg text-gray-200 mb-8 flex-grow">{testimonial.quote}</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-white">{testimonial.author}</p>
                        <p className="text-sm text-gray-400">{testimonial.position}</p>
                      </div>
                      {testimonial.companyLogo && (
                        <div className="ml-auto">
                          <img src={testimonial.companyLogo} alt="Company logo" className="h-8 w-auto opacity-70" />
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="relative inset-auto translate-y-0 mr-2 bg-primary/80 text-white hover:bg-primary border-none" />
              <CarouselNext className="relative inset-auto translate-y-0 ml-2 bg-primary/80 text-white hover:bg-primary border-none" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSliderSection;
