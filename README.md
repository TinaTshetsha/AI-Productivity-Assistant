# Connect SA

BUILD A NATIONAL AI-POWERED SOUTH AFRICAN BUSINESS DISCOVERY PLATFORM

PRODUCT NAME

BusinessConnect South Africa

TAGLINE

Every Business. One Place.

ALTERNATIVE TAGLINE

Find What You Need. Wherever You Are.

1. PRODUCT VISION

Build a full-stack, AI-powered national business discovery and consumer connection platform for South Africa.

The platform must allow consumers anywhere in South Africa to discover businesses, products and services based on their current location or a location they choose.

The platform must work nationally across:

Gauteng

Western Cape

KwaZulu-Natal

Eastern Cape

Free State

Limpopo

Mpumalanga

North West

Northern Cape

The platform must support cities, towns, suburbs, townships, rural areas and smaller communities.

The core concept is:

Every business in South Africa should have the opportunity to be discovered, and every consumer should be able to find what they need in one place.

The platform must support businesses ranging from:

Sole traders

Informal businesses

Freelancers

Home-based businesses

Startups

Small businesses

Medium-sized businesses

Large enterprises

Professional service providers

Retailers

Restaurants

Tradespeople

Online businesses

2. CORE USER EXPERIENCE

The platform should make discovering a business extremely simple.

The user should be able to say:

"Find a plumber near me."

or:

"I need a hairdresser in Sandton."

or:

"Find an affordable electrician in Khayelitsha."

or:

"Show me restaurants near Durban beachfront."

or:

"I need a photographer for a wedding in Polokwane."

The AI should understand the request and identify:

What the consumer needs

Which business category is relevant

The requested service/product

The location

Distance

Price preference

Availability

Other requirements

Then search the platform database and return relevant businesses.

3. NATIONAL LOCATION INTELLIGENCE

Location must be a fundamental part of the platform.

Do NOT hard-code the platform around Cape Town or Johannesburg.

The same website must work throughout South Africa.

For example:

A user in Cape Town searches:

"Hair salons near me."

Show Cape Town-area businesses.

A user in Johannesburg searches:

"Hair salons near me."

Show Johannesburg-area businesses.

A user in Durban searches:

"Hair salons near me."

Show Durban-area businesses.

A user in Polokwane searches:

"Hair salons near me."

Show Polokwane-area businesses.

The search engine must dynamically determine the relevant location.

4. LOCATION OPTIONS

Give users three ways to specify their location.

OPTION 1 — USE MY LOCATION

Request permission to use the user's device location.

If permission is granted:

Use latitude and longitude.

Find businesses within a configurable radius.

OPTION 2 — ENTER LOCATION

Allow the user to type:

City

Town

Suburb

Township

Village

Postal code

Examples:

Cape Town

Johannesburg

Soweto

Sandton

Khayelitsha

Gqeberha

East London

Durban

Pietermaritzburg

Polokwane

Mbombela

Bloemfontein

Kimberley

Rustenburg

Stellenbosch

George

Mthatha

OPTION 3 — SELECT LOCATION

Create a location selector:

Province

↓

City/Town

↓

Suburb/Area

5. NATIONAL LOCATION DATABASE

Create a scalable location structure.

Database hierarchy:

South Africa

→ Province

→ Municipality/City/Town

→ Suburb/Area

→ Business

The system must allow new locations to be added without changing the application architecture.

Do not assume users are only located in major cities.

Support smaller towns and rural areas as well.

6. LOCATION-AWARE HOMEPAGE

Create a homepage that immediately asks:

WHAT ARE YOU LOOKING FOR?

Search bar:

"Search for a business, product or service..."

Location field:

"Where?"

Options:

Use My Location

Enter Location

Primary button:

Search

If the user's location is available, show:

"Searching near [Current Area]"

For example:

"Searching near Bellville, Cape Town"

7. NATIONAL SEARCH EXAMPLES

Display rotating examples such as:

"Find a plumber near me"

"Hair salons in Johannesburg"

"Affordable restaurants in Durban"

"Find a mechanic in Pretoria"

"Photographers in Cape Town"

"Find an electrician in Soweto"

"Accountants in Polokwane"

"Event decorators in Gqeberha"

"Find a bakery near me"

"Clothing stores in Sandton"

8. AI NATURAL-LANGUAGE SEARCH

This is the central AI feature.

Users should not need to understand business categories.

They should describe what they need naturally.

Example:

"I need someone to fix my leaking roof in Midrand."

AI interpretation:

Category:
Home & Property

Service:
Roof Repair

Location:
Midrand

