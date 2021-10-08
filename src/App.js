import React, {useEffect, useState} from "react";
import Tmdb from "./Tmdb";
import Header from "./components/Header";
import FeaturedMovie from "./components/FeaturedMovie";
import MovieRow from "./components/MovieRow";
import './App.css'

//useEffect realiza o processo após a tela ser renderizada
//useState salva dados 

const App = () => {

  const [movieList, setMovieList] = useState([])
  const [featuredData, setFeaturedData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(()=>{
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList()
      setTimeout(() => {
        setMovieList(list)
      },500)

      // Pegando o Featured 
      let originals = list.filter(i => i.slug === 'originals')
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1))
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Tmdb.GetMovieInfo(chosen.id, 'tv')

      setFeaturedData(chosenInfo)
    }

    loadAll()
  }, [])

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener)

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return(
    <div className="page">
      <Header black={blackHeader}/>

      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        Feito por Matheus Sena Rosa para fins didáticos!!<br/>
        Direitos de imagem para Netflix.<br/>
        Dados pegos do site Themoviedb.org.
      </footer>

      {movieList.length === 0 &&
        <div className="loading">
          <img src="https://www.rchandru.com/images/portfolio/modals/m-loading.gif" alt="Carregando"></img>
        </div>
      }
    </div>
  )
}

export default App;