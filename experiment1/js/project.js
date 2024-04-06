// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }

  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    enemy: [
      "Michael",
      "Obelisk",
      "Doran",
      "Candy",
      "01000110",
      "The Killer",
      "Imposter",
      "Gamer",
      "$enemy and $enemy",
    ],
    trait: [
      "Evil",
      "Good",
      "Dauntless",
      "Invincible",
      "Unyielding",
      "Comedien",
      "ERROR 404: NOT FOUND",
    ],
    hp: [
      "1",
      "100",
      "150",
      "200",
      "250",
      "300",
      "350",
      "400",
      "450",
      "500",
      "1000",
    ],
    atk: ["1", "5", "10", "15", "20", "30", "40", "50", "100", "999"],
    weakness: [
      "fire",
      "water",
      "grass",
      "light",
      "dark",
      "swords",
      "guns",
      "insults",
      "death",
      "jokes",
      "paper",
      "rock",
    ],
    object: [
      "wolf",
      "golem",
      "snake",
      "chicken",
      "human",
      "mech",
      "clown",
      "bunny",
    ],
    material: [
      "nothing special",
      "borigness",
      "normality",
      "metal",
      "stone",
      "ice",
      "fire",
      "cotton",
      "clouds",
    ],
    noun: [
      "ice cream",
      "water",
      "alcohol",
      "kindness",
      "the beach",
      "suffering",
      "gambling",
    ],
    action: [
      "to gamble",
      "going on walks",
      "cooking its favorite food",
      "racing with its friends",
      "doing crime",
      "visiting Michael",
    ],
  };

  const template = `Enemy Encounter: $enemy the $trait
  
  It has $hp health, $atk attack, and is weak to $weakness and $weakness
  
  The enemy is a $object made out of $material, it seems like it enjoys $noun and $action
  
  `;

  // STUDENTS: You don't need to edit code below this line.

  const slotPattern = /\$(\w+)/;

  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }

    /* global box */
    $("#box").text(story);
  }

  /* global clicker */
  $("#clicker").click(generate);

  generate();
}

// let's get this party started - uncomment me
main();