Search radius:
Default local radius

Intent:
Service request

Another example:

"I'm looking for a cheap but good photographer for a wedding in Cape Town."

AI interpretation:

Category:
Events

Service:
Wedding Photography

Location:
Cape Town

Price preference:
Affordable

Purpose:
Wedding

9. LOCATION PRIORITY LOGIC

When the user says:

"near me"

prioritize:

Current GPS location

Selected suburb

Selected city/town

Selected municipality

Selected province

When the user explicitly specifies a location, use that location instead of the user's current location.

Example:

User is physically in Cape Town but searches:

"Find wedding photographers in Johannesburg."

The system must search Johannesburg.

The user's current location should not override an explicit search location.

10. SEARCH RADIUS

Allow location-based searches using:

1 km

5 km

10 km

25 km

50 km

100 km

Province-wide

South Africa-wide

Default radius should depend on the business category.

For example:

A local hairdresser might default to 10 km.

A specialist professional service may search across a wider area.

The user should always be able to change the radius.

11. NATIONAL SEARCH RESULTS

Search results should clearly show the selected location.

Example:

Businesses near Sandton, Johannesburg

or:

Businesses near Khayelitsha, Cape Town

or:

Businesses in Durban

Each result should display:

Business name

Category

Location

Distance

Rating

Verification status

Services

Opening status

Description

12. MAP VIEW

Create a national location-aware map.

The map should automatically center around the user's selected location.

Example:

User selects:

Cape Town

Map centers on Cape Town.

User selects:

Johannesburg

Map centers on Johannesburg.

User selects:

Durban

Map centers on Durban.

Show businesses as map markers.

Allow:

Zoom

Pan

Search area

Business selection

Directions

13. NATIONAL BUSINESS REGISTRATION

Any South African business should be able to register.

During onboarding collect:

Business name

Business type

Province

City/Town

Suburb/Area

Street address

GPS location

Category

Services

Products

Phone

Email

Website

WhatsApp

Social media

Opening hours

Business description

Photos

Logo

14. BUSINESS TYPES

Allow:

Sole Trader

Freelancer

Informal Business

Home-Based Business

Startup

Small Business

Medium Business

Large Enterprise

Nonprofit

Professional Service

Online Business

Other

15. BUSINESS PROFILE

Every business receives a searchable profile.

Display:

Business name

Logo

Photos

Verification status

Business type

Category

Description

Services

Products

Location

Province

City/Town

Suburb

Opening hours

Contact details

Website

Social media

Reviews

Rating

Map

16. AI BUSINESS PROFILE CREATOR

Help businesses create their profiles.

Example:

Business owner enters:

"I run a small plumbing company in Soweto. We repair leaks, install geysers and unblock drains."

AI creates:

Business description

Category

Subcategory

Services

Search keywords

Business tags

FAQ

Short profile description

SEO description

The content must appear as a draft.

Business owner must approve before publication.

Buttons:

Approve

Edit

Regenerate

17. NATIONAL BUSINESS SEARCH

Consumers should be able to search:

NEAR ME

Businesses close to current location.

CITY

Businesses within a city.

PROVINCE

Businesses across a province.

SOUTH AFRICA

Businesses nationally.

Example:

"Show me accounting firms in Gauteng."

Return relevant businesses across Gauteng.

Example:

"Find a company that supplies solar panels anywhere in South Africa."

Return national results.

18. BUSINESS CATEGORIES

Create a national, database-driven category system.

FOOD & DINING

Restaurants

Takeaways

Bakeries

Catering

Coffee Shops

Food Vendors

BEAUTY & PERSONAL CARE

Hair Salons

Barbers

Braiders

Nail Technicians

Beauty Therapists

Makeup Artists

HOME & PROPERTY

Plumbers

Electricians

Builders

Painters

Cleaners

Garden Services

Roofing

Security

Real Estate

AUTOMOTIVE

Mechanics

Car Washes

Panel Beaters

Tyre Services

Auto Electricians

Car Dealers

PROFESSIONAL SERVICES

Accountants

Lawyers

Consultants

Marketing Agencies

IT Services

Financial Services

HR Services

RETAIL

Clothing

Electronics

Furniture

Groceries

Jewellery

Boutiques

EVENTS

Event Planners

Photographers

DJs

Decorators

Venues

Catering

HEALTH & WELLNESS

Gyms

Fitness

Wellness

Pharmacies

Health Services

EDUCATION

Tutors

Training Providers

Schools

Education Services

TRANSPORT & LOGISTICS

Courier Services

Transport Services

Moving Companies

