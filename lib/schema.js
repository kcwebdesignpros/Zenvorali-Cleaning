'use strict';

const site = require('../data/site');

const ORG_ID = `${site.url}/#organization`;
const SITE_ID = `${site.url}/#website`;
const PLACE_ID = `${site.url}/#localbusiness`;

/* ---------- helpers ---------- */

/** ISO date for "now" produced at request time — keeps `dateModified` truthful. */
function isoDate(d) {
  const t = d ? new Date(d) : new Date();
  return t.toISOString().slice(0, 10);
}

function openingHoursSpecification() {
  return site.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${h.day}`,
    opens: h.opens,
    closes: h.closes
  }));
}

function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: site.address.line1,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.zip,
    addressCountry: 'US'
  };
}

function areaServed() {
  return site.serviceArea.secondary.map((name) => ({ '@type': 'City', name }));
}

/* ---------- builders ---------- */

function localBusiness() {
  return {
    '@type': ['LocalBusiness', 'CleaningService'],
    '@id': PLACE_ID,
    name: site.name,
    legalName: site.legalName,
    alternateName: 'Zenvorali Cleaning Kansas City',
    description: site.shortDesc,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}${site.ogImage}`,
    logo: {
      '@type': 'ImageObject',
      url: `${site.url}${site.logo}`,
      width: 512,
      height: 512
    },
    priceRange: site.priceRange,
    foundingDate: String(site.founded),
    currenciesAccepted: 'USD',
    paymentAccepted: 'Cash, Credit Card, Debit Card, ACH Transfer, Apple Pay',
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.full)}`,
    openingHoursSpecification: openingHoursSpecification(),
    areaServed: areaServed(),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: site.geo.lat,
        longitude: site.geo.lng
      },
      geoRadius: site.serviceArea.radiusMiles * 1609.34
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: site.rating.value,
      reviewCount: site.rating.count,
      bestRating: 5,
      worstRating: 1
    },
    sameAs: site.socials.map((s) => s.url),
    makesOffer: [
      'House Cleaning',
      'Deep Cleaning',
      'Move-In / Move-Out Cleaning',
      'Office & Commercial Cleaning',
      'Apartment & Condo Cleaning',
      'Post-Construction Cleaning'
    ].map((name) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name }
    }))
  };
}

function website() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: site.url,
    name: site.name,
    description: site.shortDesc,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${site.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
}

function organization() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: site.url,
    logo: {
      '@type': 'ImageObject',
      url: `${site.url}${site.logo}`,
      width: 512,
      height: 512
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: site.phone,
        contactType: 'customer service',
        areaServed: 'US-MO',
        availableLanguage: ['English', 'Spanish']
      },
      {
        '@type': 'ContactPoint',
        telephone: site.emergencyPhone,
        contactType: 'emergency',
        areaServed: 'US-MO'
      }
    ],
    sameAs: site.socials.map((s) => s.url)
  };
}

function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.href}`
    }))
  };
}

function serviceSchema(service) {
  return {
    '@type': 'Service',
    '@id': `${site.url}/services/${service.slug}#service`,
    name: service.name,
    serviceType: service.name,
    description: service.meta.description,
    url: `${site.url}/services/${service.slug}`,
    image: `${site.url}${service.image}`,
    provider: { '@id': PLACE_ID },
    areaServed: areaServed(),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: `${site.url}/services/${service.slug}`,
      servicePhone: site.phone,
      availableLanguage: ['English', 'Spanish']
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: service.price.from,
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: service.price.from,
        priceCurrency: 'USD',
        valueAddedTaxIncluded: false,
        name: service.price.note
      },
      availability: 'https://schema.org/InStock',
      url: `${site.url}/services/${service.slug}`,
      seller: { '@id': PLACE_ID }
    }
  };
}

function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a }
    }))
  };
}

function articleSchema(post) {
  return {
    '@type': 'BlogPosting',
    '@id': `${site.url}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.description,
    url: `${site.url}/blog/${post.slug}`,
    image: `${site.url}${post.image}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      jobTitle: post.authorRole,
      worksFor: { '@id': ORG_ID }
    },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${site.url}/blog/${post.slug}` },
    articleSection: post.category,
    wordCount: String(post.body || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).length,
    inLanguage: 'en-US'
  };
}

function itemList(items) {
  return {
    '@type': 'ItemList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: `${site.url}${it.href}`
    }))
  };
}

function reviewsSchema(reviews, serviceName) {
  return {
    '@type': 'Product',
    name: serviceName || `${site.name} Services`,
    description: `Verified customer reviews for ${site.name} in Kansas City.`,
    brand: { '@id': ORG_ID },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: site.rating.value,
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1
    },
    review: reviews.slice(0, 12).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      datePublished: r.date,
      reviewBody: r.text,
      name: r.title,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1
      }
    }))
  };
}

function contactPage() {
  return {
    '@type': 'ContactPage',
    '@id': `${site.url}/contact#contactpage`,
    name: `Contact ${site.name}`,
    description: `Request a free cleaning quote in Kansas City. Call ${site.phone} or send the form.`,
    url: `${site.url}/contact`
  };
}

function webPage({ title, description, path, type = 'WebPage' }) {
  return {
    '@type': type,
    '@id': `${site.url}${path}#webpage`,
    url: `${site.url}${path}`,
    name: title,
    description,
    isPartOf: { '@id': SITE_ID },
    about: { '@id': PLACE_ID },
    inLanguage: 'en-US',
    dateModified: isoDate()
  };
}

/**
 * Wrap a set of nodes into one @graph so pages emit a single <script> block
 * with proper @id cross-references.
 */
function graph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}

module.exports = {
  localBusiness,
  website,
  organization,
  breadcrumb,
  serviceSchema,
  faqSchema,
  articleSchema,
  itemList,
  reviewsSchema,
  contactPage,
  webPage,
  graph,
  ORG_ID,
  SITE_ID,
  PLACE_ID
};
