
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Ошибка: Пользователь попытался получить доступ к несуществующему маршруту:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#161616] text-gray-200">
      <div className="text-center max-w-md p-8 rounded-lg bg-[#1a1a1a] border border-gray-800 shadow-xl">
        <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-red-500">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 font-benzin text-white">Страница не найдена</h1>
        <p className="text-lg text-gray-400 mb-6 font-benzin">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <Link to="/">
          <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-5 rounded-md flex items-center justify-center gap-2 font-benzin">
            <Home size={18} />
            Вернуться на главную
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