Delivery Services

AGRICULTURE

Farmers

Agricultural Suppliers

Farming Services

TECHNOLOGY

Software

IT Support

Web Development

Digital Marketing

Telecommunications

Make the category system expandable.

19. AI BUSINESS CATEGORIZATION

When a business registers, AI should analyse its description and recommend:

Primary category

Secondary category

Services

Keywords

Search terms

Example:

Input:

"We install solar panels, batteries and inverters for homes and businesses."

AI suggests:

Primary category:

Energy & Solar

Services:

Solar Installation

Battery Installation

Inverter Installation

Commercial Solar

Residential Solar

Search keywords:

Solar installers

Solar panels

Inverters

Battery backup

20. AI CONSUMER ASSISTANT

Create:

ASK BUSINESSCONNECT AI

The chatbot should understand national and local requests.

Examples:

"Find a plumber near me."

"Find accountants in Johannesburg."

"What restaurants are near me?"

"Find a wedding photographer in Cape Town."

"Show me businesses that sell school uniforms in Durban."

"I need a mechanic in Bloemfontein."

"Find cleaning companies across Gauteng."

The AI must use the actual platform database.

It must NEVER invent a business.

21. NATIONAL BUSINESS COMPARISON

Allow consumers to compare businesses.

Comparison fields:

Business

Location

Distance

Services

Rating

Verification

Price information

Opening hours

Contact options

The AI may explain:

"Business A is closer to your selected location, while Business B offers more of the services you requested."

Do not make unsupported claims.

22. BUSINESS LEADS

Consumers should be able to connect directly with businesses.

Buttons:

Call

WhatsApp

Email

Message

Request Quote

Request Service

Book Appointment

Get Directions

The enquiry should be sent to the relevant business.

23. NATIONAL BUSINESS DASHBOARD

Business owners should be able to see:

Profile views

Search appearances

Customer enquiries

Calls

Messages

Website clicks

Saved businesses

Reviews

AI recommendations

Most searched services

Customer locations

24. AI BUSINESS INSIGHTS

Create a feature called:

Business Insights

Example:

"Your business was discovered 240 times this month."

"Most searches for your services came from Cape Town."

"Customers frequently searched for your plumbing services on weekends."

"Your profile is missing opening hours."

"Adding more service information could improve your visibility."

Insights must be based on actual platform data.

25. NATIONAL CONSUMER EXPERIENCE

Consumers should be able to travel anywhere in South Africa and continue using the same platform.

Example:

A consumer normally lives in Cape Town.

They travel to Johannesburg.

They open BusinessConnect.

The platform detects the new location.

The homepage updates:

"Businesses near Johannesburg."

The user searches:

"Restaurants near me."

The platform shows Johannesburg restaurants.

Later they travel to Durban.

The platform automatically adapts again.

The experience must be location-aware without requiring the user to manually rebuild their profile.

26. LOCATION PRIVACY

Location must be handled responsibly.

Ask for permission before accessing GPS.

Allow users to:

Deny location access

Enter location manually

Change location

Use approximate location

Do not unnecessarily store precise location history.

Clearly explain why location is being requested.

27. RESPONSIBLE AI

The AI must never invent:

Businesses

Addresses

Reviews

Ratings

Prices

Opening hours

Services

Availability

Contact information

If information is unavailable:

"Information not provided by this business."

Display:

"AI recommendations are based on information available on BusinessConnect. Business details may change. Confirm important information directly with the business."

The platform must address privacy, bias, inaccurate information, fake reviews, business verification and AI limitations.

This directly supports the responsible-AI component of the CAPACITI assessment.

28. NATIONAL DATABASE STRUCTURE

Create a scalable relational database.

Businesses must have:

id

owner_id

name

description

business_type

category_id

province

municipality

city

town

suburb

postal_code

street_address

latitude

longitude

phone

email

website

whatsapp

opening_hours

verification_status

rating

review_count

created_at

updated_at

This structure must support millions of businesses in the future.

29. LOCATION DATABASE STRUCTURE

Create:

provinces

municipalities

cities

towns

suburbs

postal_codes

locations

business_locations

The system must support relationships between:

Province

→ Municipality

→ City/Town

→ Suburb

→ Business

30. SOUTH AFRICAN PROVINCES

Seed the application with:

Western Cape

Gauteng

KwaZulu-Natal

Eastern Cape

Free State

Limpopo

Mpumalanga

North West

Northern Cape

Allow additional locations to be added from the admin dashboard.

31. SEARCH ENGINE

The search engine must support:

Exact business name search

Category search

Service search

Product search

