// import React from "react";
import React from "react";
import Card from "./component/Card";
import Drawer from "./component/Drawer";
import Header from "./component/Header";

function App() {

  const [items, setItems] = React.useState([]); // хук для карточек с кроссовками
  const [cartItems, setCartItems] = React.useState([]); // хук для товаров в корзине
  const [searchValue, setSearchValue] = React.useState(''); // хук для поиска товаров
  const [cartOpened, setCartOpened] = React.useState(false) // хук для открытия / закрытия корзины

  React.useEffect(() => { // этот хук следит, если открыта корзина, убираем глобальный скролл
    const body = document.querySelector('body');
    body.style.overflow = cartOpened ? 'hidden' : 'auto';
  }, [cartOpened]);

  React.useEffect(() => { // оборачиваем запрос хуком "useEffect", чтобы рендер произошел только один раз, при первой загрузке страницы
    fetch('https://6147374665467e0017384aa5.mockapi.io/items') // делаем запрос на тестовый сервер
      .then(res => {
        return res.json(); // получаем ответ в виде объекта и вызываем его метод "json" для получения "items"
      })
      .then(json => {
        setItems(json) // при помощи хука рендерим "items"
      })
  }, []);

  const onAddToCart = (obj) => { // когда произойдет клик в "Card", хук "setCartItems" запушит в массив новый "obj"
    
    setCartItems(prev => [...prev, obj])
  };

  const onChangeSearchInput = (event) => { // елси input изменится, отловить событие, и обновить state
    setSearchValue(event.target.value)
  }


  return (
    <div className="wrapper clear">
      {
        cartOpened && <Drawer //если "cartOpened" === true, то произвести рендер корзины
          onClose={() => setCartOpened(false)}
          items={cartItems} />
      }

      <Header
        onClickCart={() => setCartOpened(true)}
      />
      <div className="content p-40">
        <div className="d-flex align-center justify-between mb-40">
          <h1>{searchValue ? `Поиск по запросу: "${searchValue}"` : 'Все кроссовки'}</h1>
          <div className="search-block d-flex">
            <img src="/img/search.svg" alt="Search" />
            {
              searchValue && <img // Если "seacrhValue" существует отобрази кнопку "clear"
                onClick={() => setSearchValue('')} // по клику на кнопку очистить state
                className="clear cu-p"
                src="/img/button-remove.svg"
                alt="Clear" />
            }
            <input // контролируемый input т.к. в свойстве value значение из state
              onChange={onChangeSearchInput}
              placeholder="Поиск..."
              value={searchValue} />
          </div>
        </div>

        <div className="d-flex flex-wrap">
          {
            items
              .filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase())) // покажи те карточки, в которых присутствует "searchValue"
              .map((item, id) => (
                <Card
                  onPlus={(obj) => onAddToCart(obj)}
                  onFavorite={() => console.log('Добавили в закладки')}
                  title={item.title}
                  price={item.price}
                  imgUrl={item.imgUrl}
                  key={`${item.title}_${id}`} />
              ))
          }
        </div>
      </div>
    </div>
  )
}

export default App;
