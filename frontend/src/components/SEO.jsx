import { Helmet } from 'react-helmet'

// SEO Component
const SEO = () => (
  <Helmet>
    <title>Our Services - PalmsBeautyStore | Beauty Salon in St. John's, NL</title>
    <meta name="description" content="Discover our comprehensive range of beauty services including hair styling, braiding, makeup, and more at PalmsBeautyStore in St. John's." />
    <meta property="og:title" content="Beauty Services - PalmsBeautyStore" />
    <meta property="og:description" content="Professional beauty services including hair styling, braiding, and makeup services in St. John's, NL." />
    <link rel="canonical" href="/services" />
  </Helmet>
);

export default SEO