//CAIXA DE DIGITAR
document.querySelector('#cep-button').addEventListener('click', (evt) => {
    let cep = document.querySelector('#input-cep').value;

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then((res) => res.json())
        .then((res) => {

            buscaEndereco(res);
            buscaTemp(res.localidade);
            buscaNoticias(res.localidade);
        });
         
});

//CEP - VIACEP
const buscaEndereco = (objEndereco) =>{
    let divEndereco = document.querySelector('#endereco');
    
    let enderecoCompleto = `${objEndereco.logradouro}, ${objEndereco.bairro}, ${objEndereco.localidade} - ${objEndereco.uf}`;
    let enderecoElement = document.createElement('p');
    enderecoElement.textContent = enderecoCompleto;

    divEndereco.innerHTML = '';
    divEndereco.appendChild(enderecoElement);
}


//PREVISÃO DO TEMPO - OPENWEATHER
const buscaTemp = (localidade) => {

    const apiKeyPre = '69bee774fa77cd777b8598a67b9ac5e2';
    const apiUtl = `https://api.openweathermap.org/data/2.5/weather?q=${localidade}&appid=${apiKeyPre}&units=metric`;

    fetch(apiUtl)
        .then((res) => res.json())
        .then((data) => {

            if(data.cod == '200') {
                exibeTemp(data);
            } else {
                console.error('Erro na Busca de previsão do tempo', data.message);
            }
        })
        .catch((error) => {
            console.error('Erro na Busca da API',error);
        });
};

const exibeTemp = (dados) => {
    let divPrevTemp = document.querySelector('#temp');
    
    let tempAtual = dados.main.temp;
    let tempMin = dados.main.temp_min;
    let tempMax = dados.main.temp_max;
    let descTemp = dados.weather[0].description;
    

    let prevElement = document.createElement('p');
    prevElement.textContent = `Temperatura Atual: ${tempAtual}°C, Condição: ${descTemp}, Temperatura Minima: ${tempMin}°C, Temperatura Maxima: ${tempMax}°C`;

    divPrevTemp.innerHTML = '';
    divPrevTemp.appendChild(prevElement);

//mapa - LEAFLET
if(mapa === undefined) {
    mapa = L.mapa('mapa').setView([dados.coord.lat, dados.coord.lon], 15);
} else {
    mapa.remove();
    mapa = L.mapa('mapa').setView([dados.coord.lat, dados.coord.lon], 15);
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapa);

L.marker([dados.coord.lat, dados.coord.lon]).addTo(mapa)
    .bindPopup('Posição Atual')
    .openPopup();
}

const busacNoticias = (noticias) => {
    const divNoticias = document.querySelector('#noticias');
    divNoticias.innerHTML = '';

    if (noticias.length > 0) {
        const ul = document.createElement('ul');

        noticias.forEach((noticias) => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${noticias.title}</strong>: ${noticias.description}`;
            ul.appendChild(li);
        });

        divNoticias.appendChild(ul);
    } else {
        divNoticias.textContent = 'Nenhuma notícia encontrada para esta região.';
    }
};