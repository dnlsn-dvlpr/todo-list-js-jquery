$(function () {

    let $ultimaTarefaClicada;

    function onExcluirTarefaClick() {
        $(this).parent(".item-tarefa")
            .off('click')
            .hide("slow", function () {
                $(this).remove();
            });
    }

    function adicionarTarefa(texto) {
        let tarefa = '<div class="item-tarefa">'
            + '<div class="texto-tarefa">' + texto + '</div>'
            + '<div class="excluir-tarefa"><img src="imagens/excluir.gif"></div>'
            + '<div class="clear"></div>'
            + '</div>';
        $("#lista-tarefa").append(tarefa);
        $(".excluir-tarefa").click(onExcluirTarefaClick);
        $(".item-tarefa").click(onItemTarefaClick);
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
            let texto = $ultimaTarefaClicada.children(".texto-tarefa").text();
            let conteudo = `<input type='text' class='editar-tarefa' value='${texto}'>`;
            $ultimaTarefaClicada.html(conteudo);
            $(".editar-tarefa").keydown(onEditarTarefaKeydown);
            $(".editar-tarefa").focus();
        }
    }

    function salvarAlteracaoPendente($tarefa) {
        let texto = $tarefa.children(".editar-tarefa").val();
        $tarefa.empty();
        $tarefa.append("<div class='texto-tarefa'>" + texto + "</div>")
            .append("<div class='excluir-tarefa'></div>")
            .append("<div class='clear'></div>");
        $(".excluir-tarefa").click(onExcluirTarefaClick);
        $tarefa.click(onItemTarefaClick);
    }

    $(".excluir-tarefa").click(onExcluirTarefaClick);
    $(".item-tarefa").click(onItemTarefaClick);
    $("#tarefa").keydown(onTarefaKeydown);
});
