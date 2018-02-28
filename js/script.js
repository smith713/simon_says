var count = 0,
  valid = false,
  strict = false,
  simonArray = [],
  userArray = [];

var soundsAndButtons = [
  {
    button: "#btn-green",
    url: "https://s3.amazonaws.com/freecodecamp/simonSound1"
  },
  {
    button: "#btn-red",
    url: "https://s3.amazonaws.com/freecodecamp/simonSound2"
  },
  {
    button: "#btn-yellow",
    url: "https://s3.amazonaws.com/freecodecamp/simonSound3"
  },
  {
    button: "#btn-blue",
    url: "https://s3.amazonaws.com/freecodecamp/simonSound4"
  }
];

(function($) {
  $.extend({
    playSound: function() {
      return $(
        "<embed src='" +
          arguments[0] +
          ".mp3' hidden='true' autostart='true' loop='false' class='playSound'>" +
          "<audio autoplay='autoplay' style='display:none;' controls='controls'><source src='" +
          arguments[0] +
          ".mp3' /><source src='" +
          arguments[0] +
          ".ogg' /></audio>"
      ).appendTo("body");
    }
  });
})(jQuery);

(function($) {
  $.fn.extend({
    addTemporaryClass: function(className, duration) {
      var elements = this;
      setTimeout(function() {
        elements.removeClass(className);
      }, duration);

      return this.each(function() {
        $(this).addClass(className);
      });
    }
  });
})(jQuery);

function incorrect() {
  var errorCount = 0;
  var myInterval = setInterval(function() {
    $("#display-count").text("!!");
    $.playSound(
      "http://www.freesound.org/data/previews/331/331912_3248244-lq"
    );
    errorCount++;
    if (errorCount === 3) {
      clearInterval(myInterval);
      //if strict is true, reset game...else, continue
      if (strict === true) {
        (simonArray = []), (count = 0);
      }
      $("#display-count").text(count);
    }
  }, 500);
}

function compareUserToSimon() {
  //loop through the the array check to see if simon matches the user
  for (var i = 0; i < userArray.length; ++i) {
    if (userArray[i] !== simonArray[i]) {
      incorrect();
      userArray = [];
      return;
    }
  } //end for

  if (userArray.length === simonArray.length) {
    count += 1;
    $("#display-count").text(count);
    userArray = [];
    startGame();
  }
}

function lightsAndSounds(button, url) {
  var re = /(?:btn|#|-)/g;
  var classString = button.replace(re, "");
  if (url !== undefined) {
    $.playSound(url);
  }
  $(button).addTemporaryClass(classString + "-pressed", 500);
}

//generate a random number to add to activate a button, and add to the simon array
function randomButtonPress() {
  var btn, url;
  var random = Math.floor(Math.random() * (4 - 0) + 0);
  btn = soundsAndButtons[random].button;
  url = soundsAndButtons[random].url;
  simonArray.push(random);
  lightsAndSounds(btn, url);
  console.log("Simon array is: " + simonArray);
  //return a value to clear the interval to prevent infinite fnc call
  endInterval = true;
  return;
} // end random Button press

function playSimonSequence() {
  var i = 0;
  var myInterval = setInterval(function() {
    //send in the correct button name and url to add the button pressed effect
    lightsAndSounds(
      soundsAndButtons[simonArray[i]].button,
      soundsAndButtons[simonArray[i]].url
    );
    ++i;
    if (i === simonArray.length) {
      clearInterval(myInterval);
      setTimeout(randomButtonPress, 1000);
    }
  }, 1000);
} //end simon sequence

function startGame() {
  //if the simonArray already has values from it, and there was no error in comparing the user sequence to simon , then we want to start from the beginning of simon sequence
  if (simonArray.length !== 0) {
    playSimonSequence();
    return;
  }
  setTimeout(randomButtonPress, 1500);
} //end start game

//on and off swtich
$("#on-off-switch").click(function() {
  if (valid === false) {
    $("#display-count")
      .css("display", "block")
      .text("--");
    $(this).addClass("pull-right");
    valid = true;
  } else {
    $(this).removeClass("pull-right");
    $("#display-count").css("display", "none");
    $("#strict-light").css("background-color", "#1D1F20");
    (valid = false), (strict = false);
    //clear out the intervals and arrays, and restart the count
    var interval_id = window.setInterval("", 9999);
    for (var i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
    (userArray = []), (simonArray = []), (count = 0);
  }
});
//start button, if valid is true, then we can initiate the game
$("#start-btn").click(function() {
  if (valid === true) {
    startGame();
  } //end if
});

//strict button, if pressed we enable game reset on a wrong button press
$("#strict-btn").click(function() {
  if (valid === true) {
    if (strict === false) {
      $("#strict-light").css("background-color", "red");
      strict = true; //Very ugly if else statements :/
    } else {
      strict = false;
      $("#strict-light").css("background-color", "#1D1F20");
    }
  } else {
    $("#strict-light").css("background-color", "#1D1F20");
  }
});
//Colored button pressed with ugly if statements --refactor with function
$("#btn-green").click(function() {
  if (valid === true) {
    userArray.push(0);
    lightsAndSounds(soundsAndButtons[0].button, soundsAndButtons[0].url);
    compareUserToSimon();
  }
});

$("#btn-red").click(function() {
  if (valid === true) {
    userArray.push(1);
    lightsAndSounds(soundsAndButtons[1].button, soundsAndButtons[1].url);
    compareUserToSimon();
  }
});

$("#btn-yellow").click(function() {
  if (valid === true) {
    userArray.push(2);
    lightsAndSounds(soundsAndButtons[2].button, soundsAndButtons[2].url);
    compareUserToSimon();
  }
});

$("#btn-blue").click(function() {
  if (valid === true) {
    userArray.push(3);
    lightsAndSounds(soundsAndButtons[3].button, soundsAndButtons[3].url);
    compareUserToSimon();
  }
});
