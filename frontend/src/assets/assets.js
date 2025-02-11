
import palm_logo  from './palm_logo.png'
import palm_logo2  from './palm_logo2.png'
import bg from './bg.jpg'
import bg_video from './bg-video.mp4'
import palm  from './palm.jpg'
import { Scissors, Star, Gift } from 'lucide-react';

export const assets = {
    bg,
    bg_video,
    palm,
    palm_logo,
    palm_logo2,
    
}

export const braidingServices = [
    {
      id: 1,
      title: "Box Braids",
      description: "Box braids begin with extensions from the root and can extend from shoulder length to your calves, available in big, small, or medium sizes.",
      price: 70,
      icon: Scissors
    },
    {
      id: 2,
      title: "Knotless Braids",
      description: "Knotless braids provide a more seamless appearance, with extensions added while the hair is being braided for a natural look.",
      price: 70,
      icon: Scissors
    },
    {
      id: 3,
      title: "Corn Rows",
      description: "Traditional style where hair is braided close to the scalp using an underhand and upward motion to create continuous rows.",
      price: 130,
      icon: Scissors
    },
    {
      id: 4,
      title: "Stitch Braids",
      description: "A protective style using feed-in technique, creating the appearance of cornrows with mini lines attached to every row.",
      price: 90,
      icon: Scissors
    },
    {
      id: 5,
      title: "Crochet",
      description: "A time-saving option where pre-made braids are attached to cornrows or single stranded natural braids. Provides reusability.",
      price: 50,
      icon: Scissors
    },
    {
      id: 6,
      title: "Twists",
      description: "Created by twisting two sections of hair around each other to the ends for a beautiful protective style.",
      price: 90,
      icon: Scissors
    },
    {
      id: 7,
      title: "Butterfly Locs",
      description: "Distressed-looking locs with wing-like characteristics throughout the body of each loc.",
      price: 70,
      icon: Scissors
    },
    {
      id: 8,
      title: "Dread Locs",
      description: "Neat-rooted locs with an uncombed body, easy to maintain and style.",
      price: 70,
      icon: Scissors
    },
    {
      id: 9,
      title: "Weaves",
      description: "Extend your hair length seamlessly with premium hair extensions and weaves.",
      price: 70,
      icon: Scissors
    }
  ];

  export const beautyServices = [
    {
      id: 10,
      title: "Lash Extensions",
      description: "From natural to dramatic looks, our lash extensions are applied with precision in various lengths and thicknesses.",
      price: 90,
      icon: Star
    },
    {
      id: 11,
      title: "PMU Brows",
      description: "Permanent makeup brows designed to match your skin tone and preferred shape for natural-looking results.",
      price: 300,
      icon: Star
    },
    {
      id: 12,
      title: "Makeup",
      description: "Professional makeup application that seamlessly enhances your natural beauty, perfect for any special occasion.",
      price: 80,
      icon: Gift
    }
  ];