Keyword search

Location search

Natural-language search

AI intent search

Distance search

Filter search

Combined search

Example:

"Affordable plumbers open today near me."

Search parameters:

Category: Plumbing

Price: Affordable

Availability: Open today

Location: Current user location

32. SMART NO-RESULT SYSTEM

If there are no businesses matching the exact search:

Do NOT simply show:

"No results."

Instead:

Expand the radius.

Suggest related categories.

Suggest nearby locations.

Offer national results where appropriate.

Example:

"We couldn't find a plumber within 5 km. We found 14 plumbers within 25 km."

Buttons:

Expand Search

Search Nearby

Search City

Search Province

33. NATIONAL SEARCH MODES

Add:

NEAR ME

Uses current location.

THIS CITY

Searches selected city/town.

THIS PROVINCE

Searches entire province.

ANYWHERE IN SOUTH AFRICA

National search.

This makes the platform useful for both local and national businesses.

34. SEARCH RESULT EXPLANATION

Every AI recommendation should include:

Why this result?

Example:

"Recommended because this business offers plumbing services and is 3.4 km from your selected location."

This improves transparency.

35. BUSINESS VERIFICATION

Create:

Unverified

Verified

Trusted

Verification badges.

Do not falsely claim government certification.

Allow administrators to determine verification requirements.

36. ADMIN PLATFORM

Admin dashboard must show national data.

Display:

Businesses by province

Businesses by city

New registrations

Search volume

Most searched categories

No-result searches

Customer enquiries

Business leads

Verification requests

Reported businesses

Reported reviews

AI performance

37. NATIONAL MARKET INSIGHTS

Create:

SOUTH AFRICAN BUSINESS INSIGHTS

The platform can identify demand patterns from aggregated platform data.

Examples:

"Hair salons are one of the most searched categories in Johannesburg this month."

"Users in Cape Town frequently search for event services."

"Solar installation searches are increasing in Gauteng."

Only generate insights when sufficient platform data exists.

Clearly label insights as:

"Based on BusinessConnect platform activity."

38. SEO

Create location-based SEO pages.

Examples:

/businesses/cape-town

/businesses/johannesburg

/businesses/durban

/businesses/pretoria

/businesses/gqeberha

/businesses/bloemfontein

/businesses/polokwane

/businesses/kimberley

/category/plumbers

/category/hair-salons

/category/accountants

/category/restaurants

Also support combinations:

/businesses/cape-town/plumbers

/businesses/johannesburg/restaurants

/businesses/durban/hair-salons

These pages must use actual platform data.

39. NATIONAL BUSINESS DISCOVERY HOMEPAGE

Include:

Hero search

Location selector

Popular categories

Businesses near me

Trending businesses

Featured businesses

New businesses

Popular searches

Explore by province

Explore by category

AI recommendations

Business registration CTA

40. EXPLORE BY PROVINCE

Create a dedicated section:

EXPLORE BUSINESSES ACROSS SOUTH AFRICA

Cards:

Western Cape

Gauteng

KwaZulu-Natal

Eastern Cape

Free State

Limpopo

Mpumalanga

North West

Northern Cape

Clicking a province displays businesses in that province.

41. EXPLORE BY CITY

Allow popular locations to be displayed dynamically based on available business data.

Examples:

Cape Town

Johannesburg

Durban

Pretoria

Gqeberha

East London

Bloemfontein

Polokwane

Mbombela

Kimberley

Rustenburg

Stellenbosch

George

Pietermaritzburg

Mthatha

Do not limit the database to these cities.

42. NATIONAL BUSINESS REGISTRATION VALUE PROPOSITION

Business registration page headline:

GET DISCOVERED BY CUSTOMERS ACROSS SOUTH AFRICA

Subheadline:

Create your business profile and make it easier for customers to find you.

Benefits:

Get discovered

Receive enquiries

Build online visibility

Showcase services

Receive customer reviews

Track performance

Use AI to improve your profile

43. MONETIZATION-READY ARCHITECTURE

Do not necessarily implement payments in the first MVP, but design the architecture to support future monetization.

Potential future features:

Free listing

Premium listing

Featured placement

Sponsored visibility

Business analytics

Lead packages

Verified business subscription

Promotional campaigns

The ranking system must not secretly favour businesses simply because they pay.

Clearly label sponsored or featured placements.

44. SECURITY

Implement:

Authentication

Role-based authorization

Protected admin routes

Protected business dashboards

Input validation

Secure database access

API key protection

Privacy controls

Rate limiting where appropriate

Do not expose sensitive information in frontend code.

