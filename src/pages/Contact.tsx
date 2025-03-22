
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen antialiased bg-background text-foreground overflow-x-hidden">
      <NavBar />
      <main>
        <div className="pt-24 lg:pt-32">
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 text-brand-dark font-benzin">Контакты</h1>
                <p className="text-lg text-muted-foreground mb-12 font-benzin">
                  Свяжитесь с нами для получения консультации или обсуждения проекта
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h2 className="text-2xl font-medium mb-6 text-brand-dark font-benzin">Наши контакты</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2 text-brand-dark font-benzin">Адрес</h3>
                        <p className="text-muted-foreground font-benzin">г. Москва, ул. Большая Якиманка, 24</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 text-brand-dark font-benzin">Телефон</h3>
                        <p className="text-muted-foreground font-benzin">+7 925 712 30 00</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 text-brand-dark font-benzin">Email</h3>
                        <p className="text-muted-foreground font-benzin">info@example.com</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2 text-brand-dark font-benzin">Режим работы</h3>
                        <p className="text-muted-foreground font-benzin">Пн-Пт: 9:00 - 18:00</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-medium mb-6 text-brand-dark font-benzin">Форма обратной связи</h2>
                    <form className="space-y-4">
                      <div>
                        <input 
                          type="text" 
                          placeholder="Ваше имя" 
                          className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <input 
                          type="email" 
                          placeholder="Email" 
                          className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div>
                        <textarea 
                          placeholder="Ваше сообщение" 
                          rows={5}
                          className="w-full px-4 py-2 rounded-lg border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        ></textarea>
                      </div>
                      <div>
                        <button 
                          type="submit" 
                          className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-benzin"
                        >
                          Отправить
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
