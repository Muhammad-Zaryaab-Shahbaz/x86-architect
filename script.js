const initModal = id => new bootstrap.Modal(document.getElementById(id), {});
const introductionModal = initModal("introduction");
const flagModal = initModal("flag");
const gameOverModal = initModal("gameOver");
introductionModal.toggle();

let startTimer = false;
let seconds = 30;
let lose = false;
let finsh = false;

const stackGuide = {
  "1": "4",
  "2": "3",
  "3": "1",
  "4": "2",
  "5": "5",
  "6": "6",
};

const arrowGuide = {
  "7": "13",
  "8": "17",
};

function checkAnswers() {
  let correct = 0;
  Object.keys(stackGuide).forEach(question => {
    const answer = $(`div[data-id="${question}"]`).attr("data-pos");
    if (answer === stackGuide[question]) correct++;
  });

  Object.keys(arrowGuide).forEach(question => {
    const answer = $(`div[data-id="${question}"]`).attr("data-pos");
    if (answer === arrowGuide[question]) correct++;
  });

  if (correct !== 8) return;

  const flag = atob("VEhNe1NNQVNIRURfVEhFX1NUQUNLfQ==");
  $("#flag-text").text(flag);
  flagModal.toggle();
  finsh = true;
  return true;
}

const initStack = () => {
  const items = [
    "Caller's EBP/old EBP",
    "Return Address",
    "Argument 1",
    "Argument 2",
    "Local Variable 1",
    "Local Variable 2",
    "&larr; EBP",
    "&larr; ESP",
  ];
  const html = items
    .map((item, index) => {
      const cls = index > 5 ? "stack-piece-arrow" : "stack-piece";
      return `
    <div
      class="mb-2 neutral btn text-white w-100 ${cls}"
      data-id="${index + 1}"
      data-pos="0"
    >${item}</div>`;
    })
    .join("");
  $("#stack-pieces").html(html);
};

$(function() {
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltips].map(t => new bootstrap.Tooltip(t));

  initStack();

  $(".stack-piece").draggable({
    revert: function(e, ui) {
      const id = $(this).attr("data-id");
      const pos = $(e).attr("data-pos");

      if (stackGuide[id] !== pos) {
        $(this).attr("data-pos", "0");
        return true;
      }

      $(this).addClass("correct");
      $(e).addClass("correct");
      const height = $(this).height();
      $(e).height(height);

      checkAnswers();
      return false;
    },
  });

  $(".stack-piece-arrow").draggable({
    revert: function(e, ui) {
      const id = $(this).attr("data-id");
      const pos = $(e).attr("data-pos");

      if (arrowGuide[id] !== pos) {
        $(this).attr("data-pos", "0");
        return true;
      }

      $(this).addClass("correct");
      $(e).addClass("correct");
      const height = $(this).height();
      $(e).height(height);

      checkAnswers();
      return false;
    },
  });

  $("div#stack div").droppable({
    accept: ".stack-piece",
    drop: function(event, ui) {
      var $this = $(this);
      //$(this).droppable('disable');
      ui.draggable.attr("data-pos", $(this).attr("data-pos"));
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear", function() {
            //checkAnswers();
          });
        },
      });
    },
    out: function(event, ui) {
      ui.draggable.attr("data-pos", "0");
    },
  });

  $("div#stack-pointers div").droppable({
    accept: ".stack-piece-arrow",
    drop: function(event, ui) {
      var $this = $(this);
      //$(this).droppable('disable');
      ui.draggable.attr("data-pos", $(this).attr("data-pos"));
      ui.draggable.position({
        my: "center",
        at: "center",
        of: $this,
        using: function(pos) {
          $(this).animate(pos, 200, "linear", function() {
            //checkAnswers();
          });
        },
      });
    },
    out: function(event, ui) {
      //   console.log(event);
      ui.draggable.attr("data-pos", "0");
    },
  });
});

const start = () => {
  introductionModal.hide();
  startTimer = true;
};
setInterval(function() {
  if (startTimer && seconds > 0) {
    if (finsh) return;
    seconds = seconds - 1;
    if (seconds <= 10) {
      $("#clock").addClass("text-danger");
    }
    $("#timer").text(`${seconds}s`);
  } else {
    if (lose) return;
    $("#timer").text("30s");
    $("#clock").removeClass("text-danger");
    if (seconds == 0) {
      gameOverModal.toggle();
      lose = true;
    }
  }
}, 1000);

const copyText = (label = "flag-text", container = "flag-container") => {
  const text = $(`#${label}`).text();
  navigator.clipboard.writeText(text);

  const tooltip = bootstrap.Tooltip.getInstance(`#${container}`);
  tooltip.setContent({ ".tooltip-inner": "Copied!" });
  setTimeout(() => {
    tooltip.setContent({ ".tooltip-inner": "Copy to clipboard" });
  }, 2000);
};