45. MOBILE-FIRST EXPERIENCE

Consumers will frequently use the platform while travelling.

On mobile prioritize:

Search

Location

Map

Call

WhatsApp

Directions

Business profile

Request quote

Keep navigation simple.

46. DEMO SCENARIO 1 — CAPE TOWN

User location:

Cape Town.

User searches:

"Find an affordable hair salon near me that does braids and is open Saturday."

AI understands the request.

Platform searches Cape Town businesses.

Results appear.

Consumer selects a business.

Consumer views profile.

Consumer requests an appointment.

Business receives enquiry.

47. DEMO SCENARIO 2 — JOHANNESBURG

Change user location to Johannesburg.

Search:

"I need an electrician near me."

The platform must now return Johannesburg-area businesses.

The same system works without changing the application.

48. DEMO SCENARIO 3 — DURBAN

Change location to Durban.

Search:

"Find restaurants near me that are open tonight."

The platform returns Durban-area businesses.

49. DEMO SCENARIO 4 — NATIONAL SEARCH

Search:

"Find solar installation companies anywhere in South Africa."

The platform switches from local search to national search.

Return relevant businesses from multiple provinces.

Allow filtering by province.

50. DEMO SCENARIO 5 — EXPLICIT LOCATION

User is currently in Cape Town.

They search:

"Find wedding photographers in Johannesburg."

The system must search Johannesburg.

It must NOT return Cape Town businesses simply because that is where the user currently is.

51. COMPLETE SYSTEM FLOW

CONSUMER

↓

OPEN BUSINESSCONNECT

↓

LOCATION DETECTED OR SELECTED

↓

USER DESCRIBES WHAT THEY NEED

↓

AI UNDERSTANDS INTENT

↓

AI EXTRACTS LOCATION + CATEGORY + SERVICE + PREFERENCES

↓

SEARCH DATABASE

↓

FILTER RESULTS

↓

RANK RESULTS

↓

SHOW BUSINESSES

↓

USER COMPARES

↓

USER SELECTS BUSINESS

↓

USER CONTACTS BUSINESS

↓

BUSINESS RECEIVES LEAD

↓

BUSINESS RESPONDS

↓

CONSUMER CAN REVIEW

52. AI PROMPT ENGINEERING

Build structured AI prompts using:

ROLE

CONTEXT

USER REQUEST

LOCATION

AVAILABLE DATABASE DATA

CONSTRAINTS

TASK

OUTPUT FORMAT

VALIDATION

The most important instruction is:

ONLY RETURN BUSINESSES THAT EXIST IN THE PROVIDED PLATFORM DATABASE.

If no suitable business exists:

Return no fabricated result.

Instead suggest:

Expand radius

Related category

Nearby location

Province search

National search

53. PRODUCT PRINCIPLE

The platform must always answer:

"What does the consumer need?"

rather than:

"Which category did the consumer select?"

This makes the platform genuinely AI-powered.

54. FINAL PRODUCT POSITIONING

BusinessConnect South Africa is:

A national AI-powered business discovery and consumer connection platform.

It connects:

CONSUMERS + BUSINESSES + AI

across South Africa.

The platform should make discovering businesses as simple as asking:

"What do you need?"

The AI then does the work of understanding the request, identifying the location, finding relevant businesses and helping the consumer connect with them.

55. FINAL MVP PRIORITY

For the first working version, prioritize:

National homepage

Location detection/selection

Natural-language AI search

South African location structure

Business database

Business profiles

Search results

Filters

Map view

Consumer enquiries

Business dashboard

AI business profile generation

Admin dashboard

Verification

Responsible AI safeguards

Do not sacrifice the core search experience for unnecessary features.

The most important working demonstration is:

LOCATION → AI SEARCH → BUSINESS DISCOVERY → BUSINESS PROFILE → CUSTOMER ENQUIRY

Build this journey first and make it excellent.

56. FINAL DESIGN STATEMENT

The final product should feel like a national digital infrastructure for discovering South African businesses, not simply another directory.

Whether a consumer is in:

Cape Town

Johannesburg

Durban

Pretoria

Gqeberha

East London

Bloemfontein

Polokwane

Mbombela

Kimberley

Rustenburg

or a smaller town or community,

the platform should adapt to their location and help them find relevant businesses.

The ultimate experience is:

SEARCH ANYWHERE.

FIND LOCALLY.

CONNECT EASILY.

Build BusinessConnect South Africa as a polished, scalable MVP that can eventually expand from a prototype into a nationwide commercial platform.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3405227c-9527-4366-9106-b2c6028c696b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
