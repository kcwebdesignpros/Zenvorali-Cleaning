'use strict';

/**
 * Customer reviews. Dates are ISO — the `fmtDate` helper renders them.
 * `service` links back to a service slug for internal linking.
 */
module.exports = [
  {
    name: 'Dana Reilly',
    location: 'Brookside, Kansas City, MO',
    rating: 5,
    date: '2026-09-12',
    service: 'deep-cleaning',
    serviceName: 'Deep Cleaning',
    title: 'The leaded glass has not looked this good since we bought the house',
    text: 'We had not had the house professionally cleaned in four years and honestly did not expect much from a single visit. They spent six hours on it \u2014 hand-wiped every inch of the original trim, got the grease off the cabinet uppers and actually steamed the grout. The leaded glass in the dining room is clear for the first time since we moved in. Booked a biweekly plan before they left.'
  },
  {
    name: 'Marcus Thornton',
    location: 'Crossroads, Kansas City, MO',
    rating: 5,
    date: '2026-09-03',
    service: 'move-out-cleaning',
    serviceName: 'Move-Out Cleaning',
    title: 'Inspection passed with zero notes for the first time',
    text: 'Our building is difficult about access and the property manager inspects properly. Zenvorali registered with the management office, booked the freight lift and worked straight off the inspection checklist. They photographed everything and emailed the images with the invoice, which made the whole handover straightforward. Full deposit returned and no notes on the inspection.'
  },
  {
    name: 'Priya Nair',
    location: 'Overland Park, KS',
    rating: 5,
    date: '2026-08-27',
    service: 'office-commercial-cleaning',
    serviceName: 'Commercial Cleaning',
    title: 'The reporting alone justifies the contract',
    text: 'We moved from a weekly arrangement with a vendor who kept missing visits. Zenvorali clean five nights a week and send a report after every single one with the time, the crew and the checklist. Staff complained about our restrooms for two years and have not mentioned it once since we switched. The invoice also actually matches the scope, which sounds like a low bar but apparently is not.'
  },
  {
    name: 'Elena Kovalenko',
    location: 'Country Club Plaza, Kansas City, MO',
    rating: 5,
    date: '2026-08-15',
    service: 'apartment-condo-cleaning',
    serviceName: 'Apartment Cleaning',
    title: 'Two years on the same plan and I have never had to rebook',
    text: 'I travel most of the month, so a service that runs itself is the whole point. Same crew every visit, service lift always booked, and they use stone-safe products on my quartz after a previous company dulled it. Coming home to a clean apartment without thinking about it is easily worth the price.'
  },
  {
    name: 'Greg Hollingsworth',
    location: "Lee's Summit, MO",
    rating: 5,
    date: '2026-08-01',
    service: 'post-construction-cleaning',
    serviceName: 'Post-Construction Cleaning',
    title: 'Handed over on time with heavy drywall dust everywhere',
    text: 'Punch list closed Tuesday morning and the buyers walked through Thursday. Three-person crew, two days, and they dealt with overspray on fourteen windows and grout haze across 900 square feet of tile. They test-patched before using anything, which I appreciated. Buyers raised nothing. They are now on our standard vendor list.'
  },
  {
    name: 'Andre Whitfield',
    location: 'North Kansas City, MO',
    rating: 5,
    date: '2026-07-20',
    service: 'office-commercial-cleaning',
    serviceName: 'Commercial Cleaning',
    title: 'Our members noticed within a week',
    text: 'A gym lives and dies on how clean it feels. We clean six nights a week from 9 PM and the crew is off site before our 5 AM open with nothing left wet. They use a registered disinfectant with proper dwell time on the equipment rather than a quick wipe. Member complaints about hygiene went to nothing and we have renewed every year since.'
  },
  {
    name: 'Sarah Bennett',
    location: 'Prairie Village, KS',
    rating: 5,
    date: '2026-07-08',
    service: 'house-cleaning',
    serviceName: 'House Cleaning',
    title: 'Same two people every visit and it makes all the difference',
    text: 'We had a rotation service before and I was constantly re-explaining things \u2014 where the products live, that the fourth stair tread needs the crevice tool, that the dog is fine but the cat is not. Same crew now for over a year and they just know. It is a small thing that completely changes the experience of having a cleaning service.'
  },
  {
    name: 'James Okafor',
    location: 'Waldo, Kansas City, MO',
    rating: 4,
    date: '2026-06-26',
    service: 'house-cleaning',
    serviceName: 'House Cleaning',
    title: 'Good work, and they fixed the one issue immediately',
    text: 'The first clean missed a couple of spots in the upstairs bathroom, which I mentioned that evening. They were back the next morning at no charge and did the whole bathroom again rather than just the bits I flagged. A four rather than a five only because of the first visit \u2014 everything since has been spot on.'
  },
  {
    name: 'Nicole Ferrante',
    location: 'River Market, Kansas City, MO',
    rating: 5,
    date: '2026-06-11',
    service: 'apartment-condo-cleaning',
    serviceName: 'Apartment Cleaning',
    title: 'They actually understood that a studio is not a one-bedroom',
    text: 'Two companies before this quoted me as though I lived in a house with extra rooms I do not have. Zenvorali priced the actual footprint, which came in about 30% lower for the same scope. The balcony add-on is worth it too \u2014 they checked my HOA rules before touching anything.'
  },
  {
    name: 'Tyler Brennan',
    location: 'Gladstone, MO',
    rating: 5,
    date: '2026-05-30',
    service: 'deep-cleaning',
    serviceName: 'Deep Cleaning',
    title: 'Worth every dollar before moving to a recurring plan',
    text: 'Took their advice and did a deep clean once, then moved onto a biweekly plan. Best value decision we have made on the house. The biweekly visits are quicker and cheaper than they would be otherwise because the baseline is already there. Exactly what they said would happen.'
  },
  {
    name: 'Aisha Rahman',
    location: 'Leawood, KS',
    rating: 5,
    date: '2026-05-14',
    service: 'house-cleaning',
    serviceName: 'House Cleaning',
    title: 'The fragrance-free kit was not treated as a nuisance request',
    text: 'I have asthma and have been through several services that said they could accommodate it and then did not. Zenvorali asked at booking, made it the default for our home, and have not once arrived with something I react to. My son also has a nut allergy and they were careful about products around the kitchen. Genuinely thoughtful.'
  },
  {
    name: 'Chris Delgado',
    location: 'Independence, MO',
    rating: 5,
    date: '2026-04-29',
    service: 'move-out-cleaning',
    serviceName: 'Move-Out Cleaning',
    title: 'Saved a $1,200 deposit on a rental house',
    text: 'Three-bedroom rental with a garage and a kitchen that needed real work. They quoted $480 flat, cleaned it properly and gave me photographs of every room. The manager tried to withhold for the oven claiming it was still dirty and I just forwarded the dated photo. Deposit back in full within a week.'
  },
  {
    name: 'Hannah Liu',
    location: 'Olathe, KS',
    rating: 5,
    date: '2026-04-10',
    service: 'office-commercial-cleaning',
    serviceName: 'Commercial Cleaning',
    title: 'Certificate of insurance same day and no fuss on onboarding',
    text: 'Our lease requires a COI naming the landlord and I have had vendors take two weeks to produce one. Zenvorali sent it the same afternoon, did the walkthrough the next day and had a written scope to us within 24 hours. First clean inside 72 hours. Professional in a way that is honestly unusual in this trade.'
  },
  {
    name: 'Robert Kaminski',
    location: 'Parkville, MO',
    rating: 5,
    date: '2026-03-22',
    service: 'post-construction-cleaning',
    serviceName: 'Post-Construction Cleaning',
    title: 'They knew drywall dust is not normal dust',
    text: 'Previous cleaner used a shop vac and made everything worse \u2014 dust went straight back into the air and settled on surfaces that had already been done. Zenvorali brought HEPA equipment, worked top to bottom, cleaned all the vents and returns, and explained the process as they went. Completely different result.'
  },
  {
    name: 'Michelle Trent',
    location: 'Blue Springs, MO',
    rating: 5,
    date: '2026-03-05',
    service: 'house-cleaning',
    serviceName: 'House Cleaning',
    title: 'No contract, no cancellation fee, no pressure',
    text: 'We paused for six weeks over Christmas and there was no penalty, no renegotiation and no sales call when we came back. The team just picked up the same slot. It is refreshing to deal with a company that does not make you feel trapped in a subscription.'
  },
  {
    name: 'Devon Marsh',
    location: 'Lenexa, KS',
    rating: 5,
    date: '2026-02-18',
    service: 'deep-cleaning',
    serviceName: 'Deep Cleaning',
    title: 'They talked me out of a job I did not need',
    text: 'I called for a deep clean on a house we had kept up well. Instead of taking the booking, they asked a few questions and told me a standard recurring clean would achieve the same result for less. I took the advice and they have had my business for two years since. That is why I trust them with the key.'
  },
  {
    name: 'Lauren Ashby',
    location: 'Shawnee, KS',
    rating: 5,
    date: '2026-01-30',
    service: 'apartment-condo-cleaning',
    serviceName: 'Apartment Cleaning',
    title: 'Balcony, storage locker and a locker room for the building',
    text: 'Booked the balcony deep clean and the storage locker sweep as add-ons alongside the routine clean. Both were done thoroughly and priced exactly as quoted. They even swept the shared corridor outside my door before leaving, which is not in any scope I have seen.'
  },
  {
    name: 'Anthony Ferraro',
    location: 'Raytown, MO',
    rating: 5,
    date: '2026-01-14',
    service: 'office-commercial-cleaning',
    serviceName: 'Commercial Cleaning',
    title: 'Replaced a vendor who never actually turned up',
    text: 'We were paying monthly for a nightly service and had no idea whether anyone came. Zenvorali showed us what documented attendance looks like. Reports after every visit, quarterly reviews, and restrooms that are genuinely clean. Should have switched a year earlier.'
  }
];
