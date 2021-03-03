  // LICENCE -----------------------------------------------------------------------------
  //
  // Copyright 2018 - Cédric Batailler
  //
  // Permission is hereby granted, free of charge, to any person obtaining a copy of this
  // software and associated documentation files (the "Software"), to deal in the Software
  // without restriction, including without limitation the rights to use, copy, modify,
  // merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
  // permit persons to whom the Software is furnished to do so, subject to the following
  // conditions:
  //
  // The above copyright notice and this permission notice shall be included in all copies
  // or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
  // INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  // PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
  // CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
  // OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  //
  // OVERVIEW -----------------------------------------------------------------------------
  //
  // TODO:
  //
  // safari exclusion ---------------------------------------------------------------------
  var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  var is_ie = /*@cc_on!@*/ false || !!document.documentMode;
  var is_compatible = !(is_safari || is_ie);

  if (!is_compatible) {
      var exclusion = {
          type: "html-keyboard-response",
          stimulus:
          "<p>Malheureusement, cette étude n'est pas compatible avec votre " +
          "navigateur.</p>" +
          "<p>Veuillez réouvrir cette étude depuis un navigateur " +
          "compatible (tel que Chrome ou Firefox).</p>",
          choices: jsPsych.NO_KEYS
      };

      var timeline_exclusion = [];
      timeline_exclusion.push(exclusion);
      jsPsych.init({
        timeline: timeline_safari
      });
  }
  // firebase initialization ---------------------------------------------------------------
  // Initialize connection to firebase database. Note that firebase credential
  // are defined in js/firebase-credentials.js.
  firebase.initializeApp(firebase_config);
  var database = firebase.database();

  // connection status ---------------------------------------------------------------------
  // This section ensure that we don't lose data. Anytime the
  // client is disconnected, an alert appears onscreen
  var connectedRef = firebase.database().ref(".info/connected");
  var connection = firebase.database().ref("connection/" + session_id + "/")
  var dialog = undefined;
  var first_connection = true;

  connectedRef.on("value", function(snap) {
    if (snap.val() === true) {
      connection
        .push()
        .set({
          status: "connection",
          timestamp: firebase.database.ServerValue.TIMESTAMP
        })

      connection
        .push()
        .onDisconnect()
        .set({
          status: "disconnection",
          timestamp: firebase.database.ServerValue.TIMESTAMP
        })

    if (!first_connection) {
      dialog.modal('hide');
    }
    first_connection = false;
    } else {
      if (!first_connection) {
      dialog = bootbox.dialog({
          title: 'Connexion perdue',
          message: '<p><i class="fa fa-spin fa-spinner"></i>Veuillez patienter le temps que la connexion soit rétablie.</p>',
          closeButton: false
          });
      }
    }
  });

  // global variable definition -------------------------------------------------
  // Every global variable that will be used in the jsPsych script will be
  // defined here. Usually defaluts to null unless specified otherwise.

  // * session_id: Used anytime data is logged on firebase for matching purpose.
  //               Note that this is different from prolific id.
  var session_id = jsPsych.randomization.randomID();

  // * prolific_id: id from Prolific. By default, it is read from url.
  //                Participant can confirm this id or specify it during the
  //                experiment.
  var prolific_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
  if (prolific_id === undefined) {
    prolific_id = "NOCODE"
  }
  // * variable corresponding to participant experimental conditions
  //   (or counterbalanced variables).

  var vaast_cond_block_1 = jsPsych.randomization.sampleWithoutReplacement(["approach_mask", "approach_nomask"], 1)[0];
  var vaast_cond_block_2 = (vaast_cond_block_1 == "approach_mask") ? "approach_nomask" : "approach_mask";

  var task_order = jsPsych.randomization.sampleWithoutReplacement(["vaast_first", "scale_first"], 1)[0];
 
  // VAAST --------------------------------------------------------------------------------
  // VAAST variables ----------------------------------------------------------------------
  var nomask_movement_1  = undefined;
  var mask_movement_1  = undefined;
  var nomask_movement_2  = undefined;
  var mask_movement_2  = undefined;

  var approach_cat_1   = undefined;
  var avoidance_cat_1  = undefined;
  var approach_cat_2   = undefined;
  var avoidance_cat_2  = undefined;

  var nomask_action_1 = undefined;
  var mask_action_1 = undefined;
  var nomask_action_2 = undefined;
  var mask_action_2 = undefined;

  switch(vaast_cond_block_1) {
    case "approach_mask":
      nomask_movement_1 = "avoidance";
      mask_movement_1   = "approach";
      approach_cat_1    = "portant un masque";
      avoidance_cat_1   = "ne portant pas de masque";
      approach_carac_1  = "Masque";
      avoidance_carac_1 = "Sans masque";
      approach_img_1    = "Example_00012_Mask_nb.png";
      avoidance_img_1   = "Example_00012_nb.png";
      break;

    case "approach_nomask":
      nomask_movement_1 = "approach";
      mask_movement_1   = "avoidance";
      approach_cat_1    = "ne portant pas de masque";
      avoidance_cat_1   = "portant un masque";
      approach_carac_1  = "Sans masque";
      avoidance_carac_1 = "Masque";
      approach_img_1    = "Example_00012_nb.png";
      avoidance_img_1   = "Example_00012_Mask_nb.png";
      break;
  }

  switch(vaast_cond_block_2) {
    case "approach_mask":
      nomask_movement_2 = "avoidance";
      mask_movement_2   = "approach";
      approach_cat_2    = "portant un masque";
      avoidance_cat_2   = "ne portant pas de masque";
      approach_carac_2  = "Masque";
      avoidance_carac_2 = "Sans masque";
      approach_img_2    = "Example_00012_Mask_nb.png";
      avoidance_img_2   = "Example_00012_nb.png";
      break;

    case "approach_nomask":
      nomask_movement_2 = "approach";
      mask_movement_2   = "avoidance";
      approach_cat_2    = "ne portant pas de masque";
      avoidance_cat_2   = "portant un masque";
      approach_carac_2  = "Sans masque";
      avoidance_carac_2 = "Masque";
      approach_img_2    = "Example_00012_nb.png";
      avoidance_img_2   = "Example_00012_Mask_nb.png";
      break;
  }

  // VAAST key variables
  var approach_key = "T";
  var avoidance_key = "B";

  // VAAST stimuli ------------------------------------------------------------------------
  // vaast word stimuli ------------------------------------------------------------------
  
  var vaast_stim_train_1 = [
    {stimulus: 'stimuli/00012_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00064_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00256_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00284_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00641_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00780_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00991_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00998_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01089_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01228_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/00012_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/00064_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/00256_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/00284_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/00641_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/00780_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/00991_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/00998_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/01089_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/01228_Mask_nb.png', category: "mask", movement: mask_movement_1},
  ]
  
  var vaast_stim_1 = [
    {stimulus: 'stimuli/01254_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01255_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01393_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01404_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01624_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01715_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/02386_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/02388_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/02881_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03042_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03216_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03528_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03557_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03564_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03617_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03799_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03875_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03886_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/03890_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/04131_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/04149_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/04192_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/04292_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/04319_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/04446_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/04986_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/05494_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/05563_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/05690_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/05752_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/06027_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/06207_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/06213_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/06709_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/06779_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/06869_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/07087_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/07493_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/08156_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/08748_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/08873_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/09074_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/09175_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/09748_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/09846_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/10083_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/10132_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/10500_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/10513_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/10536_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/10841_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/11499_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/11507_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/11515_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/11581_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12070_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12183_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12200_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12245_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12480_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12569_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12736_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/12976_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13104_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13105_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13168_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13296_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13306_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13484_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13584_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13720_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/13989_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/14247_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/14943_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/15201_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/15422_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/15871_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/16112_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/16352_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/16804_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/16829_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/16839_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/16922_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17019_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17087_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17116_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17117_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17171_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17412_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17488_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17494_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/17940_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/18100_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/18228_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/18247_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/18752_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/19496_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/19665_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/19993_nb.png', category: "nomask", movement: nomask_movement_1},
    {stimulus: 'stimuli/01254_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/01255_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/01393_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/01404_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/01624_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/01715_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/02386_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/02388_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/02881_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03042_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03216_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03528_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03557_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03564_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03617_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03799_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03875_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03886_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/03890_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/04131_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/04149_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/04192_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/04292_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/04319_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/04446_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/04986_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/05494_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/05563_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/05690_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/05752_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/06027_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/06207_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/06213_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/06709_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/06779_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/06869_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/07087_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/07493_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/08156_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/08748_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/08873_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/09074_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/09175_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/09748_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/09846_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/10083_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/10132_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/10500_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/10513_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/10536_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/10841_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/11499_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/11507_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/11515_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/11581_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12070_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12183_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12200_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12245_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12480_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12569_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12736_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/12976_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13104_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13105_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13168_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13296_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13306_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13484_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13584_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13720_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/13989_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/14247_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/14943_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/15201_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/15422_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/15871_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/16112_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/16352_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/16804_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/16829_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/16839_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/16922_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17019_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17087_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17116_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17117_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17171_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17412_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17488_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17494_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/17940_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/18100_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/18228_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/18247_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/18752_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/19496_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/19665_Mask_nb.png', category: "mask", movement: mask_movement_1},
    {stimulus: 'stimuli/19993_Mask_nb.png', category: "mask", movement: mask_movement_1}
  ];

  var vaast_stim_train_2 = [
    {stimulus: 'stimuli/00012_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00064_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00256_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00284_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00641_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00780_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00991_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00998_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01089_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01228_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/00012_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/00064_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/00256_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/00284_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/00641_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/00780_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/00991_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/00998_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/01089_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/01228_Mask_nb.png', category: "mask", movement: mask_movement_2},
  ]

  var vaast_stim_2 = [
    {stimulus: 'stimuli/01254_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01255_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01393_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01404_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01624_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01715_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/02386_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/02388_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/02881_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03042_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03216_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03528_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03557_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03564_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03617_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03799_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03875_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03886_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/03890_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/04131_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/04149_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/04192_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/04292_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/04319_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/04446_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/04986_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/05494_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/05563_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/05690_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/05752_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/06027_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/06207_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/06213_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/06709_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/06779_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/06869_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/07087_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/07493_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/08156_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/08748_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/08873_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/09074_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/09175_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/09748_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/09846_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/10083_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/10132_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/10500_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/10513_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/10536_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/10841_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/11499_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/11507_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/11515_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/11581_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12070_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12183_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12200_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12245_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12480_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12569_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12736_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/12976_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13104_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13105_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13168_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13296_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13306_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13484_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13584_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13720_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/13989_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/14247_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/14943_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/15201_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/15422_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/15871_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/16112_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/16352_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/16804_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/16829_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/16839_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/16922_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17019_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17087_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17116_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17117_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17171_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17412_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17488_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17494_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/17940_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/18100_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/18228_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/18247_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/18752_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/19496_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/19665_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/19993_nb.png', category: "nomask", movement: nomask_movement_2},
    {stimulus: 'stimuli/01254_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/01255_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/01393_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/01404_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/01624_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/01715_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/02386_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/02388_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/02881_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03042_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03216_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03528_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03557_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03564_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03617_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03799_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03875_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03886_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/03890_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/04131_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/04149_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/04192_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/04292_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/04319_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/04446_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/04986_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/05494_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/05563_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/05690_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/05752_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/06027_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/06207_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/06213_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/06709_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/06779_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/06869_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/07087_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/07493_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/08156_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/08748_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/08873_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/09074_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/09175_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/09748_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/09846_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/10083_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/10132_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/10500_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/10513_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/10536_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/10841_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/11499_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/11507_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/11515_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/11581_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12070_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12183_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12200_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12245_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12480_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12569_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12736_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/12976_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13104_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13105_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13168_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13296_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13306_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13484_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13584_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13720_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/13989_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/14247_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/14943_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/15201_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/15422_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/15871_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/16112_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/16352_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/16804_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/16829_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/16839_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/16922_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17019_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17087_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17116_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17117_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17171_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17412_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17488_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17494_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/17940_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/18100_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/18228_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/18247_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/18752_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/19496_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/19665_Mask_nb.png', category: "mask", movement: mask_movement_2},
    {stimulus: 'stimuli/19993_Mask_nb.png', category: "mask", movement: mask_movement_2},
  ];

  // vaast background images --------------------------------------------------------------
  var background = [
    "background/2.jpg",
    "background/4.jpg",
    "background/6.jpg"
  ];

  // vaast stimuli sizes -------------------------------------------------------------------
  var stim_sizes = [
    38,
    46,
    60
  ];

  var resize_factor = 7;
  var image_sizes = stim_sizes.map(function(x) { return x * resize_factor; });

  // Helper functions
  // cursor helper functions -------------------------------------------------------------
  var hide_cursor = function() {
    document.querySelector('head').insertAdjacentHTML('beforeend', '<style id="cursor-toggle"> html { cursor: none; } </style>');
  }
  var show_cursor = function() {
     document.querySelector('#cursor-toggle').remove();
  }

  var hiding_cursor = {
      type: 'call-function',
      func: hide_cursor
  }
  var showing_cursor = {
      type: 'call-function',
      func: show_cursor
  }

  // next_position():
  // Compute next position as function of current position and correct movement. Because
  // participant have to press the correct response key, it always shows the correct
  // position.
  var next_position = function() {
    var current_position = jsPsych.data.getLastTrialData().values()[0].position;
    var current_response = jsPsych.data.getLastTrialData().values()[0].key_press;
    var position = current_position;

    var approach_keycode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(approach_key);
    var avoidance_keycode = jsPsych.pluginAPI.convertKeyCharacterToKeyCode(avoidance_key);

    if (current_response == approach_keycode) {
      position = position + 1;
    }

    if (current_response == avoidance_keycode) {
      position = position - 1;
    }

    return (position)
  }

  // iat sampling function ----------------------------------------------------------------
  var sample_n = function(list, n) {
    list = jsPsych.randomization.sampleWithReplacement(list, n);
    list = jsPsych.randomization.shuffleNoRepeats(list);

    return (list);
  }

  // EXPERIMENT ---------------------------------------------------------------------------

  // initial instructions -----------------------------------------------------------------
  var consent = {
    type: "html-button-response",
    stimulus:
    "<h1 class ='custom-title'> Formulaire de consentement </h1>" +
      "<p class='instructions'>En appuyant sur le bouton ci-dessous, vous reconnaisez que :</p>" +
        "<ul class='instructions'>" +
          "<li>Vous savez que vous pouvez arrêter cette étude à tout moment, sans avoir à vous justifier. " +
          "En revanche, gardez en tête que si vous arrêtez l'étude en cours de route, vous ne serez pas rémunéré.</li>" +
          "<li>Vous savez qu'il est possible de contacter notre équipe en cas de questions ou d'une insatisfaction liées à " +
          "votre participation à cette étude, à l'adresse électronique suivante : mae.braud@etu.grenoble-alpes.fr</li>" +
          "<li>Vous savez que les données récoltées resteront confidentielles et qu'aucune tierce partie ne pourra vous " +
          "identifier à partir de ces informations.</li>" +
        "</ul>" +
    "<p class='instructions'>En appuyant sur le bouton \"Je confirme les informations ci-dessus\" ci-dessous, vous donnez votre " +
    "consentement libre et éclairé pour participer à cette étude.</p>",
    choices: ['Je confirme les informations ci-dessus']
  }

    var welcome = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'> Bienvenue </h1>" +
      "<p class='instructions'>Nous vous remercions de participer à cette étude.<p>" +
      "<p class='instructions'>Au cours de cette étude, vous serez amené·e à compléter deux tâches. " +
      "Notez que nous enregistrerons des données concernant la façon dont vous aurez rempli ces tâches, " +
      "mais aucune information personnelle ne permettant de vous identifier ne sera récoltée.</p>" +
      "<p class='instructions'>Étant donné que pour la récolte des données nous dépendons de " +
      "fournisseurs de services tiers, il se peut que les logiciels de blocage de publicités (ex. Ad-block) " +
      "interfèrent avec la récolte des données. Ainsi, nous vous demandons de bien vouloir désactiver de tels " +
      "logiciels du temps de cette étude. " +
      "<b>Dans le cas où nous ne serions pas en mesure de récolter vos données, nous ne pourrons pas vous " +
      "rémunérer pour votre participation</b>. </p>" +
      "<p class='instructions'>Pour toute question au sujet de cette étude, veuillez contacter l'adresse " +
      "électronique suivante: mae.braud@etu.univ-grenoble-alpes.fr</p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour commencer l'étude.</p>",
    choices: [32]
  };

  var welcome_2 = {
    type: "html-button-response",
    stimulus:
      "<p class='instructions'>Avant de poursuivre, sachez que cette étude devrait prendre environ " +
      "XX minutes à compléter.</p>",
    choices: ['J\'ai le temps', 'Je n\'ai pas le temps'],
  };

  var not_enough_time_to_complete = {
      type: 'html-button-response',
      stimulus: '<p>Veuillez revenir plus tard pour réaliser cette étude.</p>',
      choices: ['Retourner sur le site de Crowd Panel'],
  };

  var redirect_to_prolific = {
      type: 'call-function',
      func: function() {
          window.location.href = "https://crowdpanel.io/";
          jsPsych.pauseExperiment();
      }
  }

  var if_not_enough_time = {
      timeline: [not_enough_time_to_complete, redirect_to_prolific],
      conditional_function: function() {
          // get the data from the previous trial,
          // and check which key was pressed
          var data = jsPsych.data.getLastTrialData().values()[0].button_pressed;
          if (data == 1) {
              return true;
          } else {
              return false;
          }
      }
  }

  // Switching to fullscreen --------------------------------------------------------------
  var fullscreen_trial = {
    type: 'fullscreen',
    message: "<p class='instructions'><center>Pour prendre part à cette étude, votre navigateur doit être mis en plein écran.</center></p>",
    button_label: 'Passer en plein écran',
    fullscreen_mode: true
  }

  // Initial instructions -----------------------------------------------------------------
  // First slide --------------------------------------------------------------------------
  var instructions = {
    type: "html-keyboard-response",
    stimulus:
        "<p class='instructions'>Vous êtes maintenant sur le point de commencer la première tâche.</p>" +
        "<p class='instructions'>Notez qu'il est très important que vous restiez attentif tout au long de l'étude " +
        "(il est possible que nous ayons inclus des questions visant à nous en assurer)." +
        "<br>" +
        "Notez également que nous vérifions le temps total passé sur l'étude et que nous n'accepterons pas " +
        "les soumissions avec un temps irréaliste.</p>" +
        "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour commencer la Tâche 1.</p>",
    choices: [32]
  };

  // VAAST instructions --------------------------------------------------------------
  var vaast_instructions_1 = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1": "Tâche 2") + "</h1>" +
      "<p class='instructions'>Au cours de cette tâche, comme dans un jeu vidéo, vous serez dans un environnement " +
      "virtuel (présenté ci-dessous) dans lequel vous pourrez avancer ou reculer à l'aide des touches de votre clavier.</p>" +
      "<p class='instructions'><center>" +
        "<img src = 'media/vaast-background.jpg'>" +
      "</center></p>" +
      "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };
  
  var vaast_instructions_2 = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1": "Tâche 2") + "</h1>" +
      "<p class='instructions'>Des visages vous seront présentés dans cet environnement. Votre tâche consistera " +
      "à avancer ou à reculer en fonction de certaines caractérisques de ces visages (des instructions plus précises " +
      "vous seront données par la suite).</p>" +
      "<p class='instructions'> Pour avancer ou reculer, vous utiliserez les touches suivantes de votre clavier :</p>" +
      "<p class='instructions'><center>" +
        "<img src = 'media/keyboard-vaast.png'>" +
      "</center></p>" +
      "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  var vaast_instructions_3 = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1": "Tâche 2") + "</h1>" +
      "<p class='instructions'>Au début de chaque essai, vous allez voir apparaître le symbole \'O\' au " +
      "centre de l'écran. Ce symbole indique que vous devrez appuyer sur la touche DÉPART (la <strong>touche G</strong>) " +
      "pour continuer. Ensuite, vous verrez apparaître une croix de fixation (+) au centre de l'écran, suivi " +
      "d'un visage.</p>" +
      "<p class='instructions'>Votre tâche consistera à avancer ou reculer vers ce visage selon ses caractéristiques. " +
      "Pour cela, vous devrez appuyer le plus rapidement possible soit sur la touche AVANCER (la <strong>touche T</strong>) " +
      " ou bien sur la touche RECULER (la <strong>touche B</strong>)." +
      "<p class='instructions'>Pour toutes ces actions, veuillez utiliser uniquement l'index de votre main " +
      "dominante.</p>" +
      "<p class = 'continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  var vaast_instructions_block_1_training = {
    type : "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1 : Partie 1": "Tâche 2 : Partie 1") + "</h1>" +
      "<p class='instructions'>Dans cette première partie, vous devrez :</p>" +
       "<ul class='instructions'>" +
        "<li><strong>ALLER VERS vers les visages " + approach_cat_1 + " en appuyant sur la touche AVANCER (i.e., la touche " + approach_key + ")</strong></li>" +
        "<li><strong>VOUS ÉLOIGNER des visages " + avoidance_cat_1 + " en appuyant sur la touche RECULER (i.e., la touche " + avoidance_key + ")</strong></li>" +
       "</ul>" +
      "<p class='instructions'>Vous allez d'abord commencer par une phase d'entraînement.</p>" +
      "<p class='instructions'><u>ATTENTION :</u> il est très important que vous répondiez <strong>LE PLUS RAPIDEMENT POSSIBLE SANS FAIRE D'ERREURS</strong>. " +
      "Vos erreurs vous seront signalées par une croix rouge.</p>" +
      "<p class='instructions'><table style='margin-left:auto;margin-right:auto'>" +
      "<tr>" +
      "<th width='120px'>Exemple</th>" +
      "<th>Caractéristique</th>" +
      "<th width='120px'>Action</th>" +
      "</tr>" +
      "<tr>" +
      "<td><img src='media/"+ approach_img_1 +"' width=80></td>" +
      "<td>" + approach_carac_1 +"</td>" +
      "<td>Avancer</td>" +
      "</tr>" +
      "<tr>" +
      "<td><img src='media/" + avoidance_img_1 +"' width=80></td>" +
      "<td>" + avoidance_carac_1 + "</td>" +
      "<td>Reculer</td>" +
      "</tr>" +
      "</table></p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  var vaast_instructions_block_1_test = {
      type: "html-keyboard-response",
      stimulus:
        "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1 : Partie 1": "Tâche 2 : Partie 1") + "</h1>" +
        "<p class='instructions'>La phase d'entraînement est maintenant terminée. Nous allons passer à la phase test.</p>" +
        "<p class='instructions'>Pour rappel, vous devez :</p> " +
          "<ul class='instructions'>" +
            "<li><strong>ALLER VERS vers les visages " + approach_cat_1 + " en appuyant sur la touche AVANCER (i.e., la touche " + approach_key + ")</strong></li>" +
            "<li><strong>VOUS ÉLOIGNER des visages " + avoidance_cat_1 + " en appuyant sur la touche RECULER (i.e., la touche " + avoidance_key + ")</strong></li>" +
          "</ul>" +
        "<p class='instructions'>N'oubliez pas de répondre le plus vite possible, en utilisant toujours l'index de votre main dominante.</p>" +
        "<p class='instructions'><table style='margin-left:auto;margin-right:auto'>" +
        "<tr>" +
        "<th width='120px'>Exemple</th>" +
        "<th>Caractéristique</th>" +
        "<th width='120px'>Action</th>" +
        "</tr>" +
        "<tr>" +
        "<td><img src='media/"+ approach_img_1 +"' width=80></td>" +
        "<td>" + approach_carac_1 +"</td>" +
        "<td>Avancer</td>" +
        "</tr>" +
        "<tr>" +
        "<td><img src='media/" + avoidance_img_1 +"' width=80></td>" +
        "<td>" + avoidance_carac_1 + "</td>" +
        "<td>Reculer</td>" +
        "</tr>" +
        "</table></p>" +
        "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };
  
  var vaast_instructions_4 = {
    type: 'html-keyboard-response',
    stimulus:
      "<p class='instructions'><center>Vous venez de terminer la première partie de la tâche " + ((task_order == "vaast_first") ? "1": "2")+ ". " +
      "Nous allons maintenant passer à la deuxième partie de cette " + ((task_order == "vaast_first") ? "première": "seconde") + " tâche.</center></p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  }

  var vaast_instructions_block_2_training = {
    type : "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1 : Partie 2": "Tâche 2 : Partie 2") + "</h1>" +
      "<p class='instructions'>Dans cette deuxième partie, vous devrez :</p>" +
       "<ul class='instructions'>" +
        "<li><strong>ALLER VERS vers les visages " + approach_cat_2 + " en appuyant sur la touche AVANCER (i.e., la touche " + approach_key + ")</strong></li>" +
        "<li><strong>VOUS ÉLOIGNER des visages " + avoidance_cat_2 + " en appuyant sur la touche RECULER (i.e., la touche " + avoidance_key + ")</strong></li>" +
       "</ul>" +
      "<p class='instructions'>Vous allez d'abord commencer par une phase d'entraînement.</p>" +
      "<p class='instructions'><u>ATTENTION :</u> il est très important que vous répondiez <strong>LE PLUS RAPIDEMENT POSSIBLE SANS FAIRE D'ERREURS</strong>. " +
      "Vos erreurs vous seront signalées par une croix rouge.</p>" +
      "<p class='instructions'><table style='margin-left:auto;margin-right:auto'>" +
      "<tr>" +
      "<th width='120px'>Exemple</th>" +
      "<th>Caractéristique</th>" +
      "<th width='120px'>Action</th>" +
      "</tr>" +
      "<tr>" +
      "<td><img src='media/"+ approach_img_2 +"' width=80></td>" +
      "<td>" + approach_carac_2 +"</td>" +
      "<td>Avancer</td>" +
      "</tr>" +
      "<tr>" +
      "<td><img src='media/" + avoidance_img_2 +"' width=80></td>" +
      "<td>" + avoidance_carac_2 + "</td>" +
      "<td>Reculer</td>" +
      "</tr>" +
      "</table></p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };
  
  var vaast_instructions_block_2_test = {
      type: "html-keyboard-response",
      stimulus:
        "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1 : Partie 2": "Tâche 2 : Partie 2") + "</h1>" +
        "<p class='instructions'>La phase d'entraînement est maintenant terminée. Nous allons passer à la phase test.</p>" +
        "<p class='instructions'>Pour rappel, vous devez :</p> " +
          "<ul class='instructions'>" +
            "<li><strong>ALLER VERS vers les visages " + approach_cat_2 + " en appuyant sur la touche AVANCER (i.e., la touche " + approach_key + ")</strong></li>" +
            "<li><strong>VOUS ÉLOIGNER des visages " + avoidance_cat_2 + " en appuyant sur la touche RECULER (i.e., la touche " + avoidance_key + ")</strong></li>" +
          "</ul>" +
        "<p class='instructions'>N'oubliez pas de répondre le plus vite possible, en utilisant toujours l'index de votre main dominante.</p>" +
        "<p class='instructions'><table style='margin-left:auto;margin-right:auto'>" +
        "<tr>" +
        "<th width='120px'>Exemple</th>" +
        "<th>Caractéristique</th>" +
        "<th width='120px'>Action</th>" +
        "</tr>" +
        "<tr>" +
        "<td><img src='media/"+ approach_img_2 +"' width=80></td>" +
        "<td>" + approach_carac_2 +"</td>" +
        "<td>Avancer</td>" +
        "</tr>" +
        "<tr>" +
        "<td><img src='media/" + avoidance_img_2 +"' width=80></td>" +
        "<td>" + avoidance_carac_2 + "</td>" +
        "<td>Reculer</td>" +
        "</tr>" +
        "</table></p>" +
        "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  // Creating a trial ---------------------------------------------------------------------

  var vaast_start = {
    type: 'vaast-text',
    stimulus: "o",
    position: 1,
    background_images: background,
    font_sizes: stim_sizes,
    approach_key: "G",
    stim_movement: "approach",
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: true,
    display_feedback: true,
    response_ends_trial: true
  }

  var vaast_fixation = {
    type: 'vaast-fixation',
    fixation: "+",
    font_size: 46,
    position: 1,
    background_images: background
  }

  var vaast_first_step_train_1 = {
    type: 'vaast-image',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 1,
    background_images: background,
    font_sizes: image_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key: approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: true,
    feedback_duration: 500,
    response_ends_trial: true
  }

  var vaast_first_step_1 = {
    type: 'vaast-image',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 1,
    background_images: background,
    font_sizes: image_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key: approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: false,
    response_ends_trial: true
  }

  var vaast_second_step_1 = {
    type: 'vaast-image',
    position: next_position,
    stimulus: jsPsych.timelineVariable('stimulus'),
    background_images: background,
    font_sizes: image_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    response_ends_trial: false,
    trial_duration: 500
  }

  var vaast_second_step_train_1 = {
    chunk_type: "if",
    timeline: [vaast_second_step_1],
    conditional_function: function() {
      var data = jsPsych.data.getLastTrialData().values()[0];
      return data.correct;
    }
  }

  var vaast_first_step_train_2 = {
    type: 'vaast-image',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 1,
    background_images: background,
    font_sizes: image_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key: approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: true,
    feedback_duration: 500,
    response_ends_trial: true
  }

  var vaast_first_step_2 = {
    type: 'vaast-image',
    stimulus: jsPsych.timelineVariable('stimulus'),
    position: 1,
    background_images: background,
    font_sizes: image_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    approach_key: approach_key,
    avoidance_key: avoidance_key,
    html_when_wrong: '<span style="color: red; font-size: 80px">&times;</span>',
    force_correct_key_press: false,
    display_feedback: false,
    response_ends_trial: true
  }

  var vaast_second_step_2 = {
    type: 'vaast-image',
    position: next_position,
    stimulus: jsPsych.timelineVariable('stimulus'),
    background_images: background,
    font_sizes: image_sizes,
    stim_movement: jsPsych.timelineVariable('movement'),
    response_ends_trial: false,
    trial_duration: 500
  }

  var vaast_second_step_train_2 = {
    chunk_type: "if",
    timeline: [vaast_second_step_2],
    conditional_function: function() {
      var data = jsPsych.data.getLastTrialData().values()[0];
      return data.correct;
    }
  }
  // VAAST training block -----------------------------------------------------------------

  var vaast_block_1_training = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_1, vaast_second_step_train_1],
    timeline_variables: sample_n(vaast_stim_train_1, 8)
  };

  var vaast_block_1_test = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_1, vaast_second_step_train_1],
    timeline_variables: sample_n(vaast_stim_1, 16),
  };

  var vaast_block_2_training = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_2, vaast_second_step_train_2],
    timeline_variables: sample_n(vaast_stim_train_2, 8)
  };

  var vaast_block_2_test = {
    timeline: [vaast_start, vaast_fixation, vaast_first_step_train_2, vaast_second_step_train_2],
    timeline_variables: sample_n(vaast_stim_2, 16),
  };

  var vaast_instructions_5 = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 1": "Tâche 2") + "</h1>" +
      "<p class='instructions'><center>La tâche" + ((task_order == "vaast_first") ? "1": "2") + " de cette étude est maintenanée terminée.</center></p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  // end fullscreen -----------------------------------------------------------------------
  var fullscreen_trial_exit = {
    type: 'fullscreen',
    fullscreen_mode: false
  }

  // Attention check ----------------------------------------------------------------------
  var attention_check = {
    type: 'survey-text',
    data: {trial: "attention_check"},
    preamble: "<p class ='instructions'>Lorsque nous vous demanderons de donner votre couleur préférée, " +
              "veuillez écrire le mot baguette dans la boîte ci-dessous.</p>",
    questions: [{
      prompt: "<p class='instructions'>En vous basant sur le texte ci-dessus, quelle est votre couleur préférée ?</p>"
    }],
    button_label: "Soumettre",
  }

  // Full VAAST procedure ----------------------------------------------------------------
  var vaast_procedure = {
    timeline: [
      vaast_instructions_1,
      vaast_instructions_2,
      vaast_instructions_3,
      showing_cursor,
      attention_check,
      hiding_cursor,
      vaast_instructions_block_1_training,
      vaast_block_1_training,
      vaast_instructions_block_1_test,
      vaast_block_1_test,
      vaast_instructions_4,
      vaast_instructions_block_2_training,
      vaast_block_2_training,
      vaast_instructions_block_2_test,
      vaast_block_2_test,
      vaast_instructions_5
    ]
  }

  // Attitude toward mask-weaaring scale---------------------------------------------------
  var mask_intro = {
  type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 2": "Tâche 1") + "</h1>" +
      "<p class='instructions'>Dans cette tâche, nous allons vous poser quelques questions concernant le port du masque. " +
      "<strong>Sachez qu'il n'y a pas de bonnes ou de mauvaises réponses</strong>, il s'agit avant tout de votre expérience et de votre avis personnel qui nous intéresse.</p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  var mask_scale_q1 = [
    "1\n(Jamais)",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7\n(Toujours)"
  ];

  var mask_scale_q2q3 = [
    "1\n(Non, pas du tout)",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7\n(Oui, absolument)"
  ];

  var mask_questions = {
    type:'survey-likert-custom',
    preamble:
    "Veuillez répondre aux questions ci-dessous à l'aide de l'échelle de réponse qui vous est founie après chacune.",
    data: {trial: "atms"},
    questions: [
        {
        prompt: "Au cours du dernier mois, avez-vous porté un masque lorsque vous avez été au contact d'autres personnes ?",
        labels: mask_scale_q1,
        required: true
        },
        {
        prompt: "Êtes-vous d'accord avec la politique de port du masque ?",
        labels: mask_scale_q2q3,
        required: true
        },
        {
        prompt: "Êtes-vous d'accord avec l'idée que le masque peut ralentir la propagation du virus ?",
        labels: mask_scale_q2q3,
        required: true
        }
    ],
      start_on_top: true
  }

  var mask_end = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class ='custom-title'>" + ((task_order == "vaast_first") ? "Tâche 2": "Tâche 1") + "</h1>" +
      "<p class='instructions'><center>La tâche " + ((task_order == "vaast_first") ? "2": "1") + " de cette étude est maintenanée terminée.</center></p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  var mask_attitude_measure = {
    timeline: [
      mask_intro,
      showing_cursor,
      mask_questions,
      mask_end,
      hiding_cursor,
    ]
  }

  // demographics + questions -------------------------------------------------------------

  var extra_instructions = {
   type: 'html-keyboard-response',
   stimulus: "<p class='instructions'>Cette étude est presque terminée. " +
             "Nous allons maintenant vous demander de répondre à quelques questions démographiques.</p>" +
             "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour continuer.</p>",
    choices: [32]
  };

  var extra_information_1 = {
    timeline: [{
      type: 'survey-text',
      data: {trial: "age"},
      questions: [{prompt: "Quel est votre âge ? Veuillez n'entrer que des réponses numériques."}],
      button_label: "Soumettre",
    }],
    loop_function: function(data) {
      var extra_information_3 = data.values()[0].responses;
      var extra_information_3 = JSON.parse(extra_information_3).Q0;
      if (extra_information_3 == "") {
        alert("Veuillez entrer votre âge.");
        return true;
      }
    }
  }

  var extra_information_2 = {
    type: 'survey-multi-choice',
    data: {trial: "gender"},
    questions: [{prompt: "Quel est votre genre?", options: ["Homme", "Femme", "Autre"], required: true, horizontal: true}],
    button_label: "Soumettre"
  }

  var extra_information_3 = {
    type: 'survey-multi-choice',
    data: {trial: "ses"},
    questions: [{prompt: "Quel est votre statut socio-économique ?",
                 options: ["Très bas", "Bas", "Moyen", "Élevé", "Très élevé"],
                 required: true, horizontal: false}],
    button_label: "Soumettre"
  }

  var extra_information_4 = {
    type: 'survey-multi-choice',
    data: {trial: "education"},
    questions: [{prompt: "Quel est votre plus haut niveau d'éducation ?",
                 options: ["Sans diplôme",
                           "Brevet des collèges",
                           "CAP/BEP (autres diplômes techniques)",
                           "Baccalauréat",
                           "BAC+2 (BTS, DUT, DEUG, ...)",
                           "BAC+3/4 (Licence)",
                           "BAC+5 (Master, écoles d'ingénieur, ...)",
                           "BAC+8 (Doctorat, ...)"],
                 required: true, horizontal: false}],
    button_label: "Soumettre"
  }

  var extra_information_5 = {
    type: 'survey-text',
    data: {trial: "notes"},
    questions: [{prompt: "Avez-vous des commentaires concernant cette étude ? [Optionnel]"}],
    button_label: "Soumettre"
  }


  // end instructions ---------------------------------------------------------------------

  var debrief = {
    type: "html-keyboard-response",
    stimulus:
      "<h1 class='custom-title'>L'étude est terminée.</h1>" +
      "<p class='instructions'>Nous vous remercions de votre participation.</p>" +
      "<p class='instructions'>Dans cette étude, nous nous intéressions à la facilité plus ou moins accrue " +
      "des individus à effectuer des mouvements d'approche ou d'évitement vis-à-vis des personnes qui portent " +
      "(ou ne portent pas) de masques. En effet, dans le contexte sanitaire actuel où le respect de la distanciation " +
      "physique et du port du masque est obligatoire (particulièrement en intérieur, dans les lieux publics), nous " +
      "nous attendions à ce que lorsqu'une personne est confrontée à un individu qui ne porte pas de masque, celle-ci " +
      "soit plus susceptible de manifester des comportements d'évitement (au sens d'une augmentation de la distance " +
      "physique) face à cet individu." +
      "<br>" +
      "Nous nous intéressions également au fait de savoir si cette tendance à l'évitement des individus qui ne portent " +
      "pas de masque variait selon l'attitude plus ou moins favorable des personnes vis-à-vis du port du masque et de leur " +
      "pratique de cette réglementation.</p>" +
      "<p class='instructions'>Si vous avez des questions au sujet de cette étude, vous pouvez nous contacter à l'adresse suivante : " +
      "mae.braud@etu.univ-grenoble-alpes.fr</p>" +
      "<p class='continue-instructions'>Appuyez sur <strong>espace</strong> pour être redirigé sur le site de Crowd Panel.</p>",
    choices: [32]
  };

  var ending = {
    type: "html-keyboard-response",
    trial_duration: 2000,
    stimulus:
      "<p class='instructions'>Vous allez maintenant être rediriger vers le site web de Crowd Panel, ceci ne devrait pas prendre plus de quelques secondes.<p>" +
      "<p class='instructions'>Si vous n'êtes pas redirigé automatiquement, veuillez cliquer <a href='https://crowdpanel.io/'>ici</a>.<p>",
    choices: jsPsych.NO_KEYS
  };

  // procedure ----------------------------------------------------------------------------
  // Initialize timeline ------------------------------------------------------------------
  var timeline = [];
  ///welcome
  timeline.push(welcome,
                consent,
                welcome_2,
                if_not_enough_time);
   // fullscreen
   timeline.push(fullscreen_trial,
                 hiding_cursor);

   // initial instructions
   timeline.push(instructions);

  // main tasks (VAAST & attitude scale)
  timeline.push(((task_order == "vaast_first") ? vaast_procedure: mask_attitude_measure),
                ((task_order == "vaast_first") ? mask_attitude_measure: vaast_procedure));

  // demographic questions
  timeline.push(extra_instructions,
                showing_cursor,
                extra_information_1,
                extra_information_2,
                extra_information_3,
                extra_information_4,
                extra_information_5);
    
  // ending
  timeline.push(debrief,
                ending);

  // exit fullscreen
  timeline.push(fullscreen_trial_exit);             

  // Launch experiment --------------------------------------------------------------------
  // preloading ---------------------------------------------------------------------------
  // Preloading. For some reason, it appears auto-preloading fails, so using it manually.
  // In principle, it should have ended when participants starts VAAST procedure (which)
  // contains most of the images that have to be pre-loaded.
  var loading_gif = ["media/loading.gif"]
  var vaast_instructions_images = ["media/vaast-background.jpg", "media/keyboard-vaast.png"];
  var vaast_bg_filename = background;
  var vaast_stimuli_preload = ["stimuli/00012_nb.png", "stimuli/00064_nb.png", "stimuli/00256_nb.png", "stimuli/00284_nb.png", "stimuli/00641_nb.png",
                               "stimuli/00780_nb.png", "stimuli/00991_nb.png", "stimuli/00998_nb.png", "stimuli/01089_nb.png", "stimuli/01228_nb.png", "stimuli/01254_nb.png",
                               "stimuli/01255_nb.png", "stimuli/01393_nb.png", "stimuli/01404_nb.png", "stimuli/01624_nb.png", "stimuli/01715_nb.png", "stimuli/02386_nb.png",
                               "stimuli/02388_nb.png", "stimuli/02881_nb.png", "stimuli/03042_nb.png", "stimuli/03216_nb.png", "stimuli/03528_nb.png", "stimuli/03557_nb.png",
                               "stimuli/03564_nb.png", "stimuli/03617_nb.png", "stimuli/03799_nb.png", "stimuli/03875_nb.png", "stimuli/03886_nb.png", "stimuli/03890_nb.png",
                               "stimuli/04131_nb.png", "stimuli/04149_nb.png", "stimuli/04192_nb.png", "stimuli/04292_nb.png", "stimuli/04319_nb.png", "stimuli/04446_nb.png",
                               "stimuli/04986_nb.png", "stimuli/05494_nb.png", "stimuli/05563_nb.png", "stimuli/05690_nb.png", "stimuli/05752_nb.png", "stimuli/06027_nb.png",
                               "stimuli/06207_nb.png", "stimuli/06213_nb.png", "stimuli/06709_nb.png", "stimuli/06779_nb.png", "stimuli/06869_nb.png", "stimuli/07087_nb.png",
                               "stimuli/07493_nb.png", "stimuli/08156_nb.png", "stimuli/08748_nb.png", "stimuli/08873_nb.png", "stimuli/09074_nb.png", "stimuli/09175_nb.png",
                               "stimuli/09748_nb.png", "stimuli/09846_nb.png", "stimuli/10083_nb.png", "stimuli/10132_nb.png", "stimuli/10500_nb.png", "stimuli/10513_nb.png",
                               "stimuli/10536_nb.png", "stimuli/10841_nb.png", "stimuli/11499_nb.png", "stimuli/11507_nb.png", "stimuli/11515_nb.png", "stimuli/11581_nb.png",
                               "stimuli/12070_nb.png", "stimuli/12183_nb.png", "stimuli/12200_nb.png", "stimuli/12245_nb.png", "stimuli/12480_nb.png", "stimuli/12569_nb.png",
                               "stimuli/12736_nb.png", "stimuli/12976_nb.png", "stimuli/13104_nb.png", "stimuli/13105_nb.png", "stimuli/13168_nb.png", "stimuli/13296_nb.png",
                               "stimuli/13306_nb.png", "stimuli/13484_nb.png", "stimuli/13584_nb.png", "stimuli/13720_nb.png", "stimuli/13989_nb.png", "stimuli/14247_nb.png",
                               "stimuli/14943_nb.png", "stimuli/15201_nb.png", "stimuli/15422_nb.png", "stimuli/15871_nb.png", "stimuli/16112_nb.png", "stimuli/16352_nb.png",
                               "stimuli/16804_nb.png", "stimuli/16829_nb.png", "stimuli/16839_nb.png", "stimuli/16922_nb.png", "stimuli/17019_nb.png", "stimuli/17087_nb.png",
                               "stimuli/17116_nb.png", "stimuli/17117_nb.png", "stimuli/17171_nb.png", "stimuli/17412_nb.png", "stimuli/17488_nb.png", "stimuli/17494_nb.png",
                               "stimuli/17940_nb.png", "stimuli/18100_nb.png", "stimuli/18228_nb.png", "stimuli/18247_nb.png", "stimuli/18752_nb.png", "stimuli/19496_nb.png",
                               "stimuli/19665_nb.png", "stimuli/19993_nb.png",
                               "stimuli/00012_Mask_nb.png", "stimuli/00064_Mask_nb.png", "stimuli/00256_Mask_nb.png", "stimuli/00284_Mask_nb.png", "stimuli/00641_Mask_nb.png",
                               "stimuli/00780_Mask_nb.png", "stimuli/00991_Mask_nb.png", "stimuli/00998_Mask_nb.png", "stimuli/01089_Mask_nb.png", "stimuli/01228_Mask_nb.png", "stimuli/01254_Mask_nb.png",
                               "stimuli/01255_Mask_nb.png", "stimuli/01393_Mask_nb.png", "stimuli/01404_Mask_nb.png", "stimuli/01624_Mask_nb.png", "stimuli/01715_Mask_nb.png", "stimuli/02386_Mask_nb.png",
                               "stimuli/02388_Mask_nb.png", "stimuli/02881_Mask_nb.png", "stimuli/03042_Mask_nb.png", "stimuli/03216_Mask_nb.png", "stimuli/03528_Mask_nb.png", "stimuli/03557_Mask_nb.png",
                               "stimuli/03564_Mask_nb.png", "stimuli/03617_Mask_nb.png", "stimuli/03799_Mask_nb.png", "stimuli/03875_Mask_nb.png", "stimuli/03886_Mask_nb.png", "stimuli/03890_Mask_nb.png",
                               "stimuli/04131_Mask_nb.png", "stimuli/04149_Mask_nb.png", "stimuli/04192_Mask_nb.png", "stimuli/04292_Mask_nb.png", "stimuli/04319_Mask_nb.png", "stimuli/04446_Mask_nb.png",
                               "stimuli/04986_Mask_nb.png", "stimuli/05494_Mask_nb.png", "stimuli/05563_Mask_nb.png", "stimuli/05690_Mask_nb.png", "stimuli/05752_Mask_nb.png", "stimuli/06027_Mask_nb.png",
                               "stimuli/06207_Mask_nb.png", "stimuli/06213_Mask_nb.png", "stimuli/06709_Mask_nb.png", "stimuli/06779_Mask_nb.png", "stimuli/06869_Mask_nb.png", "stimuli/07087_Mask_nb.png",
                               "stimuli/07493_Mask_nb.png", "stimuli/08156_Mask_nb.png", "stimuli/08748_Mask_nb.png", "stimuli/08873_Mask_nb.png", "stimuli/09074_Mask_nb.png", "stimuli/09175_Mask_nb.png",
                               "stimuli/09748_Mask_nb.png", "stimuli/09846_Mask_nb.png", "stimuli/10083_Mask_nb.png", "stimuli/10132_Mask_nb.png", "stimuli/10500_Mask_nb.png", "stimuli/10513_Mask_nb.png",
                               "stimuli/10536_Mask_nb.png", "stimuli/10841_Mask_nb.png", "stimuli/11499_Mask_nb.png", "stimuli/11507_Mask_nb.png", "stimuli/11515_Mask_nb.png", "stimuli/11581_Mask_nb.png",
                               "stimuli/12070_Mask_nb.png", "stimuli/12183_Mask_nb.png", "stimuli/12200_Mask_nb.png", "stimuli/12245_Mask_nb.png", "stimuli/12480_Mask_nb.png", "stimuli/12569_Mask_nb.png",
                               "stimuli/12736_Mask_nb.png", "stimuli/12976_Mask_nb.png", "stimuli/13104_Mask_nb.png", "stimuli/13105_Mask_nb.png", "stimuli/13168_Mask_nb.png", "stimuli/13296_Mask_nb.png",
                               "stimuli/13306_Mask_nb.png", "stimuli/13484_Mask_nb.png", "stimuli/13584_Mask_nb.png", "stimuli/13720_Mask_nb.png", "stimuli/13989_Mask_nb.png", "stimuli/14247_Mask_nb.png",
                               "stimuli/14943_Mask_nb.png", "stimuli/15201_Mask_nb.png", "stimuli/15422_Mask_nb.png", "stimuli/15871_Mask_nb.png", "stimuli/16112_Mask_nb.png", "stimuli/16352_Mask_nb.png",
                               "stimuli/16804_Mask_nb.png", "stimuli/16829_Mask_nb.png", "stimuli/16839_Mask_nb.png", "stimuli/16922_Mask_nb.png", "stimuli/17019_Mask_nb.png", "stimuli/17087_Mask_nb.png",
                               "stimuli/17116_Mask_nb.png", "stimuli/17117_Mask_nb.png", "stimuli/17171_Mask_nb.png", "stimuli/17412_Mask_nb.png", "stimuli/17488_Mask_nb.png", "stimuli/17494_Mask_nb.png",
                               "stimuli/17940_Mask_nb.png", "stimuli/18100_Mask_nb.png", "stimuli/18228_Mask_nb.png", "stimuli/18247_Mask_nb.png", "stimuli/18752_Mask_nb.png", "stimuli/19496_Mask_nb.png",
                               "stimuli/19665_Mask_nb.png", "stimuli/19993_Mask_nb.png"];

  jsPsych.pluginAPI.preloadImages(loading_gif);
  jsPsych.pluginAPI.preloadImages(vaast_instructions_images);
  jsPsych.pluginAPI.preloadImages(vaast_bg_filename);
  jsPsych.pluginAPI.preloadImages(vaast_stimuli_preload);

  // Preload images
  var preloadimages = [];
  preloadimages.push(loading_gif, vaast_instructions_images, vaast_bg_filename, vaast_stimuli_preload);


  // timeline initiaization ---------------------------------------------------------------

  // timeline initiaization ------------------------------------------------------
  if (is_compatible) {
    jsPsych.init({
      timeline: timeline,
      preload_images: preloadimages,
      max_load_time: 1000 * 500,
      exclusions: {
            min_width: 800,
            min_height: 600,
        },
      on_interaction_data_update: function() {
        database
            .ref("browser_event/")
            .push()
            .set({
              session_id: session_id,
              prolific_id: prolific_id,
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              event_data: jsPsych.data.getInteractionData().last().json(),
              })
        },
      on_data_update: function() {
        database
            .ref("trial/")
            .push()
            .set({
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              session_id: session_id,
              vaast_cond_block_1: vaast_cond_block_1,
              vaast_cond_block_2: vaast_cond_block_2,
              data: jsPsych.data.get().last().json()
              });
        },
      on_finish: function() {
        database
            .ref("completed/" + prolific_id)
            .set({
              timestamp: firebase.database.ServerValue.TIMESTAMP,
              session_id: session_id,
              });

        window.location.href = "https://app.prolific.co/submissions/complete?cc=4494BBA1";
        },
      show_preload_progress_bar: true,
      });
    }
 // }
