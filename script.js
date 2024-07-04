$(document).ready(function () {  
    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy',
        todayHighlight: true,
        autoclose: true,
        language: 'pt-BR',
        orientation: 'auto'
    });  

    $('#box-dados-proprietarios').on('click', '#btn-close-tab', function() {
        $(this).closest('#box-proprietario').remove();
    });

    $('#btn-add-new-line').click(function() {
        var customHtml = `
                <div id="box-proprietario" class="border rounded mt-3 p-3">
                    <div class="d-flex justify-content-end mb-3">
                        <button type="button" id="btn-close-tab" class="btn btn-light btn-sm">
                            <img src="./src/img/icons/close_tab.svg" alt="Icone de fechar aba">
                        </button>
                    </div>
                    <div class="row g-2">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="nomeProp" placeholder="Preencha o nome do proprietário..." required>
                            <label for="floatingInputGrid">Nome do Proprietário *</label>
                        </div>
                        <div class="col-md">
                            <div class="form-floating">
                              <input type="tel" id="contatoProp" class="form-control propPhone" maxlength="15" placeholder="(00) 00000-0000" required>
                              <label for="floatingInputGrid">Contato *</label>
                            </div>
                        </div>
                        <div class="col-md">
                            <div class="form-floating">
                              <input type="email" class="form-control" id="emailProp" placeholder="abcdefgh@email.com" required>
                              <label for="floatingInputGrid">E-mail *</label>
                            </div>
                        </div>
                    </div>
                </div>`;

        $('#box-dados-proprietarios').append(customHtml);
    });

    // Consulta API de CEP
    $("#btn-search-cep").click(function() {
        let inputTextCep = $(".box-search-cep").val();

        fetch(`https://viacep.com.br/ws/${inputTextCep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (data.uf) {
                $('.box-estado').val(data.uf);
                $('.box-municipio').val(data.localidade);

                $('.box-estado, .box-municipio').prop('disabled', true);
            } else {
                swal ( "Oops" ,  "O CEP informado é inválido. Por favor, insira um CEP válido." ,  "error" )
            }
        })
        .catch(error => {
            swal ( "Oops" ,  "Algo de errado aconteceu" ,  "error" )
        });
    });

    // Format string to contact
    $('#box-dados-proprietarios').on('input', '#contatoProp', function() {
        let value = $(this).val();
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        $(this).val(value);
    });

    // Format string to CEP (ZipCode)
    $('#cepArea').on('input', function() {
        let value = $(this).val();
        value = value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        $(this).val(value);
    })
})
