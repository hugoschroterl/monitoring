
function normalize(c) {
  if(c.monitorar == "true")
    c.monitorar = true;
  if(c.monitorar == "false")
    c.monitorar = false;

  if(c.questionario == "true")
    c.questionario = true;
  if(c.questionario == "false")
    c.questionario = false;

  if(c.relatorio == "true")
    c.relatorio = true;
  if(c.relatorio == "false")
    c.relatorio = false;

  c.intervalo_minimo_de_stall = Number(c.intervalo_minimo_de_stall);
  c.intervalo_de_monitoramento = Number(c.intervalo_de_monitoramento);


  if(c.enviar_para_servidor == "true")
    c.enviar_para_servidor = true;
  if(c.enviar_para_servidor == "false")
    c.enviar_para_servidor = false;

 c.startup_time = Number(c.startup_time);
 c.stall_duration = Number(c.stall_duration);

}





// Saves options to chrome.storage
function save_options() {
  var ende = document.getElementById('endereco').value;
  
  var stall_state = {};
  $(".custom").each(function() {
          var btn = $(this);
          var name = btn.attr("id");
          var estado = btn.attr("estado");
          stall_state[name] = estado;
  });


  chrome.storage.sync.set({
    endereco: ende,
    monitorar: $('input[name="monitorar"]:checked').val(),
    questionario: $('input[name="questionario"]:checked').val(),
    relatorio: $('input[name="relatorio"]:checked').val(),
    intervalo_minimo_de_stall: $("#intervalo_minimo_de_stall").val(),
    intervalo_de_monitoramento : $("#intervalo_de_monitoramento").val(),
    enviar_para_servidor : $("#enviar_para_servidor").prop('checked'),
    simulador : $("#simulador").text(),
    estado_stall : stall_state ,
    startup_time : $("#startup_time").val(),
    stall_duration : $("#stall_duration").val()

  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Configurações salvas.';
    setTimeout(function() {
      $("#status").html("&nbsp;");
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.


function restore_options() {



  chrome.storage.sync.get({
    endereco: "http://0.0.0.0:3000",
    monitorar: "true",
    questionario: "true",
    relatorio: "false",
    intervalo_minimo_de_stall : 50,
    intervalo_de_monitoramento : 1000,
    enviar_para_servidor : "true",
    simulador : $("#simulador").text(),
    estado_stall : {"pos0":"undefined"},
    startup_time : 1000,
    stall_duration : 1000

  }, function(items) {

    normalize(items);
    //document.getElementById('color').value = items.favoriteColor;
    //document.getElementById('like').checked = items.likesColor;
    document.getElementById('endereco').value = items.endereco;
    if(items.monitorar) {
        $('input[name="monitorar"]')[0].checked = true;
    } else {
        $('input[name="monitorar"]')[1].checked = true;
    }

    if(items.questionario) {
        $('input[name="questionario"]')[0].checked = true;
    } else {
        $('input[name="questionario"]')[1].checked = true;
    }

    if(items.relatorio) {
        $('input[name="relatorio"]')[0].checked = true;
    } else {
        $('input[name="relatorio"]')[1].checked = true;
    }

    $("#intervalo_de_monitoramento").val(items.intervalo_de_monitoramento);
    $("#intervalo_minimo_de_stall").val(items.intervalo_minimo_de_stall);

    $("#enviar_para_servidor").prop('checked', items.enviar_para_servidor);

    $("#simulador").text(items.simulador);
    console.log(items.estado_stall);
    if(items.estado_stall["pos0"] != undefined) {
       $(".custom").each(function() {
          var btn = $(this);
          var name = btn.attr("id");
          btn.attr("estado", items.estado_stall[name]);
       });
    }


    $("#startup_time").val(items.startup_time);

    $("#stall_duration").val(items.stall_duration);

    refresh_page();

    


  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);


function refresh_page() {
      if($('input[name="monitorar"]:checked').val() == "true") {
          $("#monitorando").css('visibility','visible');
      } else {
          $("#monitorando").css('visibility','hidden');
      }

       console.log($("#simulador").text());
       if($("#simulador").text() == "Ativar simulador") {
        $("#simulador").removeClass("btn-danger");
        $("#simulador").addClass("btn-primary");
        $("#monitor").show();  
        $("#simulacao").hide();
      } else {
        $("#simulador").addClass("btn-danger");
        $("#simulador").removeClass("btn-primary");
        $("#monitor").hide();  
        $("#simulacao").show();
      }


      $(".custom").each(function() {
          var btn = $(this);
          if(btn.attr("estado") == "good") {
              btn.removeClass("btn-danger");
              btn.addClass("btn-success");
          } else {
              btn.removeClass("btn-success");
              btn.addClass("btn-danger");
          }
      });
      
};


$('input[name="monitorar"]').change(function() {
    refresh_page();
});

document.getElementById('simulador').addEventListener('click',
    simulador);


function simulador() {
      if($("#simulador").text() == "Ativar simulador") {
        $("#simulador").text("Desativar simulador");
        $("#simulador").addClass("btn-danger");
        $("#simulador").removeClass("btn-primary");
        $("#monitor").hide();  
        $("#simulacao").show();
        $("#simulacao").attr("estado","ativo");
      
      } else {
        $("#simulador").text("Ativar simulador");
        $("#simulador").removeClass("btn-danger");
        $("#simulador").addClass("btn-primary");
        $("#monitor").show();  
        $("#simulacao").hide();
        $("#simulacao").attr("estado","inativo");
      }
      
}


$(".custom").each(function() {
          var btn = $(this);

          $(this).click(function() {
              if(btn.attr("estado") == "good") {
                btn.removeClass("btn-success");
                btn.addClass("btn-danger");
                btn.attr("estado", "bad");
              } else {
                btn.removeClass("btn-danger");
                btn.addClass("btn-success");
                btn.attr("estado", "good");
              }
          })
});