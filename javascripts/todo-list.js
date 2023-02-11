$(function () {

    let usuario = "usuario@email.com";
    let servidor = "http://livro-capitulo07.herokuapp.com";

    let $ultimaTarefaClicada;

    function onExcluirTarefaClick() {
        $(this).parent(".item-tarefa")
            .off('click')
            .hide("slow", function () {
                $this = $(this);

                $.post(server + "/tarefa",
                    {
                        usuario: usuario,
                        tarefa_id: $this.children(".id-tarefa").text(),
                        _method: "DELETE"
                    });

                $(this).remove();
            });
    }

    function adicionarTarefa(texto, id) {
        id = id || 0;

        let tarefa = '<div class="item-tarefa">'
            + '<div class="id-tarefa">' + id + '</div>'
            + '<div class="texto-tarefa">' + texto + '</div>'
            + '<div class="excluir-tarefa"><img src="imagens/excluir.gif"></div>'
            + '<div class="clear"></div>'
            + '</div>';

        $("#lista-tarefa").append(tarefa);
        $(".excluir-tarefa").click(onExcluirTarefaClick);
        $(".item-tarefa").click(onItemTarefaClick);

        if (id === 0) {
            let div = $($(tarefa).children(".id-tarefa"));
            console.log("id", div);
            cadastrarTarefa(texto, $(div));
        }
    }

    function onTarefaKeydown(event) {
        if (event.which === 13) {
            adicionarTarefa($("#tarefa").val());
            $("#tarefa").val("");
        }
    }

    function onEditarTarefaKeydown(event) {
        if (event.which === 13) {
            salvarAlteracaoPendente($ultimaTarefaClicada);
            $ultimaTarefaClicada = undefined;
        }
    }

    function onItemTarefaClick() {
        if (!$(this).is($ultimaTarefaClicada)) {
            if ($ultimaTarefaClicada !== undefined) {
                salvarAlteracaoPendente($ultimaTarefaClicada);
            }

            $ultimaTarefaClicada = $(this);
            let id = $ultimaTarefaClicada.children(".id-tarefa").text();
            let texto = $ultimaTarefaClicada.children(".texto-tarefa").text();
            let conteudo = `<div class='id-tarefa'>${id}</div><input type='text' class='editar-tarefa' value='${texto}'>`;
            $ultimaTarefaClicada.html(conteudo);
            $(".editar-tarefa").keydown(onEditarTarefaKeydown);
            $(".editar-tarefa").focus();
        }
    }

    function salvarAlteracaoPendente($tarefa) {
        let id = $tarefa.children(".id-tarefa").text();
        let texto = $tarefa.children(".editar-tarefa").val();
        $tarefa.empty();
        $tarefa.append("<div class='id-tarefa'>" + id + "</div>")
            .append("<div class='texto-tarefa'>" + texto + "</div>")
            .append("<div class='excluir-tarefa'></div>")
            .append("<div class='clear'></div>");
        atualizarTarefa(texto, id);
        $(".excluir-tarefa").click(onExcluirTarefaClick);
        $tarefa.click(onItemTarefaClick);
    }

    function carregarTarefas() {
        $("#tarefa").empty();

        $.getJSON(servidor + "/tarefas", { usuario: usuario })
            .done(function (data) {
                console.log("data: ", data);
                for (var tarefa = 0; tarefa < data.length; tarefa++) {
                    addTarefa(data[tarefa].texto, data[tarefa].id);
                }
            });
    }

    function atualizarTarefa(texto, id) {
        $.post(servidor + "/tarefa", { tarefa_id: id, texto: texto });
    }

    function cadastrarTarefa(texto, $div) {
        $.post(server + "/tarefa",
            {
                usuario: usuario,
                texto: texto,
                _method: "PUT"
            })
            .done(function (data) {
                $div.text(data.id);
            });
    }

    $(".excluir-tarefa").click(onExcluirTarefaClick);
    $(".item-tarefa").click(onItemTarefaClick);
    $("#tarefa").keydown(onTarefaKeydown);

    carregarTarefas();
});
