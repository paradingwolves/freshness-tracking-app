import React, { useState } from 'react';

const tips = [
  "Regularly brush your pet's fur to keep it healthy and reduce shedding.",
  "Provide clean and fresh water for your pet at all times.",
  "Feed your pet a balanced diet appropriate for their age and size.",
  "Give your pet plenty of exercise and playtime to keep them active and happy.",
  "Schedule regular check-ups with your veterinarian for your pet's health.",
  "Keep your pet's living area clean and free from hazards.",
  "Socialize your pet with other animals and people to improve their behavior.",
  "Use positive reinforcement training techniques for a well-behaved pet.",
  "Provide your pet with appropriate toys to keep them mentally stimulated.",
  "Spay or neuter your pet to prevent unwanted litters and health issues.",
  "Ensure your pet's collar has an ID tag with your contact information.",
  "Create a safe and secure outdoor space for your pet if they spend time outside.",
  "Be aware of your pet's body language to understand their needs and emotions.",
  "Avoid feeding your pet human food that can be harmful to them.",
  "Regularly clean and disinfect your pet's food and water bowls.",
  "Keep toxic plants and substances out of your pet's reach.",
  "Stay up-to-date with vaccinations and preventatives to protect your pet from diseases.",
  "Provide your pet with a comfortable and clean resting place.",
  "Teach your pet basic commands for better communication.",
  "Monitor your pet's weight to prevent obesity and related health issues.",
  "Groom your pet according to their breed's specific needs.",
  "Keep your pet's ears clean and check for signs of infection.",
  "Trim your pet's nails regularly to prevent discomfort and injury.",
  "Protect your pet from extreme weather conditions.",
  "Provide proper dental care to maintain your pet's oral health.",
  "Be patient and consistent with your pet's training and behavior.",
  "Monitor your pet's water intake to ensure they stay hydrated.",
  "Spending quality time with your pet is essential for their well-being.",
  "Research and choose appropriate pet insurance to cover unexpected expenses.",
  "Prepare a disaster and evacuation plan for your pet in case of emergencies.",
  "Maintain a safe and escape-proof enclosure for outdoor pets.",
  "Familiarize yourself with local pet regulations and laws.",
  "Prevent your pet from consuming harmful substances, such as chocolate and grapes.",
  "Provide mental stimulation through puzzle toys and enrichment activities.",
  "Know the signs of common pet illnesses and seek prompt veterinary care.",
  "Be mindful of your pet's age and adjust their care accordingly.",
  "Use a leash or harness when walking your pet in public places.",
  "Create a designated area for your pet to eliminate waste.",
  "Avoid exposing your pet to secondhand smoke and other pollutants.",
  "Keep your pet's vaccinations and medical records organized and up-to-date.",
  "Be cautious when introducing your pet to new animals and environments.",
  "Teach children and guests how to interact safely and respectfully with your pet.",
  "Regularly inspect your pet for ticks, fleas, and signs of skin issues.",
  "Stay informed about pet food recalls and choose trusted brands.",
  "Invest in a comfortable and supportive bed for your pet's sleep.",
  "Consider microchipping your pet for added security.",
  "Learn pet CPR and first aid techniques in case of emergencies.",
  "Ensure your pet receives appropriate exercise for their breed and age.",
  "Keep your pet's litter box or outdoor area clean and odor-free.",
];


const getRandomTip = () => {
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
};

const Footer = () => {
  const [tip, setTip] = useState(getRandomTip());

  const generateNewTip = () => {
    const newTip = getRandomTip();
    setTip(newTip);
  };

  return (
    <footer className="bg-dark text-white text-center fs-3 py-3">
      <div className="container">
        <p className="mb-0">
          {tip}
        </p>
        <button className="btn btn-light mt-2" onClick={generateNewTip}>
          Show Me Another Tip
        </button>
      </div>
    </footer>
  );
}

export default Footer;
