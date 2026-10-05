'use strict';

/** Grouped FAQ. Drives /faq and feeds FAQPage schema on that route. */
module.exports = [
  {
    group: 'Booking & Scheduling',
    icon: 'calendar',
    items: [
      {
        q: 'How far in advance do I need to book a cleaning in Kansas City?',
        a: 'Recurring clients keep a standing slot, so there is nothing to book. For one-time, deep and move-out cleans we usually have availability within three to five days. End of month is our busiest period \u2014 the last three days of any month fill roughly two weeks ahead, so book early if you are moving. Emergency and next-day slots are sometimes available if you call rather than email.'
      },
      {
        q: 'What are your opening hours?',
        a: 'We clean Monday to Thursday 7 AM to 8 PM, Friday 7 AM to 6 PM, Saturday 8 AM to 5 PM and Sunday 10 AM to 4 PM. Our office answers the phone through those hours, and commercial clients are cleaned overnight outside them. Holiday visits can often be arranged for a small additional fee.'
      },
      {
        q: 'Can I get the same cleaner or team every visit?',
        a: 'Yes, and we treat it as standard rather than an upgrade. Every recurring client is assigned a named crew that stays with the home. That is how the team learns your preferences, where your products live and which details matter to you, instead of re-learning your home from scratch every visit.'
      },
      {
        q: 'Do I need to be home during the clean?',
        a: 'No. Roughly 80% of our residential clients are at work. You can leave a key, arrange a lockbox or share a door code, and we log every arrival and departure. If you would rather be present, that is completely fine and our crews are comfortable working around you and your family.'
      },
      {
        q: 'Can I request the same day and time each visit?',
        a: 'Yes. Recurring clients hold a fixed weekly, biweekly or monthly slot. If you need to move it for a particular week, give us 48 hours notice and we will find the nearest alternative without affecting your plan or your price.'
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancel or reschedule with 48 hours notice at no charge. Cancellations inside 24 hours incur a 50% fee because the slot cannot be refilled at that notice. There is no cancellation fee and no minimum term on recurring plans \u2014 pause or stop whenever you like.'
      }
    ]
  },
  {
    group: 'Pricing & Payment',
    icon: 'tag',
    items: [
      {
        q: 'How much does cleaning cost in Kansas City?',
        a: 'Recurring house cleaning runs $99 to $259 per visit depending on size, bathrooms and frequency. Deep cleans start around $249, move-out cleans around $279, apartment cleaning around $89 to $199 and commercial contracts are quoted per square foot per visit. Every quote is flat, written and given before work starts.'
      },
      {
        q: 'Do you charge by the hour or a flat rate?',
        a: 'Flat rate, always, for residential work. We walk the property, count rooms, note condition, then commit to a number that does not change afterwards. Hourly billing rewards slowness and transfers the risk of under-estimating a job onto you, so we do not use it.'
      },
      {
        q: 'Are there any hidden fees?',
        a: 'No. The quoted figure is the invoiced figure. We do not add fuel surcharges, travel fees or supplies charges anywhere in the Kansas City metro. The only way your price changes is if you add a service you did not originally book, and we will quote that addition before doing it.'
      },
      {
        q: 'How do I pay?',
        a: 'We accept all major credit and debit cards, ACH bank transfer and Apple Pay. Residential clients are charged on the day of service. Commercial clients receive consolidated monthly invoicing, or per-draw invoicing on construction projects if that suits your accounting.'
      },
      {
        q: 'Do you require a deposit?',
        a: 'No deposit is required for standard residential cleaning. Large commercial contracts, multi-unit developments and post-construction projects over $2,000 typically carry a 25% mobilisation deposit, which is credited against the first invoice.'
      },
      {
        q: 'Do you offer discounts?',
        a: 'Recurring plans are already discounted against one-time rates. Beyond that we offer a $40 referral credit for every new client you send us, a 10% discount for seniors and veterans, and portfolio pricing for landlords and property managers with three or more units.'
      }
    ]
  },
  {
    group: 'Our Team & Trust',
    icon: 'shield',
    items: [
      {
        q: 'Are your cleaners background checked and insured?',
        a: 'Every cleaner is a directly employed team member \u2014 not a subcontractor or gig worker. Each passes a criminal background check, a drug screen, identity verification and paid training with a supervised probation period. We carry $2,000,000 in general liability insurance, full workers\' compensation and bonding cover.'
      },
      {
        q: 'What happens if something is damaged in my home?',
        a: 'Report it within 24 hours and we will assess and resolve it. Accidental damage is covered by our liability insurance, and we have a straightforward process for it with no argument and no delay. We photograph anything unusual we notice on arrival so there is a record of pre-existing condition.'
      },
      {
        q: 'Will the same people be in my home every time?',
        a: 'Yes for recurring plans. For one-time cleans, the crew lead is always a long-tenured employee even if the second person varies. We never send unsupervised new staff into a client home, and every crew has a named lead accountable for the visit.'
      },
      {
        q: 'Do you bring your own supplies and equipment?',
        a: 'Yes. Every crew arrives with commercial-grade HEPA vacuums, colour-coded microfiber, EPA Safer Choice solutions, steamer units and a descaling kit. You are welcome to request specific products, and we carry a fully fragrance-free kit for sensitive households.'
      },
      {
        q: 'What is your re-clean guarantee?',
        a: 'If anything on your agreed checklist is not right, tell us within 24 hours and we return and correct it at no charge, including the travel. It is written into every service agreement and we have honoured it on 100% of claims for twelve years.'
      },
      {
        q: 'Do you carry workers\' compensation for your staff?',
        a: 'Yes, for every employee. This matters more than most clients realise \u2014 if an uninsured cleaner is injured in your home, the exposure can reach your household policy. We provide certificates of insurance on request for residential and commercial clients alike.'
      }
    ]
  },
  {
    group: 'What We Clean',
    icon: 'sparkle',
    items: [
      {
        q: 'What is included in a standard clean?',
        a: 'Dusting of all surfaces and fixtures, vacuuming of all carpet and rugs, mopping of hard floors, kitchen counters and appliance exteriors, full bathroom sanitising, interior glass and mirrors, and disinfection of high-touch points. Roughly 48 checkpoints in total. Oven interiors, fridge interiors, interior windows, carpets and garages are priced add-ons.'
      },
      {
        q: 'What is not included that I might assume is?',
        a: 'Inside the oven, inside the refrigerator, interior windows above reach, carpet shampooing, garage and basement sweeping, laundry, dishes, exterior windows, biohazard clean-ups and hoarding situations. All of these are available either as add-ons or as part of a deep clean \u2014 we will always tell you what is and is not in your quote.'
      },
      {
        q: 'Do you clean dishes and do laundry?',
        a: 'We will load or empty a dishwasher on request as part of a visit, and laundry washed, dried and folded is available from $25 per load. Neither is included in the standard scope because clients vary enormously on whether they want us to touch them.'
      },
      {
        q: 'Can you clean a home with pets?',
        a: 'Yes, and a majority of our clients have pets. Tell us about them at booking \u2014 species, temperament, whether they need to be contained while we work and any sensitivities. We use pet-safe products as standard and can switch to a fully fragrance-free kit for nervous animals.'
      },
      {
        q: 'Do you offer green or eco-friendly cleaning?',
        a: 'Yes. Our default products are EPA Safer Choice certified, which is a third-party verified standard rather than a marketing claim. We use plant-derived degreasers, pH-neutral general cleaners and hospital-grade disinfectant only where genuinely needed. Fully fragrance-free options are always available at no extra cost.'
      },
      {
        q: 'Can you clean after a renovation or construction?',
        a: 'Yes \u2014 that is our post-construction service, which uses HEPA triple-filtration equipment and a staged rough / final / white-glove process. Construction dust requires different equipment and sequencing from household cleaning, and using a general cleaner for it usually makes the problem worse.'
      }
    ]
  },
  {
    group: 'Service Area',
    icon: 'map',
    items: [
      {
        q: 'What areas of Kansas City do you serve?',
        a: 'We cover the whole Kansas City metro within about a 35-mile radius of downtown. That includes Kansas City and North Kansas City, Independence, Blue Springs, Lee\'s Summit, Raytown, Grandview and Belton on the Missouri side, and Overland Park, Leawood, Prairie Village, Mission Hills, Shawnee, Lenexa and Olathe on the Kansas side.'
      },
      {
        q: 'Do you charge extra to travel to the suburbs?',
        a: 'No. Travel is included anywhere inside our service radius, with no fuel surcharge or distance fee. If a property sits outside the standard radius we will quote a small travel allowance upfront so there is no surprise on the invoice.'
      },
      {
        q: 'Do you clean commercial properties outside the metro?',
        a: 'We consider commercial contracts further out on a case-by-case basis, particularly multi-site contracts where the volume justifies the mobilisation. Ask us about your location when you request a bid and we will be straightforward about whether it works.'
      },
      {
        q: 'Which buildings downtown do you already work in?',
        a: 'We service a significant number of high-rise and mid-rise buildings across downtown, the Crossroads, River Market and the Plaza, and we maintain standing registrations with many building management offices. Tell us your building and we will confirm whether we already work there.'
      },
      {
        q: 'Do you serve both Missouri and Kansas sides of the metro?',
        a: 'Yes. Roughly half our clients are on the Kansas side and half in Missouri. Crews are assigned by geography to keep drive times short, which also means a team working in Leawood is usually already in Leawood on your service day.'
      }
    ]
  },
  {
    group: 'Commercial & Contracts',
    icon: 'building',
    items: [
      {
        q: 'Do you provide janitorial services on a nightly basis?',
        a: 'Yes. Most commercial clients are cleaned nightly or several nights a week between 6 PM and 6 AM, with the crew off site before your first arrival. We work from a written zone-by-zone scope and leave a digital report after every visit with the time, crew and checklist.'
      },
      {
        q: 'Can you supply a certificate of insurance?',
        a: 'Always, and usually the same day. We carry $2,000,000 general liability cover plus workers\' compensation and bonding. We can name your company or your landlord as additional insured if your lease or contract requires it.'
      },
      {
        q: 'Do you use subcontractors for commercial work?',
        a: 'No. Every commercial cleaner is a directly employed, background-checked and insured team member. That is the primary reason our attendance record holds up and why we can offer documented reporting on every visit.'
      },
      {
        q: 'How quickly can you start a commercial contract?',
        a: 'Typically within 72 hours of accepting a proposal for standard office cleaning. Sites requiring security clearance or larger facilities may take up to a week to onboard properly. Emergency and post-incident cleans can often be attended the same day.'
      },
      {
        q: 'Do you offer multi-site invoicing?',
        a: 'Yes. Multi-site clients receive one consolidated monthly invoice with a per-location breakdown, a single account manager covering every site, and portfolio pricing that improves with volume. Bundle your locations into one contract where you can.'
      }
    ]
  }
];
