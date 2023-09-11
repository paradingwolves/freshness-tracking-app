import React, { useState } from 'react';

const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Parallel lines have so much in common. It's a shame they'll never meet.",
    "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
    "I used to play piano by ear, but now I use my hands.",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "How do you organize a space party? You planet!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "I told my wife she was drawing her eyebrows too high. She looked surprised.",
    "Why don't skeletons fight each other? They don't have the guts.",
    "What's orange and sounds like a parrot? A carrot!",
    "I couldn't figure out how to put my seatbelt on. Then it just 'clicked'!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "What did one wall say to the other wall? 'I will meet you at the corner!'",
    "Why don't oysters donate to charity? Because they are shellfish!",
    "I would tell you a construction joke, but I'm still working on it.",
    "I used to be a baker, but I couldn't make enough dough.",
];

const getRandomJoke = () => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  return jokes[randomIndex];
};

const Footer = () => {
  const [joke, setJoke] = useState(getRandomJoke());

  const generateNewJoke = () => {
    const newJoke = getRandomJoke();
    setJoke(newJoke);
  };

  return (
    <footer className="bg-dark text-white text-center fs-3 py-3">
      <div className="container">
        <p className="mb-0">
          {joke}
        </p>
        <button className="btn btn-light mt-2" onClick={generateNewJoke}>
          Tell Me Another Joke
        </button>
      </div>
    </footer>
  );
}

export default Footer;
