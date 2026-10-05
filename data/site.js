'use strict';

/**
 * Global site configuration. Every template reads from here — nothing about
 * the business, the phone number or the address is hard-coded in a view.
 */

const SITE_URL = process.env.SITE_URL || 'https://zenvoralicleaning.com';

const site = {
  name: 'Zenvorali Cleaning',
  legalName: 'Zenvorali Cleaning LLC',
  tagline: 'Kansas City\u2019s Cleanest Standard',
  shortDesc:
    'Premium residential and commercial cleaning in Kansas City. Insured, bonded, background-checked teams, flat-rate pricing and a 100% re-clean guarantee.',
  url: SITE_URL,
  logo: '/img/logo.webp',
  logoMark: '/img/logo-mark.webp',
  ogImage: '/img/og-image.jpg',
  founded: 2013,
  priceRange: '$$',
  rating: { value: 4.9, count: 612 },

  /* ---- Name / Address / Phone: one source of truth ---- */
  phone: '(816) 555-0142',
  phoneHref: 'tel:+18165550142',
  emergencyPhone: '(816) 555-0199',
  emergencyPhoneHref: 'tel:+18165550199',
  email: 'hello@zenvoralicleaning.com',
  quotesEmail: 'quotes@zenvoralicleaning.com',

  address: {
    street: '4182 Bellhaven Court',
    suite: 'Suite 210',
    city: 'Kansas City',
    state: 'MO',
    stateLong: 'Missouri',
    zip: '64111',
    country: 'US',
    get line1() {
      return '4182 Bellhaven Court, Suite 210';
    },
    get full() {
      return '4182 Bellhaven Court, Suite 210, Kansas City, MO 64111';
    }
  },

  geo: { lat: 39.0558, lng: -94.5932 },

  hours: [
    { day: 'Monday', open: '7:00 AM', close: '8:00 PM', opens: '07:00', closes: '20:00' },
    { day: 'Tuesday', open: '7:00 AM', close: '8:00 PM', opens: '07:00', closes: '20:00' },
    { day: 'Wednesday', open: '7:00 AM', close: '8:00 PM', opens: '07:00', closes: '20:00' },
    { day: 'Thursday', open: '7:00 AM', close: '8:00 PM', opens: '07:00', closes: '20:00' },
    { day: 'Friday', open: '7:00 AM', close: '6:00 PM', opens: '07:00', closes: '18:00' },
    { day: 'Saturday', open: '8:00 AM', close: '5:00 PM', opens: '08:00', closes: '17:00' },
    { day: 'Sunday', open: '10:00 AM', close: '4:00 PM', opens: '10:00', closes: '16:00' }
  ],
  hoursSummary: 'Mon\u2013Thu 7\u20138 \u00b7 Fri 7\u20136 \u00b7 Sat 8\u20135 \u00b7 Sun 10\u20134',

  socials: [
    { name: 'Facebook', url: 'https://www.facebook.com/zenvoralicleaning', icon: 'facebook' },
    { name: 'Instagram', url: 'https://www.instagram.com/zenvoralicleaning', icon: 'instagram' },
    { name: 'X', url: 'https://x.com/zenvoraliclean', icon: 'x' },
    { name: 'Pinterest', url: 'https://www.pinterest.com/zenvoralicleaning', icon: 'pinterest' },
    { name: 'YouTube', url: 'https://www.youtube.com/@zenvoralicleaning', icon: 'youtube' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/zenvorali-cleaning', icon: 'linkedin' }
  ],

  /** Header / drawer navigation. `mega: true` renders the services dropdown. */
  nav: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services', mega: true },
    { label: 'Service Area', href: '/service-area' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Projects', href: '/projects' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ],

  footerNav: [
    {
      title: 'Company',
      links: [
        { label: 'About Zenvorali', href: '/about' },
        { label: 'Our Cleaning Team', href: '/team' },
        { label: 'Service Area', href: '/service-area' },
        { label: 'Before & After Projects', href: '/projects' },
        { label: 'Customer Reviews', href: '/reviews' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact Us', href: '/contact' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Cleaning Blog', href: '/blog' },
        { label: 'FAQ Centre', href: '/faq' },
        { label: 'Transparent Pricing', href: '/pricing' },
        { label: 'Special Offers', href: '/offers' },
        { label: 'Commercial Bid Request', href: '/commercial-quote' },
        { label: 'Refer a Neighbour', href: '/referral-program' },
        { label: 'Green Cleaning Promise', href: '/green-cleaning' }
      ]
    }
  ],

  city: 'Kansas City',
  region: 'Kansas City Metro',
  state: 'MO',

  /** Kansas City metro service area. */
  serviceArea: {
    primary: [
      'Downtown Kansas City', 'Crossroads Arts District', 'River Market', 'Power & Light District',
      'Westport', 'Country Club Plaza', 'Brookside', 'Waldo', 'Midtown', 'Hyde Park'
    ],
    secondary: [
      'Overland Park', 'Leawood', 'Prairie Village', 'Mission Hills', 'Fairway', 'Roeland Park',
      'Shawnee', 'Lenexa', 'Olathe', 'Merriam', 'North Kansas City', 'Parkville', 'Gladstone',
      'Liberty', 'Independence', 'Blue Springs', 'Lee\u2019s Summit', 'Raytown', 'Grandview', 'Belton'
    ],
    radiusMiles: 35,
    counties: ['Jackson County MO', 'Clay County MO', 'Platte County MO', 'Johnson County KS', 'Wyandotte County KS']
  },

  /** Trust bar + animated counters. `count` is the server-rendered fallback. */
  stats: [
    { value: 12400, suffix: '+', label: 'Homes & offices cleaned', count: '12,400+' },
    { value: 12, suffix: ' yrs', label: 'Serving the KC metro', count: '12 yrs' },
    { value: 4.9, suffix: '/5', label: 'Average client rating', count: '4.9/5', decimals: 1 },
    { value: 98, suffix: '%', label: 'Clients who rebook', count: '98%' }
  ],

  trustBadges: [
    { icon: 'shield', label: 'Fully Insured & Bonded', sub: '$2M liability coverage' },
    { icon: 'badge', label: 'Background-Checked Staff', sub: 'Every cleaner, every visit' },
    { icon: 'leaf', label: 'EPA Safer Choice Products', sub: 'Kid & pet safe formulas' },
    { icon: 'medal', label: '100% Re-Clean Guarantee', sub: 'Not happy? We return free' }
  ],

  /** "Why Choose Us" checklist. */
  advantages: [
    {
      icon: 'clock',
      title: 'On Time, Every Window',
      text: 'Two-hour arrival windows with live text updates when your crew is 20 minutes out \u2014 no all-day waiting.'
    },
    {
      icon: 'team',
      title: 'The Same Crew Each Visit',
      text: 'You get a named, consistent team that learns your home, your surfaces and your preferences instead of strangers every time.'
    },
    {
      icon: 'list',
      title: 'Transparent Flat-Rate Pricing',
      text: 'A written quote before we start. No hourly creep, no surprise add-ons, no fuel surcharges anywhere in the KC metro.'
    },
    {
      icon: 'sparkle',
      title: 'Commercial-Grade Equipment',
      text: 'HEPA vacuums, microfiber systemisation and hospital-grade disinfectants that residential services rarely invest in.'
    },
    {
      icon: 'shield',
      title: 'Vetted & Insured People',
      text: 'Background checks, drug screening, paid training and $2M liability cover on every job \u2014 documented, not promised.'
    },
    {
      icon: 'refresh',
      title: 'Re-Clean Guarantee',
      text: 'Tell us within 24 hours and we come back and fix it free. That promise is written into the service agreement.'
    }
  ],

  /** Four-step process (matches the reference "How It Works" band). */
  steps: [
    {
      n: '01',
      icon: 'phone',
      title: 'Call or Book Online',
      text: 'Ring us or send the two-minute form. A real coordinator \u2014 not a bot \u2014 answers and captures your priorities.'
    },
    {
      n: '02',
      icon: 'clipboard',
      title: 'Free Walkthrough & Flat Quote',
      text: 'We measure, count rooms and note problem areas, then email a written flat-rate quote the same day.'
    },
    {
      n: '03',
      icon: 'sparkle',
      title: 'Your Clean Is Delivered',
      text: 'A uniformed, insured crew arrives inside your window with everything needed. You come home to done.'
    },
    {
      n: '04',
      icon: 'heart',
      title: 'Inspect & Rebook',
      text: 'A 21-point checklist is emailed for sign-off. Keep the same slot weekly, biweekly or monthly in one tap.'
    }
  ],

  /** Home page dark "what makes us different" band. */
  differentiators: [
    'Same-day and next-day appointments across the metro',
    'Flat-rate quotes \u2014 no hourly billing surprises',
    'EPA Safer Choice, kid and pet safe products',
    'Insured, bonded, background-checked professionals'
  ],

  /** Commercial-friendly credentials. */
  insurance: {
    liability: '$2,000,000 general liability',
    bonding: 'Fully bonded, fidelity covered',
    workersComp: 'Workers\u2019 compensation carried',
    verified: 'Certificate of insurance emailed on request'
  },

  guarantee: {
    title: 'The Zenvorali Re-Clean Guarantee',
    text: 'If anything on your checklist is not right, tell us within 24 hours and we return and correct it at no charge \u2014 no arguments, no invoices, no exceptions.'
  },

  /** Contact form service dropdown. */
  formServices: [
    'Standard house cleaning',
    'Deep cleaning',
    'Move-in / move-out cleaning',
    'Apartment & condo cleaning',
    'Office & commercial cleaning',
    'Post-construction cleaning',
    'Airbnb & short-term rental turnover',
    'Carpet & window add-on',
    'Something else'
  ],

  paymentMethods: ['Visa', 'Mastercard', 'American Express', 'Discover', 'ACH / Bank transfer', 'Apple Pay'],

  credit: {
    text: 'Web and Marketing By KC Web Design Pros',
    name: 'KC Web Design Pros',
    url: 'https://kansascitywebdesignpros.com/'
  }
};

module.exports = site;
