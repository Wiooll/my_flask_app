// app.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const nome = document.getElementById('nome').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco = document.getElementById('preco').value;
        
        fetch('/add_product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nome: nome,
                quantidade: quantidade,
                preco: preco,
                selecionado: false
            })
        }).then(response => response.json())
          .then(data => {
              carregarProdutos();
          });
    });

    document.getElementById('btn-remover-todos').addEventListener('click', function() {
        fetch('/remove_all_products', {
            method: 'POST'
        }).then(response => response.json())
          .then(data => {
              carregarProdutos();
          });
    });

    function carregarProdutos() {
        fetch('/get_products')
            .then(response => response.json())
            .then(data => {
                const tabelaBody = document.querySelector('#produtos tbody');
                tabelaBody.innerHTML = '';
                let precoTotal = 0;
                let precoSelecionado = 0;
                
                data.forEach(produto => {
                    const novaLinha = tabelaBody.insertRow();

                    const celulaCheckbox = novaLinha.insertCell(0);
                    const celulaNome = novaLinha.insertCell(1);
                    const celulaQuantidade = novaLinha.insertCell(2);
                    const celulaPreco = novaLinha.insertCell(3);
                    const celulaRemover = novaLinha.insertCell(4);

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.classList.add('checkbox');
                    checkbox.checked = produto.selecionado;
                    checkbox.addEventListener('change', () => {
                        atualizarPrecoSelecionado();
                    });
                    celulaCheckbox.appendChild(checkbox);

                    celulaNome.textContent = produto.nome;

                    const inputQuantidade = document.createElement('input');
                    inputQuantidade.type = 'number';
                    inputQuantidade.placeholder = 'Qtd';
                    inputQuantidade.value = produto.quantidade;
                    inputQuantidade.min = 0;  
                    inputQuantidade.addEventListener('change', () => {
                        if (inputQuantidade.value < 0) inputQuantidade.value = 0;
                        atualizarPrecoTotal();
                    });
                    celulaQuantidade.appendChild(inputQuantidade);

                    const inputPreco = document.createElement('input');
                    inputPreco.type = 'number';
                    inputPreco.placeholder = 'Preço';
                    inputPreco.value = produto.preco;
                    inputPreco.min = 0;
                    inputPreco.addEventListener('change', () => {
                        if (inputPreco.value < 0) inputPreco.value = 0;
                        atualizarPrecoTotal();
                    });
                    celulaPreco.appendChild(inputPreco);

                    const btnRemover = document.createElement('button');
                    btnRemover.textContent = 'Remover';
                    btnRemover.addEventListener('click', () => {
                        fetch('/remove_product', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ id: produto.objectId })
                        }).then(response => response.json())
                          .then(data => {
                              carregarProdutos();
                          });
                    });
                    celulaRemover.appendChild(btnRemover);
                    
                    precoTotal += produto.quantidade * produto.preco;
                    if (produto.selecionado) {
                        precoSelecionado += produto.quantidade * produto.preco;
                    }
                });

                document.getElementById('preco-total').textContent = precoTotal.toFixed(2);
                document.getElementById('preco-selecionado').textContent = precoSelecionado.toFixed(2);
                
                const temProdutos = data.length > 0;
                document.querySelector('.totals').classList.toggle('hidden', !temProdutos);
                document.getElementById('btn-remover-todos').classList.toggle('hidden', !temProdutos);
            });
    }

    function atualizarPrecoTotal() {
        const linhas = document.querySelectorAll('#produtos tbody tr');
        let precoTotal = 0;

        linhas.forEach(linha => {
            const quantidade = parseFloat(linha.cells[2].querySelector('input').value);
            const preco = parseFloat(linha.cells[3].querySelector('input').value);
            if (!isNaN(quantidade) && !isNaN(preco)) {
                precoTotal += quantidade * preco;
            }
        });

        document.getElementById('preco-total').textContent = precoTotal.toFixed(2);
        atualizarPrecoSelecionado();
    }

    function atualizarPrecoSelecionado() {
        const checkboxes = document.querySelectorAll('#produtos tbody input[type="checkbox"]');
        let precoSelecionado = 0;

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const quantidade = parseFloat(checkbox.parentElement.nextElementSibling.nextElementSibling.querySelector('input').value);
                const preco = parseFloat(checkbox.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.querySelector('input').value);
                if (!isNaN(quantidade) && !isNaN(preco)) {
                    precoSelecionado += quantidade * preco;
                }
            }
        });

        document.getElementById('preco-selecionado').textContent = precoSelecionado.toFixed(2);
    }

    carregarProdutos();
});
