//pegar o CEP
function limpa_formulário_cep() {
    //Limpa valores do formulário de cep.
    document.getElementById('rua').value=("");
    document.getElementById('bairro').value=("");
    document.getElementById('cidade').value=("");
    document.getElementById('uf').value=("");
    document.getElementById('ibge').value=("");
}

function meu_callback(conteudo) {
if (!("erro" in conteudo)) {
    //Atualiza os campos com os valores.
    document.getElementById('rua').value=(conteudo.logradouro);
    document.getElementById('bairro').value=(conteudo.bairro);
    document.getElementById('cidade').value=(conteudo.localidade);
    document.getElementById('uf').value=(conteudo.uf);
    document.getElementById('ibge').value=(conteudo.ibge);
} //end if.
else {
    //CEP não Encontrado.
    limpa_formulário_cep();
    alert("CEP não encontrado.");
}
}

function pesquisacep(valor) {

//Nova variável "cep" somente com dígitos.
var cep = valor.replace(/\D/g, '');

//Verifica se campo cep possui valor informado.
if (cep != "") {

    //Expressão regular para validar o CEP.
    var validacep = /^[0-9]{8}$/;

    //Valida o formato do CEP.
    if(validacep.test(cep)) {

        //Preenche os campos com "..." enquanto consulta webservice.
        document.getElementById('rua').value="...";
        document.getElementById('bairro').value="...";
        document.getElementById('cidade').value="...";
        document.getElementById('uf').value="...";
        document.getElementById('ibge').value="...";

        //Cria um elemento javascript.
        var script = document.createElement('script');

        //Sincroniza com o callback.
        script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

        //Insere script no documento e carrega o conteúdo.
        document.body.appendChild(script);

    } //end if.
    else {
        //cep é inválido.
        limpa_formulário_cep();
        alert("Formato de CEP inválido.");
    }
} //end if.
else {
    //cep sem valor, limpa formulário.
    limpa_formulário_cep();
}
};


//previsao do tempo
function DrawWeatherTutiempo(data)
{
var htmld="",htmlh="",dhcach="",meses = new Array('-','Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro');
htmld += '<div class="header"><h2>Tempo em '+data.locality.name+'</h2><p>Previsão de 7 dias | Tempo por Tutiempo.net</p></div>';
htmlh += '<div class="header" style="padding-top:20px;"><h2>Previsão do tempo de hora em hora em '+data.locality.name+'</h2><p>Próximas 24 horas | Dados de Tutiempo.net</p></div>';
	for(var k in data)
	{
		if(k.indexOf("day")>-1)
		{
		var res = data[k].date.split("-");
		htmld += '<div class="daydata">';
		htmld += '<h3 class="date">'+res[2]+' de '+meses[res[1]]+' de '+res[0]+'</h3>';
		htmld += '<p class="it"><img alt="'+data[k].text+'" title="'+data[k].text+'" height="50" src="https://v5i.tutiempo.net/wi/01/50/'+data[k].icon+'.png" width="50" />'+data[k].temperature_max+'&deg;C<br />'+data[k].temperature_min+'&deg;C</p>';
		htmld += '<p class="wind"><img alt="'+data[k].wind_direction+'" title="'+data[k].wind_direction+'" height="50" src="https://v5i.tutiempo.net/wd/big/black/'+data[k].icon_wind+'.png" width="50" />'+data[k].wind+' km/h</p>';
		htmld += '<p class="oc">Humidade: '+data[k].humidity+'%<br />Nascer do sol: '+data[k].sunrise+'<br />Pôr do sol: '+data[k].sunset+'</p>';
		htmld += '<p class="moon"><img alt="" height="50" src="https://v5i.tutiempo.net/wmi/02/'+data[k].moon_phases_icon+'.png" width="50" />Moonrise: '+data[k].moonrise+'<br />Moonset: '+data[k].moonset+'</p>';
		htmld += '</div>';
		}
		else if(k.indexOf("hour_hour")>-1)
		{
			for(var kh in data[k])
			{
			var res = data[k][kh].date.split("-");
			htmlh += '<div class="daydata">';
			if(dhcach != data[k][kh].date){dhcach = data[k][kh].date; htmlh += '<h3 class="date">'+res[2]+' de '+meses[res[1]]+' de '+res[0]+'</h3>';}
			htmlh += '<p class="time"><strong>'+data[k][kh].hour_data+'</strong> | '+data[k][kh].text+'</h3>';
			htmlh += '<p class="wind"><img alt="'+data[k][kh].text+'" title="'+data[k][kh].text+'" height="50" src="https://v5i.tutiempo.net/wi/01/50/'+data[k][kh].icon+'.png" width="50" />'+data[k][kh].temperature+'&deg;C</p>';
			htmlh += '<p class="wind"><img alt="'+data[k][kh].wind_direction+'" title="'+data[k][kh].wind_direction+'" height="50" src="https://v5i.tutiempo.net/wd/big/black/'+data[k][kh].icon_wind+'.png" width="50" />'+data[k][kh].wind+' km/h</p>';
			htmlh += '<p class="oc" style="line-height:25px;">Humidade: '+data[k][kh].humidity+'%<br />Pressão: '+data[k][kh].pressure+'</p>';
			htmlh += '</div>';
			}
		}
	}
document.getElementById("WidgetTutiempo").innerHTML = htmld+'<p class="linkTT"><a href="'+data.locality.url_weather_forecast_15_days+'" target="_blank" rel="nofollow">Previsão 15 dias</a></p>'+htmlh+'<p class="linkTT"><a href="'+data.locality.url_hourly_forecast+'" target="_blank" rel="nofollow">Ver previsão por hora - 14 dias</a></p>';
}

function LoadJSONTuTiempo()
{
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){if(this.readyState == 4 && this.status == 200){var data = JSON.parse(this.responseText); DrawWeatherTutiempo(data);}};
xhttp.open("GET","https://api.tutiempo.net/json/?lan=pt&apid=XCG4zzXXaaq9qi6&lid=58370",true);
xhttp.send();
}
LoadJSONTuTiempo();