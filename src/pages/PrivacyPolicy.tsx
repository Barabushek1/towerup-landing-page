
import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from '@/components/PageHeader';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Политика конфиденциальности | TOWERUP</title>
        <meta name="description" content="Политика конфиденциальности TOWERUP. Узнайте, как мы собираем, используем и защищаем информацию, которую вы предоставляете при использовании нашего веб-сайта." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://towerup.uz/privacy-policy" />
      </Helmet>
      
      <NavBar />
      <PageHeader 
        title="Политика конфиденциальности"
        breadcrumb="Политика конфиденциальности"
      />
      
      <div className="container mx-auto px-6 py-12">
        <div className="prose prose-lg max-w-4xl mx-auto text-foreground">
          <h2>1. Общие положения</h2>
          <p>Настоящая политика конфиденциальности описывает, как TOWERUP собирает, использует и защищает информацию, которую вы предоставляете при использовании нашего веб-сайта.</p>

          <h2>2. Сбор информации</h2>
          <p>Мы собираем информацию, которую вы добровольно предоставляете нам через формы на сайте, включая:</p>
          <ul>
            <li>Имя и контактные данные</li>
            <li>Электронную почту</li>
            <li>Номер телефона</li>
          </ul>

          <h2>3. Использование информации</h2>
          <p>Собранная информация используется для:</p>
          <ul>
            <li>Обработки ваших запросов</li>
            <li>Предоставления информации о наших проектах</li>
            <li>Улучшения качества обслуживания</li>
          </ul>

          <h2>4. Защита информации</h2>
          <p>Мы принимаем необходимые меры для защиты вашей личной информации от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>

          <h2>5. Контакты</h2>
          <p>Если у вас есть вопросы относительно политики конфиденциальности, пожалуйста, свяжитесь с нами:</p>
          <ul>
            <li>Email: info@towerup.uz</li>
            <li>Телефон: +998 (55) 510-00-03</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
