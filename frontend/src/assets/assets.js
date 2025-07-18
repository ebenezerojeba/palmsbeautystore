import palm_logo from "./palm_logo.png";
import palm_logo2 from "./palm_logo2.png";
import bg from "./bg.jpg";
import bg_video from "./bg-video.mp4";
import palm from "./palm.jpg";
import braid1 from "./braid1.jpg";
import hair1 from "./hair1.jpg";
// import braid2 from "./braids2.JPG";
import extension1 from "./extension1.jpg";
import extension from "./extension.jpg";
import makeup1 from "./makeup1.jpg";
import butterfly from './butterfly.jpeg'
import crotchet from './crotchet.jpeg'
import stitches from './stitches.jpeg'
import twist from './twist.jpeg'
import Corn from './Corn.jpg'
import lash1 from './lash1.jpg'
import lash2 from './lash2.jpg'
import knotless from './knotless.jpg'
import cro from './cro.jpg'
import cro2 from './cro2.jpg'
import pic1 from './pic1.jpeg'
import pic2 from './pic2.png'
import pic3 from './pic3.png'
import pic4 from './pic4.jpeg'
import pic5 from './pic5.jpeg'
import visa from './visa.jpg'
import americanexpress from './americanexpress.jpg'
import mastercard from './mastercard.png'
import palmslogo from './palmslogo.jpg'
import plogo from './plogo.jpg'
import plog from './plog.png'



export const assets = {
  plog,
  plogo,
  palmslogo,
  americanexpress,
  mastercard,
  visa,
  pic1,
  pic2,
  pic3,
  pic4,
  pic5,
  braid1,

  // braid2,
  extension1,
  extension,
  hair1,
  lash1,
  lash2,
  makeup1,
  bg,
  bg_video,
  palm,
  palm_logo,
  palm_logo2,
  butterfly,
  twist,
  crotchet,
  stitches,
  Corn,
  knotless
};

const braidingServices = [
  {
    id: 1,
    title: "Box Braids",
    description: "Box braids begin with extensions from the root and can extend from shoulder length to your calves, available in big, small, or medium sizes.",
    duration: "4-6 hours",
    price: "Starting at $70",
    image: braid1,
  },
  {
    id: 2,
    title: "Knotless Braids",
    description: "Knotless braids provide a more seamless appearance, with extensions added while the hair is being braided for a natural look.",
    duration: "3-5 hours",
    price: "Starting at $70",
    image: knotless,
  },
  {
    id: 3,
    title: "Corn Rows",
    description: "Traditional style where hair is braided close to the scalp using an underhand and upward motion to create continuous rows.",
    duration: "1.5-3 hours",
    price: "Starting at $130",
    image: Corn,
  },
  {
    id: 4,
    title: "Stitch Braids",
    description: "A protective style using feed-in technique, creating the appearance of cornrows with mini lines attached to every row.",
    duration: "2-4 hours",
    price: "Starting at $90",
    image: stitches,
  },
  {
    id: 5,
    title: "Crochet",
    description: "A time-saving option where pre-made braids are attached to cornrows or single stranded natural braids. Provides reusability.",
    duration: "1.5-2 hours",
    price: "Starting at $50",
    image: cro,
  },
  {
    id: 6,
    title: "Twists",
    description: "Created by twisting two sections of hair around each other to the ends for a beautiful protective style.",
    duration: "3-5 hours",
    price: "Starting at $90",
    image: twist,
  },
  {
    id: 7,
    title: "Butterfly Locs",
    description: "Distressed-looking locs with wing-like characteristics throughout the body of each loc.",
    duration: "4-6 hours",
    price: "Starting at $70",
    image: cro2,
  },
  {
    id: 8,
    title: "Dread Locs",
    description: "Neat-rooted locs with an uncombed body, easy to maintain and style.",
    duration: "3-5 hours",
    price: "Starting at $70",
    image: twist,
  },
  {
    id: 9,
    title: "Weaves",
    description: "Extend your hair length seamlessly with premium hair extensions and weaves.",
    duration: "2-4 hours",
    price: "Starting at $70",
    image: hair1,
  },
];

const beautyServices = [
  {
    id: 10,
    title: "Lash Extensions",
    description: "From natural to dramatic looks, our lash extensions are applied with precision in various lengths and thicknesses.",
    duration: "1-2 hours",
    price: "Starting at $90",
    image: lash1,
  },
  {
    id: 11,
    title: "PMU Brows",
    description: "Permanent makeup brows designed to match your skin tone and preferred shape for natural-looking results.",
    duration: "2-3 hours",
    price: "Starting at $300",
    image: lash2,
  },
  {
    id: 12,
    title: "Makeup",
    description: "Professional makeup application that seamlessly enhances your natural beauty, perfect for any special occasion.",
    duration: "1-1.5 hours",
    price: "Starting at $80",
    image: makeup1,
  },
];

export { braidingServices, beautyServices };



// export const braidingServices = [
//   {
//     id: 1,
//     title: "Box Braids",
//     description:
//       "Box braids begin with extensions from the root and can extend from shoulder length to your calves, available in big, small, or medium sizes.",
//     price: 70,
//     duration: '1 hour, 30minutes',
//     image: braid1
//   },
//   {
//     id: 2,
//     title: "Knotless Braids",
//     description:
//       "Knotless braids provide a more seamless appearance, with extensions added while the hair is being braided for a natural look.",
//     price: 70,
//     image: knotless,
//   },
//   {
//     id: 3,
//     title: "Corn Rows",
//     description:
//       "Traditional style where hair is braided close to the scalp using an underhand and upward motion to create continuous rows.",
//     price: 130,
//     image: Corn,
//   },
//   {
//     id: 4,
//     title: "Stitch Braids",
//     description:
//       "A protective style using feed-in technique, creating the appearance of cornrows with mini lines attached to every row.",
//     price: 90,
//     image: stitches
//   },

//   {
//     id: 5,
//     title: "Crochet",
//     description:
//       "A time-saving option where pre-made braids are attached to cornrows or single stranded natural braids. Provides reusability.",
//     price: 50,
//     image: crotchet
//   },
//   {
//     id: 6,
//     title: "Twists",
//     description:
//       "Created by twisting two sections of hair around each other to the ends for a beautiful protective style.",
//     price: 90,
//     image: twist
//   },
//   {
//     id: 7,
//     title: "Butterfly Locs",
//     description:
//       "Distressed-looking locs with wing-like characteristics throughout the body of each loc.",
//     price: 70,
//     image: butterfly
//   },
//   {
//     id: 8,
//     title: "Dread Locs",
//     description:
//       "Neat-rooted locs with an uncombed body, easy to maintain and style.",
//     price: 70,
//     image : twist
//   },
//   {
//     id: 9,
//     title: "Weaves",
//     description:
//       "Extend your hair length seamlessly with premium hair extensions and weaves.",
//     price: 70,
//     image: hair1
//   },
// ];

// export const beautyServices = [
//   {
//     id: 10,
//     title: "Lash Extensions",
//     description:
//       "From natural to dramatic looks, our lash extensions are applied with precision in various lengths and thicknesses.",
//     price: 90,
//     image: lash1
//   },
//   {
//     id: 11,
//     title: "PMU Brows",
//     description:
//       "Permanent makeup brows designed to match your skin tone and preferred shape for natural-looking results.",
//     price: 300,
//     image: lash2
//   },
//   {
//     id: 12,
//     title: "Makeup",
//     description:
//       "Professional makeup application that seamlessly enhances your natural beauty, perfect for any special occasion.",
//     price: 80,
//     image: makeup1
//   },
// ];
