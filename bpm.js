this.workflowCockpit = workflowCockpit({
    init: _init,
    onSubmit: _saveData,
    onError: _rollback
});

function _init(data, info) {
    if (data && data.loadContext) {
        const { initialVariables } = data.loadContext;
        console.log("initialVariables: " + JSON.stringify(initialVariables));
    }
    
    info
        .getUserData()
        .then(function (user) {
            document.querySelector("#nomFun").setAttribute("value", user.fullname);
        })
        .then(function () {
        info.getPlatformData().then(function (platformData) {
            console.log(platformData);
        });
        info.getInfoFromProcessVariables().then(function(data) {
            // const regex = /\{[^}]*\}/g;
            // const matches  = data[0].value.match(regex);

            // const objectsArray = [];

            // // Para cada parte encontrada, removemos as chaves e criamos um objeto
            // matches.forEach(match => {
            //     // Remover as chaves
            //     const cleanMatch = match.slice(1, -1);
                
            //     // Separar as propriedades
            //     const properties = cleanMatch.split(', ');
                
            //     // Construir o objeto
            //     const obj = {};

            //     properties.forEach(property => {
            //         const [key, value] = property.split('=');
            //         obj[key.trim()] = value.trim();
            //     });

            //     // Adicionar o objeto ao array
            //     objectsArray.push(obj);
            // });

            let objectsArray = _convertStringToArrayObject(data);

            $('#box-proprietario').remove();

            objectsArray.forEach(function(item) {
                var customHtml = `
                <div id="box-proprietario" class="border rounded mt-3 p-3">
                    <div class="d-flex justify-content-end mb-3">
                        <button type="button" id="btn-close-tab" class="btn btn-light btn-sm">
                            <img src="./src/img/icons/close_tab.svg" alt="Icone de fechar aba">
                        </button>
                    </div>
                    <div class="row g-2">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="nomeProp" placeholder="Preencha o nome do proprietário..." value="${item.nomeProp}" required>
                            <label for="floatingInputGrid">Nome do Proprietário *</label>
                        </div>
                        <div class="col-md">
                            <div class="form-floating">
                              <input type="tel" id="contatoProp" class="form-control propPhone" maxlength="15" placeholder="(00) 00000-0000" value="${item.contatoProp}" required>
                              <label for="floatingInputGrid">Contato *</label>
                            </div>
                        </div>
                        <div class="col-md">
                            <div class="form-floating">
                              <input type="email" class="form-control" id="emailProp" placeholder="abcdefgh@email.com" value="${item.emailProp}" required>
                              <label for="floatingInputGrid">E-mail *</label>
                            </div>
                        </div>
                    </div>
                </div>`;

                $('#box-dados-proprietarios').append(customHtml);
            });
        })
    });
}

function _saveData(data, info) {

    let newData = {};
    let selectArea = document.querySelector("#areaEmp");
    let selectRegArea = document.querySelector("#regArea");

    // Aba 1
    newData.nomFun = document.querySelector("#nomFun").value;
    newData.area = selectArea.options[selectArea.selectedIndex].value;
    newData.dataEntrada = document.querySelector("#dataEntrada").value;


    // Aba 2
    const dadosProprietarios = [];
    let blocksProp = document.querySelectorAll('#box-proprietario');

    blocksProp.forEach(function(block) {
        const nomeProp = block.querySelector('#nomeProp').value;
        const contatoProp = block.querySelector('#contatoProp').value;
        const emailProp = block.querySelector('#emailProp').value;
        
        dadosProprietarios.push({nomeProp, contatoProp, emailProp});
    })

    console.log(blocksProp)
    
    newData.props = dadosProprietarios;

    // Aba 3
    newData.regArea = selectRegArea.options[selectRegArea.selectedIndex].value;
    newData.cepArea = document.querySelector("#cepArea").value;
    newData.cepEstado = document.querySelector("#cepEstado").value;
    newData.municipio = document.querySelector("#municipio").value;
    newData.areaHect = document.querySelector("#areaHectare").value;
    newData.areaMQ = document.querySelector("#areaMQ").value;
 
    console.log(newData);
    return {
      formData: newData,
    };
}

function _rollback(data, info) {
    console.log(data.error);
    if (info.isRequestNew()) {
       return removeData(data.processInstanceId);
    }
    return rollbackData(data.processInstanceId);
}

function _convertStringToArrayObject(data) {
    data.forEach(keyItem => {
        if(keyItem.key === "props") {
            const regex = /\{[^}]*\}/g;
            const matches  = keyItem.value.match(regex);

            const objectsArray = [];

            // Para cada parte encontrada, removemos as chaves e criamos um objeto
            matches.forEach(match => {

                // Remover as chaves
                const cleanMatch = match.slice(1, -1);
                        
                // Separar as propriedades
                const properties = cleanMatch.split(', ');
                        
                // Construir o objeto
                const obj = {};

                properties.forEach(property => {
                    const [key, value] = property.split('=');
                    obj[key.trim()] = value.trim();
                });

                // Adicionar o objeto ao array
                objectsArray.push(obj);
            });

            return objectsArray;
        }
    });
}
