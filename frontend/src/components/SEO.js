import React from "react";
import { Helmet } from "react-helmet";

const SEO = ({ title, description, keywords, image, url }) => (
  <Helmet>
    <title>{title}</title>

    {/* Basic SEO */}
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />

    {/* Canonical URL */}
    <link rel="canonical" href={url} />

    {/* Open Graph Meta Tags */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content="website" />

    {/* Twitter Card Meta Tags */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:site" content="@yourTwitterHandle" />

    {/* Mobile Optimization */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    {/* Favicon */}
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  </Helmet>
);

export default SEO;
