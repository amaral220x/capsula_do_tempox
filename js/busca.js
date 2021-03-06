let queryUrl = "https://pt.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=";



$(function() {

    $(document).keypress(function(e) {
        if(e.which == 13)
            $('#btn-buscar').click();
    });

    $('#btn-buscar').on('click', () => {
        $('#btn-buscar').focus();
        var busca = $('#busca').val();
        if(parseInt(busca)){
          var url = queryUrl + busca + "_no_Brasil";
          $.ajax({
              url: url,
              type: 'GET',
              dataType: 'json',
              success: pegarResultado
          });
        } else {
          $('#saida').empty();
          $('#saida').prepend("<div>Digite um ano, por favor!<br></div>");
          $('#saida').css('display', 'block');
        }

        function pegarResultado(dado){
            console.log(dado);

            let page = dado.query.pages;
            let pageId = Object.keys(dado.query.pages)[0];
            let content = page[pageId].extract;

            if(content != null){
                 console.log(content);
                 if(content.includes('<h2><span id="Nascimentos">Nascimentos</span></h2>\n<h')){
                    content = content.replace('<h2><span id="Nascimentos">Nascimentos</span></h2>', '');
                 }
                 if(content.includes('<h2><span id="Falecimentos">Falecimentos</span></h2>\n<h')){
                    content = content.replace('<h2><span id="Falecimentos">Falecimentos</span></h2>', '');
                 }
                 content = content.replace('<span id="Referências">Referências</span>', '');
                 $('#saida').empty();
                 $('#saida').prepend("<div>");
                 $('#saida').prepend(content);
                 $('#saida').prepend("<br></div>");
                 $('#saida').css('display', 'block');
                 console.log(content);

             } else {
                 $.ajax({
                    url: queryUrl + busca,
                    type: 'GET',
                    dataType: 'json',
                    success: segundaChance
                });
            }
        }

        function segundaChance(dado){
            console.log(dado);

            let page = dado.query.pages;
            let pageId = Object.keys(dado.query.pages)[0];
            let content = page[pageId].extract;

            if(content.includes('Brasil')){
                let partes = content.split('li>');
                $('#saida').empty();
                for(var i = 0; i < partes.length; i++){
                    if(partes[i].includes('Brasil')){
                        $('#saida').prepend('<li>' + partes[i] + 'li>');
                        $('#saida').css('display', 'block');
                    }
                }

            } else {
                $('#saida').empty();
                $('#saida').prepend("Nada a mostrar");
                $('#saida').css('display', 'block');
            }
        }

    });
});
