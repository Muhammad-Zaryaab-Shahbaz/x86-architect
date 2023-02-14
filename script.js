function checkAnswers() {
  let correct = 0;
  if (parseInt($('div[data-id="1"]').attr("data-pos")) === 4) correct++;
  if (parseInt($('div[data-id="2"]').attr("data-pos")) === 3) correct++;
  if (parseInt($('div[data-id="3"]').attr("data-pos")) === 1) correct++;
  if (parseInt($('div[data-id="4"]').attr("data-pos")) === 2) correct++;
  if (parseInt($('div[data-id="5"]').attr("data-pos")) === 5) correct++;
  if (parseInt($('div[data-id="6"]').attr("data-pos")) === 6) correct++;
  if (parseInt($('div[data-id="7"]').attr("data-pos")) === 13) correct++;
  if (parseInt($('div[data-id="8"]').attr("data-pos")) === 17) correct++;

  if (correct === 8) {
    $(".wining-flag").css("display", "flex");
    closePopup("popup-close-flag", "wining-flag", true);
    finsh = true;
    return true;
  } else {
    return false;
  }
}

$(function () {
  $(".stack-piece").draggable({
    revert: function (e, ui) {
      let id = parseInt($(this).attr("data-id"));
      let pos = parseInt($(e).attr("data-pos"));

      if (id === 1 && pos !== 4) {
        $(this).attr("data-pos", "0");
        console.log(this);
        return true;
      }

      if (id === 2 && pos !== 3) {
        $(this).attr("data-pos", "0");
        return true;
      }

      if (id === 3 && pos !== 1) {
        $(this).attr("data-pos", "0");
        return true;
      }

      if (id === 4 && pos !== 2) {
        $(this).attr("data-pos", "0");
        return true;
      }

      if (id === 5 && pos !== 5) {
        $(this).attr("data-pos", "0");
        return true;
      }

      if (id === 6 && pos !== 6) {
        $(this).attr("data-pos", "0");
        return true;
      }

      checkAnswers();
      return false;
    },
  });

  $(".stack-piece-arrow").draggable({
    revert: function (e, ui) {
      let id = parseInt($(this).attr("data-id"));
      let pos = parseInt($(e).attr("data-pos"));

      if (id === 7 && pos !== 13) {
        $(this).attr("data-pos", "0");
        return true;
      }

      if (id === 8 && pos !== 17) {
        $(this).attr("data-pos", "0");
        return true;
      }

      checkAnswers();
      return false;
    },
  });

  $("div#stack div").droppable({
    accept: ".stack-piece",
    drop: function (event, ui) {
      var $this = $(this);
      //$(this).droppable('disable');
      ui.draggable.attr("data-pos", $(this).attr("data-pos"));
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function (pos) {
          $(this).animate(pos, 200, "linear", function () {
            //checkAnswers();
          });
        },
      });
    },
    out: function (event, ui) {
      ui.draggable.attr("data-pos", "0");
    },
  });

  $("div#stack-pointers div").droppable({
    accept: ".stack-piece-arrow",
    drop: function (event, ui) {
      var $this = $(this);
      //$(this).droppable('disable');
      ui.draggable.attr("data-pos", $(this).attr("data-pos"));
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function (pos) {
          $(this).animate(pos, 200, "linear", function () {
            //checkAnswers();
          });
        },
      });
    },
    out: function (event, ui) {
      //   console.log(event);
      ui.draggable.attr("data-pos", "0");
    },
  });
});

let startTimer = false;
let seconds = 30;
let lose = false;
let finsh = false;
setInterval(function () {
  if (startTimer && seconds > 0) {
    if (finsh) return;
    seconds = seconds - 1;
    $("#timer").text(`${seconds}s`);
  } else {
    if (lose) return;
    $("#timer").text("30s");
    if (seconds == 0) {
      $(`.lose-flag`).css("display", "flex");
      closePopupLose("popup-close-flag-lose", "flag_modal-container");
      closePopupLose("lose-btn", "flag_modal-container");
      lose = true;
    }
  }
}, 1000);

function closePopupLose(select, remove) {
  $(`.${select}`).click(function () {
    $(`.${remove}`).css("display", "none");
    location.reload();
  });
}
function closePopup(select, remove, load) {
  $(`.${select}`).click(function () {
    $(`.${remove}`).remove();
    setTimeout(() => {
      startTimer = true;
      if (load) location.reload();
    }, 1000);
  });
}

$(".timer").hover(
  function () {
    $("#tooltip").show();
  },
  function () {
    $("#tooltip").hide();
  }
);

closePopup("popup-close", "introductions-container", false);
