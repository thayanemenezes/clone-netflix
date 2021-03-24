import React, { useEffect, useState } from 'react';
import './App.css'
import tmdb from './tmdb';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';


export default () => {

  const [movielist, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() =>{
    const loadAll = async () => {
      //Pegar a lista total
      let list = await tmdb.getHomeList();
      setMovieList(list);

      //Pegar o filme em destaque-featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length -1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);

    }

    loadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if (window.scrollY > 15){
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, [])

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
      <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movielist.map((item,key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}

      </section>

      <footer>
          Feito com <span role="img" aria-label="coração">❤️</span> por <strong>Thayane Menezes</strong><br/>
          Direitos de imagem para <strong>Netflix</strong><br/>
          Dados via <strong>Themoviedb.org</strong>
      </footer>

      {movielist.length <= 0 &&
      <div className="loading">
        <img src="https://i.pinimg.com/originals/f9/0f/76/f90f7689233948005f465d98ead56d44.gif" />
      </div>
      }

    </div>
  )
}

