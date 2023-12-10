document.querySelector('#button-cep').addEventListener('click', (evt) => { 
    let cep = document.querySelector('#input-cep').value;
    console.log(cep);

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((res) => {
            console.log(res);

            setEndereco(res);
            buscaPrevTemp(res.localidade);
            exibeNoticias(res.localidade);
        });
         
});

// API ENDERECO - VIACEP
const setEndereco = (objEndereco) =>{
    let divEndereco = document.querySelector('#endereco');
    
    let enderecoCompleto = `${objEndereco.logradouro}, ${objEndereco.bairro}, ${objEndereco.localidade} - ${objEndereco.uf}`;
    let enderecoElement = document.createElement('p');
    enderecoElement.textContent = enderecoCompleto;

    divEndereco.innerHTML = '';
    divEndereco.appendChild(enderecoElement);
    
}

// API DE PRE-VISAO TEMPO - OPENWEATHER
const buscaPrevTemp = (localidade) => {

    const apiKeyPre = '3535d7af2b2f6d156d920d701a473cc0';
    const apiUtl = `https://api.openweathermap.org/data/2.5/weather?q=${localidade}&appid=${apiKeyPre}&units=metric`;

    fetch(apiUtl)
        .then((res) => res.json())
        .then((data) => {

            if(data.cod == '200') {
                exibePrevisaoTempo(data);
            } else {
                console.error('Erro na Busca de previsão do tempo', data.message);
            }
        })
        .catch((error) => {
            console.error('Erro na Busca da API',error);
        });
};

const exibePrevisaoTempo = (dados) => {
    let divPrevTemp = document.querySelector('#previsaotemp');
    
    let tempAtual = dados.main.temp;
    let tempMin = dados.main.temp_min;
    let tempMax = dados.main.temp_max;
    let descTempo = dados.weather[0].description;
    

    let prevElement = document.createElement('p');
    prevElement.textContent = `Temperatura Atual: ${tempAtual}°C, Condição: ${descTempo}, Temperatura Minima: ${tempMin}°C, Temperatura Maxima: ${tempMax}°C`;

    divPrevTemp.innerHTML = '';
    divPrevTemp.appendChild(prevElement);


    // API - MAPA 
    if(map === undefined) {
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    } else {
        map.remove();
        map = L.map('map').setView([dados.coord.lat, dados.coord.lon], 15);
    }

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
            // marcador do mapa
    L.marker([dados.coord.lat, dados.coord.lon]).addTo(map)
        .bindPopup('Você está aqui!')
        .openPopup();

};
// MAP GlOBAL - para poder atualizar!
let map;

// Api de Notias NEWSAPI
const buscaNoticia = (localidade) => {
    console.log(localidade);
  const apiNoticiasUrl = ` https://newsapi.org/v2/everything?q=brasil&from=2023-12-01&sortBy=popularity&language=pt&pageSize=4&apiKey=25a66875c1ec43199007fe2a745dd7bb`;

  fetch(apiNoticiasUrl)
      .then((res) => res.json())
      .then((data) => {
          exibeNoticias(data.articles);
          
      })
      .catch((error) => {
          console.error('Erro na busca de notícias:', erro);
      });
      
};

const exibeNoticias = (noticias) => {
    const divNoticias = document.querySelector('#noticia');
    divNoticias.innerHTML = '';
  
    if (noticias.length > 0) {
        const ul = document.createElement('ul');
  
        noticias.forEach((noticia) => {
          console.log(noticia);
            const li = document.createElement('li');
            li.innerHTML = `<strong>${noticia.title}</strong>: ${noticia.description}`;
            ul.appendChild(li);
        });
  
        divNoticias.appendChild(ul);
    } else {
        divNoticias.textContent = 'Nenhuma notícia encontrada para esta região.';
    }
  };
  
  //para saber se api vai estar funcionando 
//https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=3535d7af2b2f6d156d920d701a473cc0//